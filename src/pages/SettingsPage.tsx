import React, { useState, useEffect, ReactNode } from "react";
import { UserProfile } from "../types";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { ConfirmModal } from "../components/UIStates";

export default function SettingsPage({
  user,
  showToast,
  onLogout,
  onUpdateUser,
}: {
  user: UserProfile;
  showToast: (m: string) => void;
  onLogout?: () => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}) {
  const [notifications, setNotifications] = useState(true);
  const [digest, setDigest] = useState(false);
  const [twofa, setTwofa] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(true);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [designation, setDesignation] = useState(user.roleTitle || user.grade || "");
  const [ministry, setMinistry] = useState(user.department || "");
  const [grade, setGrade] = useState(user.grade || "");
  const [cadre, setCadre] = useState(user.cadre || "");

  // Sync state if user prop changes externally
  useEffect(() => {
    setName(user.name || "");
    setDesignation(user.roleTitle || user.grade || "");
    setMinistry(user.department || "");
    setGrade(user.grade || "");
    setCadre(user.cadre || "");
  }, [user]);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      showToast("Name cannot be empty");
      return;
    }
    const updated = {
      name: name.trim(),
      roleTitle: designation.trim() || user.roleTitle,
      grade: grade.trim() || designation.trim() || user.grade,
      department: ministry.trim() || user.department,
      cadre: cadre.trim() || user.cadre,
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setIsEditing(false);
    showToast("Profile details updated successfully.");
  };

  const handleCancelEdit = () => {
    setName(user.name || "");
    setDesignation(user.roleTitle || user.grade || "");
    setMinistry(user.department || "");
    setGrade(user.grade || "");
    setCadre(user.cadre || "");
    setIsEditing(false);
  };

  const commonDesignations = [
    "Senior Statistical Officer (SSO)",
    "Junior Statistical Officer (JSO)",
    "Joint Director",
    "Deputy Director",
    "Director / Research Officer",
    "Chief Data Analyst",
  ];

  const commonMinistries = [
    "Statistics & Programme Implementation",
    "National Statistical Office (NSO)",
    "Data Informatics and Innovation Division (DIID)",
    "National Accounts Division (NAD)",
    "National Sample Survey Office (NSSO)",
  ];

  const Toggle = ({ on, toggle, size = "sm" }: { on: boolean; toggle: () => void; size?: "sm" | "lg" }) => {
    const w = size === "lg" ? 56 : 44;
    const h = size === "lg" ? 30 : 24;
    const d = size === "lg" ? 22 : 16;
    const off = size === "lg" ? 5 : 4;
    const onPos = size === "lg" ? w - d - off : w - d - 3;
    return (
      <button
        type="button"
        onClick={toggle}
        style={{
          width: w,
          height: h,
          border: `2px solid ${on ? coral : border}`,
          background: on ? coral : panel,
          cursor: "pointer",
          position: "relative",
          flexShrink: 0,
          transition: "background 0.18s, border-color 0.18s",
        }}
      >
        <div
          style={{
            width: d,
            height: d,
            background: "#fff",
            position: "absolute",
            top: off - 1,
            left: on ? onPos : off - 1,
            transition: "left 0.18s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    );
  };

  const Section = ({
    title,
    action,
    children,
  }: {
    title: string;
    action?: ReactNode;
    children: ReactNode;
  }) => (
    <div style={{ background: "#fff", border: `1px solid ${border}`, marginBottom: 16 }}>
      <div
        style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${border}`,
          fontSize: 11,
          fontWeight: 700,
          color: muted,
          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{title}</span>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );

  const Row = ({
    label,
    sub,
    control,
    highlight,
  }: {
    label: string;
    sub: string;
    control: ReactNode;
    highlight?: boolean;
  }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: `1px solid ${border}`,
        background: highlight ? "#FFF5F3" : "transparent",
        borderLeft: highlight ? `3px solid ${coral}` : "3px solid transparent",
      }}
    >
      <div style={{ flex: 1, paddingRight: 20 }}>
        <div style={{ fontSize: 13, fontWeight: highlight ? 700 : 600, color: slate }}>{label}</div>
        <div style={{ fontSize: 11, color: muted, marginTop: 3, maxWidth: 460, lineHeight: 1.5 }}>{sub}</div>
      </div>
      <div>{control}</div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
      <div style={{ marginBottom: 22, paddingBottom: 14, borderBottom: `1px solid ${border}` }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Settings & Configuration</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
          Platform preferences and account configuration · {user.email}
        </div>
      </div>

      <div style={{ maxWidth: 780 }}>
        {/* Profile Section */}
        <Section
          title="ACCOUNT PROFILE"
          action={
            !isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  background: "#FFF5F3",
                  border: `1px solid ${coral}`,
                  color: coral,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = coral;
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFF5F3";
                  e.currentTarget.style.color = coral;
                }}
              >
                <span>✎</span>
                <span>Edit Profile</span>
              </button>
            ) : null
          }
        >
          {isEditing ? (
            <form onSubmit={handleSaveProfile} style={{ padding: "20px 24px", background: "#FCFDFE" }}>
              <div style={{ marginBottom: 18, borderBottom: `1px solid ${border}`, paddingBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: slate }}>
                  Edit Official Profile Information
                </div>
                <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                  Update your officer credentials. Changes are synchronized across your official platform session.
                </div>
              </div>

              {/* Name Input */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: slate, marginBottom: 6 }}>
                  Full Officer Name <span style={{ color: coral }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: `1px solid ${border}`,
                    borderRadius: 4,
                    fontSize: 13,
                    color: slate,
                    background: "#fff",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = coral)}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
                <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>
                  Official name displayed on training certificates and competency dashboards.
                </div>
              </div>

              {/* Designation Input */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: slate, marginBottom: 6 }}>
                  Designation / Role Title <span style={{ color: coral }}>*</span>
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g., Senior Statistical Officer / Joint Director"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: `1px solid ${border}`,
                    borderRadius: 4,
                    fontSize: 13,
                    color: slate,
                    background: "#fff",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = coral)}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
                {/* Quick suggestions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: muted, alignSelf: "center" }}>Quick pick:</span>
                  {commonDesignations.slice(0, 3).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDesignation(d)}
                      style={{
                        padding: "2px 8px",
                        fontSize: 10,
                        border: `1px solid ${border}`,
                        background: "#fff",
                        color: slate,
                        borderRadius: 3,
                        cursor: "pointer",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ministry / Division Input */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: slate, marginBottom: 6 }}>
                  Ministry / Department / Division <span style={{ color: coral }}>*</span>
                </label>
                <input
                  type="text"
                  value={ministry}
                  onChange={(e) => setMinistry(e.target.value)}
                  placeholder="e.g., Statistics & Programme Implementation"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: `1px solid ${border}`,
                    borderRadius: 4,
                    fontSize: 13,
                    color: slate,
                    background: "#fff",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = coral)}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
                {/* Quick suggestions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: muted, alignSelf: "center" }}>Quick pick:</span>
                  {commonMinistries.slice(0, 2).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMinistry(m)}
                      style={{
                        padding: "2px 8px",
                        fontSize: 10,
                        border: `1px solid ${border}`,
                        background: "#fff",
                        color: slate,
                        borderRadius: 3,
                        cursor: "pointer",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cadre & Grade Optional Inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: slate, marginBottom: 6 }}>
                    Grade Level
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g., Level 10 / L4"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      border: `1px solid ${border}`,
                      borderRadius: 4,
                      fontSize: 12,
                      color: slate,
                      background: "#fff",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: slate, marginBottom: 6 }}>
                    Cadre / Service
                  </label>
                  <input
                    type="text"
                    value={cadre}
                    onChange={(e) => setCadre(e.target.value)}
                    placeholder="e.g., Indian Statistical Service (ISS)"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      border: `1px solid ${border}`,
                      borderRadius: 4,
                      fontSize: 12,
                      color: slate,
                      background: "#fff",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Official Email Read-only */}
              <div style={{ marginBottom: 22, opacity: 0.85 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: muted, marginBottom: 6 }}>
                  Official Email (Gov Mailbox)
                </label>
                <div
                  style={{
                    padding: "8px 12px",
                    background: panel,
                    border: `1px solid ${border}`,
                    borderRadius: 4,
                    fontSize: 12,
                    color: muted,
                    fontFamily: "'Space Grotesk', 'Outfit', monospace",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{user.email}</span>
                  <span style={{ fontSize: 10, color: emerald, fontWeight: 700 }}>🔒 BOUND TO AUTH SESSION</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 12, borderTop: `1px solid ${border}` }}>
                <button
                  type="button"
                  onClick={handleCancelEdit}
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
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 20px",
                    background: coral,
                    border: `1px solid ${coral}`,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 4,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(255, 111, 89, 0.3)",
                  }}
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <Row
                label="Full Officer Name"
                sub="As registered in official MoSPI HR records and certification certificates"
                control={
                  <div style={{ fontSize: 13, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", color: slate, fontWeight: 700 }}>
                    {user.name || "Not provided"}
                  </div>
                }
              />
              <Row
                label="Designation & Cadre"
                sub="Current official designation and cadre hierarchy"
                control={
                  <div
                    style={{
                      padding: "4px 12px",
                      border: `1px solid ${border}`,
                      fontSize: 12,
                      fontWeight: 700,
                      color: slate,
                      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                      background: panel,
                      borderRadius: 4,
                    }}
                  >
                    {user.roleTitle || user.grade || "Senior Statistical Officer (SSO)"}
                  </div>
                }
              />
              <Row
                label="Ministry / Division"
                sub="Parent ministry division, department, or regional field office"
                control={
                  <div style={{ fontSize: 12, fontWeight: 600, color: slate, maxWidth: 300, textAlign: "right" }}>
                    {user.department || "Statistics & Programme Implementation"}
                  </div>
                }
              />
              <Row
                label="Official Email"
                sub="Government mailbox address used for identity authentication"
                control={
                  <div style={{ fontSize: 12, fontFamily: "'Space Grotesk', 'Outfit', monospace", color: muted }}>
                    {user.email || "officer@mospi.gov.in"}
                  </div>
                }
              />
              {user.grade && (
                <Row
                  label="Grade Level & Cadre"
                  sub="Pay matrix level and service cadre"
                  control={
                    <div style={{ fontSize: 11, color: muted, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                      {user.grade} {user.cadre ? `· ${user.cadre}` : ""}
                    </div>
                  }
                />
              )}
            </>
          )}
        </Section>

        {/* Notifications Section */}
        <Section title="NOTIFICATIONS">
          <Row
            highlight
            label="Weekly Competency Digest"
            sub="Sends a full progress report every Monday at 08:00 IST covering skill gaps, assessments, and cohort rankings."
            control={<Toggle on={digest} toggle={() => setDigest(!digest)} />}
          />
          <Row
            label="Assessment Reminders"
            sub="Notify me when an assessment deadline is within 72 hours"
            control={<Toggle on={notifications} toggle={() => setNotifications(!notifications)} />}
          />
          <Row
            label="Session Login Alerts"
            sub="Send an email alert whenever a new login session is started"
            control={<Toggle on={sessionAlerts} toggle={() => setSessionAlerts(!sessionAlerts)} />}
          />
        </Section>

        {/* Security Section */}
        <Section title="SECURITY & SESSIONS">
          <Row
            label="Two-Factor Authentication (2FA)"
            sub="Require OTP verification on every login session"
            control={<Toggle on={twofa} toggle={() => setTwofa(!twofa)} />}
          />
          <Row
            label="Active Login Sessions"
            sub="1 active session · Last activity: Today · 09:41 IST"
            control={
              <button
                type="button"
                onClick={() => setShowRevokeModal(true)}
                style={{
                  padding: "5px 14px",
                  border: `1px solid ${coral}`,
                  background: "#FFF5F3",
                  fontSize: 11,
                  fontWeight: 700,
                  color: coral,
                  cursor: "pointer",
                  borderRadius: 4,
                }}
              >
                Revoke All
              </button>
            }
          />
        </Section>

        {/* Account Actions / Session Management */}
        <Section title="SESSION MANAGEMENT & ACCOUNT ACTIONS">
          <Row
            highlight
            label="Log Out of Official Session"
            sub="Terminate your current active session securely and return to the login landing page."
            control={
              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: "8px 18px",
                  background: coral,
                  border: `1px solid ${coral}`,
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(255, 111, 89, 0.25)",
                }}
              >
                <span>Log Out Now</span>
                <span style={{ fontSize: 14 }}>⎋</span>
              </button>
            }
          />
        </Section>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                showToast("Preferences saved successfully");
              }
            }}
            style={{
              padding: "10px 28px",
              background: coral,
              border: `1px solid ${coral}`,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Destructive Action */}
      <ConfirmModal
        isOpen={showRevokeModal}
        title="Revoke All Active Sessions?"
        message="This action will terminate all currently logged-in sessions for your official MoSPI account across all devices. You will need to complete 2FA authentication again on your next login."
        confirmLabel="Yes, Revoke Sessions"
        isDestructive
        onConfirm={() => {
          setShowRevokeModal(false);
          showToast("All active sessions revoked successfully.");
        }}
        onCancel={() => setShowRevokeModal(false)}
      />
    </div>
  );
}
