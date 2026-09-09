import React, { useState } from "react";
import { UserProfile } from "../types";
import { API_URL, ApiError, login, register } from "../services/coreApi";

export default function LoginPage({
  initialMode = "login",
  onLoginSuccess,
  onBackToLanding,
}: {
  initialMode?: "login" | "signup";
  onLoginSuccess: (user: UserProfile) => void;
  onBackToLanding: () => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("ISS Grade");
  const [customGrade, setCustomGrade] = useState("");
  const [department, setDepartment] = useState("Statistics & Programme Implementation");
  const [customDepartment, setCustomDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const finalGrade = grade === "Other" ? customGrade.trim() : grade;
        const finalDepartment = department === "Other" ? customDepartment.trim() : department;
        onLoginSuccess(await register({
          fullName: fullName.trim(), email: email.trim(), password,
          designation: finalGrade, grade: finalGrade, department: finalDepartment,
        }));
      } else {
        onLoginSuccess(await login(email.trim(), password));
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the backend. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGithubLogin = () => {
    setError(null);
    window.location.assign(`${API_URL}/api/v1/auth/github/login`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FBF5ED",
        color: "#17202B",
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
      }}
    >
      {/* Top Navigation Link */}
      <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10 }}>
        <button
          onClick={onBackToLanding}
          style={{
            background: "#FFFFFF",
            border: "1px solid #EADFD4",
            color: "#64707B",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: 999,
            boxShadow: "0 2px 8px rgba(38, 35, 30, 0.04)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#EE705E";
            e.currentTarget.style.borderColor = "#EE705E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64707B";
            e.currentTarget.style.borderColor = "#EADFD4";
          }}
        >
          ← Back to Public Website
        </button>
      </div>

      {/* Main Authentication Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#FFFFFF",
          border: "1px solid #EADFD4",
          borderRadius: 20,
          boxShadow: "0 18px 50px rgba(38, 35, 30, 0.08)",
          padding: 36,
        }}
      >
        {/* Expanded Header Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 14 }}>
            <img src="/Logo.png" alt="StatKarmayogi" style={{ height: 60, width: "auto", objectFit: "contain" }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#17202B", margin: "4px 0 4px", fontFamily: "'Playfair Display', serif" }}>
            {mode === "login" ? "Sign In" : "Sign Up"}
          </h1>
          <div style={{ fontSize: 13, color: "#64707B" }}>
            {mode === "login"
              ? "Enter your credentials to sign in"
              : "Create a new official account to get started"}
          </div>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: 4, background: "#FBF5ED", borderRadius: 10, border: "1px solid #EADFD4", marginBottom: 22 }}>
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              padding: "10px",
              borderRadius: 8,
              border: "none",
              background: mode === "login" ? "#EE705E" : "transparent",
              color: mode === "login" ? "#FFFFFF" : "#64707B",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{
              padding: "10px",
              borderRadius: 8,
              border: "none",
              background: mode === "signup" ? "#EE705E" : "transparent",
              color: mode === "signup" ? "#FFFFFF" : "#64707B",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64707B", marginBottom: 4, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 8,
                    border: "1px solid #EADFD4",
                    background: "#FFFFFF",
                    color: "#17202B",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#64707B", fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                    DESIGNATION & GRADE
                  </label>
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>Current cadre posting and grade level</span>
                </div>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 8,
                    border: "1px solid #EADFD4",
                    background: "#FFFFFF",
                    color: "#17202B",
                    fontSize: 14,
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                >
                  <option value="ISS Grade">ISS Grade (Indian Statistical Service)</option>
                  <option value="SSS Grade">SSS Grade (Subordinate Statistical Service)</option>
                  <option value="Senior Statistical Officer">Senior Statistical Officer (SSO)</option>
                  <option value="Junior Statistical Officer">Junior Statistical Officer (JSO)</option>
                  <option value="Director / JS Grade">Director / Joint Secretary Grade</option>
                  <option value="Data Analyst / Specialist">Data Analyst / Specialist</option>
                  <option value="Other">Other (Specify manually)</option>
                </select>
                {grade === "Other" && (
                  <input
                    type="text"
                    required
                    placeholder="Type your designation/grade..."
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    style={{
                      marginTop: 8,
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #EE705E",
                      background: "#FFFBFB",
                      color: "#17202B",
                      fontSize: 13,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#64707B", fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                    MINISTRY / DIVISION
                  </label>
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>Parent ministry division</span>
                </div>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 8,
                    border: "1px solid #EADFD4",
                    background: "#FFFFFF",
                    color: "#17202B",
                    fontSize: 14,
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                >
                  <option value="Statistics & Programme Implementation">Statistics & Programme Implementation</option>
                  <option value="National Accounts Division">National Accounts Division (NAD)</option>
                  <option value="National Sample Survey Office (NSSO)">National Sample Survey Office (NSSO)</option>
                  <option value="Data Analytics Wing (DAW)">Data Analytics Wing (DAW)</option>
                  <option value="National Statistical Systems Training Academy (NSSTA)">NSSTA Academy</option>
                  <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                  <option value="Other">Other (Specify manually)</option>
                </select>
                {department === "Other" && (
                  <input
                    type="text"
                    required
                    placeholder="Type your ministry/division..."
                    value={customDepartment}
                    onChange={(e) => setCustomDepartment(e.target.value)}
                    style={{
                      marginTop: 8,
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #EE705E",
                      background: "#FFFBFB",
                      color: "#17202B",
                      fontSize: 13,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                )}
              </div>
            </>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64707B", marginBottom: 6, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid #EADFD4",
                background: "#FFFFFF",
                color: "#17202B",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64707B", marginBottom: 6, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid #EADFD4",
                background: "#FFFFFF",
                color: "#17202B",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px",
              background: "#EE705E",
              border: "none",
              borderRadius: 999,
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(238, 112, 94, 0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#D95D4D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#EE705E")}
          >
            {submitting ? "Signing in…" : mode === "login" ? "Sign In →" : "Sign Up →"}
          </button>
          {error && <div role="alert" style={{ marginTop: 12, color: "#B42318", fontSize: 12 }}>{error}</div>}
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#EADFD4" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#EADFD4" }} />
        </div>

        {/* Sign in with GitHub Button */}
        <button
          type="button"
          onClick={handleGithubLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "#24292F",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1F2328")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#24292F")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          Sign in with GitHub
        </button>

        {/* Mode Toggle Footer Link */}
        <div style={{ marginTop: 22, textAlign: "center", fontSize: 13, color: "#64707B" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{ background: "none", border: "none", color: "#EE705E", fontWeight: 700, cursor: "pointer", padding: 0 }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{ background: "none", border: "none", color: "#EE705E", fontWeight: 700, cursor: "pointer", padding: 0 }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
