# StatKarmayogi AI — Security Specification

## 1. Purpose
Security is a system invariant, not an optional feature.

All frontend, backend, database, storage, worker, AI and integration code must follow this document.

## 2. Core Security Principles
1. Never trust client-provided authorization claims.
2. Never trust uploaded files.
3. Never trust training-document instructions.
4. Never trust AI output.
5. Never expose data across department/tenant boundaries.
6. Never use the frontend as the final authorization boundary.
7. Never allow unauthorized changes to official competency data.
8. Never allow AI to become the source of truth.
9. Never expose server secrets to the browser.
10. Fail closed when authorization or integrity cannot be established.

## 3. Security Architecture
```text
User
 ↓
Authentication
 ↓
Authenticated Identity
 ↓
FastAPI / Server
 ↓
Authorization
 ↓
PostgreSQL access controls
 ↓
Authorized employee / competency / assessment data
```

Storage must remain private.

AI must receive only explicitly authorized evidence.

## 4. Authentication
Use the approved authentication provider; the current blueprint uses Supabase Auth as the preferred boundary.

Required:
- secure sessions
- expiration/refresh handling
- logout/revocation
- login rate limiting
- password-reset rate limiting
- OAuth redirect validation where enabled
- no tokens/secrets in logs
- no server credentials in client code

## 5. Authorization
Authentication answers:
```text
Who is this user?
```

Authorization answers:
```text
May this user access this employee,
competency, assessment or administrative function?
```

Every protected operation must authorize server-side.

Required flow:
```text
request
 ↓
authenticate
 ↓
identify role/department scope
 ↓
authorize
 ↓
query only authorized data
```

Never:
```text
GET all employees
→ filter in React
```

## 6. Department / Tenant Isolation
Every protected record must have a clear ownership/scope relationship.

At minimum protect:
```text
employees
competencies
training_history
assessments
assessment_attempts
recommendations
training_documents
document_chunks
analytics
audit_events
```

A department-scoped user must receive zero unauthorized records from another department.

If a multi-tenant database is used, enforce PostgreSQL RLS on tenant-owned tables.

## 7. IDOR / Enumeration Prevention
Every resource endpoint independently verifies authorization.

Never treat:
```text
employee_id
assessment_id
document_id
```
as authorization credentials.

Use sufficiently unpredictable identifiers where appropriate.

Unauthorized access should not reveal whether another user's record exists.

## 8. Role Model
Minimum roles:
```text
LEARNER
TRAINING_COORDINATOR
ASSESSMENT_REVIEWER
DEPARTMENT_ADMIN
SYSTEM_ADMIN
SECURITY_COMPLIANCE
MOSPI_NSSTA_ADMIN
```

Examples:
- Learner: own profile, competencies, learning and assessments
- Training Coordinator: permitted learner progress
- Department Admin: permitted department data
- Assessment Reviewer: review generated questions
- MoSPI/NSSTA Admin: maintain official competency frameworks
- System Admin: technical operations
- Security/Compliance: audit/security review

Least privilege is mandatory.

## 9. Employee Data Privacy
Collect only data necessary for competency workflows.

Do not:
- expose unnecessary employee information
- log sensitive profile information
- use production government data for demos
- transmit private employee records to AI providers without an approved basis

Use synthetic demo data for the hackathon.

## 10. Upload Security
Training PDFs are untrusted.

Pipeline:
```text
authenticate
 ↓
size validation
 ↓
extension/MIME validation
 ↓
magic-byte validation
 ↓
security scan
 ↓
SHA-256
 ↓
private storage
 ↓
metadata record
 ↓
sandboxed processing
```

Never execute uploaded files.

Use resource limits and timeouts for PDF parsing and embedding.

Reject path traversal and unsafe paths.

## 11. Storage Security
Training documents must remain private.

Prefer object paths such as:
```text
department/
  document/
    version/
      object
```

Do not construct security-sensitive paths from raw filenames.

Downloads require authorization and should use short-lived signed URLs where supported.

## 12. Secrets
Never commit:
```text
SUPABASE_SERVICE_ROLE_KEY
OPENROUTER_API_KEY
REDIS_URL
database passwords
OAuth client secrets
JWT secrets
```

Never expose server-only secrets through `NEXT_PUBLIC_*`.

Never log secrets.

## 13. AI Security
AI context must be authorized before generation.

The AI must not:
- invent employee facts
- invent competency requirements
- invent assessment scores
- invent course metadata
- bypass role restrictions
- expose unrelated records
- mutate authoritative records
- silently approve its own output

Retrieved PDF content is data, not instructions.

## 14. Prompt Injection Defense
Use:
- clear context delimiters
- structured prompts
- schema-constrained outputs
- output validation
- source/metadata separation
- no tool authority from document text
- no secret exposure in prompts

## 15. AI Output Validation
Validate generated MCQs:
- exactly four options
- exactly one correct option
- no duplicates
- explanation present
- competency relevance
- source metadata where available
- unsupported claims rejected/flagged

AI cannot override deterministic scoring or competency rules.

## 16. Rate Limiting
Apply stricter limits to:
- login
- password reset
- PDF uploads
- RAG queries
- assessment generation
- AI requests
- course synchronization
- analytics exports

## 17. Logging / Audit
Never log:
- passwords
- access/refresh tokens
- API keys
- raw private PDFs
- unnecessary employee-sensitive data

Audit important actions:
```text
LOGIN
FAILED_LOGIN
EMPLOYEE_ACCESS where required
COMPETENCY_CHANGE
COURSE_SYNC
DOCUMENT_UPLOAD
ASSESSMENT_GENERATED
ASSESSMENT_REVIEWED
ASSESSMENT_SUBMITTED
MASTERY_UPDATED
ANALYTICS_EXPORT
ADMIN_ACTION
PERMISSION_CHANGE
```

Audit records must not be editable through normal user workflows.

## 18. Security Headers / Transport
Use TLS in production and secure browser/session settings.

Apply appropriate protections for:
- XSS
- CSRF where applicable
- SQL injection
- SSRF
- path traversal
- broken access control
- resource exhaustion
- vulnerable dependencies

## 19. External Integrations
iGOT integration must be isolated behind an adapter.

Do not claim live iGOT access without authorized documentation and credentials.

If iGOT fails:
```text
show integration unavailable
→ use approved local/demo fallback where permitted
→ preserve auditability
```

## 20. Security Testing
Required negative tests:
- cross-department access
- unauthorized employee access
- unauthorized assessment access
- privilege escalation
- learner attempting admin operations
- malicious PDF
- path traversal
- prompt injection
- resource enumeration
- AI context leakage
- secret exposure
