import React from "react";
import { AssessmentSubmission, Tab } from "../types";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState } from "../components/UIStates";

export default function AssessmentResultPage({
  submission,
  setTab,
}: {
  submission: AssessmentSubmission | null;
  setTab: (t: Tab) => void;
}) {
  if (!submission) {
    return (
      <div style={{ flex: 1, padding: 36, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 760 }}>
          <EmptyState
            title="No Assessment Submission"
            description="You have not submitted an assessment yet. Please start an official assessment to view your results."
            actionLabel="Go to Assessments"
            onAction={() => setTab("assessments")}
          />
        </div>
      </div>
    );
  }

  const data = submission;

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
          <div style={{ fontSize: 11, fontWeight: 700, color: coral, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", letterSpacing: "0.1em" }}>
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
            padding: "28px 32px",
            marginBottom: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: muted, fontWeight: 700, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", letterSpacing: "0.06em", marginBottom: 6 }}>
              FINAL SCORE
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: slate }}>
              {data.score} <span style={{ fontSize: 18, color: muted, fontWeight: 600 }}>/ {data.total}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: data.percentage >= 60 ? emerald : coral, marginTop: 2 }}>
              {data.percentage}% Accuracy
            </div>
          </div>

          <div style={{ borderLeft: `1px solid ${border}`, borderRight: `1px solid ${border}`, padding: "0 20px" }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 700, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", letterSpacing: "0.06em", marginBottom: 6 }}>
              MASTERY LEVEL
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: slate }}>L{data.newLevel}</div>
              {data.newLevel > data.previousLevel && (
                <div style={{ fontSize: 12, fontWeight: 700, color: emerald }}>▲ Level Up</div>
              )}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: 2,
                background: badge.bg,
                border: `1px solid ${badge.border}`,
                color: badge.color,
                fontSize: 10,
                fontWeight: 800,
                marginTop: 4,
              }}
            >
              {data.masteryTier}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: muted, fontWeight: 700, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", letterSpacing: "0.06em", marginBottom: 6 }}>
              TARGET COMPETENCY
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: slate }}>{data.competency}</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>Difficulty: {data.difficulty}</div>
          </div>
        </div>

        {/* Verification Source Citation */}
        <div style={{ background: "#F8FAFC", border: `1px solid ${border}`, padding: "18px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: slate, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", letterSpacing: "0.06em", marginBottom: 8 }}>
            GROUND TRUTH VERIFICATION
          </div>
          <div style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>
            Questions and evaluations were verified against official training module{" "}
            <span style={{ color: slate, fontWeight: 600 }}>{data.sourceDocument}</span> (Page {data.sourcePage}).
          </div>
        </div>

        {/* Action Row */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={() => setTab("assessment-review")}
            style={{
              padding: "10px 20px",
              background: "#F0FDF4",
              border: `1px solid ${emerald}`,
              color: emerald,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            🔍 Review Detailed Question Audit →
          </button>
          <button
            onClick={() => setTab("competencies")}
            style={{
              padding: "10px 22px",
              background: "#fff",
              border: `1px solid ${border}`,
              color: slate,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            View Competencies
          </button>
          <button
            onClick={() => setTab("learning")}
            style={{
              padding: "10px 24px",
              background: coral,
              border: `1px solid ${coral}`,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Explore Next Courses →
          </button>
        </div>
      </div>
    </div>
  );
}
