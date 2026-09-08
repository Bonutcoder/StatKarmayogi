"""
Data models and schemas for competencies, requirements, and skill-gap profiles.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class Competency(BaseModel):
    """Canonical competency definition in the MoSPI / NSSTA framework."""
    id: str = Field(..., description="Unique identifier of the competency, e.g. comp_statistics")
    name: str = Field(..., description="Official name of the competency, e.g. Statistics")
    domain: str = Field(default="Official Statistics", description="Domain classification")
    description: str = Field(..., description="Detailed description of competency expectations")
    evidence_sources: List[str] = Field(default_factory=list, description="Approved training or assessment sources")


class EmployeeCompetency(BaseModel):
    """Employee's current demonstrated level for a specific competency."""
    competency_id: str
    competency_name: Optional[str] = None
    current_level: int = Field(..., ge=0, le=5, description="Demonstrated proficiency level (0-5)")
    last_assessed: Optional[str] = None
    assessment_score: Optional[float] = None
    evidence_count: int = Field(default=0, ge=0)


class RoleCompetencyRequirement(BaseModel):
    """Official required competency and level for a particular role."""
    competency_id: str
    competency_name: Optional[str] = None
    required_level: int = Field(..., ge=1, le=5, description="Required proficiency level (1-5)")
    criticality: float = Field(
        default=1.0, ge=0.5, le=2.0, description="Importance multiplier for the role (0.5 - 2.0)"
    )


class SkillGap(BaseModel):
    """Deterministic output representing a detected skill gap for a single competency."""
    competency_id: str
    competency_name: str
    required_level: int
    current_level: int
    gap: int = Field(..., description="Required Level - Current Level (0 if current >= required)")
    priority_score: float = Field(..., description="Deterministic priority score based on configured formula")
    priority_level: str = Field(..., description="HIGH, MEDIUM, LOW, or MET")
    explanation: str = Field(..., description="Human-readable explanation of the gap and priority")


class SkillGapAnalysisRequest(BaseModel):
    """Payload for analyzing an employee's skill gaps against role requirements."""
    employee_id: str
    role_id: str
    requirements: List[RoleCompetencyRequirement]
    current_competencies: List[EmployeeCompetency]


class SkillGapAnalysisResponse(BaseModel):
    """Result of deterministic skill gap analysis."""
    employee_id: str
    role_id: str
    gaps: List[SkillGap]
    total_gaps: int
    high_priority_gaps: int
    readiness_percentage: float
