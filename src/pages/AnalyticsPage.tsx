import React from "react";
import { heatmapDepts, heatmapSkills, heatmapScores } from "../data/mockData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";

function cellStyle(v: number): { bg: string; color: string } {
  if (v >= 4.0) return { bg: "#D1FAE5", color: "#059669" };
  if (v >= 3.0) return { bg: "#ECFDF5", color: "#047857" };
  if (v >= 2.5) return { bg: "#FFF5F3", color: "#FF6F59" };
  return { bg: "#FEF2F2", color: "#DC2626" };
}

export default function AnalyticsPage({ search }: { search: string }) {
  const q = search.toLowerCase();

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
      {/* Page Header */}
      <div
        style={{
          marginBottom: 20,
          paddingBottom: 14,
          borderBottom: `1px solid ${border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>
            Department Competency Analytics & Heatmap
          </div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            Ministry of Statistics and Programme Implementation · Admin View · Official Scale 1.0–5.0
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              padding: "4px 10px",
              border: `1px solid ${coral}`,
              background: "#FFF5F3",
              fontSize: 10,
              fontWeight: 700,
              color: coral,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.06em",
            }}
          >
            ADMIN ONLY
          </div>
          <div
            style={{
              padding: "4px 10px",
              border: `1px solid ${border}`,
              background: "#fff",
              fontSize: 10,
              fontWeight: 700,
              color: muted,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Q3 FY 2026–27
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: border,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Departments Assessed", value: "7", sub: "100% divisional coverage" },
          { label: "Cadre Average Score", value: "3.14", sub: "Out of 5.0 milestone" },
          { label: "Critical Gaps (< 2.5)", value: "8 cells", sub: "Immediate training required" },
          { label: "Proficient (≥ 4.0)", value: "11 cells", sub: "Exceeding target readiness" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", padding: "12px 16px" }}>
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
            <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>{s.value}</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Heatmap Card */}
      <div style={{ background: "#fff", border: `1px solid ${border}`, marginBottom: 20, overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: slate, letterSpacing: "0.08em", fontFamily: "JetBrains Mono, monospace" }}>
              DEPARTMENT COMPETENCY MATRIX (HEATMAP)
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
              Numerical ratings on a 1.0–5.0 scale · MoSPI Competency Framework v3.1
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
            {[
              { label: "≥ 4.0 Proficient", color: "#059669", bg: "#D1FAE5" },
              { label: "3.0–3.9 Developing", color: "#047857", bg: "#ECFDF5" },
              { label: "2.5–2.9 Emerging", color: "#FF6F59", bg: "#FFF5F3" },
              { label: "< 2.5 Critical Gap", color: "#DC2626", bg: "#FEF2F2" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 14, height: 14, background: l.bg, border: `1px solid ${l.color}` }} />
                <span style={{ color: muted, fontSize: 10 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: panel }}>
              <th
                style={{
                  padding: "9px 16px",
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: 700,
                  color: muted,
                  borderRight: `1px solid ${border}`,
                  borderBottom: `1px solid ${border}`,
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.06em",
                  minWidth: 170,
                }}
              >
                DIVISION / DEPARTMENT
              </th>
              {heatmapSkills.map((s) => (
                <th
                  key={s}
                  style={{
                    padding: "9px 12px",
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: muted,
                    borderRight: `1px solid ${border}`,
                    borderBottom: `1px solid ${border}`,
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.toUpperCase()}
                </th>
              ))}
              <th
                style={{
                  padding: "9px 12px",
                  textAlign: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: muted,
                  borderBottom: `1px solid ${border}`,
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.04em",
                }}
              >
                AVG
              </th>
            </tr>
          </thead>
          <tbody>
            {heatmapDepts
              .filter((d) => !q || d.toLowerCase().includes(q))
              .map((dept, di) => {
                const vals = heatmapSkills.map((s) => heatmapScores[dept][s]);
                const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
                return (
                  <tr key={dept} style={{ background: di % 2 === 0 ? "#fff" : bg }}>
                    <td
                      style={{
                        padding: "10px 16px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: slate,
                        borderRight: `1px solid ${border}`,
                        borderBottom: `1px solid ${border}`,
                      }}
                    >
                      {dept}
                    </td>
                    {heatmapSkills.map((skill) => {
                      const v = heatmapScores[dept][skill];
                      const { bg: cb, color: cc } = cellStyle(v);
                      return (
                        <td
                          key={skill}
                          style={{
                            padding: "9px 12px",
                            textAlign: "center",
                            borderRight: `1px solid ${border}`,
                            borderBottom: `1px solid ${border}`,
                            background: cb,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: 13,
                              fontWeight: 700,
                              color: cc,
                            }}
                          >
                            {v.toFixed(1)}
                          </span>
                        </td>
                      );
                    })}
                    <td
                      style={{
                        padding: "9px 12px",
                        textAlign: "center",
                        borderBottom: `1px solid ${border}`,
                        background: panel,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: 12,
                          fontWeight: 700,
                          color: slate,
                        }}
                      >
                        {avg.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
