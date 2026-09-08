import React from "react";
import { Tab, UserProfile } from "../types";
import { competenciesData, skillGapsData, coursesCatalogue } from "../data/mockData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { AIStatusBadge, IntegrationBadge } from "../components/UIStates";

export default function DashboardPage({
  user,
  setTab,
}: {
  user: UserProfile;
  setTab: (t: Tab) => void;
}) {
  const criticalGap = skillGapsData[0];
  const highGapsCount = skillGapsData.filter((g) => g.priority === "HIGH").length;

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
            Deterministic competency analytics based on verified structural evidence · {user.name} ({user.grade})
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <AIStatusBadge status="AVAILABLE" />
          <IntegrationBadge status="DEMO" />
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
          { label: "Overall Readiness", value: "68.5%", sub: "Across 8 MoSPI domains" },
          { label: "Courses Enrolled", value: "3", sub: "2 currently in progress" },
          { label: "Assessments Completed", value: "14", sub: "Source-grounded tests" },
          { label: "Active Skill Gaps", value: `${skillGapsData.length}`, sub: `${highGapsCount} HIGH priority` },
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
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Readiness + Critical Gap */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 20 }}>
        {/* Competency Readiness */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "20px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: muted,
                letterSpacing: "0.08em",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              COMPETENCY READINESS (CORE DOMAINS)
            </div>
            <button
              onClick={() => setTab("competencies")}
              style={{
                background: "none",
                border: "none",
                color: coral,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View All 8 →
            </button>
          </div>

          {competenciesData.slice(0, 5).map((c) => {
            const pct = Math.round((c.level / c.required) * 100);
            const warn = pct < 60;
            return (
              <div key={c.name} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    fontWeight: 600,
                    color: slate,
                    marginBottom: 6,
                  }}
                >
                  <span>{c.name}</span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 12,
                      color: warn ? coral : emerald,
                      fontWeight: 700,
                    }}
                  >
                    Level {c.level} / {c.required} ({pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: 7,
                    background: panel,
                    border: `1px solid ${border}`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(pct, 100)}%`,
                      background: warn ? coral : emerald,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Critical Skill Gap Card */}
        <div
          style={{
            background: "#fff",
            border: `1px solid ${border}`,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: muted,
              letterSpacing: "0.08em",
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 16,
            }}
          >
            CRITICAL SKILL GAP INSPECTOR
          </div>

          <div
            style={{
              border: `1px solid ${border}`,
              background: panel,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: slate }}>{criticalGap.name}</div>
              <div
                style={{
                  padding: "3px 8px",
                  background: "#FFF5F3",
                  border: `1px solid ${coral}`,
                  fontSize: 10,
                  fontWeight: 700,
                  color: coral,
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.06em",
                }}
              >
                {criticalGap.priority} PRIORITY
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 1,
                background: border,
              }}
            >
              {[
                { label: "Current", val: `Lvl ${criticalGap.current}`, accent: false },
                { label: "Required", val: `Lvl ${criticalGap.required}`, accent: false },
                { label: "Gap", val: `${criticalGap.required - criticalGap.current} Lvls`, accent: true },
              ].map(({ label, val, accent }) => (
                <div
                  key={label}
                  style={{
                    background: accent ? "#FFF5F3" : "#fff",
                    padding: "10px 8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: accent ? coral : muted,
                      fontFamily: "JetBrains Mono, monospace",
                      letterSpacing: "0.08em",
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
            </div>
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
            {criticalGap.impact}
          </div>

          <button
            onClick={() => setTab("assessments")}
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
            }}
          >
            Launch Grounded Assessment →
          </button>
        </div>
      </div>

      {/* Course Recommendations */}
      <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "20px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: muted,
              letterSpacing: "0.08em",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            RECOMMENDED LEARNING PATHS (iGOT KARMAYOGI ALIGNED)
          </div>
          <button
            onClick={() => setTab("learning")}
            style={{
              background: "none",
              border: "none",
              color: coral,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open Full Catalogue →
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {coursesCatalogue.slice(0, 3).map((c) => (
            <div
              key={c.id}
              style={{
                border: `1px solid ${border}`,
                padding: "14px 16px",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span
                  style={{
                    padding: "2px 6px",
                    border: `1px solid ${c.source === "iGOT" ? emerald : border}`,
                    background: c.source === "iGOT" ? "#D1FAE5" : panel,
                    color: c.source === "iGOT" ? emerald : muted,
                    fontSize: 9,
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {c.source}
                </span>
                <span style={{ fontSize: 10, color: muted, fontFamily: "JetBrains Mono, monospace" }}>
                  {c.duration}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: slate, marginBottom: 8, lineHeight: 1.4 }}>
                {c.title}
              </div>
              <div
                style={{
                  background: panel,
                  border: `1px solid ${border}`,
                  padding: "8px 12px",
                  fontSize: 11,
                  color: muted,
                  lineHeight: 1.5,
                  marginTop: "auto",
                }}
              >
                <span style={{ fontWeight: 700, color: slate }}>Why recommended? </span>
                {c.reason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
