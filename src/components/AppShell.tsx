import React, { useState } from "react";
import { Tab, UserProfile } from "../types";

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
}: {
  user: UserProfile;
  onSwitchPersona?: () => void;
  onGoToLanding?: () => void;
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
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 0,
          }}
        >
          ← PUBLIC SITE
        </button>
        <span style={{ color: "#475569", fontSize: 10 }}>|</span>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94A3B8",
            letterSpacing: "0.12em",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          GOVERNMENT OF INDIA · MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onSwitchPersona}
          title="Switch Demo Role"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#E2E8F0",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            fontFamily: "JetBrains Mono, monospace",
            cursor: "pointer",
          }}
        >
          ROLE: {user.role} ▾
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, background: emerald, borderRadius: "50%" }} />
          <span
            style={{
              fontSize: 11,
              color: "#94A3B8",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            SECURE SESSION · {user.email}
          </span>
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
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -10,
              width: 16,
              height: 16,
              background: coral,
              borderRadius: "50%",
              fontSize: 9,
              fontWeight: 800,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 20, borderLeft: `1px solid ${border}` }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: slate,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ color: slate, fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
              {user.name}
            </div>
            <div style={{ color: muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>
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
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  user: UserProfile;
}) {
  const mainNav: { label: string; id: Tab }[] = [
    { label: "Dashboard", id: "dashboard" },
    { label: "Competencies", id: "competencies" },
    { label: "Skill Gaps", id: "skill-gaps" },
    { label: "Learning & Courses", id: "learning" },
    { label: "Assessments", id: "assessments" },
    { label: "Assessment Review", id: "assessment-review" },
    { label: "Training Materials", id: "materials" },
  ];

  const adminNav: { label: string; id: Tab }[] = [
    { label: "Department Analytics", id: "analytics" },
    { label: "Employee Directory", id: "employees" },
    { label: "iGOT Integration", id: "integrations" },
    { label: "System Audit", id: "audit" },
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
        <div style={{ fontSize: 15, fontWeight: 800, color: slate, letterSpacing: "-0.02em" }}>
          stat<span style={{ color: coral }}>karmayogi</span>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: muted,
            letterSpacing: "0.12em",
            marginTop: 2,
            fontFamily: "JetBrains Mono, monospace",
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
            fontFamily: "JetBrains Mono, monospace",
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
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          ADMIN & ACADEMY PANEL
        </div>
        {adminNav.map((n) => navBtn(n.label, n.id))}
      </div>

      {/* Footer badge */}
      <div style={{ padding: 16, borderTop: `1px solid ${border}` }}>
        <div
          style={{
            padding: "6px 10px",
            border: `1px solid ${border}`,
            background: panel,
            fontSize: 11,
            fontWeight: 700,
            color: muted,
            fontFamily: "JetBrains Mono, monospace",
            letterSpacing: "0.06em",
            textAlign: "center",
          }}
        >
          DEMO CATALOGUE — Active
        </div>
      </div>
    </aside>
  );
}

export function NotifPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState([
    { title: "Assessment Due", body: "Survey Methodology assessment due in 48 hours.", time: "2h ago", read: false },
    { title: "Mastery Updated", body: "Your Statistics competency was updated to Level 4.", time: "5h ago", read: false },
    { title: "New Material Added", body: "GIS Fundamentals — Video Series added to your catalogue.", time: "1d ago", read: false },
    { title: "Skill Gap Resolved", body: "SQL & Databases gap closed — target level achieved.", time: "2d ago", read: true },
  ]);

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
        <div style={{ fontSize: 12, fontWeight: 700, color: slate, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.07em" }}>NOTIFICATIONS</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: muted, fontSize: 18, cursor: "pointer", lineHeight: 1 }}>×</button>
      </div>
      {items.map((n, i) => (
        <div
          key={i}
          onClick={() => setItems((p) => p.map((x, idx) => idx === i ? { ...x, read: true } : x))}
          style={{
            padding: "13px 16px",
            borderBottom: `1px solid ${border}`,
            background: n.read ? "#fff" : "#F8FAFC",
            cursor: "pointer",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : coral, flexShrink: 0, marginTop: 4 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: slate, marginBottom: 2 }}>{n.title}</div>
            <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>{n.body}</div>
            <div style={{ fontSize: 10, color: muted, marginTop: 4, fontFamily: "JetBrains Mono, monospace" }}>{n.time}</div>
          </div>
        </div>
      ))}
      <div style={{ padding: "10px 16px" }}>
        <button
          onClick={() => setItems((p) => p.map((x) => ({ ...x, read: true })))}
          style={{ background: "none", border: "none", fontSize: 12, color: coral, fontWeight: 700, cursor: "pointer", padding: 0 }}
        >
          Mark all as read
        </button>
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
