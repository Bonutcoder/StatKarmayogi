import React from "react";
import { AssessmentSubmission, Tab } from "../types";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";

export default function AssessmentResultPage({
  submission,
  setTab,
}: {
  submission: AssessmentSubmission | null;
  setTab: (t: Tab) => void;
}) {
  // Fallback if accessed directly
  const data: AssessmentSubmission = submission || {
    competency: "Survey Methodology",
    difficulty: "Intermediate",
    score: 4,
    total: 5,
    percentage: 80,
    previousLevel: 3,
    newLevel: 4,
    masteryTier: "Strong Mastery",
    sourceDocument: "Survey Methodology Handbook",
    sourcePage: 18,
    nextRecommendedCourse: "Modern Survey Sampling & Two-Stage Cluster Design",
  };

  const getTierBadge = (tier: AssessmentSubmission["masteryTier"]) => {
    switch (tier) {
      case "Strong Mastery":
        return { bg: "#D1FAE5", border: "#059669", color: "#059669" };
      case "Proficient":
        return { bg: "#ECFDF5", border: "#047857", color: "#047857" };
      case "Developing":
        return { bg: "#FFF5F3", border: "#FF6F59", color: "#FF6F59" };
      default:
        return { bg: "#FEF2F2", border: "#DC2626", color: "#DC2626" };
    }
  };

  const badge = getTierBadge(data.masteryTier);

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 36, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 760 }}>
        {/* Header */}
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: coral, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em" }}>
            OFFICIAL EVALUATION RESULT · RECORD SAVED
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: slate, margin: "6px 0 4px" }}>
            Competency Assessment Summary
          </h1>
          <div style={{ fontSize: 13, color: muted }}>
            Validated against MoSPI Approved Training Material · Immutable audit entry logged
          </div>
        </div>

        {/* Score & Mastery Hero Card */}
        <div
          style={{
            background: "#fff",
            border: `1px solid ${border}`,
            padding: 32,
            marginBottom: 24,
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 32,
            alignItems: "center",
          }}
        >
          {/* Big Score Dial */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRight: `1px solid ${border}`,
              paddingRight: 24,
            }}
          >
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: data.percentage >= 60 ? emerald : coral,
                fontFamily: "JetBrains Mono, monospace",
                lineHeight: 1,
              }}
            >
              {data.percentage}%
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 6, fontWeight: 600 }}>
              {data.score} of {data.total} Correct Answers
            </div>
            <div
              style={{
                marginTop: 14,
                padding: "4px 12px",
                background: badge.bg,
                border: `1px solid ${badge.border}`,
                color: badge.color,
                fontSize: 11,
                fontWeight: 800,
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: "0.06em",
              }}
            >
              {data.masteryTier.toUpperCase()}
            </div>
          </div>

          {/* Competency Delta Progression */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace" }}>
              COMPETENCY EVALUATED
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: slate, marginTop: 4, marginBottom: 14 }}>
              {data.competency} ({data.difficulty})
            </div>

            {/* Level Movement Box */}
            <div style={{ padding: "12px 16px", background: panel, border: `1px solid ${border}`, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: muted, fontFamily: "JetBrains Mono, monospace" }}>
                    OFFICIAL STATUS UPDATE
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: slate, marginTop: 2 }}>
                    Level {data.previousLevel} → Level {data.newLevel}
                  </div>
                </div>
                {data.newLevel > data.previousLevel && (
                  <span
                    style={{
                      padding: "3px 10px",
                      background: "#D1FAE5",
                      border: "1px solid #059669",
                      color: "#059669",
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    +1 LEVEL PROMOTED
                  </span>
                )}
              </div>
            </div>

            {/* Source Evidence Citation */}
            <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>
              <span style={{ fontWeight: 700, color: slate }}>Authoritative Evidence: </span>
              {data.sourceDocument} · Page {data.sourcePage}
            </div>
          </div>
        </div>

        {/* 4-Tier Mastery Reference Scale (from PRD.md § 6) */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>
            OFFICIAL MOSPI MASTERY THRESHOLDS (PRD §6)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { range: "0–39%", label: "Needs Foundation", active: data.percentage < 40 },
              { range: "40–59%", label: "Developing", active: data.percentage >= 40 && data.percentage < 60 },
              { range: "60–79%", label: "Proficient", active: data.percentage >= 60 && data.percentage < 80 },
              { range: "80–100%", label: "Strong Mastery", active: data.percentage >= 80 },
            ].map((t) => (
              <div
                key={t.range}
                style={{
                  padding: "10px",
                  border: `1px solid ${t.active ? coral : border}`,
                  background: t.active ? "#FFF5F3" : panel,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: t.active ? coral : slate, fontFamily: "JetBrains Mono, monospace" }}>
                  {t.range}
                </div>
                <div style={{ fontSize: 11, color: t.active ? coral : muted, marginTop: 2, fontWeight: t.active ? 700 : 500 }}>
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Recommendation Step */}
        <div
          style={{
            background: "#fff",
            border: `2px solid ${emerald}`,
            padding: 24,
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: emerald, fontFamily: "JetBrains Mono, monospace" }}>
              RECOMMENDED NEXT ACTION IN CLOSED LOOP
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: slate, marginTop: 4 }}>
              {data.nextRecommendedCourse}
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>
              Continue building on your updated {data.competency} foundation.
            </div>
          </div>
          <button
            onClick={() => setTab("learning")}
            style={{
              padding: "10px 20px",
              background: emerald,
              border: "none",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Start Course →
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setTab("dashboard")}
            style={{
              padding: "12px 24px",
              background: slate,
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => setTab("assessment-review")}
            style={{
              padding: "12px 22px",
              background: "#fff",
              border: `1px solid ${border}`,
              color: slate,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Inspect Question Review & Citations
          </button>
        </div>
      </div>
    </div>
  );
}
