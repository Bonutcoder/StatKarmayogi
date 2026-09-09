import React, { useState } from "react";
import { CourseContentDetail, getCourseContent } from "../data/courseContentData";
import { getCourseAssessmentRecord } from "../services/courseAssessmentService";
import { generateCourseSyllabusPdf, generateModulePdf } from "../utils/pdfGenerator";
import { slate, coral, emerald, muted, border, panel, bg } from "./AppShell";

export default function CourseContentModal({
  courseId,
  isOpen,
  onClose,
  onStartAssessment,
}: {
  courseId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onStartAssessment: (courseId: string, tier: "easy" | "medium" | "difficult") => void;
}) {
  if (!isOpen || !courseId) return null;

  const content = getCourseContent(courseId);
  const [activeTab, setActiveTab] = useState<"modules" | "assessments" | "overview">("modules");
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  if (!content) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 39, 68, 0.5)",
          backdropFilter: "blur(3px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
        }}
      >
        <div style={{ background: "#fff", padding: 24, borderRadius: 8, maxWidth: 450, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: slate, marginBottom: 8 }}>Course Syllabus Not Found</div>
          <button onClick={onClose} style={{ padding: "6px 16px", background: coral, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const assessmentRecord = getCourseAssessmentRecord(courseId);
  const easyPassed = assessmentRecord.easy?.passed ?? false;
  const mediumPassed = assessmentRecord.medium?.passed ?? false;
  const difficultPassed = assessmentRecord.difficult?.passed ?? false;
  const allPassed = assessmentRecord.allTiersPassed;

  const activeModule = content.modules[activeModuleIndex] || content.modules[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 39, 68, 0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          maxHeight: "90vh",
          background: "#fff",
          border: `2px solid ${border}`,
          borderRadius: 8,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${border}`,
            background: "#FAFCFE",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span
                style={{
                  padding: "2px 8px",
                  background: "#D1FAE5",
                  border: `1px solid ${emerald}`,
                  color: emerald,
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                iGOT VERIFIED
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  background: panel,
                  border: `1px solid ${border}`,
                  fontSize: 10,
                  fontWeight: 600,
                  color: muted,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Level {content.level} · {content.category}
              </span>
              <span style={{ fontSize: 11, color: muted }}>{content.domainName}</span>
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: slate, lineHeight: 1.3 }}>
              {content.title}
            </div>

            <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>
              Provider: <span style={{ color: slate, fontWeight: 600 }}>{content.provider}</span> · Total Duration:{" "}
              <span style={{ color: slate, fontWeight: 600 }}>{content.duration_hours} Hours</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => generateCourseSyllabusPdf(content)}
              style={{
                padding: "6px 14px",
                background: "#fff",
                border: `1px solid ${coral}`,
                color: coral,
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 4,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 6px rgba(255, 111, 89, 0.15)",
              }}
            >
              <span>📥</span>
              <span>Download Syllabus (PDF)</span>
            </button>

            {allPassed ? (
              <span
                style={{
                  padding: "4px 12px",
                  background: "#D1FAE5",
                  border: `1px solid ${emerald}`,
                  color: emerald,
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 4,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                ✓ COURSE COMPLETED
              </span>
            ) : (
              <span
                style={{
                  padding: "4px 12px",
                  background: "#FFF5F3",
                  border: `1px solid ${coral}`,
                  color: coral,
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 4,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {[easyPassed, mediumPassed, difficultPassed].filter(Boolean).length} / 3 TIERS PASSED
              </span>
            )}

            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: muted,
                fontSize: 22,
                cursor: "pointer",
                padding: "0 4px",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottom: `1px solid ${border}`, background: "#fff" }}>
          {[
            { id: "modules", label: `Curriculum Modules (${content.modules.length})` },
            { id: "assessments", label: "3-Tier Assessments (Easy, Medium, Hard)" },
            { id: "overview", label: "Objectives & Standards" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: "12px 22px",
                border: "none",
                borderBottom: activeTab === t.id ? `2px solid ${coral}` : "2px solid transparent",
                background: "transparent",
                color: activeTab === t.id ? coral : slate,
                fontSize: 12,
                fontWeight: activeTab === t.id ? 700 : 600,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {activeTab === "modules" && (
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
              {/* Module List Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {content.modules.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => setActiveModuleIndex(idx)}
                    style={{
                      padding: "12px 14px",
                      border: `1px solid ${activeModuleIndex === idx ? coral : border}`,
                      background: activeModuleIndex === idx ? "#FFF5F3" : "#fff",
                      cursor: "pointer",
                      borderRadius: 6,
                    }}
                  >
                    <div style={{ fontSize: 10, color: muted, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 2 }}>
                      MODULE {idx + 1} · {m.duration}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: activeModuleIndex === idx ? coral : slate, lineHeight: 1.35 }}>
                      {m.title.replace(/^Module \d+:\s*/, "")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Module Content Detail */}
              <div style={{ background: "#FAFCFE", border: `1px solid ${border}`, padding: "20px 24px", borderRadius: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: slate, marginBottom: 8 }}>
                  {activeModule.title}
                </div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 14 }}>
                  Estimated Study Time: <b>{activeModule.duration}</b> · Standard Operating Guidance
                </div>

                <div style={{ fontSize: 13, color: slate, lineHeight: 1.65, marginBottom: 20 }}>
                  {activeModule.content}
                </div>

                <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "16px 18px", borderRadius: 6, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: muted, letterSpacing: "0.06em", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 10 }}>
                    KEY STATUTORY & TECHNICAL TAKEAWAYS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: slate, display: "flex", flexDirection: "column", gap: 6, lineHeight: 1.5 }}>
                    {activeModule.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={() => generateModulePdf(content, activeModuleIndex)}
                    style={{
                      padding: "7px 14px",
                      background: "#fff",
                      border: `1px solid ${border}`,
                      color: slate,
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>📄</span>
                    <span>Download Module {activeModuleIndex + 1} Notes (PDF)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("assessments")}
                    style={{
                      padding: "8px 16px",
                      background: coral,
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Take Course Assessments →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "assessments" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: slate }}>Course Assessment Progression</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                  Pass all 3 difficulty tiers (minimum 70% per tier) to achieve official certification and mark this course completed.
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  {
                    tier: "easy" as const,
                    badge: "TIER 1 · EASY",
                    title: "Foundations & Concepts",
                    desc: content.assessments.easy.description,
                    questionsCount: content.assessments.easy.questions.length,
                    duration: "10 mins",
                    result: assessmentRecord.easy,
                  },
                  {
                    tier: "medium" as const,
                    badge: "TIER 2 · MEDIUM",
                    title: "Applied Methodologies",
                    desc: content.assessments.medium.description,
                    questionsCount: content.assessments.medium.questions.length,
                    duration: "15 mins",
                    result: assessmentRecord.medium,
                  },
                  {
                    tier: "difficult" as const,
                    badge: "TIER 3 · DIFFICULT",
                    title: "Advanced Scenarios & Audits",
                    desc: content.assessments.difficult.description,
                    questionsCount: content.assessments.difficult.questions.length,
                    duration: "20 mins",
                    result: assessmentRecord.difficult,
                  },
                ].map((tierItem) => {
                  const passed = tierItem.result?.passed ?? false;
                  const attempted = tierItem.result !== undefined;

                  return (
                    <div
                      key={tierItem.tier}
                      style={{
                        background: "#fff",
                        border: `1px solid ${passed ? emerald : border}`,
                        borderRadius: 6,
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        boxShadow: passed ? "0 4px 12px rgba(5, 150, 105, 0.08)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            border: `1px solid ${passed ? emerald : border}`,
                            background: passed ? "#D1FAE5" : panel,
                            color: passed ? emerald : muted,
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {tierItem.badge}
                        </span>
                        <span style={{ fontSize: 11, color: muted, fontFamily: "'Space Grotesk', sans-serif" }}>
                          {tierItem.duration}
                        </span>
                      </div>

                      <div style={{ fontSize: 14, fontWeight: 800, color: slate, marginBottom: 4 }}>
                        {tierItem.title}
                      </div>

                      <div style={{ fontSize: 11, color: muted, lineHeight: 1.45, marginBottom: 16 }}>
                        {tierItem.desc}
                      </div>

                      <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${border}` }}>
                        {attempted ? (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <span style={{ fontSize: 11, color: muted }}>Latest Score:</span>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: passed ? emerald : coral,
                                fontFamily: "'Space Grotesk', sans-serif",
                              }}
                            >
                              {tierItem.result?.score}% ({passed ? "PASSED" : "FAILED"})
                            </span>
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: muted, marginBottom: 10 }}>
                            Not yet attempted · {tierItem.questionsCount} Questions
                          </div>
                        )}

                        <button
                          onClick={() => {
                            onClose();
                            onStartAssessment(courseId, tierItem.tier);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 0",
                            background: passed ? "#D1FAE5" : coral,
                            border: `1px solid ${passed ? emerald : coral}`,
                            color: passed ? emerald : "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          {passed ? "Retake Assessment" : "Start Assessment →"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {allPassed && (
                <div
                  style={{
                    marginTop: 20,
                    padding: "16px 20px",
                    background: "#D1FAE5",
                    border: `1px solid ${emerald}`,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 24 }}>🏆</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: emerald }}>
                      Full Course Competency Verified!
                    </div>
                    <div style={{ fontSize: 11, color: slate, marginTop: 2 }}>
                      You have successfully passed Easy, Medium, and Difficult assessments for this course. Your competency records and cadre progress have been updated.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#FAFCFE", border: `1px solid ${border}`, padding: "18px 20px", borderRadius: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: slate, marginBottom: 6 }}>Executive Course Overview</div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>{content.overview}</div>
              </div>

              <div style={{ background: "#fff", border: `1px solid ${border}`, padding: "18px 20px", borderRadius: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: slate, marginBottom: 10 }}>Learning Objectives & Competency Outcomes</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: slate, display: "flex", flexDirection: "column", gap: 8, lineHeight: 1.5 }}>
                  {content.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
