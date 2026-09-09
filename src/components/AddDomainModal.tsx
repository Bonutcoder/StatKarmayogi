import React, { useState } from "react";
import { LEARNING_DOMAINS, DOMAIN_COURSES, LearningDomain, DomainCourse, DomainEnrollment, getCoursesByDomain } from "../data/domainData";
import { slate, coral, emerald, muted, border, panel, bg } from "./AppShell";

export default function AddDomainModal({
  isOpen,
  onClose,
  onSaveDomain,
  existingEnrollments = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaveDomain: (enrollment: DomainEnrollment) => void;
  existingEnrollments?: DomainEnrollment[];
}) {
  const [selectedDomain, setSelectedDomain] = useState<LearningDomain | null>(null);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleSelectDomain = (d: LearningDomain) => {
    setSelectedDomain(d);
    // Pre-populate if already enrolled
    const existing = existingEnrollments.find((e) => e.domainId === d.id);
    if (existing) {
      setCompletedCourseIds(existing.selectedCourseIds);
    } else {
      setCompletedCourseIds([]);
    }
    setStep(2);
  };

  const handleToggleCourse = (courseId: string) => {
    setCompletedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleSelectAll = (courses: DomainCourse[]) => {
    setCompletedCourseIds(courses.map((c) => c.id));
  };

  const handleClearAll = () => {
    setCompletedCourseIds([]);
  };

  const handleSave = () => {
    if (!selectedDomain) return;
    const allDomainCourses = getCoursesByDomain(selectedDomain.id);
    const targetCourseIds = allDomainCourses
      .map((c) => c.id)
      .filter((id) => !completedCourseIds.includes(id));

    const enrollment: DomainEnrollment = {
      domainId: selectedDomain.id,
      domainName: selectedDomain.name,
      icon: selectedDomain.icon,
      category: selectedDomain.category,
      selectedCourseIds: completedCourseIds,
      targetCourseIds,
      enrolledAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    onSaveDomain(enrollment);
    onClose();
  };

  const domainCourses = selectedDomain ? getCoursesByDomain(selectedDomain.id) : [];
  const remainingCount = domainCourses.length - completedCourseIds.length;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 39, 68, 0.55)",
        backdropFilter: "blur(3px)",
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
          maxWidth: step === 1 ? 840 : 920,
          maxHeight: "90vh",
          background: "#fff",
          border: `2px solid ${coral}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FAFCFE",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: coral,
                fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              DOMAIN COMPETENCY ENROLLMENT · STEP {step} OF 2
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: slate, marginTop: 2 }}>
              {step === 1 ? "Select Domain / Stream to Learn" : `Configure Courses · ${selectedDomain?.name}`}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: muted,
              fontSize: 22,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {step === 1 ? (
            <div>
              <div style={{ fontSize: 13, color: muted, marginBottom: 18, lineHeight: 1.5 }}>
                Select a learning domain from the 7 curated official competency streams. You will be able to check off courses you have already completed, and the remaining courses will automatically populate your <b>Dashboard</b> and <b>Skill Gaps</b>.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 14 }}>
                {LEARNING_DOMAINS.map((domain) => {
                  const courses = getCoursesByDomain(domain.id);
                  const isEnrolled = existingEnrollments.some((e) => e.domainId === domain.id);
                  const existing = existingEnrollments.find((e) => e.domainId === domain.id);

                  return (
                    <div
                      key={domain.id}
                      onClick={() => handleSelectDomain(domain)}
                      style={{
                        padding: 18,
                        background: isEnrolled ? "#F0FDF4" : "#fff",
                        border: `1.5px solid ${isEnrolled ? emerald : border}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all 0.18s",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = coral;
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = isEnrolled ? emerald : border;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <span style={{ fontSize: 26 }}>{domain.icon}</span>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                fontSize: 10,
                                fontWeight: 700,
                                fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                                background: domain.category === "Core" ? "#D1FAE5" : domain.category === "Advanced" ? "#EDE9FE" : panel,
                                color: domain.category === "Core" ? emerald : domain.category === "Advanced" ? "#6D28D9" : muted,
                                border: `1px solid ${border}`,
                                borderRadius: 3,
                              }}
                            >
                              {domain.category}
                            </span>
                            {isEnrolled && (
                              <span
                                style={{
                                  padding: "2px 8px",
                                  fontSize: 10,
                                  fontWeight: 800,
                                  background: emerald,
                                  color: "#fff",
                                  borderRadius: 3,
                                }}
                              >
                                ACTIVE ({existing?.selectedCourseIds.length}/{courses.length})
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ fontSize: 15, fontWeight: 700, color: slate, marginBottom: 4 }}>
                          {domain.name}
                        </div>
                        <div style={{ fontSize: 12, color: muted, lineHeight: 1.45, marginBottom: 12 }}>
                          {domain.desc}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: 10,
                          borderTop: `1px solid ${border}`,
                          fontSize: 11,
                          fontWeight: 700,
                          color: coral,
                        }}
                      >
                        <span>{courses.length} Official Courses</span>
                        <span>Configure Stream →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {/* Step 2: Course Selection */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "#FFF5F3",
                  border: `1px solid ${coral}`,
                  borderRadius: 6,
                  marginBottom: 18,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: slate }}>
                    Mark Completed Courses
                  </div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                    Check off courses you have already completed. The unselected courses will be added to your <b>Dashboard</b> & <b>Skill Gaps</b>.
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(domainCourses)}
                    style={{
                      padding: "4px 10px",
                      background: "#fff",
                      border: `1px solid ${border}`,
                      fontSize: 11,
                      fontWeight: 700,
                      color: slate,
                      cursor: "pointer",
                      borderRadius: 4,
                    }}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    style={{
                      padding: "4px 10px",
                      background: "#fff",
                      border: `1px solid ${border}`,
                      fontSize: 11,
                      fontWeight: 700,
                      color: muted,
                      cursor: "pointer",
                      borderRadius: 4,
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Course Checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
                {domainCourses.map((c) => {
                  const isChecked = completedCourseIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleToggleCourse(c.id)}
                      style={{
                        padding: "14px 16px",
                        border: `1.5px solid ${isChecked ? emerald : border}`,
                        background: isChecked ? "#F0FDF4" : "#fff",
                        borderRadius: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        transition: "all 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div onClick
                        style={{
                          marginTop: 3,
                          width: 17,
                          height: 17,
                          accentColor: emerald,
                          cursor: "pointer",
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: slate }}>
                            {c.title}
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                fontSize: 10,
                                fontWeight: 700,
                                background: panel,
                                border: `1px solid ${border}`,
                                color: muted,
                                fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                              }}
                            >
                              Level {c.level} · {c.duration_hours}h
                            </span>
                            <span
                              style={{
                                padding: "2px 8px",
                                fontSize: 10,
                                fontWeight: 800,
                                background: isChecked ? "#D1FAE5" : "#FFF5F3",
                                border: `1px solid ${isChecked ? emerald : coral}`,
                                color: isChecked ? emerald : coral,
                                borderRadius: 3,
                                fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                              }}
                            >
                              {isChecked ? "COMPLETED ✓" : "TO COMPLETE →"}
                            </span>
                          </div>
                        </div>

                        <div style={{ fontSize: 11, color: muted, lineHeight: 1.45 }}>
                          {c.description}
                        </div>

                        <div style={{ fontSize: 10, color: muted, marginTop: 4, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                          Provider: <b>{c.provider}</b>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: `1px solid ${border}`,
            background: "#FAFCFE",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                padding: "8px 18px",
                background: "#fff",
                border: `1px solid ${border}`,
                color: slate,
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              ← Back to Domains
            </button>
          ) : (
            <div style={{ fontSize: 12, color: muted }}>
              Click any domain above to begin course configuration.
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 12, textAlign: "right" }}>
                <span style={{ color: emerald, fontWeight: 700 }}>{completedCourseIds.length} Completed</span>
                <span style={{ color: muted }}> · </span>
                <span style={{ color: coral, fontWeight: 700 }}>{remainingCount} Skill Gaps</span>
              </div>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: "9px 24px",
                  background: coral,
                  border: `1px solid ${coral}`,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 4,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(255, 111, 89, 0.3)",
                }}
              >
                Enroll Domain & Generate Skill Gaps ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
