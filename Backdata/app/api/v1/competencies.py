from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.competency import Competency
from app.schemas.competency import CompetencyResponse, CompetencyUpdate
from app.core.dependencies import get_current_user, RoleChecker
from app.db.models.user import User, Employee
from app.services.competency_engine import update_employee_competency_level
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/competencies", tags=["Competencies"])

@router.get("", response_model=List[CompetencyResponse])
async def list_competencies(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Competency)
    res = await db.execute(stmt)
    competencies = res.scalars().all()
    return competencies

@router.get("/{id}", response_model=CompetencyResponse)
async def get_competency_by_id(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Competency).where(Competency.id == id)
    res = await db.execute(stmt)
    comp = res.scalar_one_or_none()
    if not comp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Competency not found")
    return comp

@router.post("/employee/{employee_id}/update")
async def update_competency(
    employee_id: str,
    req: CompetencyUpdate,
    current_user: User = Depends(RoleChecker(["DEPARTMENT_ADMIN", "SYSTEM_ADMIN", "MOSPI_NSSTA_ADMIN", "TRAINING_COORDINATOR"])),
    db: AsyncSession = Depends(get_db)
):
    # Verify employee exists
    stmt_emp = select(Employee).where(Employee.id == employee_id)
    emp_res = await db.execute(stmt_emp)
    employee = emp_res.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    updated = await update_employee_competency_level(
        db=db,
        employee_id=employee_id,
        competency_id=req.competency_id,
        new_level=req.new_level,
        change_reason=req.change_reason,
        source_type=req.source_type,
        source_id=req.source_id
    )

    await log_audit_event(
        db,
        event_type="COMPETENCY_UPDATED",
        actor_user_id=current_user.id,
        department_id=current_user.department_id,
        details={"employee_id": employee_id, "competency_id": req.competency_id, "new_level": req.new_level, "reason": req.change_reason}
    )

    return {"status": "success", "competency_id": updated.competency_id, "current_level": updated.current_level}
