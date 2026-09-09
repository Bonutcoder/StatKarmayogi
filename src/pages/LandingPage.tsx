import React, { useState, useRef } from "react";
import BrandLogo from "../components/BrandLogo";

function Tilt3DCard({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: "50%", y: "50%" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setGlareStyle({
      opacity: 0.35,
      x: `${(x / rect.width) * 100}%`,
      y: `${(y / rect.height) * 100}%`,
    });
  };

  const handleMouseLeave = () => {
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
    setGlareStyle({ opacity: 0, x: "50%", y: "50%" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `radial-gradient(circle at ${glareStyle.x} ${glareStyle.y}, rgba(255,255,255,0.7) 0%, rgba(238,112,94,0.05) 40%, transparent 80%)`,
          opacity: glareStyle.opacity,
          pointerEvents: "none",
          transition: "opacity 0.2s ease-out",
          zIndex: 20,
        }}
      />
      {children}
    </div>
  );
}

export default function LandingPage({
  onLogin,
  onSignUp,
}: {
  onLogin: () => void;
  onSignUp: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FBF5ED",
        color: "#17202B",
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        lineHeight: 1.6,
        overflowX: "hidden",
      }}
    >
      {/* Navigation Header */}
      <header
        style={{
          borderBottom: "1px solid #EADFD4",
          background: "rgba(251, 245, 237, 0.95)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 82,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo & Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
            }}
            onClick={onLogin}
          >
            <BrandLogo height={52} />
          </div>

          {/* Nav Links & Authentication Buttons */}
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a href="#features" style={{ color: "#4D5962", textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#EE705E")} onMouseLeave={(e) => (e.currentTarget.style.color = "#4D5962")}>
              Framework
            </a>

            <button
              onClick={onLogin}
              style={{
                background: "transparent",
                border: "1px solid #D8CCC1",
                padding: "9px 20px",
                borderRadius: 999,
                fontWeight: 700,
                cursor: "pointer",
                color: "#17202B",
                fontSize: 13,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#EE705E";
                e.currentTarget.style.color = "#EE705E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#D8CCC1";
                e.currentTarget.style.color = "#17202B";
              }}
            >
              Sign In
            </button>

            <button
              onClick={onSignUp}
              style={{
                background: "#EE705E",
                border: "none",
                color: "#FFFFFF",
                padding: "10px 24px",
                borderRadius: 999,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 13,
                boxShadow: "0 4px 14px rgba(238, 112, 94, 0.35)",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#D95D4D";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#EE705E";
                e.currentTarget.style.transform = "none";
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "75px 24px 70px", maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        {/* Background Graphic: Man pushing boulder up mountain (Karmayogi Effort & Perseverance) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 1400,
            height: 720,
            opacity: 0.22,
            mixBlendMode: "multiply",
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: "url('/boulder_hero.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 90%)",
            maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 90%)",
            filter: "contrast(92%) brightness(105%)",
          }}
        />

        {/* Ambient Glow Spheres in background */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(238, 112, 94, 0.14) 0%, rgba(255, 107, 53, 0.08) 45%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
          className="animate-pulse-glow"
        />

        <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1, paddingTop: 20 }}>
          {/* Main Title */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 5.5vw, 68px)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              color: "#17202B",
              margin: "0 0 22px",
            }}
          >
            Competency Intelligence & <br />
            <span style={{ color: "#EE705E" }}>Evidence-Based Growth</span> for Official Statistics
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 18,
              color: "#64707B",
              maxWidth: 720,
              margin: "0 auto 36px",
              fontWeight: 400,
              lineHeight: 1.65,
            }}
          >
            Empowering India's Official Statistical System with secure competency analytics, document search, and connected learning services.
          </p>

          {/* Primary Authentication Action Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", marginBottom: 60 }}>
            <button
              onClick={onSignUp}
              style={{
                background: "#EE705E",
                color: "#FFFFFF",
                padding: "15px 34px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(238, 112, 94, 0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#D95D4D";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#EE705E";
                e.currentTarget.style.transform = "none";
              }}
            >
              Create Account (Sign Up) →
            </button>

            <button
              onClick={onLogin}
              style={{
                background: "#FFFFFF",
                color: "#17202B",
                padding: "15px 30px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                border: "1px solid #D8CCC1",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(38, 35, 30, 0.05)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#EE705E";
                e.currentTarget.style.color = "#EE705E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#D8CCC1";
                e.currentTarget.style.color = "#17202B";
              }}
            >
              Sign In
            </button>
          </div>

          {/* Metric Bar in 3D Card */}
          <Tilt3DCard>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                background: "#FFFFFF",
                padding: 28,
                borderRadius: 24,
                border: "1px solid rgba(234, 223, 212, 0.8)",
                boxShadow: "0 20px 60px rgba(38, 35, 30, 0.08)",
                transformStyle: "preserve-3d",
              }}
            >
              <div style={{ transform: "translateZ(20px)" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#EE705E", fontFamily: "'Space Grotesk', sans-serif" }}>50</div>
                <div style={{ fontSize: 13, color: "#64707B", fontWeight: 600 }}>Verified iGOT Courses</div>
              </div>
              <div style={{ transform: "translateZ(20px)" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#17202B", fontFamily: "'Space Grotesk', sans-serif" }}>8</div>
                <div style={{ fontSize: 13, color: "#64707B", fontWeight: 600 }}>Statistical Competencies</div>
              </div>
              <div style={{ transform: "translateZ(20px)" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#EE705E", fontFamily: "'Space Grotesk', sans-serif" }}>100%</div>
                <div style={{ fontSize: 13, color: "#64707B", fontWeight: 600 }}>Audit Grounded Security</div>
              </div>
              <div style={{ transform: "translateZ(20px)" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#17202B", fontFamily: "'Space Grotesk', sans-serif" }}>0-Trust</div>
                <div style={{ fontSize: 13, color: "#64707B", fontWeight: 600 }}>RAG Document Isolation</div>
              </div>
            </div>
          </Tilt3DCard>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" style={{ padding: "70px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#EE705E", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'Space Grotesk', 'Outfit', sans-serif", marginBottom: 8 }}>
            CORE SYSTEM ARCHITECTURE
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: "#17202B", margin: 0 }}>
            Built to MoSPI & NSSTA Competency Specifications
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {/* Card 1 */}
          <Tilt3DCard>
            <div className="card-white card-white-hover" style={{ padding: 32, borderRadius: 20, height: "100%", transformStyle: "preserve-3d" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(238, 112, 94, 0.12)", display: "grid", placeItems: "center", fontSize: 22, color: "#EE705E", marginBottom: 20, transform: "translateZ(20px)" }}>
                🎯
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#17202B", margin: "0 0 10px", fontFamily: "'Playfair Display', serif", transform: "translateZ(15px)" }}>
                SBERT Semantic Competency Engine
              </h3>
              <p style={{ fontSize: 14, color: "#64707B", margin: 0, transform: "translateZ(10px)" }}>
                Calculates multi-factor skill deficits using weighted role requirements, self-assessments, and official survey experience. Supports Levels 1 through 5.
              </p>
            </div>
          </Tilt3DCard>

          {/* Card 2 */}
          <Tilt3DCard>
            <div className="card-white card-white-hover" style={{ padding: 32, borderRadius: 20, height: "100%", transformStyle: "preserve-3d" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(238, 112, 94, 0.12)", display: "grid", placeItems: "center", fontSize: 22, color: "#EE705E", marginBottom: 20, transform: "translateZ(20px)" }}>
                📚
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#17202B", margin: "0 0 10px", fontFamily: "'Playfair Display', serif", transform: "translateZ(15px)" }}>
                50-Course iGOT Karmayogi Adapter
              </h3>
              <p style={{ fontSize: 14, color: "#64707B", margin: 0, transform: "translateZ(10px)" }}>
                Course availability is supplied by the connected learning provider.
              </p>
            </div>
          </Tilt3DCard>

          {/* Card 3 */}
          <Tilt3DCard>
            <div className="card-white card-white-hover" style={{ padding: 32, borderRadius: 20, height: "100%", transformStyle: "preserve-3d" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(238, 112, 94, 0.12)", display: "grid", placeItems: "center", fontSize: 22, color: "#EE705E", marginBottom: 20, transform: "translateZ(20px)" }}>
                🛡️
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#17202B", margin: "0 0 10px", fontFamily: "'Playfair Display', serif", transform: "translateZ(15px)" }}>
                Zero-Trust RAG Document Isolation
              </h3>
              <p style={{ fontSize: 14, color: "#64707B", margin: 0, transform: "translateZ(10px)" }}>
                Department-isolated vector store using ChromaDB. Enforces prompt injection defense with XML-delimited untrusted document contexts.
              </p>
            </div>
          </Tilt3DCard>

          {/* Card 4 */}
          <Tilt3DCard>
            <div className="card-white card-white-hover" style={{ padding: 32, borderRadius: 20, height: "100%", transformStyle: "preserve-3d" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(238, 112, 94, 0.12)", display: "grid", placeItems: "center", fontSize: 22, color: "#EE705E", marginBottom: 20, transform: "translateZ(20px)" }}>
                ⚡
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#17202B", margin: "0 0 10px", fontFamily: "'Playfair Display', serif", transform: "translateZ(15px)" }}>
                Deterministic MCQ & Answer Masking
              </h3>
              <p style={{ fontSize: 14, color: "#64707B", margin: 0, transform: "translateZ(10px)" }}>
                Auto-generates strict 4-option MCQ assessments with server-side answer key masking, preventing client-side inspection or tampering.
              </p>
            </div>
          </Tilt3DCard>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #EADFD4", padding: "40px 24px", background: "#FFFDF9", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <BrandLogo height={48} />
          <div style={{ fontSize: 13, color: "#64707B" }}>
            StatKarmayogi AI · Competency Intelligence Platform
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, marginTop: 4 }}>
            <button onClick={onLogin} style={{ background: "none", border: "none", color: "#EE705E", fontWeight: 700, cursor: "pointer" }}>Sign In</button>
            <span style={{ color: "#D8CCC1" }}>•</span>
            <button onClick={onSignUp} style={{ background: "none", border: "none", color: "#EE705E", fontWeight: 700, cursor: "pointer" }}>Sign Up</button>
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'Space Grotesk', 'Outfit', sans-serif", marginTop: 4 }}>
            Built with React 19, Vite, FastAPI & iGOT Karmayogi Standards
          </div>
        </div>
      </footer>
    </div>
  );
}
