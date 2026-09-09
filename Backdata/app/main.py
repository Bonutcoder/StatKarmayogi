import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.base import Base
from app.db.session import engine, AsyncSessionLocal
from app.api.v1.router import api_router

async def init_db_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db_data()
    yield

app = FastAPI(
    title="StatKarmayogi AI — Core Backend (Backdata)",
    description="Authoritative Backend Data, Security, Deterministic Engines & API Contracts",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Backdata (StatKarmayogi Core Backend)",
        "mode": "LIVE DATA ONLY",
        "version": "1.0.0"
    }
