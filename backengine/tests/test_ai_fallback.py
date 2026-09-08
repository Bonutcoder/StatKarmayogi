"""
Tests for AI Service Outage Resilience and Graceful Degradation.
Validates PERSON_2.md Section AI Failure and SECURITY.md Section 13:
"AI or iGOT outages must not break login, competency records, gap calculation, assessment history."
"""

import unittest
import asyncio
from backengine.app.ai.mock_ai import MockAIProvider
from backengine.app.ai.base import AIProviderError
from backengine.app.rag.vector_store import VectorStore
from backengine.app.assessment.generator import AssessmentGenerator
from backengine.app.assessment.models import AssessmentGenerationRequest
from backengine.app.competency.gap_engine import SkillGapEngine
from backengine.app.competency.models import RoleCompetencyRequirement, EmployeeCompetency


class TestAIFallbackAndDegradedState(unittest.TestCase):
    def setUp(self):
        self.failing_ai = MockAIProvider(simulate_failure=True)
        self.vector_store = VectorStore()
        self.generator = AssessmentGenerator(self.vector_store, self.failing_ai)
        self.gap_engine = SkillGapEngine()

    def test_ai_outage_error_message(self):
        """Verify that an AI failure returns explicit degraded message."""
        with self.assertRaises(AIProviderError) as ctx:
            asyncio.run(
                self.failing_ai.generate_mcqs(
                    competency_name="Statistics",
                    difficulty=2,
                    context_chunks=[],
                    count=3,
                )
            )

        err_msg = str(ctx.exception)
        self.assertIn("AI unavailable", err_msg)
        self.assertIn("deterministic competency data", err_msg)

    def test_deterministic_engine_operates_during_ai_outage(self):
        """
        Verify that deterministic skill gap engine remains 100% operational
        and unaffected even when the AI provider is completely down.
        """
        reqs = [
            RoleCompetencyRequirement(competency_id="comp_statistics", required_level=4),
        ]
        curr = [
            EmployeeCompetency(competency_id="comp_statistics", current_level=2),
        ]

        # Gap calculation must work with zero dependence on AI
        res = self.gap_engine.analyze("emp_test", "role_test", reqs, curr)
        self.assertEqual(res.total_gaps, 1)
        self.assertEqual(res.gaps[0].gap, 2)
        self.assertEqual(res.readiness_percentage, 50.0)

    def test_assessment_generator_graceful_recovery(self):
        """
        Verify generator catches AI failure and recovers via resilient fallback
        without crashing the request.
        """
        req = AssessmentGenerationRequest(
            employee_id="emp_001",
            competency_id="comp_statistics",
            competency_name="Statistics",
            difficulty=2,
            question_count=2,
        )

        session = asyncio.run(self.generator.generate_assessment(req))
        self.assertIsNotNone(session)
        self.assertEqual(len(session.questions), 2)
        self.assertEqual(session.competency_name, "Statistics")


if __name__ == "__main__":
    unittest.main()
