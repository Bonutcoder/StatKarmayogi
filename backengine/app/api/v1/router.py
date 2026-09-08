"""
Consolidated API v1 Router for Person 2 (Competency Intelligence, RAG & AI Engine).
Person 1 can mount this directly into the central FastAPI app:
app.include_router(api_v1_router, prefix="/api/v1")
"""

from fastapi import APIRouter
from backengine.app.api.v1.endpoints import (
    competencies,
    recommendations,
    igot,
    rag,
    assessments,
)

api_v1_router = APIRouter()

api_v1_router.include_router(
    competencies.router, prefix="/competencies", tags=["Competencies & Skill Gaps"]
)
api_v1_router.include_router(
    recommendations.router, prefix="/recommendations", tags=["Course Recommendations"]
)
api_v1_router.include_router(
    igot.router, prefix="/integrations/igot", tags=["iGOT Adapter"]
)
api_v1_router.include_router(
    rag.router, prefix="/rag", tags=["RAG Document Retrieval"]
)
api_v1_router.include_router(
    assessments.router, prefix="/assessments", tags=["Assessments & Mastery"]
)
