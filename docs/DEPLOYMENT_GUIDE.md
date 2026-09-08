# StatKarmayogi AI — Tech Lead Deployment & Services Guide

This document is the official deployment and external services reference for the **Tech Lead** of **StatKarmayogi AI**, adhering strictly to `docs/TECH_LEAD_SERVICES.md` and `docs/SECURITY.md`.

---

## 1. Environment Variable Specifications (`Backdata/.env`)

When deploying to cloud platforms (Vercel, Render, Railway, AWS, or Azure), provision the following environment variables:

| Variable Name | Required | Server / Client | Purpose |
|---|---|---|---|
| `APP_ENV` | Yes | Server | Environment phase (`development`, `staging`, `production`) |
| `APP_BASE_URL` | Yes | Server | Base URL of the backend API |
| `SECRET_KEY` | Yes | Server | Secret key for local cryptographic functions |
| `DATABASE_URL` | Yes | Server | Async PostgreSQL URL (`postgresql+asyncpg://...`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client & Server | Public Supabase project endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client & Server | Public Supabase anonymous client key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Server Only** | Administrative service role key (Never expose to client!) |
| `SUPABASE_JWT_SECRET` | Yes | Server | Supabase JWT Secret for token verification |
| `OPENROUTER_API_KEY` | Optional | **Server Only** | OpenRouter AI Gateway key for RAG & MCQ generation |
| `OPENROUTER_MODEL` | Optional | Server | OpenRouter model ID (`google/gemini-2.0-flash-001`) |
| `STORAGE_LOCAL_ROOT` | Yes | Server | Directory path for private document uploads (`./private_storage`) |
| `MAX_UPLOAD_SIZE_MB` | Yes | Server | Max PDF upload size limit (Default: `25`) |

> [!CAUTION]
> **Secrets Protection Rule**
> Never add `NEXT_PUBLIC_` prefix to server-only secrets such as `SUPABASE_SERVICE_ROLE_KEY` or `OPENROUTER_API_KEY`.

---

## 2. Supabase Cloud Provisioning Steps

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com) -> New Project.
   - Project Name: `statkarmayogi-prod`
   - Select Region: `South Asia (Mumbai)` or closest region.

2. **Retrieve PostgreSQL Credentials**:
   - Go to **Project Settings -> Database -> Connection String -> URI**.
   - Copy string and update driver to `postgresql+asyncpg://`:
     ```text
     DATABASE_URL=postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```

3. **Retrieve Auth Keys**:
   - Go to **Project Settings -> API**.
   - Copy Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`
   - Copy JWT Secret -> `SUPABASE_JWT_SECRET`

4. **Create Private Storage Bucket**:
   - Go to **Storage -> Create Bucket**.
   - Bucket Name: `training_documents`
   - Access: Set to **Private** (Public access disabled).

---

## 3. iGOT Karmayogi Adapter Boundary

StatKarmayogi AI uses an isolated adapter boundary:
```text
LearningProvider
├── search_courses()
├── get_course()
└── get_course_catalog()
```
- Until official authorized iGOT API credentials are provided by the government ecosystem, the system runs on `MockLearningProvider` and labels all courses clearly with `[DEMO CATALOGUE]`.
- When official credentials are provided, switch implementation to `IGOTLearningProvider` without changing application business logic.

---

## 4. Branch Protection & Git Workflow

- **`main`**: Production-ready branch. Protected by PR review requirements.
- **`dev`**: Active integration branch for Person 1, Person 2, and Person 3.
- **Deployment**: Automatic build triggers set on `dev` (for staging) and `main` (for production).
