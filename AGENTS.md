# StatKarmayogi AI — AGENTS.md

## Mandatory Security Document
`SECURITY.md` is mandatory for every agent and takes precedence on security behavior.

## Prime Directive
```text
READ → SEARCH → VERIFY → PLAN → IMPLEMENT → TEST → INSPECT → REPORT
```

Never guess when project documentation, contracts or repository facts can answer the question.

If an unknown materially affects architecture, security, credentials, deployment, data or an API contract:
```text
STOP → ASK / ESCALATE
```

## Authority Order
```text
1. Tech Lead explicit decision
2. SECURITY.md
3. Approved product/architecture specification
4. Current database/API/type contracts
5. Component/identifier registry
6. Existing implementation
7. Agent assumption
```

## Before Touching Code
For substantial work, record:
```text
GOAL
SCOPE
FILES LIKELY AFFECTED
DEPENDENCIES
CONTRACTS AFFECTED
RISKS
```

Before creating a route, component, type, model or event:
1. Search for an existing canonical identifier.
2. Reuse it where applicable.
3. If genuinely new, document it in the relevant contract/registry.

## Security Boundary
The frontend is never the authorization layer.

Correct:
```text
request
 ↓
authenticate
 ↓
identify user/department scope
 ↓
authorize
 ↓
query authorized data
 ↓
return response
```

Incorrect:
```text
fetch all employees
 ↓
filter in React
```

This applies to employees, competency records, assessments, training documents, analytics and audit data.

## AI Boundary
AI receives only authorized context.

AI must not:
- invent employee facts
- invent competency requirements
- invent course metadata
- bypass authorization
- modify authoritative competency history directly
- silently approve its own output
- expose secrets or unrelated tenant data

## Deterministic Before AI
The following must be deterministic:
- competency requirement calculation
- skill-gap calculation
- assessment scoring
- mastery thresholds
- employee/course metadata
- source metadata

AI can interpret or generate content after evidence is established.

## Data Invariants
- Competency history is append-only.
- Assessment attempts are never silently overwritten.
- Official competency requirements require authorized administrative changes.
- Vector storage is not the source of truth.
- Training-document source metadata must be preserved.

## Upload Security
Treat every uploaded PDF as untrusted:
```text
auth
→ size
→ extension/MIME
→ magic bytes
→ security scan
→ SHA-256
→ private storage
→ metadata
→ processing
```

Never execute uploads.

## Failure Behavior
AI or iGOT outages must not break:
```text
login
competency records
gap calculation
assessment history
core dashboards
audit
```

Show explicit degraded states instead of fake results.

## Testing
Every substantial feature should include:
- happy path
- unauthorized access
- malformed input
- empty state
- provider failure
- retry/idempotency where applicable
- regression coverage
