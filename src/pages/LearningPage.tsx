import React, { useState } from "react";
import { Course } from "../types";
import { coursesCatalogue } from "../data/mockData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState, IntegrationBadge } from "../components/UIStates";

export default function LearningPage({
  search,
  showToast,
}: {
  search: string;
  showToast: (m: string) => void;
}) {
  const [sourceFilter, setSourceFilter] = useState<"All" | "iGOT" | "DEMO">("All");
  const [competencyFilter, setCompetencyFilter] = useState<string>("All");

  const q = search.toLowerCase();

  const competencies = ["All", ...Array.from(new Set(coursesCatalogue.map((c) => c.competency)))];

  const filtered = coursesCatalogue.filter((c) => {
    const matchesQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.competency.toLowerCase().includes(q) ||
      c.reason.toLowerCase().includes(q);

    const matchesSource =
      sourceFilter === "All" ||
      (sourceFilter === "iGOT" && c.source === "iGOT") ||
      (sourceFilter === "DEMO" && c.source.includes("DEMO"));

    const matchesComp = competencyFilter === "All" || c.competency === competencyFilter;

    return matchesQuery && matchesSource && matchesComp;
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
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Learning & Course Catalogue</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            iGOT Karmayogi official training catalogue & NSSTA local statistical modules
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <IntegrationBadge status="DEMO" />
          <button
            onClick={() => showToast("Syncing latest iGOT course index...")}
            style={{
              padding: "6px 14px",
              background: "#fff",
              border: `1px solid ${border}`,
              fontSize: 11,
              fontWeight: 700,
              color: slate,
              cursor: "pointer",
            }}
          >
            ↻ Sync Catalogue
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          marginBottom: 20,
          background: "#fff",
          padding: "12px 18px",
          border: `1px solid ${border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace" }}>
            PROVIDER:
          </span>
          <div style={{ display: "flex", gap: 1, background: border }}>
            {(["All", "iGOT", "DEMO"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                style={{
                  padding: "4px 12px",
                  border: "none",
                  background: sourceFilter === s ? slate : "#fff",
                  color: sourceFilter === s ? "#fff" : muted,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {s === "DEMO" ? "DEMO / LOCAL" : s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace" }}>
            COMPETENCY:
          </span>
          <select
            value={competencyFilter}
            onChange={(e) => setCompetencyFilter(e.target.value)}
            style={{
              padding: "5px 12px",
              border: `1px solid ${border}`,
              background: panel,
              fontSize: 12,
              color: slate,
              outline: "none",
            }}
          >
            {competencies.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="Try broadening your filter or search query."
          actionLabel="Clear Filters"
          onAction={() => {
            setSourceFilter("All");
            setCompetencyFilter("All");
          }}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {filtered.map((c) => {
            const isIgot = c.source === "iGOT";
            return (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${border}`,
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Badges */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        border: `1px solid ${isIgot ? emerald : border}`,
                        background: isIgot ? "#D1FAE5" : panel,
                        color: isIgot ? emerald : muted,
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {c.source}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        border: `1px solid ${border}`,
                        background: panel,
                        fontSize: 10,
                        fontWeight: 600,
                        color: slate,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {c.level.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: muted, fontFamily: "JetBrains Mono, monospace" }}>
                    {c.duration}
                  </span>
                </div>

                <div style={{ fontSize: 15, fontWeight: 700, color: slate, marginBottom: 4, lineHeight: 1.35 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 12 }}>
                  Provider: <span style={{ color: slate, fontWeight: 600 }}>{c.provider}</span>
                </div>

                {/* Recommendation Reason */}
                <div
                  style={{
                    background: panel,
                    border: `1px solid ${border}`,
                    padding: "10px 12px",
                    fontSize: 12,
                    color: muted,
                    lineHeight: 1.5,
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontWeight: 700, color: slate }}>Why recommended? </span>
                  {c.reason}
                </div>

                {/* Actions & Progress */}
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {c.enrolled ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: emerald, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                        ENROLLED ({c.progress || 0}%)
                      </span>
                      <button
                        onClick={() => showToast(`Resuming course: ${c.title}`)}
                        style={{
                          padding: "6px 14px",
                          background: emerald,
                          border: "none",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Resume Module →
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => showToast(`Enrolled in ${c.title} via iGOT adapter`)}
                      style={{
                        padding: "7px 16px",
                        background: coral,
                        border: "none",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Enroll Now →
                    </button>
                  )}

                  {c.externalUrl && (
                    <a
                      href={c.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 11,
                        color: muted,
                        textDecoration: "none",
                        fontFamily: "JetBrains Mono, monospace",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      Portal Link ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
