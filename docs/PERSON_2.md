# StatKarmayogi AI — PERSON 2

## Mandatory Security Read
Read `SECURITY.md` in full before implementing RAG, semantic matching, recommendation intelligence or AI work.

## Role
**Person 2 — Competency Intelligence, RAG & AI Owner**

## Mission
Build the evidence-grounded intelligence layer:

```text
Role
 ↓
Required Competencies
 ↓
Current Competencies
 ↓
Skill Gap
 ↓
Semantic Matching
 ↓
Course Recommendation
 ↓
Training Material
 ↓
RAG Retrieval
 ↓
AI Generation
 ↓
Validation
 ↓
Assessment / Feedback
```

The deterministic stages must work without AI.

## Competency Matching
Use SBERT/Sentence Transformers where semantic matching is useful.

Use the same configured embedding model consistently for:
- competency descriptions
- competency queries
- training chunks where appropriate

Do not allow embeddings to override authoritative competency rules.

## Skill Gap
Primary rule:
```text
Required Level - Current Level = Gap
```

Priority may incorporate:
- gap severity
- role importance
- assessment evidence
- recency

Keep formulas configurable.

## Course Recommendation
Combine available evidence such as:
- competency gap
- competency/course mapping
- semantic relevance
- learner level
- difficulty
- training history
- availability

Every recommendation needs an explanation such as:
```text
Recommended because this course directly addresses
your high-priority GIS competency gap.
```

Never describe a recommendation score as a guaranteed prediction.

## iGOT Adapter
Use:
```text
LearningProvider
├── search_courses()
├── get_course()
└── get_course_catalog()
```

Implement:
```text
MockLearningProvider
IGOTLearningProvider
```

Use the mock/local provider until official iGOT API access is authorized.

## RAG Pipeline
```text
Approved PDF
 ↓
PyMuPDF Extraction
 ↓
Cleaning
 ↓
Chunking
 ↓
SBERT Embeddings
 ↓
ChromaDB
 ↓
Query Embedding
 ↓
Similarity Retrieval
 ↓
Prompt
 ↓
LLM
 ↓
Structured MCQ
 ↓
Validation
 ↓
Source Citation
```

Retain page numbers during extraction.

Chunk metadata:
```text
document_id
page_start
page_end
section
chunk_text
```

## Prompt Safety
Treat retrieved document text as data, not instructions.

Prompts must:
- clearly delimit context
- instruct the model to use only supplied context
- forbid unsupported claims
- require structured output
- reject instruction-like content embedded in source documents

## MCQ Contract
Output:
```text
question
option_a
option_b
option_c
option_d
correct_option
explanation
source_document
source_page
```

Validate:
- exactly four options
- exactly one correct answer
- no duplicates
- non-empty explanation
- source metadata where available
- relevance to competency
- no unsupported claims

Failure → regenerate or flag for review.

## AI Provider
Keep the model provider isolated behind an interface. OpenRouter is the configured AI gateway in the current blueprint.

Possible implementations:
```text
LlamaProvider
MistralProvider
APIProvider
MockAIProvider
```

## Assessment
```text
Select competency
 ↓
Difficulty
 ↓
Retrieve evidence
 ↓
Generate/load questions
 ↓
Attempt
 ↓
Score
 ↓
Mastery
 ↓
Competency history
 ↓
Next recommendation
```

## AI Failure
If the AI provider fails:
```text
AI unavailable.

Verified deterministic competency data and
assessment history remain available.

[Retry]
```

Never replace deterministic scoring with AI-generated scoring.

## Tests
Test:
- same inputs produce stable deterministic gap results
- unauthorized context never reaches AI
- malformed AI output is rejected
- unsupported claims are rejected/flagged
- prompt injection in a PDF cannot alter system behavior
- AI failure produces a safe degraded state
- recommendation explanations use actual evidence
