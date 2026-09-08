# StatKarmayogi AI — Official Statistical System Competency Intelligence

**StatKarmayogi AI** is an AI-enabled competency intelligence and assessment platform for India's Official Statistical System (MoSPI / NSSTA), designed to work with **iGOT Karmayogi**.

> Problem Statement: SIH 2026 — 26101

---

## System Architecture

```text
React / TypeScript Frontend (Person 3)
         ↓
FastAPI Backend Services — Backdata/ (Person 1)
   ├── PostgreSQL (Competencies, Employees, Assessments, Audit)
   ├── Private Storage (Training PDFs & Metadata)
   ├── Auth & RBAC Authorization Layer
   └── Deterministic Competency & Mastery Scoring Engine
         ↓
RAG & AI Engine / iGOT Adapter (Person 2)
```

---

## Directory Structure

- `Backdata/`: Core FastAPI Backend application, database models, security handlers, deterministic competency engine, and `/api/v1` REST API surface.
- `docs/`: Master Engineering Blueprint, PRD, Security specifications, and architecture specifications.

---

## Quick Start (Backend / Backdata)

1. Navigate to the backend directory:
   ```bash
   cd Backdata
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment configuration:
   ```bash
   cp .env.example .env
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
6. Access API documentation at `http://localhost:8000/docs`.

---

## Security Invariants

All services in `Backdata/` enforce the security requirements in `docs/SECURITY.md`:
- Supabase Auth JWT token verification.
- Department and Tenant access control enforced strictly server-side.
- Private document upload pipeline (Extension + MIME + `%PDF-` magic-bytes + SHA-256 validation).
- Fail-closed security authorization.
- Append-only audit logging for state-changing operations.
