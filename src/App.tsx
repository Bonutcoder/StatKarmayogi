import React, { useState, useEffect } from "react";
import { Tab, UserProfile, AssessmentSubmission } from "./types";
import { TopBar, Sidebar, Toast, NotifPanel, bg } from "./components/AppShell";
import { checkCoreHealth, clearSession, completeGithubLogin } from "./services/coreApi";
import { DomainEnrollment } from "./data/domainData";
import {
  loadDomainEnrollments,
  removeLegacyDemoDomainEnrollments,
  saveDomainEnrollment,
  markCourseCompleted,
} from "./services/domainService";
import AddDomainModal from "./components/AddDomainModal";
import CourseContentModal from "./components/CourseContentModal";

// Modular Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CompetenciesPage from "./pages/CompetenciesPage";
import SkillGapsPage from "./pages/SkillGapsPage";
import LearningPage from "./pages/LearningPage";
import AssessmentsPage from "./pages/AssessmentsPage";
import AssessmentResultPage from "./pages/AssessmentResultPage";
import AssessmentReviewPage from "./pages/AssessmentReviewPage";
import EvidenceAuditPage from "./pages/EvidenceAuditPage";
import TrainingMaterialsPage from "./pages/TrainingMaterialsPage";
import CourseIntegrationPage from "./pages/CourseIntegrationPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [tab, setTab] = useState<Tab>("landing");
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem("statkarmayogi.user_profile");
      if (saved) return JSON.parse(saved);
    } catch { }
    return null;
  });
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<AssessmentSubmission | null>(null);
  const [showPersonaPicker, setShowPersonaPicker] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean>(false);

  // Domain Streams & Assessment states
  const [domainEnrollments, setDomainEnrollments] = useState<DomainEnrollment[]>(() =>
    loadDomainEnrollments()
  );
  const [isAddDomainModalOpen, setIsAddDomainModalOpen] = useState<boolean>(false);
  const [activeAssessmentCourseId, setActiveAssessmentCourseId] = useState<string | undefined>(undefined);
  const [activeAssessmentTier, setActiveAssessmentTier] = useState<"easy" | "medium" | "difficult">("easy");
  const [studyModalCourseId, setStudyModalCourseId] = useState<string | null>(null);
  const [ragAssessmentSource, setRagAssessmentSource] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (removeLegacyDemoDomainEnrollments()) {
      setDomainEnrollments([]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleRefreshApi = async () => {
    const status = await checkCoreHealth();
    setApiOnline(status.online);
    if (status.online) {
      showToast(`Connected to FastAPI Backend (v${status.version || "1.0.0"}) on Port 8000.`);
    } else {
      showToast("Backend Server is offline. Live data is unavailable.");
    }
  };

  useEffect(() => {
    checkCoreHealth().then((status) => {
      setApiOnline(status.online);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const githubToken = params.get("github_token");
    const oauthError = params.get("oauth_error");
    if (oauthError) {
      window.history.replaceState(null, "", window.location.pathname);
      showToast(`GitHub sign-in failed: ${oauthError}`);
      return;
    }
    if (!githubToken) return;
    completeGithubLogin(githubToken)
      .then((profile) => {
        setUser(profile);
        setTab("dashboard");
        showToast(`Welcome, ${profile.name}`);
      })
      .catch(() => showToast("GitHub sign-in could not establish a platform session."))
      .finally(() => window.history.replaceState(null, "", window.location.pathname));
  }, []);

  const handleSetTab = (t: Tab) => {
    setTab(t);
    setSearch("");
    setShowNotif(false);
  };

  const handleLogout = () => {
    clearSession();
    handleSetTab("landing");
    showToast("Logged out successfully. Secure session ended.");
  };

  const handleUpdateUser = (updatedFields: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updatedFields };
      try {
        sessionStorage.setItem("statkarmayogi.user_profile", JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const handleAssessmentSubmit = (sub: AssessmentSubmission) => {
    setLatestSubmission(sub);
    // Refresh domain enrollments if updated
    setDomainEnrollments(loadDomainEnrollments());
  };

  const handleSaveDomainEnrollment = (domainId: string, completedCourseIds: string[]) => {
    const updated = saveDomainEnrollment(domainId, completedCourseIds);
    setDomainEnrollments(updated);
    showToast("Domain stream updated successfully! Dashboard & Skill Gaps recalculated.");
  };

  const handleMarkCourseCompleted = (courseId: string) => {
    const updated = markCourseCompleted(courseId);
    setDomainEnrollments(updated);
    showToast("Course marked as completed! Competency level updated.");
  };

  const handleLaunchAssessment = (courseId: string, tier: "easy" | "medium" | "difficult" = "easy") => {
    // Clear any local RAG source so iGOT course uses its own built-in questions
    setRagAssessmentSource(null);
    setActiveAssessmentCourseId(courseId);
    setActiveAssessmentTier(tier);
    handleSetTab("assessments");
  };

  const handleGenerateDocumentAssessment = (document: { id: string; title: string }) => {
    setRagAssessmentSource(document);
    handleSetTab("assessments");
  };

  // If public landing page is active
  if (tab === "landing") {
    return (
      <>
        <LandingPage
          onLogin={() => handleSetTab("login")}
          onSignUp={() => handleSetTab("signup")}
        />
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </>
    );
  }

  // If login or signup page is active
  if (tab === "login" || tab === "signup") {
    return (
      <>
        <LoginPage
          initialMode={tab === "signup" ? "signup" : "login"}
          onLoginSuccess={(u) => {
            setUser(u);
            try {
              sessionStorage.setItem("statkarmayogi.user_profile", JSON.stringify(u));
            } catch { }
            handleSetTab("dashboard");
            showToast(`Welcome, ${u.name} (${u.role})`);
          }}
          onBackToLanding={() => handleSetTab("landing")}
        />
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </>
    );
  }

  if (!user) {
    return <LoginPage initialMode="login" onLoginSuccess={(u) => { setUser(u); handleSetTab("dashboard"); }} onBackToLanding={() => handleSetTab("landing")} />;
  }

  // Internal Official Platform Workspace
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: bg,
      }}
    >
      {/* Main Workspace Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar tab={tab} setTab={handleSetTab} user={user} onLogout={handleLogout} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          <TopBar
            search={search}
            setSearch={setSearch}
            onNotif={() => setShowNotif((v) => !v)}
            user={user}
          />

          {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}

          {/* Active Screen Router */}
          <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {tab === "dashboard" && (
              <DashboardPage
                user={user}
                setTab={handleSetTab}
                domainEnrollments={domainEnrollments}
                onOpenAddDomain={() => setIsAddDomainModalOpen(true)}
                onMarkCourseCompleted={handleMarkCourseCompleted}
                onLaunchAssessment={handleLaunchAssessment}
                onViewCourseContent={(cId) => setStudyModalCourseId(cId)}
              />
            )}
            {tab === "competencies" && (
              <CompetenciesPage
                search={search}
                domainEnrollments={domainEnrollments}
                onOpenAddDomain={() => setIsAddDomainModalOpen(true)}
              />
            )}
            {tab === "skill-gaps" && (
              <SkillGapsPage
                search={search}
                setTab={handleSetTab}
                domainEnrollments={domainEnrollments}
                onOpenAddDomain={() => setIsAddDomainModalOpen(true)}
                onMarkCourseCompleted={handleMarkCourseCompleted}
              />
            )}
            {tab === "learning" && (
              <LearningPage
                search={search}
                showToast={showToast}
                domainEnrollments={domainEnrollments}
                onOpenAddDomain={() => setIsAddDomainModalOpen(true)}
                onMarkCourseCompleted={handleMarkCourseCompleted}
                onLaunchAssessment={handleLaunchAssessment}
              />
            )}
            {tab === "assessments" && (
              <AssessmentsPage
                initialCourseId={activeAssessmentCourseId}
                initialTier={activeAssessmentTier}
                onSubmitAssessment={handleAssessmentSubmit}
                showToast={showToast}
                onCourseCompleted={handleMarkCourseCompleted}
                ragAssessmentSource={ragAssessmentSource}
                onRagAssessmentStarted={() => undefined}
              />
            )}
            {tab === "assessment-result" && (
              <AssessmentResultPage submission={latestSubmission} setTab={handleSetTab} />
            )}
            {tab === "assessment-review" && (
              <AssessmentReviewPage setTab={handleSetTab} />
            )}
            {tab === "evidence-audit" && <EvidenceAuditPage setTab={handleSetTab} />}
            {tab === "materials" && (
              <TrainingMaterialsPage search={search} showToast={showToast} onGenerateAssessment={handleGenerateDocumentAssessment} />
            )}
            {tab === "integrations" && (
              <CourseIntegrationPage showToast={showToast} />
            )}
            {tab === "settings" && (
              <SettingsPage
                user={user}
                showToast={showToast}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </main>
        </div>
      </div>

      {/* Add Domain / Learning Stream Modal */}
      {isAddDomainModalOpen && (
        <AddDomainModal
          isOpen={isAddDomainModalOpen}
          onClose={() => setIsAddDomainModalOpen(false)}
          onSaveDomain={(enrollment) =>
            handleSaveDomainEnrollment(enrollment.domainId, enrollment.selectedCourseIds)
          }
          existingEnrollments={domainEnrollments}
        />
      )}

      {/* Course Study & Syllabus Modal */}
      {studyModalCourseId && (
        <CourseContentModal
          courseId={studyModalCourseId}
          isOpen={Boolean(studyModalCourseId)}
          onClose={() => setStudyModalCourseId(null)}
          onStartAssessment={(cId, tier) => {
            setStudyModalCourseId(null);
            handleLaunchAssessment(cId, tier);
          }}
        />
      )}

      {/* Persona Switcher Modal */}
      {showPersonaPicker && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 39, 68, 0.4)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#fff",
              border: "2px solid #FF6F59",
              padding: 24,
              boxShadow: "0 14px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#2C302E" }}>
                Switch Official Persona
              </div>
              <button
                onClick={() => setShowPersonaPicker(false)}
                style={{ background: "none", border: "none", color: "#64748B", fontSize: 18, cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 18, color: "#64748B", fontSize: 13 }}>
              Persona switching is disabled because the connected backend session is authoritative.
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
