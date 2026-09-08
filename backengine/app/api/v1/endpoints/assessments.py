"""
Assessment generation, submission, and deterministic grading endpoints.
"""

from fastapi import APIRouter, HTTPException
from backengine.app.assessment.models import (
    AssessmentGenerationRequest,
    AssessmentSession,
    QuizSubmission,
    AssessmentResult,
)
from backengine.app.assessment.generator import AssessmentGenerator
from backengine.app.assessment.scoring import AssessmentScoringEngine
from backengine.app.rag.vector_store import VectorStore
from backengine.app.ai.openrouter import OpenRouterAIProvider
from backengine.app.ai.mock_ai import MockAIProvider
from backengine.app.core.config import get_settings

router = APIRouter()
settings = get_settings()

vector_store = VectorStore()
ai_provider = (
    MockAIProvider()
    if settings.USE_MOCK_AI or not settings.OPENROUTER_API_KEY
    else OpenRouterAIProvider(settings)
)
generator = AssessmentGenerator(vector_store, ai_provider, settings)
scoring_engine = AssessmentScoringEngine(generator, settings)


@router.post("/generate", response_model=AssessmentSession)
async def generate_assessment(request: AssessmentGenerationRequest):
    """
    Generates RAG-grounded MCQs satisfying the strict MCQ contract.
    Answers and explanations are masked for learner presentation.
    """
    try:
        return await generator.generate_assessment(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assessment generation error: {str(e)}")


@router.post("/score", response_model=AssessmentResult)
async def score_assessment(submission: QuizSubmission):
    """
    Deterministically grades submitted quiz answers against server-side session.
    Calculates score percentage and assigns verified mastery tiers (Needs Foundation, Developing, Proficient, Strong Mastery).
    """
    try:
        return scoring_engine.score_submission(submission)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring error: {str(e)}")
