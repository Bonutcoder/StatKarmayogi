"""
Assessment Generation Engine.
Coordinates RAG vector retrieval, AI model generation, contract validation, and session creation.
"""

from typing import List, Dict, Optional
import uuid
from backengine.app.core.config import get_settings, Settings
from backengine.app.rag.vector_store import VectorStore
from backengine.app.ai.base import AIProvider
from backengine.app.assessment.models import (
    MCQQuestion,
    AssessmentGenerationRequest,
    AssessmentSession,
)
from backengine.app.assessment.validator import MCQValidator


class AssessmentGenerator:
    """
    Coordinates evidence retrieval and contract-grounded question generation.
    """

    def __init__(
        self,
        vector_store: VectorStore,
        ai_provider: AIProvider,
        settings: Optional[Settings] = None,
    ):
        self.vector_store = vector_store
        self.ai_provider = ai_provider
        self.settings = settings or get_settings()

        # In-memory session bank: { assessment_id: { "meta": ..., "questions": [MCQQuestion] } }
        self._active_sessions: Dict[str, Dict] = {}

    def get_stored_session(self, assessment_id: str) -> Optional[Dict]:
        """Retrieves server-side unmasked session for answer verification."""
        return self._active_sessions.get(assessment_id)

    async def generate_assessment(
        self, request: AssessmentGenerationRequest
    ) -> AssessmentSession:
        """
        Orchestrates full assessment creation:
        1. Query VectorStore for competency evidence chunks within department isolation.
        2. Call AI Provider with delimited prompt.
        3. Validate output against MCQ contract.
        4. Mask answers for client presentation.
        """
        # Step 1: Retrieve authorized evidence chunks
        query = f"{request.competency_name} official procedures, principles and methodologies"
        chunks = self.vector_store.search(
            department_id=request.department_id,
            query=query,
            top_k=self.settings.RAG_TOP_K,
        )

        # Step 2: Invoke AI inference with fallback retry
        valid_mcqs: List[MCQQuestion] = []
        try:
            raw_mcqs = await self.ai_provider.generate_mcqs(
                competency_name=request.competency_name,
                difficulty=request.difficulty,
                context_chunks=chunks,
                count=request.question_count,
            )
            # Step 3: Validate contract
            valid_mcqs = MCQValidator.validate_batch(raw_mcqs)
        except Exception:
            # AI failure -> fallback to mock provider for continuity
            from backengine.app.ai.mock_ai import MockAIProvider
            fallback_ai = MockAIProvider()
            raw_mcqs = await fallback_ai.generate_mcqs(
                competency_name=request.competency_name,
                difficulty=request.difficulty,
                context_chunks=chunks,
                count=request.question_count,
            )
            valid_mcqs = MCQValidator.validate_batch(raw_mcqs)

        # Ensure all questions have unique IDs
        for idx, q in enumerate(valid_mcqs, 1):
            if not q.id:
                q.id = f"q_{idx}_{uuid.uuid4().hex[:6]}"

        assessment_id = f"asmt_{uuid.uuid4().hex[:8]}"

        # Step 4: Persist unmasked questions server-side for authoritative scoring
        self._active_sessions[assessment_id] = {
            "assessment_id": assessment_id,
            "employee_id": request.employee_id,
            "competency_id": request.competency_id,
            "difficulty": request.difficulty,
            "questions": valid_mcqs,
        }

        # Step 5: Construct client-safe masked session (options only, no correct_option or explanation)
        client_questions = []
        for q in valid_mcqs:
            client_questions.append({
                "id": q.id,
                "question": q.question,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
                "source_document": q.source_document,
                "source_page": q.source_page,
            })

        return AssessmentSession(
            assessment_id=assessment_id,
            employee_id=request.employee_id,
            competency_id=request.competency_id,
            competency_name=request.competency_name,
            difficulty=request.difficulty,
            questions=client_questions,
        )
