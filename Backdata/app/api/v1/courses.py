from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.course import Course
from app.schemas.course import CourseResponse
from app.core.dependencies import get_current_user
from app.db.models.user import User

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("", response_model=List[CourseResponse])
async def list_courses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Course).where(Course.is_active == True)
    res = await db.execute(stmt)
    courses = res.scalars().all()
    return courses

@router.get("/{id}", response_model=CourseResponse)
async def get_course_by_id(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Course).where(Course.id == id)
    res = await db.execute(stmt)
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course
