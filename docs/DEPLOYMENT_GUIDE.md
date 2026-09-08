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
| `GITHUB_CLIENT_ID` | Optional | Server | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | Optional | **Server Only** | GitHub OAuth Client Secret |
| `OPENROUTER_API_KEY` | Optional | **Server Only** | OpenRouter AI Gateway key for RAG & MCQ generation |
| `OPENROUTER_MODEL` | Optional | Server | OpenRouter model ID (`google/gemini-2.0-flash-001`) |
| `STORAGE_LOCAL_ROOT` | Yes | Server | Directory path for private document uploads (`./private_storage`) |
| `MAX_UPLOAD_SIZE_MB` | Yes | Server | Max PDF upload size limit (Default: `25`) |

> [!CAUTION]
> **Secrets Protection Rule**
> Never add `NEXT_PUBLIC_` prefix to server-only secrets such as `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_CLIENT_SECRET`, or `OPENROUTER_API_KEY`.

---

## 2. Supabase OAuth Provider Configuration Guide

### GitHub OAuth Setup
1. Open [GitHub Developer Settings](https://github.com/settings/developers) -> **OAuth Apps -> New OAuth App**.
2. Application Name: `StatKarmayogi AI`
3. Homepage URL: `http://localhost:3000` (or production URL)
4. Authorization Callback URL:
   ```text
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
5. Click **Register Application**.
6. Generate a new **Client Secret**.
7. Copy **Client ID** and **Client Secret**.
8. In Supabase Dashboard -> **Authentication -> Providers -> GitHub**:
   - Toggle **Enable GitHub provider** -> ON.
   - Paste **Client ID** & **Client Secret** -> Click **Save**.

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
