"""
Tests for Deterministic Assessment Scoring and Mastery Classification.
Verifies that:
- Percentage = (correct / total) * 100
- Mastery tiers match PRD.md specifications:
  0-39% Needs Foundation, 40-59% Developing, 60-79% Proficient, 80-100% Strong Mastery
- Scoring is strictly non-AI and reproducible.
"""

import unittest
from backengine.app.assessment.models import (
    MCQQuestion,
    QuizSubmission,
    AnswerItem,
)
from backengine.app.assessment.generator import AssessmentGenerator
from backengine.app.assessment.scoring import AssessmentScoringEngine
from backengine.app.rag.vector_store import VectorStore
from backengine.app.ai.mock_ai import MockAIProvider


class TestAssessmentScoring(unittest.TestCase):
    def setUp(self):
        self.vector_store = VectorStore()
        self.mock_ai = MockAIProvider()
        self.generator = AssessmentGenerator(self.vector_store, self.mock_ai)
        self.scoring_engine = AssessmentScoringEngine(self.generator)

        # Pre-seed a known session with 4 questions
        self.assessment_id = "asmt_test_session"
        self.questions = [
            MCQQuestion(
                id="q_1",
                question="Question 1",
                option_a="A1", option_b="B1", option_c="C1", option_d="D1",
                correct_option="A",
                explanation="Exp 1",
                source_document="doc_1", source_page=1,
            ),
            MCQQuestion(
                id="q_2",
                question="Question 2",
                option_a="A2", option_b="B2", option_c="C2", option_d="D2",
                correct_option="B",
                explanation="Exp 2",
                source_document="doc_1", source_page=2,
            ),
            MCQQuestion(
                id="q_3",
                question="Question 3",
                option_a="A3", option_b="B3", option_c="C3", option_d="D3",
                correct_option="C",
                explanation="Exp 3",
                source_document="doc_1", source_page=3,
            ),
            MCQQuestion(
                id="q_4",
                question="Question 4",
                option_a="A4", option_b="B4", option_c="C4", option_d="D4",
                correct_option="D",
                explanation="Exp 4",
                source_document="doc_1", source_page=4,
            ),
        ]

        self.generator._active_sessions[self.assessment_id] = {
            "assessment_id": self.assessment_id,
            "employee_id": "emp_learner_1",
            "competency_id": "comp_statistics",
            "difficulty": 3,
            "questions": self.questions,
        }

    def test_strong_mastery_scoring(self):
        """4/4 correct = 100% -> Strong Mastery."""
        sub = QuizSubmission(
            assessment_id=self.assessment_id,
            employee_id="emp_learner_1",
            competency_id="comp_statistics",
            answers=[
                AnswerItem(question_id="q_1", selected_option="A"),
                AnswerItem(question_id="q_2", selected_option="B"),
                AnswerItem(question_id="q_3", selected_option="C"),
                AnswerItem(question_id="q_4", selected_option="D"),
            ],
        )
        res = self.scoring_engine.score_submission(sub)
        self.assertEqual(res.score_percentage, 100.0)
        self.assertEqual(res.correct_answers, 4)
        self.assertEqual(res.mastery_tier, "Strong Mastery")
        self.assertEqual(res.competency_level_recommended, 3)

    def test_proficient_scoring(self):
        """3/4 correct = 75.0% -> Proficient."""
        sub = QuizSubmission(
            assessment_id=self.assessment_id,
            employee_id="emp_learner_1",
            competency_id="comp_statistics",
            answers=[
                AnswerItem(question_id="q_1", selected_option="A"),
                AnswerItem(question_id="q_2", selected_option="B"),
                AnswerItem(question_id="q_3", selected_option="C"),
                AnswerItem(question_id="q_4", selected_option="A"),  # Wrong answer
            ],
        )
        res = self.scoring_engine.score_submission(sub)
        self.assertEqual(res.score_percentage, 75.0)
        self.assertEqual(res.correct_answers, 3)
        self.assertEqual(res.mastery_tier, "Proficient")

    def test_developing_scoring(self):
        """2/4 correct = 50.0% -> Developing."""
        sub = QuizSubmission(
            assessment_id=self.assessment_id,
            employee_id="emp_learner_1",
            competency_id="comp_statistics",
            answers=[
                AnswerItem(question_id="q_1", selected_option="A"),
                AnswerItem(question_id="q_2", selected_option="B"),
                AnswerItem(question_id="q_3", selected_option="A"),  # Wrong
                AnswerItem(question_id="q_4", selected_option="A"),  # Wrong
            ],
        )
        res = self.scoring_engine.score_submission(sub)
        self.assertEqual(res.score_percentage, 50.0)
        self.assertEqual(res.mastery_tier, "Developing")

    def test_needs_foundation_scoring(self):
        """1/4 correct = 25.0% -> Needs Foundation."""
        sub = QuizSubmission(
            assessment_id=self.assessment_id,
            employee_id="emp_learner_1",
            competency_id="comp_statistics",
            answers=[
                AnswerItem(question_id="q_1", selected_option="A"),
                AnswerItem(question_id="q_2", selected_option="A"),  # Wrong
                AnswerItem(question_id="q_3", selected_option="A"),  # Wrong
                AnswerItem(question_id="q_4", selected_option="A"),  # Wrong
            ],
        )
        res = self.scoring_engine.score_submission(sub)
        self.assertEqual(res.score_percentage, 25.0)
        self.assertEqual(res.mastery_tier, "Needs Foundation")


if __name__ == "__main__":
    unittest.main()
