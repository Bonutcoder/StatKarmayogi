"""
Core settings and configuration for Person 2 (Competency Intelligence, RAG & AI Engine).
Strictly adheres to SECURITY.md: No secrets logged or hardcoded.
"""

from typing import Dict, Any
import os
from pathlib import Path
from dotenv import load_dotenv


# The core backend owns the shared deployment secrets. A service-specific .env,
# when present, can override it without exposing keys to the React client.
PROJECT_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(PROJECT_ROOT / "Backdata" / ".env", override=False)
load_dotenv(PROJECT_ROOT / "backengine" / ".env", override=True)


class Settings:
    """Application settings with environment variable overrides and secure defaults."""

    def __init__(self):
        # Project & Environment
        self.PROJECT_NAME: str = "StatKarmayogi AI - Backengine"
        self.VERSION: str = "0.1.0"
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

        # OpenRouter AI Provider Configuration
        self.OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
        self.OPENROUTER_BASE_URL: str = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        self.OPENROUTER_DEFAULT_MODEL: str = os.getenv(
            "OPENROUTER_DEFAULT_MODEL",
            os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3-8b-instruct:free"),
        )
        self.AI_TIMEOUT_SECONDS: float = float(os.getenv("AI_TIMEOUT_SECONDS", "30.0"))
        self.AI_MAX_RETRIES: int = int(os.getenv("AI_MAX_RETRIES", "2"))
        self.USE_MOCK_AI: bool = os.getenv("USE_MOCK_AI", "false").lower() in ("true", "1", "yes")

        # Embedding & SBERT Configuration
        self.EMBEDDING_MODEL_NAME: str = os.getenv(
            "EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2"
        )
        self.EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "384"))

        # Skill Gap Priority Weights (Configurable)
        self.GAP_SEVERITY_WEIGHT: float = float(os.getenv("GAP_SEVERITY_WEIGHT", "0.40"))
        self.ROLE_IMPORTANCE_WEIGHT: float = float(os.getenv("ROLE_IMPORTANCE_WEIGHT", "0.30"))
        self.ASSESSMENT_EVIDENCE_WEIGHT: float = float(os.getenv("ASSESSMENT_EVIDENCE_WEIGHT", "0.15"))
        self.RECENCY_WEIGHT: float = float(os.getenv("RECENCY_WEIGHT", "0.15"))

        # Course Recommendation Weights
        self.REC_GAP_WEIGHT: float = float(os.getenv("REC_GAP_WEIGHT", "0.45"))
        self.REC_RELEVANCE_WEIGHT: float = float(os.getenv("REC_RELEVANCE_WEIGHT", "0.25"))
        self.REC_DIFFICULTY_WEIGHT: float = float(os.getenv("REC_DIFFICULTY_WEIGHT", "0.15"))
        self.REC_HISTORY_WEIGHT: float = float(os.getenv("REC_HISTORY_WEIGHT", "0.15"))

        # Mastery Thresholds (0-100 percentage scale)
        self.MASTERY_THRESHOLDS: Dict[str, tuple] = {
            "Needs Foundation": (0, 39.99),
            "Developing": (40, 59.99),
            "Proficient": (60, 79.99),
            "Strong Mastery": (80, 100.0),
        }

        # RAG Pipeline Configuration
        self.RAG_CHUNK_SIZE: int = int(os.getenv("RAG_CHUNK_SIZE", "500"))
        self.RAG_CHUNK_OVERLAP: int = int(os.getenv("RAG_CHUNK_OVERLAP", "50"))
        self.RAG_TOP_K: int = int(os.getenv("RAG_TOP_K", "4"))
        self.RAG_MIN_SIMILARITY: float = float(os.getenv("RAG_MIN_SIMILARITY", "0.40"))
        self.VECTOR_STORE_PATH: str = os.getenv("VECTOR_STORE_PATH", "./chroma_db")

        # iGOT Integration Configuration
        self.IGOT_API_BASE_URL: str = os.getenv("IGOT_API_BASE_URL", "https://igotkarmayogi.gov.in/api")
        self.IGOT_API_TOKEN: str = os.getenv("IGOT_API_TOKEN", "")
        self.USE_MOCK_IGOT: bool = os.getenv("USE_MOCK_IGOT", "true").lower() in ("true", "1", "yes")


_settings_instance = None


def get_settings() -> Settings:
    """Singleton getter for configuration settings."""
    global _settings_instance
    if _settings_instance is None:
        _settings_instance = Settings()
    return _settings_instance
