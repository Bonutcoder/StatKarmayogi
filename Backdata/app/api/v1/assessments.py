from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.user import User, Employee
from app.db.models.assessment import Assessment, AssessmentAttempt
from app.schemas.assessment import AssessmentResponse, AssessmentSubmitRequest, AssessmentAttemptResult
from app.core.dependencies import get_current_user, get_current_employee, verify_department_access
from app.services.assessment_service import submit_assessment_attempt
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.get("/{id}", response_model=AssessmentResponse)
async def get_assessment_by_id(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Assessment).where(Assessment.id == id, Assessment.is_active == True)
    res = await db.execute(stmt)
    assessment = res.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    return assessment

@router.post("/{id}/submit", response_model=AssessmentAttemptResult)
async def submit_assessment(
    id: str,
    req: AssessmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    current_employee: Employee = Depends(get_current_employee),
    db: AsyncSession = Depends(get_db)
):
    result = await submit_assessment_attempt(
        db=db,
        employee_id=current_employee.id,
        assessment_id=id,
        answers_input=req.answers
    )

    await log_audit_event(
        db,
        event_type="ASSESSMENT_SUBMITTED",
        actor_user_id=current_user.id,
        department_id=current_user.department_id,
        details={
            "assessment_id": id,
            "attempt_id": result.attempt_id,
            "score": result.score_percentage,
            "mastery_level": result.mastery_level
        }
    )

    return result

@router.get("/employee/{employee_id}/attempts", response_model=List[AssessmentAttemptResult])
async def get_employee_attempts(
    employee_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt_emp = select(Employee).where(Employee.id == employee_id)
    emp_res = await db.execute(stmt_emp)
    emp = emp_res.scalar_one_or_none()

    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    if current_user.role == "LEARNER":
        if emp.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    else:
        verify_department_access(current_user, emp.department_id)

    stmt = select(AssessmentAttempt).where(AssessmentAttempt.employee_id == employee_id).order_by(AssessmentAttempt.started_at.desc())
    res = await db.execute(stmt)
    attempts = res.scalars().all()

    output: List[AssessmentAttemptResult] = []
    for att in attempts:
        output.append(
            AssessmentAttemptResult(
                attempt_id=att.id,
                employee_id=att.employee_id,
                assessment_id=att.assessment_id,
                score_percentage=att.score_percentage,
                passed=att.passed,
                mastery_level="PROFICIENT" if att.passed else "NEEDS_FOUNDATION",
                total_questions=0,
                correct_count=0,
                started_at=att.started_at,
                completed_at=att.completed_at or att.started_at
            )
        )

    return output
