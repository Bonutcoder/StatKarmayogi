"""
OpenRouter AI Provider.
Sends requests to OpenRouter gateway with timeouts, retries, and JSON output parsing.
Implements the AIProvider interface.
"""

from typing import List, Dict, Any, Optional
import json
import re
import httpx
from backengine.app.core.config import get_settings, Settings
from backengine.app.ai.base import AIProvider, AIGenerationResponse, AIProviderError
from backengine.app.ai.prompt_templates import SYSTEM_INSTRUCTION, build_mcq_generation_prompt


class OpenRouterAIProvider(AIProvider):
    """
    OpenRouter API client for LLM inference (e.g. Llama 3, Mistral).
    Isolates external model access behind standard error handling and degraded fallbacks.
    """

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()
        self.api_key = self.settings.OPENROUTER_API_KEY
        self.base_url = self.settings.OPENROUTER_BASE_URL.rstrip("/")
        self.default_model = self.settings.OPENROUTER_DEFAULT_MODEL
        self.timeout = self.settings.AI_TIMEOUT_SECONDS

    async def generate(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = 0.2,
    ) -> AIGenerationResponse:
        """
        Submits prompt to OpenRouter API and returns structured response.
        """
        if not self.api_key:
            return AIGenerationResponse(
                content="",
                model=self.default_model,
                is_success=False,
                error_message="OPENROUTER_API_KEY not configured.",
                is_degraded=True,
            )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://statkarmayogi.gov.in",
            "X-Title": "StatKarmayogi AI",
        }

        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.default_model,
            "messages": messages,
            "temperature": temperature,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                )

                if response.status_code != 200:
                    return AIGenerationResponse(
                        content="",
                        model=self.default_model,
                        is_success=False,
                        error_message=f"OpenRouter API returned error {response.status_code}: {response.text[:200]}",
                        is_degraded=True,
                    )

                data = response.json()
                content = data["choices"][0]["message"]["content"].strip()
                return AIGenerationResponse(
                    content=content,
                    model=self.default_model,
                    is_success=True,
                    is_degraded=False,
                )
        except Exception as e:
            return AIGenerationResponse(
                content="",
                model=self.default_model,
                is_success=False,
                error_message=f"AI Provider connection error: {str(e)}",
                is_degraded=True,
            )

    async def generate_mcqs(
        self,
        competency_name: str,
        difficulty: int,
        context_chunks: List[Dict[str, Any]],
        count: int = 3,
    ) -> List[Dict[str, Any]]:
        """
        Requests source-grounded MCQs from OpenRouter and parses structured JSON output.
        """
        prompt = build_mcq_generation_prompt(
            competency_name=competency_name,
            difficulty=difficulty,
            context_chunks=context_chunks,
            count=count,
        )

        response = await self.generate(
            prompt=prompt,
            system_message=SYSTEM_INSTRUCTION,
            temperature=0.1,
        )

        if not response.is_success or not response.content:
            raise AIProviderError(
                response.error_message
                or "AI unavailable. Verified deterministic competency data and assessment history remain available."
            )

        # Parse JSON from response, handling possible markdown code fence wrapping
        raw_json = response.content.strip()
        if raw_json.startswith("```"):
            raw_json = re.sub(r"^```(?:json)?\n?", "", raw_json)
            raw_json = re.sub(r"\n?```$", "", raw_json)

        try:
            parsed = json.loads(raw_json)
            if isinstance(parsed, list):
                return parsed
            elif isinstance(parsed, dict) and "questions" in parsed:
                return parsed["questions"]
            return []
        except json.JSONDecodeError as e:
            raise AIProviderError(f"AI response did not adhere to structured JSON schema: {str(e)}")
