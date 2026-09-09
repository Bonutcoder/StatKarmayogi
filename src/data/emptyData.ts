import {
  AssessmentQuestion,
  AuditEvent,
  Competency,
  Course,
  EmployeeDirectoryItem,
  SkillGap,
  TrainingMaterial,
} from "../types";

export const competenciesData: Competency[] = [];
export const skillGapsData: SkillGap[] = [];
export const coursesCatalogue: Course[] = [];
export const assessmentQuestionsData: AssessmentQuestion[] = [];
export const materialsData: TrainingMaterial[] = [];
export const auditHistoryData: AuditEvent[] = [];
export const employeeDirectoryData: EmployeeDirectoryItem[] = [];
export const heatmapDepts: string[] = [];
export const heatmapSkills: string[] = [];
export const heatmapScores: Record<string, Record<string, number>> = {};
