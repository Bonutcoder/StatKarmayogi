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
Competency Intelligence & RAG AI Engine — backengine/ (Person 2)
   ├── SBERT Semantic Competency Matcher
   ├── Multi-Factor Course Recommendations
   ├── RAG Pipeline & Department-Isolated Vector Store
   ├── Prompt-Injection-Defended AI Provider (OpenRouter & Mock)
   └── Strict MCQ Contract & Deterministic Grading Engine
         ↓
iGOT Adapter (Person 2)
```

---

## Directory Structure

- `Backdata/`: Core FastAPI Backend application, database models, security handlers, deterministic competency engine, and `/api/v1` REST API surface (Person 1).
- `backengine/`: Competency Intelligence, RAG Document Pipeline, SBERT Semantic Matching, Assessment Generator & iGOT Adapter (Person 2).
- `docs/`: Master Engineering Blueprint, PRD, Security specifications, and architecture specifications.

---

## Quick Start

### 1. Backend Core (`Backdata/` — Person 1)
```bash
cd Backdata
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```
API Documentation: `http://localhost:8000/docs`

### 2. Intelligence & RAG Engine (`backengine/` — Person 2)
```bash
cd backengine
pip install -r requirements.txt
python main.py
```
Run Person 2 test suite:
```bash
python -m unittest discover -s tests -p "test_*.py" -v
```

---

## Security Invariants

All services enforce the mandatory requirements in `docs/SECURITY.md`:
- Supabase Auth JWT token verification.
- Department and Tenant access control enforced strictly server-side.
- Private document upload pipeline (Extension + MIME + `%PDF-` magic-bytes + SHA-256 validation).
- Prompt injection defense & XML-delimited untrusted RAG contexts.
- Strict MCQ contract validation with server-side answer masking.
- Fail-closed security authorization.
- Append-only audit logging for state-changing operations.
