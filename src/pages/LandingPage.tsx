import React from "react";

export default function LandingPage({
  onEnterPortal,
  onLogin,
}: {
  onEnterPortal: () => void;
  onLogin: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fbf5ed",
        color: "#17202b",
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.5,
      }}
    >
      {/* Navigation */}
      <header
        style={{
          borderBottom: "1px solid #eadfd4",
          background: "rgba(251, 245, 237, 0.95)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 24px",
            height: 82,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              fontFamily: "'Playfair Display', serif",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
                border: "2px solid #ee705e",
                borderRadius: "50%",
                color: "#ee705e",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              SK
            </div>
            <span>
              StatKarm<span style={{ color: "#ee705e" }}>Yogi</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 14 }}>
            <a href="#features" style={{ color: "#4d5962", textDecoration: "none", fontWeight: 500 }}>
              Framework
            </a>
            <a href="#loop" style={{ color: "#4d5962", textDecoration: "none", fontWeight: 500 }}>
              Closed-Loop
            </a>
            <a href="#trust" style={{ color: "#4d5962", textDecoration: "none", fontWeight: 500 }}>
              Trust Architecture
            </a>
            <button
              onClick={onLogin}
              style={{
                background: "transparent",
                border: "1px solid #d8ccc1",
                padding: "8px 18px",
                borderRadius: 999,
                fontWeight: 700,
                cursor: "pointer",
                color: "#17202b",
                fontSize: 13,
              }}
            >
              Sign In
            </button>
            <button
              onClick={onEnterPortal}
              style={{
                background: "#ee705e",
                border: "none",
                color: "#fff",
                padding: "10px 22px",
                borderRadius: 999,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 13,
                boxShadow: "0 4px 12px rgba(238, 112, 94, 0.3)",
              }}
            >
              Access Portal →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "70px 24px 80px", maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#ee705e",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                marginBottom: 16,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              SIH 2026 #26101 · MOSPI / NSSTA / iGOT ECOSYSTEM
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(40px, 5.5vw, 68px)",
                lineHeight: 1.05,
                letterSpacing: "-2px",
                color: "#17202b",
                margin: 0,
              }}
            >
              Competency intelligence for India’s official{" "}
              <em style={{ color: "#ee705e", fontStyle: "normal" }}>statistical cadre</em>.
            </h1>
            <p
              style={{
                color: "#64707b",
                fontSize: 17,
                margin: "24px 0 32px",
                lineHeight: 1.6,
                maxWidth: 520,
              }}
            >
              Transform official statistical training into verified public capability.
              Deterministic skill-gap analysis, RAG-grounded source assessments, and
              tamper-evident mastery records built alongside iGOT Karmayogi.
            </p>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <button
                onClick={onEnterPortal}
                style={{
                  background: "#ee705e",
                  border: "none",
                  color: "#fff",
                  padding: "14px 28px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(238, 112, 94, 0.25)",
                }}
              >
                Launch Officer Dashboard →
              </button>
              <button
                onClick={onLogin}
                style={{
                  background: "transparent",
                  border: "1px solid #d8ccc1",
                  color: "#17202b",
                  padding: "14px 24px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Switch Role / Login
              </button>
            </div>
            <div style={{ marginTop: 36, color: "#8a918f", fontSize: 13 }}>
              <strong style={{ color: "#17202b", fontSize: 18, marginRight: 8 }}>100%</strong>
              Deterministic skill-gap rules · Verified against official MoSPI documentation
            </div>
          </div>

          {/* Hero Art / Floating Cards */}
          <div style={{ position: "relative", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 360,
                height: 360,
                borderRadius: "50%",
                background: "#dfe9df",
                position: "absolute",
              }}
            />
            {/* Floating Progress Card */}
            <div
              style={{
                width: 290,
                background: "rgba(255, 253, 249, 0.96)",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                borderRadius: 18,
                padding: 22,
                boxShadow: "0 18px 50px rgba(38, 35, 30, 0.12)",
                zIndex: 2,
                position: "relative",
                transform: "translate(-10px, -20px)",
              }}
            >
              <div style={{ fontSize: 11, color: "#64707b", fontFamily: "JetBrains Mono, monospace" }}>
                COMPETENCY READINESS
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, margin: "6px 0 16px", color: "#17202b" }}>
                Survey Sampling (L4)
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>Statistics</span>
                <b style={{ color: "#ee705e" }}>92%</b>
              </div>
              <div style={{ height: 6, background: "#eee6dd", borderRadius: 8, margin: "4px 0 12px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "92%", background: "#059669" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>Python & Ingestion</span>
                <b style={{ color: "#ee705e" }}>81%</b>
              </div>
              <div style={{ height: 6, background: "#eee6dd", borderRadius: 8, margin: "4px 0 12px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "81%", background: "#059669" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>GIS Mapping</span>
                <b style={{ color: "#ee705e" }}>50%</b>
              </div>
              <div style={{ height: 6, background: "#eee6dd", borderRadius: 8, margin: "4px 0 4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "50%", background: "#ee705e" }} />
              </div>
              <div style={{ marginTop: 12, padding: "6px 10px", background: "#FEF2F2", border: "1px solid #FECAB8", fontSize: 10, color: "#DC2626", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                CRITICAL GAP: 2 LEVELS TO TARGET L4
              </div>
            </div>

            {/* Floating Quote Card */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                width: 260,
                background: "#fff",
                border: "1px solid #eadfd4",
                borderRadius: 14,
                padding: 16,
                zIndex: 3,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontSize: 10, color: "#ee705e", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
                GROUNDED SOURCE EVIDENCE
              </div>
              <div style={{ fontSize: 12, color: "#17202b", marginTop: 4, fontStyle: "italic" }}>
                "Two-stage cluster sampling ensures optimal variance control across rural enumeration blocks."
              </div>
              <div style={{ fontSize: 10, color: "#64707b", marginTop: 6, fontFamily: "JetBrains Mono, monospace" }}>
                NSS Handbook · Page 18
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Closed Loop */}
      <section id="loop" style={{ background: "#f3ece3", padding: "70px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 650, margin: "0 auto 44px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ee705e", fontFamily: "JetBrains Mono, monospace", letterSpacing: "1.5px" }}>
              HOW IT WORKS
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 42px)", margin: "8px 0" }}>
              The Continuous Competency Closed Loop
            </h2>
            <p style={{ color: "#64707b", fontSize: 15 }}>
              Deterministic competency rules establish measurable facts; RAG grounds AI; AI generates targeted learning assessments.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {[
              {
                step: "01",
                title: "Deterministic Gap Detection",
                desc: "Analyzes required competency milestones against verified officer profiles. Gap = Required Level − Current Level.",
              },
              {
                step: "02",
                title: "Personalized iGOT Training",
                desc: "Recommends verified courses from the iGOT Karmayogi catalogue tailored to high-priority competency gaps.",
              },
              {
                step: "03",
                title: "Source-Grounded Assessment",
                desc: "Evaluates mastery via AI questions strictly citing approved MoSPI PDFs, automatically advancing competency levels.",
              },
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  background: "#fff",
                  padding: 28,
                  borderRadius: 16,
                  border: "1px solid #eadfd4",
                }}
              >
                <div style={{ fontSize: 32, fontFamily: "'Playfair Display', serif", color: "#ee705e", fontWeight: 700 }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 18, margin: "10px 0 8px", color: "#17202b" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#64707b", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: "80px 24px", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 650, margin: "0 auto 44px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 40px)" }}>
            Engineered for Official Governance
          </h2>
          <p style={{ color: "#64707b", fontSize: 15 }}>
            StatKarmayogi AI conforms with MoSPI security standards, avoiding unverified AI hallucinations.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            {
              title: "Authoritative RAG Retrieval",
              desc: "Questions cite page, section, and verified text chunks from official training manuals, preventing hallucinated answers.",
            },
            {
              title: "Department Heatmap Analytics",
              desc: "Ministry administrators get high-density heatmaps across 7 departments and 6 statistical competencies in real time.",
            },
            {
              title: "Tamper-Evident Audit Ledger",
              desc: "Every assessment, mastery elevation, and document ingest is logged with timestamp, user session, and IP.",
            },
            {
              title: "iGOT Integration Boundary",
              desc: "Isolated adapter seamlessly links with iGOT courses while clearly indicating live vs local demo catalogues.",
            },
            {
              title: "4-Tier Mastery Progression",
              desc: "From Foundation (0–39%) to Strong Mastery (80–100%) with automated historical record preservation.",
            },
            {
              title: "Role-Based Data Isolation",
              desc: "Strict separation between Learner profiles, Assessment Reviewers, and Department Administrators.",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: "#fff",
                padding: "24px 22px",
                borderRadius: 14,
                border: "1px solid #eadfd4",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#17202b" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#64707b", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            background: "#17202b",
            color: "#fff",
            borderRadius: 22,
            padding: "50px 60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 30,
          }}
        >
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, margin: 0 }}>
              Ready to verify statistical mastery?
            </h2>
            <p style={{ color: "#bdc4c5", marginTop: 10, fontSize: 15, maxWidth: 520 }}>
              Access your official competency dashboard or simulate evaluation workflows as an administrator.
            </p>
          </div>
          <button
            onClick={onEnterPortal}
            style={{
              background: "#ee705e",
              border: "none",
              color: "#fff",
              padding: "14px 30px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Open Application →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #eadfd4", padding: "28px 24px", color: "#64707b", fontSize: 12 }}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Government of India · Ministry of Statistics & Programme Implementation (MoSPI)</div>
          <div style={{ fontFamily: "JetBrains Mono, monospace" }}>SIH 2026 Problem Statement 26101</div>
        </div>
      </footer>
    </div>
  );
}
