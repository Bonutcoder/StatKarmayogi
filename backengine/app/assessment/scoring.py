"""
Deterministic Assessment Scoring and Mastery Classification.
Implements deterministic scoring invariants:
Score = (Correct Answers / Total Questions) * 100.
Mastery Tiers: Needs Foundation (0-39%), Developing (40-59%), Proficient (60-79%), Strong Mastery (80-100%).
Strictly NON-AI: AI is never permitted to determine scores or alter official mastery facts.
"""

from typing import Dict, List, Optional
from backengine.app.core.config import get_settings, Settings
from backengine.app.assessment.models import (
    MCQQuestion,
    QuizSubmission,
    AssessmentResult,
    QuestionReviewItem,
)
from backengine.app.assessment.generator import AssessmentGenerator


class AssessmentScoringEngine:
    """
    Evaluates submitted learner answers against server-side ground truth.
    Produces authoritative score percentages and classified mastery tiers.
    """

    def __init__(
        self,
        generator: AssessmentGenerator,
        settings: Optional[Settings] = None,
    ):
        self.generator = generator
        self.settings = settings or get_settings()

    def classify_mastery(self, percentage: float) -> tuple[str, str]:
        """
        Maps a deterministic score percentage to a mastery tier and description.
        """
        for tier, (low, high) in self.settings.MASTERY_THRESHOLDS.items():
            if low <= percentage <= high:
                if tier == "Strong Mastery":
                    desc = "Demonstrates thorough understanding and reproducible competency in official statistical workflows."
                elif tier == "Proficient":
                    desc = "Demonstrates solid operational capability with minor areas for refinement."
                elif tier == "Developing":
                    desc = "Demonstrates basic familiarity; further study of standard guidelines is recommended."
                else:
                    desc = "Requires foundational instruction before attempting complex official responsibilities."
                return tier, desc

        return "Needs Foundation", "Score below proficiency threshold."

    def calculate_level_recommendation(
        self, current_difficulty: int, percentage: float
    ) -> int:
        """
        Deterministic recommendation for competency level update:
        - >= 80%: Advance to difficulty level.
        - >= 60%: Maintain current level.
        - < 60%: Retain existing level and reinforce.
        """
        if percentage >= 80.0:
            return min(5, current_difficulty)
        elif percentage >= 60.0:
            return max(1, current_difficulty - 1)
        return max(0, current_difficulty - 1)

    def score_submission(self, submission: QuizSubmission) -> AssessmentResult:
        """
        Grades a quiz submission deterministically.
        """
        session_data = self.generator.get_stored_session(submission.assessment_id)
        if not session_data:
            raise ValueError(f"Assessment session '{submission.assessment_id}' not found or expired.")

        questions: List[MCQQuestion] = session_data["questions"]
        question_map: Dict[str, MCQQuestion] = {q.id: q for q in questions if q.id}

        correct_count = 0
        total_questions = len(questions)
        review_items: List[QuestionReviewItem] = []

        # Map learner's submitted answers
        submitted_answers: Dict[str, str] = {
            a.question_id: a.selected_option.strip().upper()
            for a in submission.answers
        }

        for q in questions:
            qid = q.id or ""
            learner_choice = submitted_answers.get(qid, "")
            is_correct = (learner_choice == q.correct_option.strip().upper())
            if is_correct:
                correct_count += 1

            review_items.append(
                QuestionReviewItem(
                    question_id=qid,
                    question_text=q.question,
                    selected_option=learner_choice,
                    correct_option=q.correct_option,
                    is_correct=is_correct,
                    explanation=q.explanation,
                    source_document=q.source_document,
                    source_page=q.source_page,
                )
            )

        percentage = round((correct_count / total_questions) * 100.0, 1) if total_questions > 0 else 0.0
        mastery_tier, mastery_desc = self.classify_mastery(percentage)
        level_rec = self.calculate_level_recommendation(
            current_difficulty=session_data.get("difficulty", 1),
            percentage=percentage,
        )

        return AssessmentResult(
            assessment_id=submission.assessment_id,
            employee_id=submission.employee_id,
            competency_id=submission.competency_id,
            total_questions=total_questions,
            correct_answers=correct_count,
            score_percentage=percentage,
            mastery_tier=mastery_tier,
            mastery_description=mastery_desc,
            competency_level_recommended=level_rec,
            review_items=review_items,
        )
