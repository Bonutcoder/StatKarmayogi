# StatKarmayogi AI — TECH_LEAD_SERVICES.md

## Security Authority
Use `SECURITY.md` as the mandatory security source of truth.

> **Tech Lead provisions access. Engineering implements the product.**

This document covers external services, credentials, environment variables and deployment handoff.

## 1. Service Map
Preferred hackathon architecture:
```text
Supabase
 ├── Auth
 ├── PostgreSQL
 └── private Storage

ChromaDB
 └── prototype vector retrieval

OpenRouter
 └── AI gateway

Redis
 └── optional processing queue

Vercel / approved hosting
 └── frontend deployment

GitHub
 └── source control
```

Do not add providers without team/Tech Lead approval.

## 2. Environment Template
```env
# APP
APP_ENV=development
APP_BASE_URL=

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# SERVER ONLY
SUPABASE_SERVICE_ROLE_KEY=

# AI
OPENROUTER_API_KEY=
OPENROUTER_MODEL=

# OPTIONAL QUEUE
REDIS_URL=

# OPTIONAL OAUTH
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Never add `NEXT_PUBLIC_` to server-only secrets.

## 3. Tech Lead Provides
Required:
```text
GitHub repository/access
Supabase project
Supabase URL
Supabase anon key
Supabase service-role key
OpenRouter API key
OpenRouter model identifier
Deployment project/access
```

If Redis is used:
```text
Redis connection URL
```

If OAuth is enabled:
```text
client ID
client secret
approved redirect URI
```

## 4. Supabase
Tech Lead handles:
- project creation
- region
- application keys
- authentication settings
- production storage/security configuration

Engineering handles:
- schema
- migrations
- queries
- RLS policies
- storage adapter
- API integration
- tests

Documents must remain private.

## 5. OpenRouter
Provide:
```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

AI calls must be server-side.

The model remains configurable.

The deterministic competency engine and assessment scoring must continue without OpenRouter.

## 6. iGOT
No production credential should be fabricated.

Until official access is available:
```text
MockLearningProvider
```

When authorized:
```text
IGOTLearningProvider
```

The adapter boundary should prevent iGOT API changes from rewriting the application.

## 7. Redis
Optional for background processing.

Possible queue:
```text
training-document-processing
```

Engineering owns queue implementation.

## 8. Deployment
Production/staging secrets belong in the deployment platform's environment configuration.

Verify:
```text
APP_BASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENROUTER_API_KEY
OPENROUTER_MODEL
REDIS_URL if used
OAuth values if enabled
```

## 9. GitHub
Team handles:
- repository
- access
- branch protection
- repository secrets
- merge/release approval

Ignore:
```text
.env
.env.local
.env.*.local
```

Never commit credentials.

## 10. Demo Environment
Use synthetic employee records and approved/public training PDFs.

Demo must clearly label:
```text
DEMO DATA
LOCAL / MOCK iGOT CATALOGUE
```

Do not imply production government integration.
