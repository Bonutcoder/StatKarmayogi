# StatKarmayogi AI — PERSON 1

## Mandatory Security Read
Read `SECURITY.md` in full before implementing backend, database, authentication, authorization, storage or core data work.

## Role
**Person 1 — Core Backend, Security & Data Owner**

You own the authoritative application data layer.

## Mission
Build:
```text
Auth
 ↓
Authorization
 ↓
Employees
 ↓
Roles / Competencies
 ↓
Skill Gaps
 ↓
Training / Courses
 ↓
Assessments
 ↓
Mastery History
 ↓
Audit
 ↓
API
```

The system must work even when AI and iGOT are unavailable.

## Authentication
Use the approved authentication architecture. For the current blueprint, Supabase Auth is the preferred authentication boundary.

Implement:
- sign up where enabled
- sign in
- sign out
- session handling
- authenticated identity
- protected API behavior

Do not implement a competing password/authentication system if Supabase Auth is being used.

## Authorization
Authorization is P0.

Flow:
```text
Request
 ↓
Authenticate
 ↓
Identify user
 ↓
Identify department/role scope
 ↓
Authorize
 ↓
Resource access check
 ↓
Business logic
```

Protect:
- employee profiles
- competency records
- training history
- assessments
- recommendations
- uploaded documents
- analytics
- audit records
- admin operations

A user ID is not an authorization credential.

## Employee / Competency Data
Implement canonical entities:
```text
Employee
Role
Competency
RoleCompetency
EmployeeCompetency
CompetencyHistory
SkillGap
```

The deterministic rule is:
```text
Gap = Required Level - Current Level
```

Preserve history rather than silently replacing prior competency evidence.

## Course / Training Data
Support:
```text
Course
CourseCompetency
TrainingHistory
TrainingDocument
DocumentChunk
```

Keep iGOT/local/demo source labels separate.

## Assessment Data
Preserve:
```text
Assessment
Question
AssessmentAttempt
Answer
MasteryRecord
```

Every attempt is historical evidence.

## Storage
Training PDFs must be private.

Store structured metadata in PostgreSQL and document files in private object storage. ChromaDB stores retrieval-oriented vectors/metadata and is not the transactional source of truth.

## API Ownership
Own the backend contracts for:
```text
/auth
/employees
/roles
/competencies
/courses
/recommendations
/documents
/assessments
/analytics
/audit
/jobs
```

Use `/api/v1`.

Business logic belongs in services/domain modules, not route handlers.

## Audit
Record important state changes:
```text
LOGIN
EMPLOYEE_UPDATED
COMPETENCY_UPDATED
COURSE_SYNCED
DOCUMENT_UPLOADED
ASSESSMENT_SUBMITTED
MASTERY_UPDATED
RECOMMENDATION_GENERATED
ADMIN_ACTION
```

Do not fabricate actors. Use authenticated identity.

## Tests
P0 tests:
- cross-department access denied
- unauthorized employee access denied
- learner cannot perform admin mutation
- assessment history preserved
- competency history preserved
- invalid upload rejected
- private document cannot be accessed without authorization
- AI outage does not break deterministic flows
