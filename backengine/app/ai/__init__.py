"""
AI Provider abstraction, prompt injection defense, and OpenRouter / Mock implementations.
"""

from backengine.app.ai.base import AIProvider, AIGenerationResponse, AIProviderError
from backengine.app.ai.prompt_templates import build_mcq_generation_prompt
from backengine.app.ai.openrouter import OpenRouterAIProvider
from backengine.app.ai.mock_ai import MockAIProvider

__all__ = [
    "AIProvider",
    "AIGenerationResponse",
    "AIProviderError",
    "build_mcq_generation_prompt",
    "OpenRouterAIProvider",
    "MockAIProvider",
]
