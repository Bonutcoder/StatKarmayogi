import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_ENV: str = "development"
    APP_BASE_URL: str = "http://localhost:8000"
    SECRET_KEY: str = "statkarmayogi-super-secret-key-change-in-production-32-bytes"
    
    # Database URL
    DATABASE_URL: str = "sqlite+aiosqlite:///./statkarmayogi.db"
    
    # Supabase / Auth settings
    NEXT_PUBLIC_SUPABASE_URL: str = "https://example.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str = "anon-key-placeholder"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: str = "super-secret-jwt-key-placeholder-for-dev-auth"
    
    # Storage settings
    STORAGE_LOCAL_ROOT: str = "./private_storage"
    MAX_UPLOAD_SIZE_MB: int = 25
    
    # AI & Integration settings
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_MODEL: str = "google/gemini-2.0-flash-001"

settings = Settings()
