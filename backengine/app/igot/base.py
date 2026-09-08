"""
Abstract Base Class for Learning Providers (iGOT Adapter).
Enforces strict decoupling between competency intelligence and the learning ecosystem.
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CourseSummary(BaseModel):
    """Concise representation of a course for search and recommendation listings."""
    id: str
    title: str
    provider: str = "iGOT Karmayogi / NSSTA"
    competency_ids: List[str]
    level: int = Field(default=1, ge=1, le=5, description="Difficulty level 1 to 5")
    duration_hours: float = 4.0
    source: str = "iGOT Karmayogi"
    external_url: str = "https://igotkarmayogi.gov.in"
    rating: float = 4.5


class CourseDetail(CourseSummary):
    """Detailed metadata for a specific learning module."""
    description: str
    modules: List[str] = Field(default_factory=list)
    target_audience: str = "Statistical Officers and Analysts"
    prerequisites: List[str] = Field(default_factory=list)


class LearningProvider(ABC):
    """
    Contract for retrieving course catalog and learning content.
    Prevents vendor lock-in and isolates external network calls.
    """

    @abstractmethod
    async def search_courses(
        self,
        query: Optional[str] = None,
        competency_ids: Optional[List[str]] = None,
        level: Optional[int] = None,
        limit: int = 10,
    ) -> List[CourseSummary]:
        """Search courses by free text, target competencies, or proficiency level."""
        pass

    @abstractmethod
    async def get_course(self, course_id: str) -> Optional[CourseDetail]:
        """Retrieve full details of a specific course."""
        pass

    @abstractmethod
    async def get_course_catalog(
        self, category: Optional[str] = None, limit: int = 20
    ) -> List[CourseSummary]:
        """Retrieve canonical catalog listing."""
        pass
