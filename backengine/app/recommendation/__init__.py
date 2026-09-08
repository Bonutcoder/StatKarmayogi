"""
Multi-factor course recommendation engine with transparent, evidence-based explanations.
"""

from backengine.app.recommendation.models import (
    CourseRecommendation,
    RecommendationRequest,
    RecommendationResponse,
)
from backengine.app.recommendation.engine import CourseRecommendationEngine

__all__ = [
    "CourseRecommendation",
    "RecommendationRequest",
    "RecommendationResponse",
    "CourseRecommendationEngine",
]
