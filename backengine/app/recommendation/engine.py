"""
Multi-factor Course Recommendation Engine.
Synthesizes deterministic competency gaps, course mapping, difficulty alignment,
and training history into prioritized course recommendations with transparent justifications.
"""

from typing import List, Dict, Optional, Set
from backengine.app.core.config import get_settings, Settings
from backengine.app.competency.models import SkillGap
from backengine.app.igot.base import LearningProvider, CourseSummary
from backengine.app.recommendation.models import (
    CourseRecommendation,
    RecommendationRequest,
    RecommendationResponse,
)


class CourseRecommendationEngine:
    """
    Ranks courses from the learning provider against an officer's skill gaps.
    Every recommendation is accompanied by an explicit, verifiable explanation.
    """

    def __init__(
        self,
        learning_provider: LearningProvider,
        settings: Optional[Settings] = None,
    ):
        self.provider = learning_provider
        self.settings = settings or get_settings()

    def _calculate_level_match(self, current_level: int, course_level: int) -> float:
        """
        Determines pedagogical alignment between current officer level and course level.
        Optimal: course_level is current_level + 1 (progression).
        """
        diff = abs((current_level + 1) - course_level)
        if diff == 0:
            return 1.0
        elif diff == 1:
            return 0.75
        elif diff == 2:
            return 0.40
        return 0.10

    def _generate_explanation(
        self,
        gap: SkillGap,
        course: CourseSummary,
        level_match_score: float,
    ) -> str:
        """Constructs an evidence-backed rationale for the recommendation."""
        priority_desc = gap.priority_level.lower()
        base_msg = (
            f"Recommended because this course directly addresses your {priority_desc}-priority "
            f"{gap.competency_name} competency gap (Target: Level {gap.required_level}, Current: Level {gap.current_level})."
        )
        if course.level == gap.current_level + 1:
            base_msg += f" The course level ({course.level}) is ideally suited for progressive mastery."
        return base_msg

    async def recommend(self, request: RecommendationRequest) -> RecommendationResponse:
        """
        Generates course recommendations for an officer based on their active skill gaps.
        """
        active_gaps = [g for g in request.skill_gaps if g.gap > 0]
        if not active_gaps:
            return RecommendationResponse(
                employee_id=request.employee_id,
                recommendations=[],
                total_found=0,
            )

        completed_set: Set[str] = set(request.completed_course_ids)
        gap_map: Dict[str, SkillGap] = {g.competency_id: g for g in active_gaps}
        target_comp_ids = list(gap_map.keys())

        # Retrieve eligible courses from learning provider
        available_courses = await self.provider.search_courses(
            competency_ids=target_comp_ids,
            limit=50,
        )

        scored_recommendations: List[CourseRecommendation] = []

        for course in available_courses:
            # Skip courses already completed by this employee
            if course.id in completed_set:
                continue

            # Identify matching competencies between this course and officer's gaps
            matching_gaps = [
                gap_map[cid] for cid in course.competency_ids if cid in gap_map
            ]
            if not matching_gaps:
                continue

            # Best matching gap for this course
            primary_gap = max(matching_gaps, key=lambda g: g.priority_score)

            level_match = self._calculate_level_match(
                current_level=primary_gap.current_level,
                course_level=course.level,
            )

            # Calculate composite relevance score
            relevance = (
                (self.settings.REC_GAP_WEIGHT * primary_gap.priority_score)
                + (self.settings.REC_RELEVANCE_WEIGHT * 1.0)  # Direct competency alignment
                + (self.settings.REC_DIFFICULTY_WEIGHT * level_match)
                + (self.settings.REC_HISTORY_WEIGHT * 1.0)   # Uncompleted bonus
            )
            relevance = round(min(1.0, relevance), 4)

            comp_names = [g.competency_name for g in matching_gaps]
            explanation = self._generate_explanation(
                gap=primary_gap,
                course=course,
                level_match_score=level_match,
            )

            scored_recommendations.append(
                CourseRecommendation(
                    course_id=course.id,
                    course_title=course.title,
                    provider=course.provider,
                    target_competency_ids=course.competency_ids,
                    target_competency_names=comp_names,
                    relevance_score=relevance,
                    explanation=explanation,
                    course_level=course.level,
                    duration_hours=course.duration_hours,
                    source=course.source,
                    external_url=course.external_url,
                )
            )

        # Sort by relevance score descending
        scored_recommendations.sort(key=lambda r: r.relevance_score, reverse=True)

        selected = scored_recommendations[: request.limit]

        return RecommendationResponse(
            employee_id=request.employee_id,
            recommendations=selected,
            total_found=len(selected),
        )
