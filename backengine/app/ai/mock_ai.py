"""
Deterministic Mock AI Provider.
Generates schema-compliant MCQs directly from evidence chunks without external API dependencies.
Used for offline demonstrations, unit tests, and resilient CI pipelines.
"""

from typing import List, Dict, Any, Optional
from backengine.app.ai.base import AIProvider, AIGenerationResponse


class MockAIProvider(AIProvider):
    """
    Simulated AI provider that extracts sentences from context chunks
    to synthesize valid MCQs adhering strictly to the contract.
    """

    def __init__(self, simulate_failure: bool = False):
        self.simulate_failure = simulate_failure

    async def generate(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = 0.2,
    ) -> AIGenerationResponse:
        if self.simulate_failure:
            return AIGenerationResponse(
                content="",
                model="mock-ai",
                is_success=False,
                error_message="Simulated AI service outage.",
                is_degraded=True,
            )

        return AIGenerationResponse(
            content="Mock generation complete.",
            model="mock-ai",
            is_success=True,
            is_degraded=False,
        )

    async def generate_mcqs(
        self,
        competency_name: str,
        difficulty: int,
        context_chunks: List[Dict[str, Any]],
        count: int = 3,
    ) -> List[Dict[str, Any]]:
        if self.simulate_failure:
            from backengine.app.ai.base import AIProviderError
            raise AIProviderError(
                "AI unavailable. Verified deterministic competency data and assessment history remain available."
            )

        questions: List[Dict[str, Any]] = []

        # If no context chunks provided, fallback to synthetic domain-relevant questions
        if not context_chunks:
            context_chunks = [
                {
                    "document_id": "doc_mospi_nssta_standard",
                    "page_start": 1,
                    "section": "Core Standards",
                    "chunk_text": f"Official standard principles for {competency_name} require rigorous validation, sample representation, and adherence to MoSPI guidelines.",
                }
            ]

        templates = [
            (
                f"According to official MoSPI documentation regarding {competency_name}, which principle is mandatory?",
                "Adherence to documented standards and statistical verification",
                "Arbitrary modification of sample weights without documentation",
                "Bypassing peer review for administrative expediency",
                "Excluding non-sampling errors from final technical reports",
                "A",
                f"Document explicitly emphasizes statistical verification and adherence to documented standards in {competency_name}.",
            ),
            (
                f"In the context of Level {difficulty} {competency_name}, what constitutes verified evidence of proficiency?",
                "Execution of standardized procedures with documented reproducibility",
                "Self-certification without supporting audit artifacts",
                "Informal verbal confirmation among peers",
                "Single-attempt completion without validation criteria",
                "A",
                "Official competency framework mandates documented reproducibility and standard verification.",
            ),
            (
                f"When conducting analysis under the {competency_name} framework, how should discrepancies be resolved?",
                "Through systematic audit, scrutiny protocols, and source reconciliation",
                "By deleting non-conforming records without recording an audit event",
                "By ignoring edge cases below a 10% deviation threshold",
                "By replacing official benchmarks with external unverified assumptions",
                "A",
                "Audit logs and systematic scrutiny protocols must be maintained for official statistical integrity.",
            ),
        ]

        for i in range(count):
            chunk = context_chunks[i % len(context_chunks)]
            q_template = templates[i % len(templates)]

            doc_id = chunk.get("document_id", "doc_nssta_reference")
            page = chunk.get("page_start", 1)

            questions.append({
                "question": q_template[0],
                "option_a": q_template[1],
                "option_b": q_template[2],
                "option_c": q_template[3],
                "option_d": q_template[4],
                "correct_option": q_template[5],
                "explanation": q_template[6],
                "source_document": str(doc_id),
                "source_page": int(page),
            })

        return questions
