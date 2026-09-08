import React, { useState, ReactNode } from "react";
import { UserProfile } from "../types";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { ConfirmModal } from "../components/UIStates";

export default function SettingsPage({
  user,
  showToast,
}: {
  user: UserProfile;
  showToast: (m: string) => void;
}) {
  const [notifications, setNotifications] = useState(true);
  const [digest, setDigest] = useState(false);
  const [twofa, setTwofa] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(true);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

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

  const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <div style={{ background: "#fff", border: `1px solid ${border}`, marginBottom: 16 }}>
      <div
        style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${border}`,
          fontSize: 11,
          fontWeight: 700,
          color: muted,
          fontFamily: "JetBrains Mono, monospace",
          letterSpacing: "0.08em",
        }}
      >
        {title}
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
      <div>
        <div style={{ fontSize: 13, fontWeight: highlight ? 700 : 600, color: slate }}>{label}</div>
        <div style={{ fontSize: 11, color: muted, marginTop: 3, maxWidth: 460, lineHeight: 1.5 }}>{sub}</div>
      </div>
      {control}
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

      <div style={{ maxWidth: 800 }}>
        {/* Prominent Weekly Digest Feature Card */}
        <div
          style={{
            background: "#fff",
            border: `2px solid ${coral}`,
            padding: "22px 24px",
            marginBottom: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  padding: "2px 10px",
                  background: coral,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.07em",
                }}
              >
                FEATURED
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: slate }}>
                Enable Weekly Competency Digest Report
              </div>
            </div>
            <div style={{ fontSize: 13, color: muted, lineHeight: 1.65, marginBottom: 10 }}>
              Receive a structured weekly report every Monday at 08:00 IST summarising your competency progress across all mapped skill domains. The digest includes your top skill gap movements, upcoming assessment deadlines, newly recommended courses, and a comparative percentile ranking within your department cohort.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[`Delivered to ${user.email}`, "Every Monday · 08:00 IST", "PDF + official digest format"].map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "2px 8px",
                    border: `1px solid ${coral}`,
                    fontSize: 10,
                    color: coral,
                    fontFamily: "JetBrains Mono, monospace",
                    fontWeight: 600,
                    background: "#FFF5F3",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <Toggle
              on={digest}
              toggle={() => {
                const next = !digest;
                setDigest(next);
                showToast(next ? "Weekly Digest Report enabled — first report Monday 08:00 IST" : "Weekly digest disabled");
              }}
              size="lg"
            />
            <div style={{ fontSize: 10, fontWeight: 700, color: digest ? coral : muted, fontFamily: "JetBrains Mono, monospace" }}>
              {digest ? "ENABLED" : "DISABLED"}
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <Section title="ACCOUNT PROFILE">
          <Row
            label="Full Officer Name"
            sub="As registered in official MoSPI HR record"
            control={<div style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: slate, fontWeight: 600 }}>{user.name}</div>}
          />
          <Row
            label="Official Email"
            sub="Government mailbox address"
            control={<div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: muted }}>{user.email}</div>}
          />
          <Row
            label="Designation & Grade"
            sub="Current cadre posting and grade level"
            control={<div style={{ padding: "3px 10px", border: `1px solid ${border}`, fontSize: 11, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace", background: panel }}>{user.grade}</div>}
          />
          <Row
            label="Ministry / Division"
            sub="Parent ministry division"
            control={<div style={{ fontSize: 12, color: muted }}>{user.department}</div>}
          />
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
                }}
              >
                Revoke All
              </button>
            }
          />
        </Section>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => showToast("Settings saved successfully")}
            style={{
              padding: "10px 28px",
              background: coral,
              border: `1px solid ${coral}`,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
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
