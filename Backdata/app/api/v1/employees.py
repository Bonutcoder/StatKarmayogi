from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.user import User, Employee
from app.schemas.employee import EmployeeResponse
from app.schemas.competency import SkillGapResponse, CompetencyHistoryResponse
from app.core.dependencies import get_current_user, verify_department_access, RoleChecker
from app.services.competency_engine import recalculate_employee_gaps
from app.db.models.competency import CompetencyHistory

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("/{id}", response_model=EmployeeResponse)
async def get_employee_by_id(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Employee).where(Employee.id == id)
    res = await db.execute(stmt)
    emp = res.scalar_one_or_none()

    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    # Authorization Check
    if current_user.role == "LEARNER":
        if emp.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to other learner profiles")
    else:
        verify_department_access(current_user, emp.department_id)

    return emp

@router.get("/{id}/gaps", response_model=List[SkillGapResponse])
async def get_employee_skill_gaps(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Employee).where(Employee.id == id)
    res = await db.execute(stmt)
    emp = res.scalar_one_or_none()

    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    if current_user.role == "LEARNER":
        if emp.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    else:
        verify_department_access(current_user, emp.department_id)

    gaps = await recalculate_employee_gaps(db, id)
    return gaps

@router.get("/{id}/history", response_model=List[CompetencyHistoryResponse])
async def get_employee_competency_history(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Employee).where(Employee.id == id)
    res = await db.execute(stmt)
    emp = res.scalar_one_or_none()

    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    if current_user.role == "LEARNER":
        if emp.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    else:
        verify_department_access(current_user, emp.department_id)

    stmt_h = select(CompetencyHistory).where(CompetencyHistory.employee_id == id).order_by(CompetencyHistory.created_at.desc())
    h_res = await db.execute(stmt_h)
    history = h_res.scalars().all()
    return history
