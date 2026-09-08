# Backdata — StatKarmayogi AI Core Backend Service

This repository contains the authoritative backend data layer, auth/authorization mechanisms, deterministic engines, storage validation pipeline, audit logger, and REST API surface (`/api/v1`) for **StatKarmayogi AI**.

## Architecture & Modules

```text
Backdata/
├── app/
│   ├── main.py             # FastAPI entrypoint & middleware setup
│   ├── config.py           # Application environment settings
│   ├── core/
│   │   ├── security.py     # JWT decoding, password hashing, SHA256 utilities
│   │   ├── dependencies.py # Authentication & RBAC authorization dependencies
│   │   └── exceptions.py   # Custom API error handlers
│   ├── db/
│   │   ├── base.py         # SQLAlchemy Base
│   │   ├── session.py      # Async DB session engine
│   │   └── models/         # User, Employee, Competency, Course, Assessment, Audit models
│   ├── schemas/            # Pydantic validation models for request/response bodies
│   │   ├── auth.py, employee.py, competency.py, course.py, document.py, assessment.py, etc.
│   ├── services/           # Deterministic business logic
│   │   ├── competency_engine.py    # Gap = Required - Current
│   │   ├── assessment_service.py   # Quiz scoring & Mastery levels
│   │   ├── storage_service.py      # Untrusted upload security pipeline
│   │   ├── recommendation_service.py # Deterministic recommendation engine
│   │   └── audit_service.py        # Append-only audit trail
│   └── api/v1/             # REST controllers (/api/v1/*)
└── tests/                  # Pytest automated test suite
```

## Running Tests

To run the automated security, authorization, and deterministic engine tests:
```bash
pytest
```
