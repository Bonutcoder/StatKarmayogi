import { DomainCourse, DomainEnrollment, DOMAIN_COURSES, LEARNING_DOMAINS, getCoursesByDomain } from "../data/domainData";
import { Competency, SkillGap } from "../types";

const ENROLLMENTS_STORAGE_KEY = "statkarmayogi.domain_enrollments";
const ENROLLMENTS_STORAGE_VERSION_KEY = "statkarmayogi.domain_enrollments_version";
const ENROLLMENTS_STORAGE_VERSION = "2";

/** Removes the legacy default enrollment that was previously written as demo data. */
export function removeLegacyDemoDomainEnrollments(): boolean {
  try {
    if (localStorage.getItem(ENROLLMENTS_STORAGE_VERSION_KEY) === ENROLLMENTS_STORAGE_VERSION) {
      return false;
    }
    localStorage.removeItem(ENROLLMENTS_STORAGE_KEY);
    sessionStorage.removeItem(ENROLLMENTS_STORAGE_KEY);
    localStorage.setItem(ENROLLMENTS_STORAGE_VERSION_KEY, ENROLLMENTS_STORAGE_VERSION);
    return true;
  } catch {
    return false;
  }
}

export function loadDomainEnrollments(): DomainEnrollment[] {
  removeLegacyDemoDomainEnrollments();
  try {
    const saved = localStorage.getItem(ENROLLMENTS_STORAGE_KEY) || sessionStorage.getItem(ENROLLMENTS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}

  return [];
}

export function saveDomainEnrollments(enrollments: DomainEnrollment[]) {
  try {
    localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(enrollments));
    sessionStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(enrollments));
  } catch {}
}

export function saveDomainEnrollment(domainId: string, completedCourseIds: string[]): DomainEnrollment[] {
  const current = loadDomainEnrollments();
  const domain = LEARNING_DOMAINS.find((d) => d.id === domainId);
  if (!domain) return current;

  const domainCourses = getCoursesByDomain(domainId);
  const targetCourseIds = domainCourses
    .map((c) => c.id)
    .filter((id) => !completedCourseIds.includes(id));

  const existingIndex = current.findIndex((e) => e.domainId === domainId);
  const newEnrollment: DomainEnrollment = {
    domainId: domain.id,
    domainName: domain.name,
    icon: domain.icon,
    category: domain.category,
    selectedCourseIds: completedCourseIds,
    targetCourseIds,
    enrolledAt: "Active",
  };

  let updated: DomainEnrollment[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = newEnrollment;
  } else {
    updated = [...current, newEnrollment];
  }

  saveDomainEnrollments(updated);
  return updated;
}

export function markCourseCompleted(courseId: string): DomainEnrollment[] {
  const current = loadDomainEnrollments();
  const course = DOMAIN_COURSES.find((c) => c.id === courseId);
  if (!course) return current;

  const updated = current.map((enrollment) => {
    if (enrollment.domainId === course.domainId) {
      const selected = Array.from(new Set([...enrollment.selectedCourseIds, courseId]));
      const target = enrollment.targetCourseIds.filter((id) => id !== courseId);
      return {
        ...enrollment,
        selectedCourseIds: selected,
        targetCourseIds: target,
      };
    }
    return enrollment;
  });

  saveDomainEnrollments(updated);
  return updated;
}

export function computePendingCourses(enrollments: DomainEnrollment[]): DomainCourse[] {
  const pendingIds = Array.from(new Set(enrollments.flatMap((e) => e.targetCourseIds)));
  return DOMAIN_COURSES.filter((c) => pendingIds.includes(c.id));
}

export function computeCompletedCourses(enrollments: DomainEnrollment[]): DomainCourse[] {
  const completedIds = Array.from(new Set(enrollments.flatMap((e) => e.selectedCourseIds)));
  return DOMAIN_COURSES.filter((c) => completedIds.includes(c.id));
}

export function computeSkillGapsFromEnrollments(enrollments: DomainEnrollment[]): SkillGap[] {
  const gaps: SkillGap[] = [];

  for (const enrollment of enrollments) {
    const domainCourses = getCoursesByDomain(enrollment.domainId);
    for (const courseId of enrollment.targetCourseIds) {
      const course = domainCourses.find((c) => c.id === courseId);
      if (!course) continue;

      const currentLevel = Math.max(1, course.level - 1);
      const requiredLevel = course.level;
      const isHighPriority = course.level >= 3;

      gaps.push({
        id: course.id,
        name: course.title,
        current: currentLevel,
        required: requiredLevel,
        priority: isHighPriority ? "HIGH" : "MEDIUM",
        impact: `Required competency module in ${enrollment.domainName}. Prerequisite for official cadre certification.`,
        recommendedCourseId: course.id,
      });
    }
  }

  return gaps;
}

export function computeCompetenciesFromEnrollments(enrollments: DomainEnrollment[]): Competency[] {
  return enrollments.map((enrollment) => {
    const allCourses = getCoursesByDomain(enrollment.domainId);
    const total = allCourses.length || 1;
    const completed = enrollment.selectedCourseIds.length;
    const ratio = completed / total;
    
    // Scale 1-5
    const level = Math.min(5, Math.max(1, Math.round(ratio * 5)));

    return {
      id: enrollment.domainId,
      name: enrollment.domainName,
      category: enrollment.category,
      level,
      required: 5,
      desc: `${completed} of ${total} verified courses completed (${Math.round(ratio * 100)}% mastery)`,
      evidenceSource: `iGOT Karmayogi (${enrollment.icon} ${enrollment.domainName})`,
    };
  });
}
