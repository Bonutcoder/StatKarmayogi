"""
Competency intelligence and skill-gap endpoints.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backengine.app.competency.models import (
    SkillGapAnalysisRequest,
    SkillGapAnalysisResponse,
)
from backengine.app.competency.gap_engine import SkillGapEngine
from backengine.app.competency.matcher import SemanticCompetencyMatcher, OFFICIAL_COMPETENCIES

router = APIRouter()
gap_engine = SkillGapEngine()
matcher = SemanticCompetencyMatcher()


class CompetencyMatchRequest(BaseModel):
    query: str
    top_k: int = 3
    threshold: float = 0.20


@router.post("/analyze", response_model=SkillGapAnalysisResponse)
async def analyze_skill_gaps(request: SkillGapAnalysisRequest):
    """
    Executes deterministic skill gap analysis:
    Required Level - Current Level = Gap.
    Includes priority scoring and evidence-based explanations.
    """
    try:
        return gap_engine.analyze(
            employee_id=request.employee_id,
            role_id=request.role_id,
            requirements=request.requirements,
            current_competencies=request.current_competencies,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gap analysis error: {str(e)}")


@router.post("/match")
async def match_competency(request: CompetencyMatchRequest) -> List[Dict[str, Any]]:
    """
    Semantic search over the canonical MoSPI / NSSTA Competency Framework
    using SBERT / Sentence Transformers.
    """
    return matcher.match(
        query=request.query,
        top_k=request.top_k,
        threshold=request.threshold,
    )


@router.get("/framework")
async def get_framework() -> List[Dict[str, Any]]:
    """Retrieves canonical official MoSPI / NSSTA competency framework."""
    return OFFICIAL_COMPETENCIES
