# StatKarmayogi AI — UI_UX.md

## Security Boundary
Follow `SECURITY.md`. UI controls are not authorization.

## Design Direction
**Government-grade · analytical · calm · modern · trustworthy**

The product should feel like a competency intelligence instrument, not a generic AI chatbot or LMS clone.

Use visual language built around:
```text
COMPETENCY
READINESS
GAPS
LEARNING
EVIDENCE
MASTERY
```

Avoid:
- generic purple AI dashboard
- excessive gradients
- card-everything layouts
- chatbot-first UI
- noisy status banners
- confusing analytics without context

## Global Shell
```text
┌───────────────────────────────────────────────────────────────┐
│ StatKarmayogi AI     Search...      Notifications     Profile │
├──────────────┬────────────────────────────────────────────────┤
│ Dashboard    │                                                │
│ Competencies │              MAIN CONTENT                      │
│ Skill Gaps   │                                                │
│ Learning     │                                                │
│ Assessments  │                                                │
│ Materials    │                                                │
│              │                                                │
│ ADMIN        │                                                │
│ Analytics    │                                                │
│ Audit        │                                                │
│ Settings     │                                                │
└──────────────┴────────────────────────────────────────────────┘
```

Only resources returned within the user's authorized scope may appear.

## Learner Dashboard
Primary areas:
```text
Competency Readiness
Priority Skill Gaps
Recommended Learning
Assessment Progress
Mastery Trend
```

Example:
```text
Competency Readiness
Statistics       █████████ 92%
Python           ████████  81%
ML               ████      42%
GIS              ███       31%
```

## Skill Gap Inspector
```text
GIS

Current Level     2
Required Level    4
Gap               2 levels
Priority          HIGH

Why this matters
Required for the selected role.

Recommended
[Course]
[Start Assessment]
```

## Course Recommendation
Show the reason:
```text
Why recommended?
Matches your high-priority Machine Learning gap
and is appropriate for your current level.
```

## Assessment
Keep the quiz focused.

Show:
```text
Competency
Difficulty
Question 3 of 10
Progress
Question
A
B
C
D
```

Do not hide important source evidence.

## Assessment Result
```text
86%
Strong Mastery

Competency
Survey Methodology

Improved from
62% → 86%

Evidence
Training PDF · Page 18

Next step
Recommended course...
```

## RAG Evidence
Use a distinct evidence treatment:
```text
SOURCE EVIDENCE
Training Material: Survey Methodology Handbook
Page: 18
Section: Sampling Design
```

AI interpretation should be visually distinct:
```text
AI INTERPRETATION
This result suggests...
```

## Admin Analytics
Useful visualizations:
- department competency heatmap
- competency distribution
- skill-gap counts
- mastery trends
- training completion
- recommendation statistics

Avoid exposing individual records to users without authorization.

## Integration Status
Make source clear:
```text
iGOT — Connected
iGOT — Unavailable
DEMO CATALOGUE — Active
```

Never imply live iGOT access when using the mock provider.

## PDF Processing
Show:
```text
Uploading
Extracting
Chunking
Embedding
Indexing
Ready
```

On failure:
```text
Training document processing failed.
No assessment content was generated from this file.

[Retry]
```

## Required UI States
Loading, empty, success, error, partial failure, processing, retry, permission denied, integration unavailable, AI unavailable, confirmation and destructive action.

## Design System Components
```text
Button
Input
Select
Dialog
Toast
Tabs
Breadcrumb
Badge
Table
Progress
CompetencyCard
GapCard
CourseCard
QuizCard
QuizProgress
SourceCitation
PDFUploader
Heatmap
TrendChart
EmployeeSelector
RoleSelector
IntegrationStatus
```

## Accessibility
Target WCAG 2.2 AA:
- keyboard navigation
- visible focus
- semantic HTML
- screen-reader labels
- contrast
- no color-only indicators
- accessible forms/errors
- reduced motion
