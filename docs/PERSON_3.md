# StatKarmayogi AI — PERSON 3

## Mandatory Security Read
Read `SECURITY.md` before implementing frontend work. UI controls are not authorization.

## Role
**Person 3 — Frontend, UX & Product Experience Owner**

## Mission
Make the core product instantly understandable:

```text
ROLE
 ↓
COMPETENCY READINESS
 ↓
SKILL GAPS
 ↓
LEARNING
 ↓
ASSESSMENT
 ↓
MASTERY
```

The UI should make verified competency facts more authoritative than AI interpretation.

## Pages
```text
LandingPage
LoginPage
RegisterPage
DashboardPage
CompetenciesPage
SkillGapsPage
LearningPage
AssessmentsPage
AssessmentResultPage
TrainingMaterialsPage
EmployeePage
AdminDashboardPage
EmployeesAdminPage
CompetencyFrameworkPage
CourseIntegrationPage
AssessmentReviewPage
AnalyticsPage
AuditPage
SettingsPage
NotFoundPage
```

## Core Components
```text
AppShell
TopBar
Sidebar
CompetencyCard
SkillBar
GapCard
CourseCard
QuizCard
QuizProgress
AssessmentResult
MasteryBadge
RecommendationReason
SourceCitation
PDFUploader
ProcessingStatus
Heatmap
TrendChart
EmployeeSelector
RoleSelector
IntegrationStatus
AIStatus
ErrorState
EmptyState
LoadingState
Toast
```

## Dashboard
Show only authorized data.

Learner dashboard:
```text
Competency Readiness
Priority Skill Gaps
Recommended Learning
Assessment Progress
Recent Mastery Changes
```

Example:
```text
Statistics        92%
Python            81%
Machine Learning  42%
GIS               31%
```

## Skill Gap Experience
For each gap show:
```text
Competency
Current Level
Required Level
Gap
Priority
Why it matters
Recommended learning
```

The user should understand why the gap exists.

## Learning
Course cards should show:
- title
- provider
- competency match
- difficulty/level
- duration
- source label
- recommendation reason
- external course link where officially available

Clearly distinguish:
```text
iGOT
DEMO / LOCAL
```

## Assessment
The quiz UI should clearly show:
- competency
- difficulty
- question number
- answer options
- progress
- submit state

Results should show:
```text
Score
Mastery
Competency
Source Evidence
Next Recommendation
```

## RAG Source Citation
For generated questions, show:
```text
Source
Document title
Page
Section
```

Never present AI-generated content as official fact without its source/evidence context.

## AI States
```text
PROCESSING
AVAILABLE
UNAVAILABLE
FAILED
```

Failure:
```text
AI assessment generation is unavailable.

Your competency data and previous assessment history
remain available.

[Retry]
```

## Admin UX
Admin pages:
```text
Dashboard
Employees
Competency Framework
Course Integration
Training Documents
Assessment Review
Analytics
Audit
System Settings
```

Admin operations must be enforced by the backend; hiding a button is not authorization.

## Required UI States
Every major workflow defines:
- loading
- empty
- success
- error
- partial failure
- processing
- retry
- permission denied
- external integration unavailable
- AI unavailable
- confirmation
- destructive action

## Design System
Centralize:
- typography
- spacing
- colors
- light/dark theme
- icons
- borders/shadows
- buttons
- inputs/forms
- tables
- charts/heatmaps
- quiz components
- source citations

## Accessibility
Target WCAG 2.2 AA:
- keyboard navigation
- visible focus
- semantic HTML
- screen-reader labels
- sufficient contrast
- no color-only indicators
- accessible forms/errors
- reduced-motion support

## Responsive
Support desktop, tablet and mobile. Optimize the hackathon demo for desktop/laptop presentation.
