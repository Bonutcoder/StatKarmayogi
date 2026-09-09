import React from "react";
import { Competency, Course, SkillGap, Tab, UserProfile } from "../types";
import { DomainEnrollment, DomainCourse, DOMAIN_COURSES, LEARNING_DOMAINS, getCoursesByDomain } from "../data/domainData";
import { computePendingCourses, computeCompletedCourses, computeSkillGapsFromEnrollments, computeCompetenciesFromEnrollments } from "../services/domainService";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState } from "../components/UIStates";

export default function DashboardPage({
  user,
  setTab,
  domainEnrollments,
  onOpenAddDomain,
  onMarkCourseCompleted,
  onLaunchAssessment,
  onViewCourseContent,
}: {
  user: UserProfile;
  setTab: (t: Tab) => void;
  domainEnrollments: DomainEnrollment[];
  onOpenAddDomain: () => void;
  onMarkCourseCompleted?: (courseId: string) => void;
  onLaunchAssessment?: (courseId: string) => void;
  onViewCourseContent?: (courseId: string) => void;
}) {
  const pendingCourses = computePendingCourses(domainEnrollments);
  const completedCourses = computeCompletedCourses(domainEnrollments);
  const skillGaps = computeSkillGapsFromEnrollments(domainEnrollments);
  const competencies = computeCompetenciesFromEnrollments(domainEnrollments);

  const highGapsCount = skillGaps.filter((g) => g.priority === "HIGH").length;
  const criticalGap = skillGaps[0];

  const totalPossibleCourses = domainEnrollments.reduce((sum, e) => sum + getCoursesByDomain(e.domainId).length, 0);
  const overallReadinessPct = totalPossibleCourses > 0
    ? Math.round((completedCourses.length / totalPossibleCourses) * 100)
    : 0;

  if (domainEnrollments.length === 0) {
    return (
      <div style={{ padding: 28, overflow: "auto", flex: 1 }}>
        <EmptyState
          title="No learning domains added"
          description="Add a domain to begin tracking courses, competencies, and skill gaps."
          actionLabel="Add Domain"
          onAction={onOpenAddDomain}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 28, overflow: "auto", flex: 1 }}>
      {/* Page Header */}
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
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>
            Officer Competency Overview
          </div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            Continuous professional learning & competency mapping · {user.name} ({user.roleTitle || user.grade})
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={onOpenAddDomain}
            style={{
              padding: "5px 10px",
              background: coral,
              border: `1px solid ${coral}`,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 4,
              boxShadow: "0 2px 8px rgba(255, 111, 89, 0.25)",
              display: "flex",
              alignItems: "center",
            }}
          >
            Add Domain
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: border,
          marginBottom: 22,
        }}
      >
        {[
          {
            label: "Domain Readiness",
            value: `${overallReadinessPct}%`,
            sub: `${completedCourses.length} of ${totalPossibleCourses} courses completed`,
          },
          {
            label: "Active Learning Streams",
            value: `${domainEnrollments.length}`,
            sub: `${domainEnrollments.map((e) => e.icon).join(" ")} enrolled`,
          },
          {
            label: "Pending Courses to Complete",
            value: `${pendingCourses.length}`,
            sub: "Actionable modules remaining",
          },
          {
            label: "Active Skill Gaps",
            value: `${skillGaps.length}`,
            sub: `${highGapsCount} High Priority deficit`,
          },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", padding: "14px 18px" }}>
            <div
              style={{
                fontSize: 10,
                color: muted,
                fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                letterSpacing: "0.07em",
                marginBottom: 4,
              }}
            >
              {s.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: slate }}>{s.value}</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Active Learning Streams (Domains Progress) */}
      <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "20px 24px", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, letterSpacing: "0.08em", fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
              ACTIVE LEARNING DOMAINS & STREAMS
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
              Your selected competency pathways from the 7 official iGOT streams
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
          {domainEnrollments.map((enrollment) => {
            const domainAll = getCoursesByDomain(enrollment.domainId);
            const completedCount = enrollment.selectedCourseIds.length;
            const totalCount = domainAll.length;
            const pct = Math.round((completedCount / totalCount) * 100);

            return (
              <div
                key={enrollment.domainId}
                style={{
                  border: `1px solid ${border}`,
                  padding: "16px",
                  borderRadius: 6,
                  background: "#FAFCFE",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{enrollment.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: slate }}>
                        {enrollment.domainName}
                      </div>
                      <div style={{ fontSize: 10, color: muted, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                        {enrollment.category} Stream · {completedCount} of {totalCount} completed
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: pct >= 60 ? emerald : coral,
                      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                    }}
                  >
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width: "100%", height: 6, background: border, borderRadius: 3, overflow: "hidden", margin: "10px 0" }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: pct >= 60 ? emerald : coral,
                      borderRadius: 3,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                  <span style={{ color: muted }}>
                    <b>{enrollment.targetCourseIds.length}</b> courses remaining
                  </span>
                  <button
                    onClick={() => setTab("skill-gaps")}
                    style={{
                      background: "none",
                      border: "none",
                      color: coral,
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    View Skill Gaps →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Readiness & Skill Deficit */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 22 }}>
        {/* Competency Readiness Matrix */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, letterSpacing: "0.08em", fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
              DOMAIN MASTERY LEVELS (1.0 – 5.0)
            </div>
            <button onClick={() => setTab("competencies")} style={{ background: "none", border: "none", color: coral, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              Inspect Competency Framework →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {competencies.map((c) => {
              const pct = Math.round((c.level / c.required) * 100);
              return (
                <div key={c.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: slate }}>{c.name}</span>
                      <span style={{ fontSize: 9, padding: "1px 6px", background: panel, border: `1px solid ${border}`, color: muted, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {c.category}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: slate, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                      Level {c.level} / {c.required} ({pct}%)
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: panel, border: `1px solid ${border}`, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: c.level >= 4 ? emerald : coral }} />
                  </div>
                  <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>{c.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Skill Gap Callout */}
        <div style={{ background: "#fff", border: `1px solid ${coral}`, padding: "20px 24px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: coral, letterSpacing: "0.08em", fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
              HIGHEST PRIORITY SKILL DEFICIT
            </div>
            <span style={{ padding: "2px 8px", background: "#FFF5F3", border: `1px solid ${coral}`, color: coral, fontSize: 10, fontWeight: 800 }}>
              {criticalGap?.priority || "NORMAL"}
            </span>
          </div>

          <div style={{ fontSize: 16, fontWeight: 800, color: slate, marginBottom: 4 }}>
            {criticalGap ? criticalGap.name : "All domain courses up to date"}
          </div>

          <div style={{ fontSize: 12, color: muted, marginBottom: 14 }}>
            {criticalGap
              ? `Deficit: Level ${criticalGap.current} → Required Level ${criticalGap.required}`
              : "No pending competency deficits."}
          </div>

          <div
            style={{
              fontSize: 12,
              color: muted,
              lineHeight: 1.6,
              marginBottom: 16,
              padding: "10px 12px",
              background: panel,
              border: `1px solid ${border}`,
            }}
          >
            <span style={{ fontWeight: 700, color: slate }}>Why this matters: </span>
            {criticalGap?.impact || "Complete your assigned domain courses to enhance official readiness."}
          </div>

          <button
            onClick={() => setTab("skill-gaps")}
            style={{
              marginTop: "auto",
              padding: "11px 0",
              background: coral,
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.02em",
              borderRadius: 4,
            }}
          >
            Inspect Skill Gaps & Pathways →
          </button>
        </div>
      </div>

      {/* Pending Courses to Complete in Enrolled Domains */}
      <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, letterSpacing: "0.08em", fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
              PENDING COURSES TO COMPLETE (DOMAIN LEARNING PATHWAYS)
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
              Uncompleted courses in your active domains mapped to statutory competency milestones
            </div>
          </div>
          <button
            onClick={() => setTab("learning")}
            style={{ background: "none", border: "none", color: coral, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
          >
            Open Full Catalogue ({DOMAIN_COURSES.length} Courses) →
          </button>
        </div>

        {pendingCourses.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", background: panel, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: slate }}>All Domain Courses Completed!</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
              You have completed all courses in your selected domains. Click <b>+ Add Domain</b> to enroll in a new competency stream.
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {pendingCourses.slice(0, 6).map((c) => (
              <div
                key={c.id}
                style={{
                  border: `1px solid ${border}`,
                  padding: "16px",
                  background: "#fff",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <span
                      style={{
                        padding: "2px 6px",
                        border: `1px solid ${emerald}`,
                        background: "#D1FAE5",
                        color: emerald,
                        fontSize: 9,
                        fontWeight: 700,
                        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                      }}
                    >
                      {c.source}
                    </span>
                    <span style={{ fontSize: 10, color: muted, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                      Level {c.level} · {c.duration_hours}h
                    </span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: slate, marginBottom: 6, lineHeight: 1.35 }}>
                    {c.title}
                  </div>

                  <div style={{ fontSize: 11, color: muted, lineHeight: 1.45, marginBottom: 12 }}>
                    {c.description}
                  </div>
                </div>

                <div style={{ paddingTop: 10, borderTop: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: muted, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                      Provider: <b>{c.provider.split(" ")[0]}</b>
                    </span>
                    {onMarkCourseCompleted && (
                      <button
                        onClick={() => onMarkCourseCompleted(c.id)}
                        style={{
                          padding: "3px 8px",
                          background: "#FFF5F3",
                          border: `1px solid ${coral}`,
                          color: coral,
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 3,
                          cursor: "pointer",
                        }}
                      >
                        Mark Done ✓
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    {onViewCourseContent && (
                      <button
                        onClick={() => onViewCourseContent(c.id)}
                        style={{
                          flex: 1,
                          padding: "5px 0",
                          background: "#fff",
                          border: `1px solid ${border}`,
                          color: slate,
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 3,
                          cursor: "pointer",
                        }}
                      >
                        📖 Syllabus
                      </button>
                    )}
                    {onLaunchAssessment && (
                      <button
                        onClick={() => onLaunchAssessment(c.id)}
                        style={{
                          flex: 1,
                          padding: "5px 0",
                          background: coral,
                          border: "none",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 3,
                          cursor: "pointer",
                        }}
                      >
                        📝 Assess
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
