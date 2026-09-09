import React, { useState } from "react";
import { Tab } from "../types";
import { DomainEnrollment } from "../data/domainData";
import { computeSkillGapsFromEnrollments, computePendingCourses } from "../services/domainService";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState } from "../components/UIStates";

export default function SkillGapsPage({
  search,
  setTab,
  domainEnrollments = [],
  onOpenAddDomain,
  onMarkCourseCompleted,
}: {
  search: string;
  setTab: (t: Tab) => void;
  domainEnrollments?: DomainEnrollment[];
  onOpenAddDomain?: () => void;
  onMarkCourseCompleted?: (courseId: string) => void;
}) {
  const gaps = computeSkillGapsFromEnrollments(domainEnrollments);
  const pendingCourses = computePendingCourses(domainEnrollments);

  const q = search.toLowerCase();
  const filtered = gaps.filter(
    (g) =>
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.impact.toLowerCase().includes(q) ||
      g.priority.toLowerCase().includes(q)
  );

  const highPriorityCount = gaps.filter((g) => g.priority === "HIGH").length;
  const meanDeficit = gaps.length
    ? (gaps.reduce((sum, g) => sum + (g.required - g.current), 0) / gaps.length).toFixed(1)
    : "0.0";

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
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Skill Gap Inspector</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            Deterministic gap calculation derived from uncompleted courses across your active learning domains: <code>Gap = Required Level − Current Level</code>.
          </div>
        </div>

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
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>+</span>
            <span>Add Domain</span>
          </button>
        )}
      </div>

      {/* KPI Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: border,
          marginBottom: 22,
        }}
      >
        {[
          { label: "Active Domain Skill Gaps", value: `${gaps.length}` },
          { label: "High Priority Interventions", value: `${highPriorityCount}` },
          { label: "Mean Competency Deficit", value: gaps.length ? `${meanDeficit} Levels` : "0 Levels" },
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
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Skill Gaps Found"
          description={
            domainEnrollments.length === 0
              ? "You have not added any learning domains yet. Click '+ Add Domain' to select your learning streams and identify competency requirements."
              : "Outstanding work! All courses in your selected learning domains have been completed. All competency milestones are achieved."
          }
          actionLabel={domainEnrollments.length === 0 ? "Add First Domain" : "Add Another Domain"}
          onAction={onOpenAddDomain}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((g) => {
            const high = g.priority === "HIGH";
            const gapWidth = g.required - g.current;
            const relatedCourse = pendingCourses.find((c) => c.id === g.id);

            return (
              <div
                key={g.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${high ? coral : border}`,
                  padding: "20px 22px",
                  borderRadius: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: slate }}>{g.name}</div>
                    {relatedCourse && (
                      <div style={{ fontSize: 11, color: muted, marginTop: 2, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                        Course: <span style={{ color: slate, fontWeight: 600 }}>{relatedCourse.title}</span> · Provider: <span style={{ color: slate }}>{relatedCourse.provider}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 9999,
                        background: high ? "linear-gradient(135deg, #FEF2F2 0%, #FFF5F3 100%)" : "rgba(100, 112, 123, 0.08)",
                        border: `1px solid ${high ? "rgba(238, 112, 94, 0.35)" : "rgba(100, 112, 123, 0.2)"}`,
                        boxShadow: high ? "0 2px 8px rgba(238, 112, 94, 0.12)" : "none",
                        fontSize: 10,
                        fontWeight: 700,
                        color: high ? "#D95D4D" : muted,
                        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                        letterSpacing: "0.05em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: high ? "#EE705E" : "#94A3B8",
                          boxShadow: high ? "0 0 6px rgba(238, 112, 94, 0.6)" : "none",
                        }}
                      />
                      {g.priority} PRIORITY
                    </span>

                    {onMarkCourseCompleted && (
                      <button
                        onClick={() => onMarkCourseCompleted(g.id)}
                        style={{
                          padding: "5px 12px",
                          background: "#D1FAE5",
                          border: `1px solid ${emerald}`,
                          color: emerald,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          borderRadius: 3,
                        }}
                      >
                        ✓ Mark Completed / Close Gap
                      </button>
                    )}

                    <button
                      onClick={() => setTab("learning")}
                      style={{
                        padding: "5px 12px",
                        background: panel,
                        border: `1px solid ${border}`,
                        color: slate,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        borderRadius: 3,
                      }}
                    >
                      Find Course →
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 3fr",
                    gap: 1,
                    background: border,
                    marginBottom: 14,
                  }}
                >
                  {[
                    { label: "Current Level", val: `Level ${g.current}`, accent: false },
                    { label: "Required Level", val: `Level ${g.required}`, accent: false },
                    { label: "Calculated Gap", val: `${gapWidth} ${gapWidth === 1 ? "Level" : "Levels"}`, accent: true },
                  ].map(({ label, val, accent }) => (
                    <div
                      key={label}
                      style={{
                        background: accent ? "#FFF5F3" : "#fff",
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                          color: accent ? coral : muted,
                          letterSpacing: "0.07em",
                          marginBottom: 4,
                        }}
                      >
                        {label.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: accent ? coral : slate,
                          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                        }}
                      >
                        {val}
                      </div>
                    </div>
                  ))}
                  <div style={{ background: panel, padding: "12px 14px" }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                        color: muted,
                        letterSpacing: "0.07em",
                        marginBottom: 4,
                      }}
                    >
                      STATUTORY RATIONALE & IMPACT
                    </div>
                    <div style={{ fontSize: 12, color: slate, lineHeight: 1.55 }}>
                      {g.impact}
                    </div>
                  </div>
                </div>

                {/* Visual Gap Progress Bar */}
                <div style={{ display: "flex", gap: 2, background: border, height: 6, borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      height: 6,
                      background: coral,
                      width: `${(g.current / g.required) * 100}%`,
                    }}
                  />
                  <div style={{ height: 6, background: panel, flex: 1 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
