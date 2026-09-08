"""
Deterministic Skill Gap Engine.
Implements the core invariant: Required Level - Current Level = Gap.
Strictly non-AI: repeatable, deterministic, auditable.
"""

from typing import List, Dict, Optional
from backengine.app.core.config import get_settings, Settings
from backengine.app.competency.models import (
    RoleCompetencyRequirement,
    EmployeeCompetency,
    SkillGap,
    SkillGapAnalysisResponse,
)


class SkillGapEngine:
    """
    Deterministic calculation engine for competency skill gaps and priority ordering.
    Never relies on AI; output is 100% reproducible.
    """

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()

    def calculate_gap(self, required_level: int, current_level: int) -> int:
        """
        Primary deterministic rule:
        Required Level - Current Level = Gap (minimum 0)
        """
        return max(0, required_level - current_level)

    def calculate_priority_score(
        self,
        gap: int,
        criticality: float,
        assessment_score: Optional[float] = None,
        evidence_count: int = 0,
        last_assessed: Optional[str] = None,
    ) -> float:
        """
        Calculates priority score incorporating:
        gap severity, role importance, assessment evidence, and recency.
        Strictly deterministic.
        """
        if gap == 0:
            return 0.0

        # Normalized gap severity (0.0 to 1.0, assuming max gap is 5)
        normalized_gap = min(1.0, gap / 5.0)

        # Normalized criticality (0.0 to 1.0, assuming max criticality is 2.0)
        normalized_crit = min(1.0, criticality / 2.0)

        # Evidence urgency: higher if no evidence or poor past assessment score
        if evidence_count == 0 or assessment_score is None:
            evidence_urgency = 1.0  # highest urgency because unverified
        else:
            evidence_urgency = max(0.0, 1.0 - (assessment_score / 100.0))

        # Recency urgency: unassessed or distant assessment increases urgency
        recency_urgency = 1.0 if not last_assessed else 0.5

        raw_score = (
            (self.settings.GAP_SEVERITY_WEIGHT * normalized_gap)
            + (self.settings.ROLE_IMPORTANCE_WEIGHT * normalized_crit)
            + (self.settings.ASSESSMENT_EVIDENCE_WEIGHT * evidence_urgency)
            + (self.settings.RECENCY_WEIGHT * recency_urgency)
        )

        total_weight = (
            self.settings.GAP_SEVERITY_WEIGHT
            + self.settings.ROLE_IMPORTANCE_WEIGHT
            + self.settings.ASSESSMENT_EVIDENCE_WEIGHT
            + self.settings.RECENCY_WEIGHT
        )
        normalized_score = raw_score / total_weight if total_weight > 0 else raw_score
        return round(min(1.0, normalized_score), 4)

    def classify_priority(self, gap: int, priority_score: float) -> str:
        """Categorizes priority into human-actionable tiers."""
        if gap == 0:
            return "MET"
        if priority_score >= 0.60:
            return "HIGH"
        if priority_score >= 0.35:
            return "MEDIUM"
        return "LOW"

    def generate_explanation(
        self,
        competency_name: str,
        required_level: int,
        current_level: int,
        gap: int,
        priority_level: str,
    ) -> str:
        """Generates clear, deterministic explanation based strictly on established facts."""
        if gap == 0:
            return (
                f"Proficiency requirement met for {competency_name}. "
                f"Current level {current_level} meets or exceeds required level {required_level}."
            )
        return (
            f"{priority_level} priority skill gap detected for {competency_name}. "
            f"Role requires Level {required_level}, current demonstrated proficiency is Level {current_level} "
            f"(Gap: {gap} levels)."
        )

    def analyze(
        self,
        employee_id: str,
        role_id: str,
        requirements: List[RoleCompetencyRequirement],
        current_competencies: List[EmployeeCompetency],
    ) -> SkillGapAnalysisResponse:
        """
        Executes full deterministic gap analysis for an employee against their role requirements.
        """
        # Map current competencies by competency_id for fast lookup
        current_map: Dict[str, EmployeeCompetency] = {
            c.competency_id: c for c in current_competencies
        }

        gaps: List[SkillGap] = []
        total_required_levels = 0
        total_demonstrated_levels = 0

        for req in requirements:
            comp_id = req.competency_id
            comp_name = req.competency_name or comp_id

            emp_comp = current_map.get(comp_id)
            curr_level = emp_comp.current_level if emp_comp else 0
            score = emp_comp.assessment_score if emp_comp else None
            evidence_cnt = emp_comp.evidence_count if emp_comp else 0
            last_assessed_date = emp_comp.last_assessed if emp_comp else None

            gap = self.calculate_gap(req.required_level, curr_level)
            p_score = self.calculate_priority_score(
                gap=gap,
                criticality=req.criticality,
                assessment_score=score,
                evidence_count=evidence_cnt,
                last_assessed=last_assessed_date,
            )
            p_level = self.classify_priority(gap, p_score)
            explanation = self.generate_explanation(
                competency_name=comp_name,
                required_level=req.required_level,
                current_level=curr_level,
                gap=gap,
                priority_level=p_level,
            )

            gaps.append(
                SkillGap(
                    competency_id=comp_id,
                    competency_name=comp_name,
                    required_level=req.required_level,
                    current_level=curr_level,
                    gap=gap,
                    priority_score=p_score,
                    priority_level=p_level,
                    explanation=explanation,
                )
            )

            total_required_levels += req.required_level
            total_demonstrated_levels += min(curr_level, req.required_level)

        # Sort gaps by priority score descending
        gaps.sort(key=lambda g: g.priority_score, reverse=True)

        readiness = (
            round((total_demonstrated_levels / total_required_levels) * 100.0, 1)
            if total_required_levels > 0
            else 100.0
        )

        total_gap_count = sum(1 for g in gaps if g.gap > 0)
        high_p_count = sum(1 for g in gaps if g.priority_level == "HIGH")

        return SkillGapAnalysisResponse(
            employee_id=employee_id,
            role_id=role_id,
            gaps=gaps,
            total_gaps=total_gap_count,
            high_priority_gaps=high_p_count,
            readiness_percentage=readiness,
        )
