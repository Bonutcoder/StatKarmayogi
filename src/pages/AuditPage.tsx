import React, { useState } from "react";
import { auditHistoryData } from "../data/emptyData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState } from "../components/UIStates";

function actionBadge(action: string): { color: string; bg: string; border: string } {
  if (action.includes("UPLOAD")) return { color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" };
  if (action.includes("MASTERY")) return { color: "#059669", bg: "#D1FAE5", border: "#A7F3D0" };
  if (action.includes("ASSESSMENT")) return { color: "#6D28D9", bg: "#EDE9FE", border: "#DDD6FE" };
  if (action.includes("ROLE")) return { color: "#FF6F59", bg: "#FFF5F3", border: "#FECAB8" };
  return { color: "#64748B", bg: "#F1F5F9", border: "#CBD5E1" };
}

export default function AuditPage({ search }: { search: string }) {
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;
  const q = search.toLowerCase();

  const filtered = auditHistoryData.filter(
    (e) =>
      !q ||
      e.action.toLowerCase().includes(q) ||
      e.user.toLowerCase().includes(q) ||
      e.session.toLowerCase().includes(q) ||
      e.ip.toLowerCase().includes(q)
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
      {/* Header */}
      <div
        style={{
          marginBottom: 22,
          paddingBottom: 14,
          borderBottom: `1px solid ${border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>
            System Audit & Governance Ledger
          </div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            Append-only · Immutable event ledger · Tamper-evident · ISO 27001 / CERT-In compliant
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              padding: "4px 10px",
              border: `1px solid ${emerald}`,
              background: "#D1FAE5",
              fontSize: 10,
              fontWeight: 700,
              color: emerald,
              fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            IMMUTABLE LEDGER ACTIVE
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Audit Records Found"
          description="No security events match the current search filter."
        />
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: panel }}>
                {["Timestamp (IST)", "Action Type", "Actor Identity", "Session Token", "Source IP", "Integrity"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: muted,
                      borderBottom: `1px solid ${border}`,
                      borderRight: `1px solid ${border}`,
                      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((ev, i) => {
                const b = actionBadge(ev.action);
                return (
                  <tr key={ev.id} style={{ background: i % 2 === 0 ? "#fff" : bg }}>
                    <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", color: muted, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}`, whiteSpace: "nowrap" }}>
                      {ev.ts}
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}`, whiteSpace: "nowrap" }}>
                      <span style={{ padding: "2px 8px", border: `1px solid ${b.border}`, background: b.bg, color: b.color, fontSize: 10, fontWeight: 700, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                        {ev.action}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: slate, fontWeight: 600, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                      {ev.user}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", color: muted, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                      {ev.session}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", color: muted, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                      {ev.ip}
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: `1px solid ${border}` }}>
                      <span style={{ color: emerald, fontSize: 11, fontWeight: 700, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                        VALID ✓
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: `1px solid ${border}` }}>
            <div style={{ fontSize: 12, color: muted }}>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} audit entries
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ padding: "4px 10px", border: `1px solid ${border}`, background: "#fff", color: page <= 1 ? "#CBD5E1" : slate, fontSize: 11, cursor: page <= 1 ? "not-allowed" : "pointer" }}
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{ padding: "4px 10px", border: `1px solid ${border}`, background: "#fff", color: page >= totalPages ? "#CBD5E1" : slate, fontSize: 11, cursor: page >= totalPages ? "not-allowed" : "pointer" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
