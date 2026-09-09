import { markCourseCompleted } from "./domainService";
import { Question } from "../data/courseContentData";

export interface TierResult {
  passed: boolean;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface CourseAssessmentRecord {
  courseId: string;
  easy?: TierResult;
  medium?: TierResult;
  difficult?: TierResult;
  allTiersPassed: boolean;
}

export interface AssessmentAttemptLog {
  id: string;
  courseId: string;
  courseTitle: string;
  domainName: string;
  level: string;
  tier: "easy" | "medium" | "difficult";
  scorePercent: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  userAnswers: Record<number, number>;
  completedAt: string;
  questions: Question[];
}

const ASSESSMENT_STORAGE_KEY = "statkarmayogi.course_assessments";
const ATTEMPTS_LOG_STORAGE_KEY = "statkarmayogi.assessment_attempts_history";

export function loadCourseAssessments(): Record<string, CourseAssessmentRecord> {
  try {
    const saved = localStorage.getItem(ASSESSMENT_STORAGE_KEY) || sessionStorage.getItem(ASSESSMENT_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch { }
  return {};
}

export function saveCourseAssessments(records: Record<string, CourseAssessmentRecord>) {
  try {
    localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(records));
    sessionStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(records));
  } catch { }
}

export function loadAssessmentAttempts(): AssessmentAttemptLog[] {
  try {
    const saved = localStorage.getItem(ATTEMPTS_LOG_STORAGE_KEY) || sessionStorage.getItem(ATTEMPTS_LOG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch { }
  return [];
}

export function saveAssessmentAttemptLog(log: AssessmentAttemptLog) {
  try {
    const current = loadAssessmentAttempts();
    const updated = [log, ...current.filter((item) => item.id !== log.id)];
    localStorage.setItem(ATTEMPTS_LOG_STORAGE_KEY, JSON.stringify(updated));
    sessionStorage.setItem(ATTEMPTS_LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch { }
}

export function getCourseAssessmentRecord(courseId: string): CourseAssessmentRecord {
  const all = loadCourseAssessments();
  return (
    all[courseId] || {
      courseId,
      allTiersPassed: false,
    }
  );
}

export function recordAssessmentAttempt(
  courseId: string,
  tier: "easy" | "medium" | "difficult",
  scorePercent: number,
  totalQuestions: number,
  logDetails?: {
    courseTitle: string;
    domainName: string;
    level: string;
    correctCount: number;
    userAnswers: Record<number, number>;
    questions: Question[];
  }
): { record: CourseAssessmentRecord; newlyCompletedCourse: boolean; attemptId: string } {
  const all = loadCourseAssessments();
  const existing = all[courseId] || {
    courseId,
    allTiersPassed: false,
  };

  const isPassed = scorePercent >= 70;
  const completedAt = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const tierResult: TierResult = {
    passed: isPassed,
    score: scorePercent,
    totalQuestions,
    completedAt,
  };

  const updatedRecord: CourseAssessmentRecord = {
    ...existing,
    [tier]: tierResult,
    allTiersPassed: false,
  };

  const easyPassed = updatedRecord.easy?.passed ?? false;
  const mediumPassed = updatedRecord.medium?.passed ?? false;
  const difficultPassed = updatedRecord.difficult?.passed ?? false;

  const nowAllPassed = easyPassed && mediumPassed && difficultPassed;
  const newlyCompleted = nowAllPassed && !existing.allTiersPassed;

  updatedRecord.allTiersPassed = nowAllPassed;
  all[courseId] = updatedRecord;
  saveCourseAssessments(all);

  const attemptId = `ATT-${Math.floor(1000 + Math.random() * 9000)}`;

  if (logDetails) {
    saveAssessmentAttemptLog({
      id: attemptId,
      courseId,
      courseTitle: logDetails.courseTitle,
      domainName: logDetails.domainName,
      level: logDetails.level,
      tier,
      scorePercent,
      passed: isPassed,
      correctCount: logDetails.correctCount,
      totalQuestions,
      userAnswers: logDetails.userAnswers,
      completedAt,
      questions: logDetails.questions,
    });
  }

  // If all 3 tiers are now passed, automatically mark the course completed in Domain Enrollments!
  if (newlyCompleted) {
    markCourseCompleted(courseId);
  }

  return {
    record: updatedRecord,
    newlyCompletedCourse: newlyCompleted,
    attemptId,
  };
}
