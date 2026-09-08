// Canonical Domain Types matching PRD.md and PROJECT_CONTEXT.md

export type Tab =
  | "landing"
  | "login"
  | "dashboard"
  | "competencies"
  | "skill-gaps"
  | "learning"
  | "assessments"
  | "assessment-result"
  | "assessment-review"
  | "materials"
  | "employees"
  | "integrations"
  | "analytics"
  | "audit"
  | "settings";

export type UserRole =
  | "LEARNER"
  | "TRAINING_COORDINATOR"
  | "DEPARTMENT_ADMIN"
  | "SYSTEM_ADMIN"
  | "ASSESSMENT_REVIEWER";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  grade: string;
  cadre: string;
}

export interface Competency {
  id: string;
  name: string;
  category: "Core" | "Advanced" | "Foundational";
  level: number;
  required: number;
  desc: string;
  evidenceSource?: string;
}

export interface SkillGap {
  id: string;
  name: string;
  current: number;
  required: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  impact: string;
  recommendedCourseId: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  source: "iGOT" | "DEMO / LOCAL";
  competency: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  enrolled?: boolean;
  progress?: number;
  reason: string;
  externalUrl?: string;
}

export interface QuestionOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  qIndex: number;
  competency: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  module: string;
  marks: number;
  question: string;
  options: QuestionOption[];
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
  sourceDocument: string;
  sourcePage: number;
  sourceSection: string;
  verifiedPassage: string;
  groundingConfidence: number;
}

export interface AssessmentSubmission {
  competency: string;
  difficulty: string;
  score: number;
  total: number;
  percentage: number;
  previousLevel: number;
  newLevel: number;
  masteryTier: "Needs Foundation" | "Developing" | "Proficient" | "Strong Mastery";
  sourceDocument: string;
  sourcePage: number;
  nextRecommendedCourse: string;
}

export interface TrainingMaterial {
  id: string;
  title: string;
  type: "PDF" | "PPTX" | "Video" | "Document";
  size: string;
  pages: number | null;
  tag: "Core Reading" | "Supplementary" | "Assessment Prep";
  uploaded: string;
  status: "Ready" | "Processing" | "Failed";
  sha256: string;
}

export interface AuditEvent {
  id: string;
  ts: string;
  action:
    | "LOGIN"
    | "DOCUMENT_UPLOADED"
    | "MASTERY_UPDATED"
    | "ASSESSMENT_SUBMITTED"
    | "ROLE_ASSIGNED"
    | "CATALOGUE_SYNCED"
    | "ADMIN_ACTION";
  user: string;
  ip: string;
  session: string;
}

export interface EmployeeDirectoryItem {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  cadre: string;
  overallScore: number;
  activeGaps: number;
  topCompetency: string;
  lastActive: string;
}
