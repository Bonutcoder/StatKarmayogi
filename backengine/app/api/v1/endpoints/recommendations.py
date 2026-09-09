"""
Course recommendation endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from backengine.app.recommendation.models import (
    RecommendationRequest,
    RecommendationResponse,
)
from backengine.app.recommendation.engine import CourseRecommendationEngine
from backengine.app.igot.mock_provider import MockLearningProvider

router = APIRouter()
learning_provider = MockLearningProvider()
rec_engine = CourseRecommendationEngine(learning_provider)


@router.post("/generate", response_model=RecommendationResponse)
async def generate_recommendations(request: RecommendationRequest):
    """
    Computes multi-factor course recommendations grounded in active skill gaps.
    Every recommendation includes a transparent explanation.
    """
    try:
        return await rec_engine.recommend(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")
