import React from "react";
import { Tab } from "../types";
import { skillGapsData } from "../data/mockData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState } from "../components/UIStates";

export default function SkillGapsPage({
  search,
  setTab,
}: {
  search: string;
  setTab: (t: Tab) => void;
}) {
  const q = search.toLowerCase();
  const filtered = skillGapsData.filter(
    (g) =>
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.impact.toLowerCase().includes(q) ||
      g.priority.toLowerCase().includes(q)
  );

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
      {/* Header */}
      <div style={{ marginBottom: 22, paddingBottom: 14, borderBottom: `1px solid ${border}` }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Skill Gap Inspector</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
          Deterministic gap calculation: <code>Gap = Required Level − Current Level</code>. Official statutory priority mapping.
        </div>
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
          { label: "Total Identified Gaps", value: `${skillGapsData.length}` },
          { label: "High Priority Interventions", value: `${skillGapsData.filter((g) => g.priority === "HIGH").length}` },
          { label: "Mean Competency Deficit", value: "1.75 Levels" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", padding: "14px 18px" }}>
            <div
              style={{
                fontSize: 10,
                color: muted,
                fontFamily: "JetBrains Mono, monospace",
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
          title="No Gaps Found"
          description="All competencies are on track for current role requirements."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((g) => {
            const high = g.priority === "HIGH";
            const gapWidth = g.required - g.current;
            return (
              <div
                key={g.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${high ? coral : border}`,
                  padding: "20px 22px",
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
                  <div style={{ fontSize: 16, fontWeight: 800, color: slate }}>{g.name}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        border: `1px solid ${high ? coral : border}`,
                        background: high ? "#FFF5F3" : panel,
                        fontSize: 10,
                        fontWeight: 700,
                        color: high ? coral : muted,
                        fontFamily: "JetBrains Mono, monospace",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {g.priority} PRIORITY
                    </span>
                    <button
                      onClick={() => setTab("assessments")}
                      style={{
                        padding: "4px 12px",
                        background: coral,
                        border: "none",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Assess →
                    </button>
                    <button
                      onClick={() => setTab("learning")}
                      style={{
                        padding: "4px 12px",
                        background: panel,
                        border: `1px solid ${border}`,
                        color: slate,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Find Course
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
                          fontFamily: "JetBrains Mono, monospace",
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
                          fontFamily: "JetBrains Mono, monospace",
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
                        fontFamily: "JetBrains Mono, monospace",
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
                <div style={{ display: "flex", gap: 2, background: border }}>
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
