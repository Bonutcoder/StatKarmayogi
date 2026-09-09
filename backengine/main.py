"""
StatKarmayogi AI - Backengine Entrypoint
Person 2: Competency Intelligence, RAG & AI Owner
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backengine.app.core.config import get_settings
from backengine.app.api.v1.router import api_v1_router

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Competency Intelligence, Evidence-Grounded RAG & Deterministic Assessment Engine for India's Official Statistical System (MoSPI / NSSTA)",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Cross-Origin Resource Sharing for Person 3's Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Person 2's API surface
app.include_router(api_v1_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
async def health_check():
    """System health and degraded state verification."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "deterministic_engine": "online",
        "learning_provider": "mock_catalog" if settings.USE_MOCK_IGOT else "live_adapter",
        "ai_provider_mode": "mock" if (settings.USE_MOCK_AI or not settings.OPENROUTER_API_KEY) else "openrouter",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
