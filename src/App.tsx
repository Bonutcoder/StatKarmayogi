import React, { useState } from "react";
import { Tab, UserProfile, AssessmentSubmission } from "./types";
import { initialProfiles } from "./data/mockData";
import { GovStrip, TopBar, Sidebar, Toast, NotifPanel, bg } from "./components/AppShell";

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
import TrainingMaterialsPage from "./pages/TrainingMaterialsPage";
import EmployeesAdminPage from "./pages/EmployeesAdminPage";
import CourseIntegrationPage from "./pages/CourseIntegrationPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AuditPage from "./pages/AuditPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [tab, setTab] = useState<Tab>("landing");
  const [user, setUser] = useState<UserProfile>(initialProfiles[0]);
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<AssessmentSubmission | null>(null);
  const [showPersonaPicker, setShowPersonaPicker] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleSetTab = (t: Tab) => {
    setTab(t);
    setSearch("");
    setShowNotif(false);
  };

  const handleAssessmentSubmit = (sub: AssessmentSubmission) => {
    setLatestSubmission(sub);
    setTab("assessment-result");
  };

  // If public landing page is active
  if (tab === "landing") {
    return (
      <>
        <LandingPage
          onEnterPortal={() => handleSetTab("dashboard")}
          onLogin={() => handleSetTab("login")}
        />
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </>
    );
  }

  // If login page is active
  if (tab === "login") {
    return (
      <>
        <LoginPage
          onLoginSuccess={(u) => {
            setUser(u);
            handleSetTab("dashboard");
            showToast(`Welcome back, ${u.name} (${u.role})`);
          }}
          onBackToLanding={() => handleSetTab("landing")}
        />
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </>
    );
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
      {/* Official Government Strip */}
      <GovStrip
        user={user}
        onGoToLanding={() => handleSetTab("landing")}
        onSwitchPersona={() => setShowPersonaPicker(true)}
      />

      {/* Main Workspace Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar tab={tab} setTab={handleSetTab} user={user} />

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
              <DashboardPage user={user} setTab={handleSetTab} />
            )}
            {tab === "competencies" && (
              <CompetenciesPage search={search} />
            )}
            {tab === "skill-gaps" && (
              <SkillGapsPage search={search} setTab={handleSetTab} />
            )}
            {tab === "learning" && (
              <LearningPage search={search} showToast={showToast} />
            )}
            {tab === "assessments" && (
              <AssessmentsPage onSubmitAssessment={handleAssessmentSubmit} showToast={showToast} />
            )}
            {tab === "assessment-result" && (
              <AssessmentResultPage submission={latestSubmission} setTab={handleSetTab} />
            )}
            {tab === "assessment-review" && (
              <AssessmentReviewPage />
            )}
            {tab === "materials" && (
              <TrainingMaterialsPage search={search} showToast={showToast} />
            )}
            {tab === "employees" && (
              <EmployeesAdminPage search={search} showToast={showToast} />
            )}
            {tab === "integrations" && (
              <CourseIntegrationPage showToast={showToast} />
            )}
            {tab === "analytics" && (
              <AnalyticsPage search={search} />
            )}
            {tab === "audit" && (
              <AuditPage search={search} />
            )}
            {tab === "settings" && (
              <SettingsPage user={user} showToast={showToast} />
            )}
          </main>
        </div>
      </div>

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

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {initialProfiles.map((p) => {
                const active = user.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setUser(p);
                      setShowPersonaPicker(false);
                      showToast(`Switched active profile to ${p.name} (${p.role})`);
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      border: `1px solid ${active ? "#FF6F59" : "#E2E8F0"}`,
                      background: active ? "#FFF5F3" : "#F8FAFC",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#2C302E" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>{p.roleTitle}</div>
                    </div>
                    <span
                      style={{
                        padding: "3px 8px",
                        border: "1px solid #E2E8F0",
                        background: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2C302E",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {p.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
