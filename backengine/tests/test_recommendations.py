"""
Tests for Course Recommendation Engine.
Verifies multi-factor scoring, transparent justifications, and completed course filtering.
"""

import unittest
import asyncio
from backengine.app.competency.models import SkillGap
from backengine.app.recommendation.models import RecommendationRequest
from backengine.app.recommendation.engine import CourseRecommendationEngine
from backengine.app.igot.mock_provider import MockLearningProvider


class TestCourseRecommendations(unittest.TestCase):
    def setUp(self):
        self.provider = MockLearningProvider()
        self.engine = CourseRecommendationEngine(self.provider)

    def test_recommendation_filtering_and_ranking(self):
        """Verify recommendations address high-priority gaps and exclude completed courses."""
        gaps = [
            SkillGap(
                competency_id="comp_statistics",
                competency_name="Statistics",
                required_level=4,
                current_level=1,
                gap=3,
                priority_score=0.85,
                priority_level="HIGH",
                explanation="HIGH priority gap in Statistics.",
            ),
            SkillGap(
                competency_id="comp_gis",
                competency_name="GIS",
                required_level=3,
                current_level=1,
                gap=2,
                priority_score=0.55,
                priority_level="MEDIUM",
                explanation="MEDIUM priority gap in GIS.",
            ),
        ]

        # Case 1: No completed courses
        req = RecommendationRequest(
            employee_id="emp_test_1",
            skill_gaps=gaps,
            completed_course_ids=[],
            limit=3,
        )
        res = asyncio.run(self.engine.recommend(req))

        self.assertGreater(len(res.recommendations), 0)
        # First recommendation should address the high-priority Statistics gap
        first_rec = res.recommendations[0]
        self.assertIn("comp_statistics", first_rec.target_competency_ids)
        self.assertIn("Statistics", first_rec.explanation)
        self.assertIn("high-priority", first_rec.explanation)

        # Case 2: Complete the top statistics course, verify it gets excluded
        completed_id = first_rec.course_id
        req_completed = RecommendationRequest(
            employee_id="emp_test_1",
            skill_gaps=gaps,
            completed_course_ids=[completed_id],
            limit=3,
        )
        res_completed = asyncio.run(self.engine.recommend(req_completed))
        rec_ids = [r.course_id for r in res_completed.recommendations]
        self.assertNotIn(completed_id, rec_ids)


if __name__ == "__main__":
    unittest.main()
