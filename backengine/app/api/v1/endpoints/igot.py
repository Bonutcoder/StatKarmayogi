"""
iGOT adapter integration endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from backengine.app.igot.base import CourseSummary, CourseDetail
from backengine.app.igot.mock_provider import MockLearningProvider
from backengine.app.igot.igot_provider import IGOTLearningProvider
from backengine.app.core.config import get_settings

router = APIRouter()
settings = get_settings()

provider = (
    MockLearningProvider()
    if settings.USE_MOCK_IGOT
    else IGOTLearningProvider(settings)
)


@router.get("/courses", response_model=List[CourseSummary])
async def search_courses(
    q: Optional[str] = Query(None, description="Free-text search query"),
    competency: Optional[str] = Query(None, description="Comma-separated competency IDs"),
    level: Optional[int] = Query(None, ge=1, le=5, description="Course difficulty level"),
    limit: int = Query(10, ge=1, le=50),
):
    """
    Retrieves course listings from the isolated iGOT learning provider adapter.
    """
    comp_list = [c.strip() for c in competency.split(",")] if competency else None
    return await provider.search_courses(
        query=q,
        competency_ids=comp_list,
        level=level,
        limit=limit,
    )


@router.get("/courses/{course_id}", response_model=CourseDetail)
async def get_course_detail(course_id: str):
    """Retrieves full course metadata."""
    course = await provider.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    return course
