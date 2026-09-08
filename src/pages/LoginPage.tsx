import React, { useState } from "react";
import { UserProfile } from "../types";
import { initialProfiles } from "../data/mockData";
import { navy, slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";

export default function LoginPage({
  onLoginSuccess,
  onBackToLanding,
}: {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToLanding: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(initialProfiles[0]);
  const [password, setPassword] = useState("••••••••••••");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otp, setOtp] = useState("");
  const [simulatedError, setSimulatedError] = useState("");

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("otp");
    setSimulatedError("");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setSimulatedError("Please enter a valid 4-digit OTP (e.g. 1234)");
      return;
    }
    onLoginSuccess(selectedUser);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Top Banner */}
      <div style={{ position: "absolute", top: 24, left: 24 }}>
        <button
          onClick={onBackToLanding}
          style={{
            background: "none",
            border: "none",
            color: muted,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back to Public Website
        </button>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          border: `1px solid ${border}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          padding: 36,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: coral, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.12em" }}>
            STATKARMAYOGI AI · MOSPI
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: slate, margin: "6px 0 4px" }}>
            Official Statistical Authentication
          </h1>
          <div style={{ fontSize: 12, color: muted }}>
            Sign in with authorized MoSPI / NSSTA credentials
          </div>
        </div>

        {/* Persona Quick-Switch Tabs */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            QUICK ROLE DEMO SELECTOR
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {initialProfiles.map((p) => {
              const active = selectedUser.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(p);
                    setStep("credentials");
                    setSimulatedError("");
                  }}
                  style={{
                    padding: "8px 6px",
                    border: `1px solid ${active ? coral : border}`,
                    background: active ? "#FFF5F3" : panel,
                    color: active ? coral : slate,
                    fontSize: 11,
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div>{p.name.split(" ")[0]}</div>
                  <div style={{ fontSize: 9, color: active ? coral : muted, fontFamily: "JetBrains Mono, monospace" }}>
                    {p.role === "LEARNER" ? "Officer" : p.role === "TRAINING_COORDINATOR" ? "Coordinator" : "Admin"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected User Badge */}
        <div style={{ padding: 12, background: panel, border: `1px solid ${border}`, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: muted }}>Active Persona:</span>
            <span style={{ fontWeight: 700, color: slate }}>{selectedUser.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4 }}>
            <span style={{ color: muted }}>Email:</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", color: slate }}>{selectedUser.email}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4 }}>
            <span style={{ color: muted }}>Designation:</span>
            <span style={{ color: emerald, fontWeight: 600 }}>{selectedUser.grade}</span>
          </div>
        </div>

        {simulatedError && (
          <div style={{ padding: "8px 12px", background: "#FEF2F2", border: "1px solid #DC2626", color: "#DC2626", fontSize: 12, marginBottom: 16 }}>
            {simulatedError}
          </div>
        )}

        {step === "credentials" ? (
          <form onSubmit={handleCredentialsSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>
                OFFICIAL GOVERNMENT EMAIL
              </label>
              <input
                type="email"
                readOnly
                value={selectedUser.email}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${border}`,
                  background: "#FAFAFA",
                  color: slate,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>
                PASSWORD / TOKEN
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${border}`,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: coral,
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Verify Credentials & Request OTP →
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>
                ENTER 4-DIGIT 2FA OTP
              </label>
              <input
                autoFocus
                type="text"
                placeholder="Enter 1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "6px",
                  border: `1px solid ${coral}`,
                  boxSizing: "border-box",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              />
              <div style={{ fontSize: 11, color: muted, marginTop: 6, textAlign: "center" }}>
                Demo hint: enter any 4 numbers (e.g. <b>1234</b>)
              </div>
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: emerald,
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Confirm 2FA & Access Dashboard
            </button>
            <button
              type="button"
              onClick={() => setStep("credentials")}
              style={{
                width: "100%",
                marginTop: 8,
                background: "none",
                border: "none",
                color: muted,
                fontSize: 11,
                cursor: "pointer",
                padding: 6,
              }}
            >
              ← Back to credentials
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${border}`, fontSize: 10, color: muted, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>
          SECURITY BOUNDARY ENFORCED · NO CLIENT-SIDE CREDENTIAL STORAGE
        </div>
      </div>
    </div>
  );
}
