from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.session import get_db
from app.db.models.user import User, Employee, Department
from app.db.models.competency import SkillGap, Competency
from app.schemas.analytics import DepartmentAnalyticsResponse, CompetencyGapSummary
from app.core.dependencies import get_current_user, verify_department_access, RoleChecker

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/department/{department_id}", response_model=DepartmentAnalyticsResponse)
async def get_department_analytics(
    department_id: str,
    current_user: User = Depends(RoleChecker(["DEPARTMENT_ADMIN", "SYSTEM_ADMIN", "MOSPI_NSSTA_ADMIN", "TRAINING_COORDINATOR"])),
    db: AsyncSession = Depends(get_db)
):
    verify_department_access(current_user, department_id)

    # 1. Count employees in department
    stmt_emp = select(func.count(Employee.id)).where(Employee.department_id == department_id)
    emp_count_res = await db.execute(stmt_emp)
    total_emp = emp_count_res.scalar() or 0

    # 2. Compute competency gap analytics
    stmt_gaps = select(
        Competency.id,
        Competency.name,
        Competency.domain,
        func.count(SkillGap.employee_id).label("gap_count"),
        func.avg(SkillGap.gap_value).label("avg_gap")
    ).join(
        SkillGap, Competency.id == SkillGap.competency_id
    ).join(
        Employee, SkillGap.employee_id == Employee.id
    ).where(
        Employee.department_id == department_id
    ).group_by(
        Competency.id, Competency.name, Competency.domain
    )

    gap_res = await db.execute(stmt_gaps)
    gap_summaries: List[CompetencyGapSummary] = []

    for row in gap_res.all():
        gap_summaries.append(
            CompetencyGapSummary(
                competency_id=row[0],
                competency_name=row[1],
                domain=row[2],
                total_employees=total_emp,
                employees_with_gap=row[3],
                avg_gap_value=float(row[4] or 0.0)
            )
        )

    readiness = 100.0 - (len(gap_summaries) * 10.0)
    readiness = max(0.0, min(100.0, readiness))

    return DepartmentAnalyticsResponse(
        department_id=department_id,
        total_employees=total_emp,
        average_readiness_score=readiness,
        gaps_by_competency=gap_summaries
    )
