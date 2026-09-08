# StatKarmayogi AI — PROJECT_CONTEXT.md

## Security Authority
All security requirements are defined by `SECURITY.md`. When security behavior conflicts with another document, follow `SECURITY.md`.

## Identity
```text
Product: StatKarmayogi AI
Tagline: Competency Intelligence for India's Official Statistical System
Category: AI-enabled competency intelligence and assessment
Target ecosystem: MoSPI / NSSTA / iGOT Karmayogi
Problem Statement: SIH 2026 — 26101
```

## Core Thesis
```text
ROLE REQUIREMENTS
      ↓
COMPETENCY PROFILE
      ↓
SKILL GAP
      ↓
LEARNING
      ↓
TRAINING
      ↓
RAG ASSESSMENT
      ↓
MASTERY
      ↓
COMPETENCY UPDATE
      ↓
NEXT LEARNING
```

The product is a competency intelligence and assessment layer, not an independent LMS.

## Trust Architecture
```text
                 TRUST
                   │
       ┌───────────┴───────────┐
       │                       │
 OFFICIAL DATA             SECURITY
       │                       │
       ▼                       ▼
COMPETENCY FACTS          AUTHORIZATION
       │                       │
       └───────────┬───────────┘
                   ▼
               RETRIEVAL
                   │
                   ▼
             AI GENERATION
                   │
                   ▼
            HUMAN/ADMIN REVIEW
                   │
                   ▼
             USER EXPERIENCE
```

Official competency frameworks, authorized employee records, verified assessment results and approved course metadata are authoritative. RAG grounds generated content. The LLM generates/interprets.

## Architecture
```text
React + TypeScript
        ↓
FastAPI / Python
        ↓
PostgreSQL
   ├── competency data
   ├── employee data
   ├── assessment history
   └── audit
        ↓
RAG Engine
   ├── PyMuPDF
   ├── SBERT
   └── ChromaDB
        ↓
AI Provider
        ↓
Assessment / Feedback

FastAPI
   └── iGOT Adapter
          ├── Mock Provider
          └── Future Authorized iGOT Provider
```

## Canonical Data
Core entities:
```text
User
Employee
Department
Role
Competency
RoleCompetency
EmployeeCompetency
CompetencyHistory
SkillGap
Course
CourseCompetency
TrainingHistory
TrainingDocument
DocumentChunk
Assessment
Question
AssessmentAttempt
Answer
MasteryRecord
Recommendation
IntegrationSync
AuditEvent
Job
Notification
```

## Search
PostgreSQL:
- employee search
- course metadata
- competency search
- department filters

ChromaDB:
- semantic training-document retrieval
- semantic competency matching

Do not introduce Milvus/OpenSearch before scale requires it.

## Processing
```text
Upload
 ↓
Validate
 ↓
SHA-256
 ↓
Private Storage
 ↓
DB Metadata
 ↓
Processing Job
 ↓
Extract
 ↓
Chunk
 ↓
Embed
 ↓
Index
 ↓
Ready
```

## Competency Logic
```text
Gap = Required Level - Current Level
```

The competency engine is deterministic. Semantic matching may use SBERT to map differently worded competency descriptions.

## Recommendation Logic
Recommendation score may combine:
- competency gap
- course relevance
- difficulty
- learner level
- training history
- availability
- semantic similarity

Every recommendation must provide an understandable reason. A recommendation score is not a guaranteed prediction.

## Assessment Evidence
RAG metadata should preserve:
```text
document_id
page_start
page_end
section
chunk_text
```

The UI should show source title, page and section where available.

## Demo Data
Use synthetic data for the hackathon:
```text
Roles:
- Statistical Officer
- Data Analyst
- Statistical Investigator
- Training Coordinator

Competencies:
- Statistics
- Survey Methodology
- Python
- Machine Learning
- GIS
- Data Visualization
- Data Quality
- Digital Governance
```

Use only public/approved training PDFs for RAG demonstration.

## Non-Goals
- Replacing iGOT
- Unapproved private iGOT access
- Government SSO without official documentation
- Autonomous changes to official competency records
- Automated employment/promotion decisions
- National-scale infrastructure during the hackathon
