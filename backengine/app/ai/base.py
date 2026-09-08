"""
Abstract Base Class for AI Model Providers.
Ensures provider isolation (OpenRouter, local models, mock) behind a unified interface.
Complies with PERSON_2.md Section AI Provider and SECURITY.md Section 13.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class AIProviderError(Exception):
    """Raised when an external AI provider fails or times out."""
    pass


class AIGenerationResponse(BaseModel):
    """Container for AI model output and execution status."""
    content: str
    model: str
    is_success: bool = True
    error_message: Optional[str] = None
    is_degraded: bool = False


class AIProvider(ABC):
    """
    Contract for AI inference engines.
    AI must never directly mutate authoritative database records or override deterministic scoring.
    """

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = 0.2,
    ) -> AIGenerationResponse:
        """Execute raw text completion."""
        pass

    @abstractmethod
    async def generate_mcqs(
        self,
        competency_name: str,
        difficulty: int,
        context_chunks: List[Dict[str, Any]],
        count: int = 3,
    ) -> List[Dict[str, Any]]:
        """Generate structured MCQs grounded exclusively in provided evidence chunks."""
        pass
