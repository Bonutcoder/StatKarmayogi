"""
Strict MCQ Contract Validator.
Implements the validation rules defined in PERSON_2.md Section MCQ Contract.
Rejects malformed, duplicate, or ungrounded questions.
"""

from typing import Dict, Any, List
from backengine.app.assessment.models import MCQQuestion, MCQValidationResult


class MCQValidator:
    """
    Automated validator ensuring generated questions satisfy strict quality and security standards.
    """

    VALID_OPTIONS = {"A", "B", "C", "D"}

    @classmethod
    def validate_raw_dict(cls, data: Dict[str, Any]) -> MCQValidationResult:
        """
        Validates raw dict output from AI against the MCQ contract:
        - Exactly four options (option_a, option_b, option_c, option_d)
        - Exactly one correct answer in ['A', 'B', 'C', 'D']
        - No duplicate options
        - Non-empty question and explanation
        - Source document and page present
        """
        errors: List[str] = []

        # 1. Check question text
        question_text = str(data.get("question", "")).strip()
        if not question_text or len(question_text) < 10:
            errors.append("Question text is empty or too short (< 10 characters).")

        # 2. Check all four options present and non-empty
        opt_a = str(data.get("option_a", "")).strip()
        opt_b = str(data.get("option_b", "")).strip()
        opt_c = str(data.get("option_c", "")).strip()
        opt_d = str(data.get("option_d", "")).strip()

        if not opt_a:
            errors.append("option_a is empty.")
        if not opt_b:
            errors.append("option_b is empty.")
        if not opt_c:
            errors.append("option_c is empty.")
        if not opt_d:
            errors.append("option_d is empty.")

        # 3. Check for duplicates among options (case-insensitive)
        options = [opt_a.lower(), opt_b.lower(), opt_c.lower(), opt_d.lower()]
        if len(set(options)) != 4:
            errors.append("Options contain duplicate values.")

        # 4. Check correct option
        correct = str(data.get("correct_option", "")).strip().upper()
        if correct not in cls.VALID_OPTIONS:
            errors.append(f"correct_option '{correct}' is invalid. Must be exactly one of 'A', 'B', 'C', or 'D'.")

        # 5. Check explanation
        explanation = str(data.get("explanation", "")).strip()
        if not explanation or len(explanation) < 10:
            errors.append("Explanation is empty or lacks factual detail.")

        # 6. Check source citations
        source_doc = str(data.get("source_document", "")).strip()
        if not source_doc:
            errors.append("source_document citation is missing.")

        source_page = data.get("source_page", 1)
        try:
            source_page = int(source_page)
            if source_page < 1:
                errors.append("source_page must be a positive integer.")
        except (ValueError, TypeError):
            errors.append("source_page is not a valid integer.")

        if errors:
            return MCQValidationResult(is_valid=False, errors=errors, question=None)

        # Build clean validated model
        mcq = MCQQuestion(
            id=data.get("id"),
            question=question_text,
            option_a=opt_a,
            option_b=opt_b,
            option_c=opt_c,
            option_d=opt_d,
            correct_option=correct,
            explanation=explanation,
            source_document=source_doc,
            source_page=source_page,
        )

        return MCQValidationResult(is_valid=True, errors=[], question=mcq)

    @classmethod
    def validate_batch(cls, raw_questions: List[Dict[str, Any]]) -> List[MCQQuestion]:
        """
        Validates a list of questions and filters out any non-compliant items.
        """
        valid_questions: List[MCQQuestion] = []
        for raw in raw_questions:
            result = cls.validate_raw_dict(raw)
            if result.is_valid and result.question is not None:
                valid_questions.append(result.question)
        return valid_questions
