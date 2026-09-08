import React, { useState } from "react";
import { AssessmentSubmission } from "../types";
import { assessmentQuestionsData } from "../data/mockData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";

export default function AssessmentsPage({
  onSubmitAssessment,
  showToast,
}: {
  onSubmitAssessment: (sub: AssessmentSubmission) => void;
  showToast: (m: string) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(2); // default to Q3 as in mockup
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({
    0: "A",
    1: "B",
  });
  const [drawerOpen, setDrawerOpen] = useState(true);

  const currentQ = assessmentQuestionsData[currentIdx];
  const totalQuestions = assessmentQuestionsData.length;

  const handleSelectOption = (key: "A" | "B" | "C" | "D") => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: key }));
  };

  const answeredCount = Object.keys(answers).length;

  const handleSubmit = () => {
    // Calculate score
    let correct = 0;
    assessmentQuestionsData.forEach((q, idx) => {
      if (answers[idx] === q.correctOption) {
        correct++;
      }
    });

    const percentage = Math.round((correct / totalQuestions) * 100);

    let tier: AssessmentSubmission["masteryTier"] = "Needs Foundation";
    if (percentage >= 80) tier = "Strong Mastery";
    else if (percentage >= 60) tier = "Proficient";
    else if (percentage >= 40) tier = "Developing";

    const submission: AssessmentSubmission = {
      competency: "Survey Methodology",
      difficulty: "Intermediate",
      score: correct,
      total: totalQuestions,
      percentage,
      previousLevel: 3,
      newLevel: percentage >= 60 ? 4 : 3,
      masteryTier: tier,
      sourceDocument: currentQ.sourceDocument,
      sourcePage: currentQ.sourcePage,
      nextRecommendedCourse: "Modern Survey Sampling & Two-Stage Cluster Design",
    };

    showToast(`Assessment submitted! Score: ${percentage}% · ${tier}`);
    onSubmitAssessment(submission);
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Quiz Workspace */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", borderRight: `1px solid ${border}` }}>
        {/* Header */}
        <div style={{ marginBottom: 22, paddingBottom: 14, borderBottom: `1px solid ${border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>
              Source-Grounded Assessment Canvas
            </div>
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              style={{
                padding: "4px 12px",
                border: `1px solid ${border}`,
                background: panel,
                fontSize: 11,
                fontWeight: 700,
                color: slate,
                cursor: "pointer",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {drawerOpen ? "Hide Evidence Drawer ▹" : "Show Evidence Drawer ◃"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {[
              ["COMPETENCY", currentQ.competency],
              ["DIFFICULTY", currentQ.difficulty],
              ["MODULE", currentQ.module],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  padding: "5px 14px",
                  border: `1px solid ${border}`,
                  marginRight: -1,
                  background: "#fff",
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                <span style={{ fontSize: 10, color: muted, letterSpacing: "0.06em" }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: slate }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Stepper */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: slate }}>
              Question {currentQ.qIndex} of {totalQuestions}
            </span>
            <span style={{ color: muted, fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
              {Math.round((answeredCount / totalQuestions) * 100)}% answered ({answeredCount}/{totalQuestions})
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {assessmentQuestionsData.map((_, i) => {
              const answered = answers[i] !== undefined;
              const isCurrent = i === currentIdx;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <button
                    onClick={() => setCurrentIdx(i)}
                    style={{
                      width: 32,
                      height: 32,
                      border: `2px solid ${isCurrent ? coral : answered ? emerald : border}`,
                      background: isCurrent ? coral : answered ? emerald : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "JetBrains Mono, monospace",
                      color: isCurrent || answered ? "#fff" : muted,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {answered ? "✓" : i + 1}
                  </button>
                  {i < totalQuestions - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: answered ? emerald : border,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "20px 22px", marginBottom: 16 }}>
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
            <span>Q{currentQ.qIndex}</span>
            <span>|</span>
            <span>MULTIPLE CHOICE</span>
            <span>|</span>
            <span>{currentQ.marks} MARKS</span>
            <span>|</span>
            <span style={{ color: emerald, fontWeight: 700 }}>
              VERIFIED PASSAGE GROUNDING: {Math.round(currentQ.groundingConfidence * 100)}%
            </span>
          </div>
          <div style={{ fontSize: 14, color: slate, lineHeight: 1.75, fontWeight: 500 }}>
            {currentQ.question}
          </div>
        </div>

        {/* Options List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {currentQ.options.map((opt) => {
            const isSel = answers[currentIdx] === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "14px 18px",
                  border: `1px solid ${isSel ? coral : border}`,
                  background: isSel ? "#FFF5F3" : "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: `1px solid ${isSel ? coral : border}`,
                    background: isSel ? coral : bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono, monospace",
                    color: isSel ? "#fff" : muted,
                    flexShrink: 0,
                  }}
                >
                  {opt.key}
                </div>
                <div style={{ fontSize: 13, color: slate, lineHeight: 1.6, paddingTop: 3 }}>
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation & Submission Action Bar */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((c) => Math.max(0, c - 1))}
            style={{
              padding: "10px 20px",
              border: `1px solid ${border}`,
              background: "#fff",
              fontSize: 13,
              fontWeight: 600,
              color: currentIdx === 0 ? "#CBD5E1" : muted,
              cursor: currentIdx === 0 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          {currentIdx < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIdx((c) => Math.min(totalQuestions - 1, c + 1))}
              style={{
                padding: "10px 24px",
                border: `1px solid ${slate}`,
                background: slate,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 30px",
                border: "none",
                background: emerald,
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
              }}
            >
              Finish & Calculate Mastery Score ✓
            </button>
          )}

          <button
            onClick={() => showToast(`Question ${currentQ.qIndex} flagged for instructor review`)}
            style={{
              marginLeft: "auto",
              padding: "10px 18px",
              border: `1px solid ${border}`,
              background: "#fff",
              fontSize: 11,
              color: muted,
              cursor: "pointer",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Flag for Review ⚐
          </button>
        </div>
      </div>

      {/* RAG Source Evidence Drawer */}
      {drawerOpen && (
        <div
          style={{
            width: 380,
            minWidth: 380,
            background: panel,
            borderLeft: `1px solid ${border}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, background: "#fff" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: slate, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em" }}>
              AUTHORITATIVE RAG EVIDENCE
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
              Retrieved context validating Question {currentQ.qIndex}
            </div>
          </div>

          <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
            {/* Primary Document Meta */}
            <div style={{ background: "#fff", border: `1px solid ${border}`, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: muted, letterSpacing: "0.1em", fontFamily: "JetBrains Mono, monospace", marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>
                SOURCE METADATA
              </div>
              {[
                ["Source Document", currentQ.sourceDocument],
                ["Page Number", `Page ${currentQ.sourcePage}`],
                ["Section", currentQ.sourceSection],
                ["Grounding Confidence", `${Math.round(currentQ.groundingConfidence * 100)}% Verified`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11, borderBottom: `1px solid ${panel}` }}>
                  <span style={{ color: muted }}>{k}</span>
                  <span style={{ color: slate, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Verified Passage Quote */}
            <div style={{ background: "#F0FDF4", border: `1px solid ${emerald}`, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: emerald, fontWeight: 700, marginBottom: 6 }}>
                VERIFIED SOURCE PASSAGE
              </div>
              <div style={{ fontSize: 12, color: slate, lineHeight: 1.65, fontStyle: "italic" }}>
                "{currentQ.verifiedPassage}"
              </div>
            </div>

            {/* AI Explanation Boundary */}
            <div style={{ background: "#fff", border: `1px solid ${border}`, padding: 16 }}>
              <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: muted, fontWeight: 700, marginBottom: 6 }}>
                AI EXPLANATION (INTERPRETATION LAYER)
              </div>
              <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>
                {currentQ.explanation}
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: muted, fontFamily: "JetBrains Mono, monospace" }}>
                Notice: AI interprets retrieved context; factual scoring is deterministic.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
