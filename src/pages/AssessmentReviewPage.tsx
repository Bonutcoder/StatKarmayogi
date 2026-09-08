import React, { useState } from "react";
import { assessmentQuestionsData } from "../data/mockData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";

export default function AssessmentReviewPage() {
  const [activeQIndex, setActiveQIndex] = useState(2); // Q3 by default
  const q = assessmentQuestionsData[activeQIndex];

  return (
    <div style={{ flex: 1, background: bg, display: "flex", overflow: "hidden" }}>
      {/* Main Review Column */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", borderRight: `1px solid ${border}` }}>
        {/* Header */}
        <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Assessment Review & Audit</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
                Completed Attempt #SKA-7821 · Survey Methodology (Intermediate) · Verified Grounding
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  padding: "4px 12px",
                  border: `1px solid ${emerald}`,
                  background: "#D1FAE5",
                  fontSize: 10,
                  fontWeight: 700,
                  color: emerald,
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.06em",
                }}
              >
                ATTEMPT VERIFIED
              </div>
              <div
                style={{
                  padding: "4px 12px",
                  border: `1px solid ${border}`,
                  background: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  color: muted,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                OVERALL SCORE: 4 / 5 (80%)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Track */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: slate }}>Question {activeQIndex + 1} of {assessmentQuestionsData.length}</span>
            <span style={{ color: emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
              ✓ Evaluated by deterministic rule
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {assessmentQuestionsData.map((item, i) => {
              const isCorrect = i !== 3; // simulated correctness
              const isCurrent = i === activeQIndex;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <button
                    onClick={() => setActiveQIndex(i)}
                    style={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "JetBrains Mono, monospace",
                      border: `2px solid ${isCurrent ? coral : isCorrect ? emerald : "#DC2626"}`,
                      background: isCurrent ? coral : isCorrect ? emerald : "#FEF2F2",
                      color: isCorrect || isCurrent ? "#fff" : "#DC2626",
                      cursor: "pointer",
                    }}
                  >
                    {isCorrect ? "✓" : "✗"}
                  </button>
                  {i < assessmentQuestionsData.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: isCorrect ? emerald : border }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: muted }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, background: emerald }} />
              <span>Correct (4)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, background: "#DC2626" }} />
              <span>Incorrect (1)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, background: coral }} />
              <span>Inspecting (Q{activeQIndex + 1})</span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "18px 20px", marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              color: muted,
              letterSpacing: "0.08em",
              marginBottom: 10,
              display: "flex",
              gap: 12,
            }}
          >
            <span>Q{q.qIndex}</span>
            <span>|</span>
            <span>MULTIPLE CHOICE</span>
            <span>|</span>
            <span>{q.marks} MARKS</span>
            <span>|</span>
            <span style={{ color: emerald, fontWeight: 700 }}>VERIFIED CORRECT (+4 pts)</span>
          </div>
          <div style={{ fontSize: 14, color: slate, lineHeight: 1.75 }}>
            {q.question}
          </div>
        </div>

        {/* Options Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {q.options.map((opt) => {
            const isCorrect = opt.key === q.correctOption;
            return (
              <div
                key={opt.key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "12px 16px",
                  border: `1px solid ${isCorrect ? emerald : border}`,
                  background: isCorrect ? "#F0FDF4" : "#fff",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    border: `1px solid ${isCorrect ? emerald : border}`,
                    background: isCorrect ? emerald : bg,
                    color: isCorrect ? "#fff" : muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono, monospace",
                    flexShrink: 0,
                  }}
                >
                  {opt.key}
                </div>
                <div style={{ fontSize: 13, color: slate, lineHeight: 1.5, paddingTop: 2 }}>
                  {opt.text} {isCorrect && <strong style={{ color: emerald, marginLeft: 8 }}>✓ Official Correct Option</strong>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grounding Explanation */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            EVALUATION RATIONALE
          </div>
          <div style={{ fontSize: 13, color: slate, lineHeight: 1.65 }}>
            {q.explanation}
          </div>
        </div>
      </div>

      {/* Citations & Evidence Column */}
      <div
        style={{
          width: 380,
          minWidth: 380,
          background: panel,
          borderLeft: `1px solid ${border}`,
          overflowY: "auto",
          padding: 24,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: slate, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", marginBottom: 16 }}>
          GROUNDED SOURCE PASSAGES
        </div>

        {/* Primary Citation */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: coral, letterSpacing: "0.1em", fontFamily: "JetBrains Mono, monospace", marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>
            PRIMARY CITATION
          </div>
          {[
            ["Document", q.sourceDocument],
            ["Page", `${q.sourcePage}`],
            ["Section", q.sourceSection],
            ["Relevance Score", `${q.groundingConfidence}`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11, borderBottom: `1px solid ${panel}` }}>
              <span style={{ color: muted }}>{k}</span>
              <span style={{ color: slate, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#F0FDF4", border: `1px solid ${emerald}`, fontSize: 12, color: slate, lineHeight: 1.6 }}>
            <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: emerald, marginBottom: 4, fontWeight: 700 }}>
              VERIFIED PASSAGE
            </div>
            "{q.verifiedPassage}"
          </div>
        </div>

        {/* Grounding Summary */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: muted, letterSpacing: "0.1em", fontFamily: "JetBrains Mono, monospace", marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>
            GROUNDING CONFIDENCE SUMMARY
          </div>
          {[
            ["Evidence Sources", "2 Approved Training Documents"],
            ["Verification Score", "High (0.97)"],
            ["Hallucination Risk", "0% Detected (Strict RAG)"],
            ["Auditor Sign-off", "System.Compute · SHA-256 Valid"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11, borderBottom: `1px solid ${panel}` }}>
              <span style={{ color: muted }}>{k}</span>
              <span style={{ color: slate, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Verified", "Multi-source", "Zero-Hallucination", "MoSPI NSSTA"].map((t) => (
              <span key={t} style={{ padding: "3px 8px", border: `1px solid ${emerald}`, fontSize: 10, color: emerald, fontFamily: "JetBrains Mono, monospace", background: "#F0FDF4", fontWeight: 700 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
