import React, { useState } from "react";
import { Tab, UserProfile } from "../types";
import BrandLogo from "./BrandLogo";

export const navy = "#0F2744";
export const slate = "#2C302E";
export const coral = "#FF6F59";
export const emerald = "#059669";
export const muted = "#64748B";
export const border = "#E2E8F0";
export const panel = "#F1F5F9";
export const bg = "#F8FAFC";

export function GovStrip({
  user,
  onSwitchPersona,
  onGoToLanding,
  apiOnline = false,
  onRefreshApi,
  onLogout,
}: {
  user: UserProfile;
  onSwitchPersona?: () => void;
  onGoToLanding?: () => void;
  apiOnline?: boolean;
  onRefreshApi?: () => void;
  onLogout?: () => void;
}) {
  return (
    <div
      style={{
        height: 36,
        background: navy,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: `2px solid ${emerald}`,
        flexShrink: 0,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={onGoToLanding}
          title="Return to Public Landing Page"
          style={{
            background: "none",
            border: "none",
            color: "#CBD5E1",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 0,
          }}
        >
          ← HOME
        </button>
        <span style={{ color: "#475569", fontSize: 11 }}>|</span>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94A3B8",
            letterSpacing: "0.08em",
            fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          STATKARMAYOGI LEARNING PLATFORM
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onRefreshApi}
          title={apiOnline ? "API Online on Port 8000. Click to re-check." : "API Standby / Offline. Click to reconnect."}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: apiOnline ? "rgba(5, 150, 105, 0.15)" : "rgba(245, 158, 11, 0.15)",
            border: `1px solid ${apiOnline ? "rgba(5, 150, 105, 0.4)" : "rgba(245, 158, 11, 0.4)"}`,
            padding: "2px 8px",
            borderRadius: 999,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: apiOnline ? emerald : "#F59E0B",
              boxShadow: apiOnline ? "0 0 6px rgba(5, 150, 105, 0.6)" : "none",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: apiOnline ? "#34D399" : "#FBBF24",
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            {apiOnline ? "API: ONLINE (:8000)" : "API: STANDBY"}
          </span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, background: emerald, borderRadius: "50%" }} />
          <span
            style={{
              fontSize: 11,
              color: "#94A3B8",
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            SECURE SESSION · {user.email}
          </span>
          {onLogout && (
            <button
              onClick={onLogout}
              title="End session and log out"
              style={{
                background: "rgba(239, 68, 68, 0.18)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#FCA5A5",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.2s",
                marginLeft: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EF4444";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)";
                e.currentTarget.style.color = "#FCA5A5";
              }}
            >
              LOG OUT ⎋
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TopBar({
  search,
  setSearch,
  onNotif,
  user,
}: {
  search: string;
  setSearch: (v: string) => void;
  onNotif: () => void;
  user: UserProfile;
}) {
  return (
    <header
      style={{
        height: 70,
        minHeight: 70,
        background: "#fff",
        borderBottom: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        zIndex: 10,
      }}
    >
      <div style={{ position: "relative", width: 360 }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            color: muted,
            pointerEvents: "none",
          }}
        >
          ⌕
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search competency frameworks, courses, audits…"
          style={{
            width: "100%",
            background: panel,
            border: `1px solid ${search ? slate : border}`,
            padding: "8px 14px 8px 32px",
            fontSize: 13,
            color: slate,
            outline: "none",
            fontFamily: "'Inter', system-ui, sans-serif",
            boxSizing: "border-box",
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: muted,
              fontSize: 16,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 13, fontWeight: 600, color: muted }}>
        <button
          onClick={onNotif}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: muted,
            padding: 0,
            position: "relative",
          }}
        >
          Notifications
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 20, borderLeft: `1px solid ${border}` }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: slate,
              color: "#fff",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ color: slate, fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
              {user.name}
            </div>
            <div style={{ color: muted, fontSize: 10, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
              {user.department}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Sidebar({
  tab,
  setTab,
  user,
  onLogout,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  user: UserProfile;
  onLogout?: () => void;
}) {
  const mainNav: { label: string; id: Tab }[] = [
    { label: "Dashboard", id: "dashboard" },
    { label: "Competencies", id: "competencies" },
    { label: "Skill Gaps", id: "skill-gaps" },
    { label: "Learning & Courses", id: "learning" },
    { label: "Assessments", id: "assessments" },
    { label: "Assessment Review", id: "assessment-review" },
    { label: "Grounded Evidence Audit", id: "evidence-audit" },
    { label: "Training Materials", id: "materials" },
  ];

  const adminNav: { label: string; id: Tab }[] = [
    { label: "iGOT Integration", id: "integrations" },
    { label: "Settings", id: "settings" },
  ];

  const navBtn = (label: string, id: Tab) => {
    const active = tab === id;
    return (
      <button
        key={id}
        onClick={() => setTab(id)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: active ? 700 : 500,
          color: active ? slate : muted,
          background: active ? "#FFF5F3" : "transparent",
          border: "none",
          borderLeft: active ? `3px solid ${coral}` : "3px solid transparent",
          cursor: "pointer",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        height: "100%",
        background: "#fff",
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BrandLogo height={32} />
        </div>
        <div
          style={{
            fontSize: 0,
            fontWeight: 700,
            color: muted,
            letterSpacing: "0.12em",
            marginTop: 2,
            fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
          }}
        >
          COMPETENCY INTELLIGENCE
        </div>
      </div>

      {/* Main nav */}
      <div style={{ padding: "10px 0", flex: 1, overflowY: "auto" }}>
        <div
          style={{
            margin: "6px 16px 6px",
            fontSize: 9,
            fontWeight: 700,
            color: muted,
            letterSpacing: "0.12em",
            fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
          }}
        >
          LEARNER SUITE
        </div>
        {mainNav.map((n) => navBtn(n.label, n.id))}

        <div
          style={{
            margin: "18px 16px 6px",
            fontSize: 9,
            fontWeight: 700,
            color: muted,
            letterSpacing: "0.12em",
            fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
          }}
        >
          ADMIN & ACADEMY PANEL
        </div>
        {adminNav.map((n) => navBtn(n.label, n.id))}
      </div>

      {/* Footer badge */}
      <div style={{ padding: 14, borderTop: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 8 }}>
        {onLogout && (
          <button onClick={onLogout} style={{ width: "100%", padding: "8px 10px", border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#B91C1C", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 4 }}>
            Log out
          </button>
        )}
        <div
          style={{
            padding: "6px 10px",
            border: `1px solid ${border}`,
            background: panel,
            fontSize: 0,
            fontWeight: 700,
            color: muted,
            fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
            letterSpacing: "0.06em",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 10 }}>STATKARMAYOGI AI</span>
          STATKARMAYOGI · MoSPI AI
        </div>
      </div>
    </aside>
  );
}

export function NotifPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 70,
        right: 0,
        width: 360,
        background: "#fff",
        border: `1px solid ${border}`,
        borderTop: "none",
        zIndex: 9000,
        boxShadow: "-4px 4px 20px rgba(0,0,0,0.10)",
      }}
    >
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: slate, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", letterSpacing: "0.07em" }}>NOTIFICATIONS</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: muted, fontSize: 18, cursor: "pointer", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: "28px 16px", textAlign: "center", color: muted, fontSize: 12 }}>
        No notifications.
      </div>
    </div>
  );
}

export function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: slate,
        color: "#fff",
        padding: "12px 20px",
        fontSize: 13,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      }}
    >
      {msg}
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 16, cursor: "pointer", lineHeight: 1 }}>
        ×
      </button>
    </div>
  );
}
