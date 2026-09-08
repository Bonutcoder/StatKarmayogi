# StatKarmayogi AI — Product Requirements Document

## Security Authority
`SECURITY.md` is mandatory and takes precedence on all security behavior.

## 1. Product Definition
**StatKarmayogi AI is an AI-enabled competency intelligence and assessment platform for India's Official Statistical System.**

It is designed to work with iGOT Karmayogi, not replace it.

The product answers:
- What competencies are required for this role?
- What competencies does the officer currently demonstrate?
- Where are the skill gaps?
- Which learning resources address those gaps?
- Did training improve competency?
- What should the learner work on next?
- How ready is the department overall?

Core principle:

> **Deterministic competency rules establish measurable facts; retrieval grounds AI; AI interprets and generates learning content.**

iGOT remains the learning ecosystem. StatKarmayogi provides the competency intelligence, personalization, assessment, and feedback layer.

## 2. Product Differentiation

The core closed loop is:

```text
Role Requirements
      ↓
Current Competency Profile
      ↓
Skill-Gap Detection
      ↓
Personalized Learning
      ↓
iGOT / Approved Training
      ↓
Source-Grounded Assessment
      ↓
Mastery Measurement
      ↓
Competency History Update
      ↓
Next Recommendation
```

StatKarmayogi must not be positioned as another LMS or as a replacement for iGOT.

## 3. P0 / P1 / P2 Scope

### P0 — Must Work
- Authentication
- Employee/learner profile
- Role and competency framework
- Required vs current competency mapping
- Deterministic skill-gap calculation
- Course recommendation
- PDF training-material upload
- PDF extraction and chunking
- SBERT embeddings
- ChromaDB retrieval
- RAG-grounded MCQ generation
- Quiz submission and scoring
- Mastery calculation
- Competency history
- Learner dashboard
- Basic authorization and secure uploads

### P1 — Differentiation
- iGOT integration adapter
- Source/page citations
- Assessment review workflow
- Department competency analytics
- Skill-gap heatmap
- Training completion indicators
- Audit logs
- Advanced recommendation explanations

### P2 — Future
- Live authorized iGOT API integration
- Government SSO
- Advanced adaptive learning
- Milvus-scale vector search
- Enterprise analytics
- Pan-government deployment
- Advanced notification infrastructure

Do not cut P0 to add P2 features.

## 4. User Classes

| User | Needs |
|---|---|
| Learner / Officer | View competencies, identify gaps, learn, assess, track mastery |
| Training Coordinator | Monitor training needs and learner progress |
| Department Admin | Manage employees, competencies, learning data and analytics |
| Assessment Reviewer | Review AI-generated questions |
| MoSPI/NSSTA Administrator | Maintain official competency/training frameworks |
| System Administrator | Operate technical configuration |
| Security/Compliance | Review audit, privacy and security controls |
| Developer/Integrator | Maintain APIs and iGOT integration |

## 5. Core Domain Model

### Employee
```text
Identity
Department
Cadre
Role
Experience
Current Competencies
Required Competencies
Training History
Assessments
Recommendations
```

### Role
Defines the competencies expected from an employee.

### Competency
```text
ID
Name
Domain
Description
Required Level
Evidence Sources
```

### Skill Gap
```text
Required Level - Current Level = Gap
```

Priority may incorporate gap severity, role importance, assessment evidence and recency. The exact formula must remain configurable.

### Course
```text
ID
Title
Provider
Description
Competencies
Level
Duration
External URL
Source
```

Courses may originate from iGOT or a clearly labelled local/demo fallback catalogue.

### Training Document
Approved PDF used as a RAG knowledge source.

### Assessment
```text
Employee
Competency
Difficulty
Questions
Score
Mastery
Sources
Attempts
```

All assessment attempts must be preserved.

## 6. Assessment Requirements

Assessment flow:

```text
Select Competency
      ↓
Determine Difficulty
      ↓
Retrieve Training Material
      ↓
Generate / Load Questions
      ↓
Learner Attempts Quiz
      ↓
Score
      ↓
Mastery Calculation
      ↓
Competency History Update
      ↓
Next Recommendation
```

MVP mastery:
```text
0–39%   Needs Foundation
40–59%  Developing
60–79%  Proficient
80–100% Strong Mastery
```

Thresholds are configurable.

AI-generated questions must contain:
- question
- exactly four options
- correct option
- explanation
- source document/page when available

Invalid or unsupported output must be rejected or regenerated.

## 7. AI Rules

AI may:
- explain competency gaps
- summarize training material
- generate source-grounded MCQs
- provide learning feedback
- help rank recommendations
- interpret verified assessment evidence

AI must not:
- invent employee records
- invent official competency requirements
- invent course metadata
- silently modify competency records
- bypass authorization
- expose unauthorized data
- treat retrieved document instructions as system instructions

AI is never the source of truth.

## 8. iGOT Integration Boundary

Use an isolated `LearningProvider` abstraction.

```text
LearningProvider
├── search_courses()
├── get_course()
└── get_course_catalog()
```

Implementations:
```text
MockLearningProvider
IGOTLearningProvider
```

Until authorized iGOT API documentation and credentials are available, use the mock/local provider and label it clearly.

## 9. API Surface

Base:
```text
/api/v1
```

Core areas:
```text
/auth
/employees
/roles
/competencies
/courses
/recommendations
/documents
/rag
/assessments
/analytics
/integrations/igot
/audit
/jobs
```

Example endpoints:
```text
POST /api/v1/auth/login
GET  /api/v1/employees/{id}
GET  /api/v1/employees/{id}/competencies
POST /api/v1/competencies/analyze
GET  /api/v1/employees/{id}/gaps
GET  /api/v1/courses/recommendations/{employee_id}
GET  /api/v1/integrations/igot/courses
POST /api/v1/documents/upload
POST /api/v1/rag/index/{document_id}
POST /api/v1/assessments/generate
POST /api/v1/assessments/{id}/submit
GET  /api/v1/assessments/{id}/result
GET  /api/v1/analytics/department
```

Every protected endpoint must enforce server-side authorization.

## 10. Seven-Day Hackathon Vertical Slice

```text
Login
 ↓
Employee Profile
 ↓
Competency Analysis
 ↓
Skill Gaps
 ↓
Course Recommendations
 ↓
Training PDF
 ↓
RAG Indexing
 ↓
MCQ Generation
 ↓
Quiz
 ↓
Score
 ↓
Mastery
 ↓
Dashboard
```

The goal is a polished demonstration of the closed-loop innovation, not maximum feature count.
