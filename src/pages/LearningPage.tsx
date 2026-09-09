import React, { useState } from "react";
import { DOMAIN_COURSES, LEARNING_DOMAINS, DomainEnrollment } from "../data/domainData";
import { getCourseAssessmentRecord } from "../services/courseAssessmentService";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState, IntegrationBadge } from "../components/UIStates";
import CourseContentModal from "../components/CourseContentModal";

export default function LearningPage({
  search,
  showToast,
  domainEnrollments = [],
  onOpenAddDomain,
  onMarkCourseCompleted,
  onLaunchAssessment,
}: {
  search: string;
  showToast: (m: string) => void;
  domainEnrollments?: DomainEnrollment[];
  onOpenAddDomain?: () => void;
  onMarkCourseCompleted?: (courseId: string) => void;
  onLaunchAssessment?: (courseId: string, tier?: "easy" | "medium" | "difficult") => void;
}) {
  const [domainFilter, setDomainFilter] = useState<string>("All");
  const [levelFilter, setLevelFilter] = useState<string>("All");
  const [activeStudyCourseId, setActiveStudyCourseId] = useState<string | null>(null);

  const completedCourseIds = new Set(
    domainEnrollments.flatMap((e) => e.selectedCourseIds)
  );
  const targetCourseIds = new Set(
    domainEnrollments.flatMap((e) => e.targetCourseIds)
  );

  const q = search.toLowerCase();

  const filtered = DOMAIN_COURSES.filter((c) => {
    const matchesQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      (LEARNING_DOMAINS.find((d) => d.id === c.domainId)?.name || "").toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q);

    const matchesDomain = domainFilter === "All" || c.domainId === domainFilter;
    const matchesLevel = levelFilter === "All" || c.level === Number(levelFilter);

    return matchesQuery && matchesDomain && matchesLevel;
  });

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
      {/* Header */}
      <div
        style={{
          marginBottom: 22,
          paddingBottom: 14,
          borderBottom: `1px solid ${border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Learning & Course Catalogue</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            50 statutory courses across 7 learning streams · Access syllabus, modules & 3-tier assessments
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {onOpenAddDomain && (
            <button
              onClick={onOpenAddDomain}
              style={{
                padding: "7px 16px",
                background: coral,
                border: `1px solid ${coral}`,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(255, 111, 89, 0.25)",
              }}
            >
              + Add Domain / Stream
            </button>
          )}
          <IntegrationBadge status="iGOT" />
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          marginBottom: 20,
          background: "#fff",
          padding: "12px 18px",
          border: `1px solid ${border}`,
          borderRadius: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
            STREAM:
          </span>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            style={{
              padding: "5px 12px",
              border: `1px solid ${border}`,
              background: panel,
              fontSize: 12,
              color: slate,
              outline: "none",
              borderRadius: 4,
            }}
          >
            <option value="All">All 7 Learning Streams</option>
            {LEARNING_DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.name} ({d.category})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
            LEVEL:
          </span>
          <div style={{ display: "flex", gap: 1, background: border }}>
            {(["All", "L1", "L2", "L3", "L4"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                style={{
                  padding: "4px 10px",
                  border: "none",
                  background: levelFilter === lvl ? slate : "#fff",
                  color: levelFilter === lvl ? "#fff" : muted,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginLeft: "auto", fontSize: 12, color: muted, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
          Showing <b>{filtered.length}</b> of {DOMAIN_COURSES.length} courses
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="Try broadening your filter or search query."
          actionLabel="Clear Filters"
          onAction={() => {
            setDomainFilter("All");
            setLevelFilter("All");
          }}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {filtered.map((c) => {
            const isCompleted = completedCourseIds.has(c.id);
            const isPending = targetCourseIds.has(c.id);
            const assessmentRecord = getCourseAssessmentRecord(c.id);
            const passedCount = [
              assessmentRecord.easy?.passed,
              assessmentRecord.medium?.passed,
              assessmentRecord.difficult?.passed,
            ].filter(Boolean).length;

            return (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${isCompleted ? emerald : isPending ? coral : border}`,
                  padding: "20px",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: isCompleted
                    ? "0 2px 8px rgba(5, 150, 105, 0.08)"
                    : isPending
                    ? "0 2px 8px rgba(255, 111, 89, 0.08)"
                    : "none",
                }}
              >
                {/* Badges */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        border: `1px solid ${border}`,
                        background: panel,
                        color: slate,
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                      }}
                    >
                      {c.source}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        border: `1px solid ${border}`,
                        background: panel,
                        fontSize: 10,
                        fontWeight: 600,
                        color: muted,
                        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                      }}
                    >
                      Level {c.level}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        background: "#FAFCFE",
                        border: `1px solid ${border}`,
                        fontSize: 10,
                        color: slate,
                        fontWeight: 600,
                      }}
                    >
                      {LEARNING_DOMAINS.find((d) => d.id === c.domainId)?.name || c.domainId}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: muted, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                    {c.duration_hours}h
                  </span>
                </div>

                <div style={{ fontSize: 15, fontWeight: 700, color: slate, marginBottom: 4, lineHeight: 1.35 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 10 }}>
                  Provider: <span style={{ color: slate, fontWeight: 600 }}>{c.provider}</span>
                </div>

                {/* Course Description */}
                <div
                  style={{
                    background: panel,
                    border: `1px solid ${border}`,
                    padding: "10px 12px",
                    fontSize: 12,
                    color: muted,
                    lineHeight: 1.5,
                    marginBottom: 16,
                    borderRadius: 4,
                  }}
                >
                  {c.description}
                </div>

                {/* 3-Tier Assessment Status Mini-Strip */}
                <div
                  style={{
                    padding: "8px 12px",
                    background: "#FAFCFE",
                    border: `1px solid ${border}`,
                    borderRadius: 4,
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 11, color: muted, fontFamily: "'Space Grotesk', sans-serif" }}>
                    Assessments: <b>{passedCount}/3 Passed</b>
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 10, color: assessmentRecord.easy?.passed ? emerald : muted }}>
                      🟢 Easy {assessmentRecord.easy?.passed ? "✓" : ""}
                    </span>
                    <span style={{ fontSize: 10, color: assessmentRecord.medium?.passed ? emerald : muted }}>
                      🟡 Med {assessmentRecord.medium?.passed ? "✓" : ""}
                    </span>
                    <span style={{ fontSize: 10, color: assessmentRecord.difficult?.passed ? emerald : muted }}>
                      🔴 Diff {assessmentRecord.difficult?.passed ? "✓" : ""}
                    </span>
                  </div>
                </div>

                {/* Actions & Status */}
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => setActiveStudyCourseId(c.id)}
                    style={{
                      padding: "6px 12px",
                      background: "#fff",
                      border: `1px solid ${border}`,
                      color: slate,
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    📖 Study Course
                  </button>

                  <button
                    onClick={() => {
                      if (onLaunchAssessment) {
                        onLaunchAssessment(c.id);
                      } else {
                        setActiveStudyCourseId(c.id);
                      }
                    }}
                    style={{
                      padding: "6px 12px",
                      background: isCompleted ? "#D1FAE5" : coral,
                      border: `1px solid ${isCompleted ? emerald : coral}`,
                      color: isCompleted ? emerald : "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    {isCompleted ? "✓ Completed (Retake)" : "📝 Take Assessment"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Study Modal */}
      {activeStudyCourseId && (
        <CourseContentModal
          courseId={activeStudyCourseId}
          isOpen={Boolean(activeStudyCourseId)}
          onClose={() => setActiveStudyCourseId(null)}
          onStartAssessment={(cId, tier) => {
            setActiveStudyCourseId(null);
            if (onLaunchAssessment) {
              onLaunchAssessment(cId, tier);
            }
          }}
        />
      )}
    </div>
  );
}
