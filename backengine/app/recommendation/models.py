"""
Data models for course recommendations.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from backengine.app.competency.models import SkillGap


class CourseRecommendation(BaseModel):
    """A prioritized course recommendation accompanied by a transparent justification."""
    course_id: str
    course_title: str
    provider: str
    target_competency_ids: List[str]
    target_competency_names: List[str]
    relevance_score: float = Field(..., ge=0.0, le=1.0, description="Multi-factor score (not a prediction)")
    explanation: str = Field(..., description="Evidence-backed explanation of why this course is recommended")
    course_level: int
    duration_hours: float
    source: str = "iGOT Karmayogi"
    external_url: str


class RecommendationRequest(BaseModel):
    """Input payload for generating course recommendations."""
    employee_id: str
    skill_gaps: List[SkillGap]
    completed_course_ids: List[str] = Field(default_factory=list)
    preferred_language: Optional[str] = "en"
    limit: int = Field(default=5, ge=1, le=20)


class RecommendationResponse(BaseModel):
    """Recommendations result containing ordered courses and evidence citations."""
    employee_id: str
    recommendations: List[CourseRecommendation]
    total_found: int
    disclaimer: str = (
        "Recommendation scores are calculated from multi-factor evidence (skill gap priority, "
        "competency alignment, and course level) and do not represent a guaranteed learning prediction."
    )
