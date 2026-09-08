from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.user import User, Employee
from app.schemas.course import RecommendationResponse
from app.core.dependencies import get_current_user, verify_department_access
from app.services.recommendation_service import generate_employee_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/employee/{employee_id}", response_model=List[RecommendationResponse])
async def get_recommendations_for_employee(
    employee_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Employee).where(Employee.id == employee_id)
    res = await db.execute(stmt)
    employee = res.scalar_one_or_none()

    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    if current_user.role == "LEARNER":
        if employee.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    else:
        verify_department_access(current_user, employee.department_id)

    recs = await generate_employee_recommendations(db, employee_id)
    return recs
