import React, { useState } from "react";
import { employeeDirectoryData } from "../data/mockData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState } from "../components/UIStates";

export default function EmployeesAdminPage({
  search,
  showToast,
}: {
  search: string;
  showToast: (m: string) => void;
}) {
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const q = search.toLowerCase();

  const departments = ["All", ...Array.from(new Set(employeeDirectoryData.map((e) => e.department)))];

  const filtered = employeeDirectoryData.filter((e) => {
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q);

    const matchesDept = deptFilter === "All" || e.department === deptFilter;

    return matchesSearch && matchesDept;
  });

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
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Ministry Personnel Directory</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            Official ISS Cadre & Subordinate Statistical Service Profiles · Admin Roster
          </div>
        </div>

        {/* Dept Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace" }}>
            DIVISION:
          </span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{
              padding: "6px 12px",
              border: `1px solid ${border}`,
              background: "#fff",
              fontSize: 12,
              color: slate,
              outline: "none",
            }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Officers Found"
          description="Try selecting another division or clearing your search term."
          actionLabel="Reset Filter"
          onAction={() => setDeptFilter("All")}
        />
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: panel }}>
                {["Officer Name", "Cadre / Designation", "Division", "Readiness", "Active Gaps", "Top Competency", "Last Activity", "Actions"].map((h) => (
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
                      fontFamily: "JetBrains Mono, monospace",
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
              {filtered.map((emp, i) => (
                <tr key={emp.id} style={{ background: i % 2 === 0 ? "#fff" : bg }}>
                  <td style={{ padding: "12px 14px", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: slate }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: muted, fontFamily: "JetBrains Mono, monospace" }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    <div style={{ fontSize: 12, color: slate, fontWeight: 500 }}>{emp.designation}</div>
                    <div style={{ fontSize: 10, color: muted, fontFamily: "JetBrains Mono, monospace" }}>{emp.cadre}</div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: slate, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    {emp.department}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700, color: emp.overallScore >= 70 ? emerald : coral }}>
                        {emp.overallScore}%
                      </span>
                      <div style={{ width: 60, height: 6, background: panel, border: `1px solid ${border}`, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${emp.overallScore}%`, background: emp.overallScore >= 70 ? emerald : coral }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    {emp.activeGaps > 0 ? (
                      <span style={{ padding: "2px 8px", border: `1px solid ${coral}`, background: "#FFF5F3", color: coral, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                        {emp.activeGaps} GAPS
                      </span>
                    ) : (
                      <span style={{ padding: "2px 8px", border: `1px solid ${emerald}`, background: "#D1FAE5", color: emerald, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                        ON TARGET
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 11, color: slate, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    {emp.topCompetency}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 11, color: muted, fontFamily: "JetBrains Mono, monospace", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}`, whiteSpace: "nowrap" }}>
                    {emp.lastActive}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: `1px solid ${border}` }}>
                    <button
                      onClick={() => showToast(`Opening dossier for ${emp.name}`)}
                      style={{
                        padding: "5px 10px",
                        background: "#fff",
                        border: `1px solid ${border}`,
                        fontSize: 11,
                        color: slate,
                        cursor: "pointer",
                      }}
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
