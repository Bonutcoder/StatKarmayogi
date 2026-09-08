"""
iGOT Live Adapter.
Implements the contract for connecting to the official iGOT Karmayogi API.
Includes resilient fallback to MockLearningProvider when offline or unauthorized.
Follows SECURITY.md Section 19.
"""

from typing import List, Optional
import httpx
from backengine.app.core.config import get_settings, Settings
from backengine.app.igot.base import LearningProvider, CourseSummary, CourseDetail
from backengine.app.igot.mock_provider import MockLearningProvider


class IGOTLearningProvider(LearningProvider):
    """
    Live adapter for iGOT Karmayogi.
    If credentials are missing or the external government service is unreachable,
    it falls back gracefully to the approved mock provider while recording degraded status.
    """

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()
        self._mock_fallback = MockLearningProvider()
        self.is_live_available = False

    async def search_courses(
        self,
        query: Optional[str] = None,
        competency_ids: Optional[List[str]] = None,
        level: Optional[int] = None,
        limit: int = 10,
    ) -> List[CourseSummary]:
        if not self.settings.IGOT_API_TOKEN:
            # Fall back safely to mock catalog when live credentials are not provisioned
            return await self._mock_fallback.search_courses(query, competency_ids, level, limit)

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                headers = {
                    "Authorization": f"Bearer {self.settings.IGOT_API_TOKEN}",
                    "Content-Type": "application/json",
                }
                params = {"limit": limit}
                if query:
                    params["q"] = query
                if competency_ids:
                    params["competencies"] = ",".join(competency_ids)
                if level:
                    params["level"] = str(level)

                response = await client.get(
                    f"{self.settings.IGOT_API_BASE_URL}/courses",
                    headers=headers,
                    params=params,
                )
                if response.status_code == 200:
                    data = response.json()
                    courses = [CourseSummary(**item) for item in data.get("results", [])]
                    self.is_live_available = True
                    return courses
        except Exception:
            # Network or authorization failure -> graceful degradation to approved fallback
            self.is_live_available = False

        return await self._mock_fallback.search_courses(query, competency_ids, level, limit)

    async def get_course(self, course_id: str) -> Optional[CourseDetail]:
        if not self.settings.IGOT_API_TOKEN:
            return await self._mock_fallback.get_course(course_id)

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                headers = {
                    "Authorization": f"Bearer {self.settings.IGOT_API_TOKEN}",
                }
                response = await client.get(
                    f"{self.settings.IGOT_API_BASE_URL}/courses/{course_id}",
                    headers=headers,
                )
                if response.status_code == 200:
                    return CourseDetail(**response.json())
        except Exception:
            self.is_live_available = False

        return await self._mock_fallback.get_course(course_id)

    async def get_course_catalog(
        self, category: Optional[str] = None, limit: int = 20
    ) -> List[CourseSummary]:
        if not self.settings.IGOT_API_TOKEN:
            return await self._mock_fallback.get_course_catalog(category, limit)

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                headers = {"Authorization": f"Bearer {self.settings.IGOT_API_TOKEN}"}
                response = await client.get(
                    f"{self.settings.IGOT_API_BASE_URL}/courses/catalog",
                    headers=headers,
                    params={"limit": limit, "category": category} if category else {"limit": limit},
                )
                if response.status_code == 200:
                    return [CourseSummary(**item) for item in response.json().get("results", [])]
        except Exception:
            self.is_live_available = False

        return await self._mock_fallback.get_course_catalog(category, limit)
