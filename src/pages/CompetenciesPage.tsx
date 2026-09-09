import React, { useState } from "react";
import { DomainEnrollment } from "../data/domainData";
import { computeCompetenciesFromEnrollments } from "../services/domainService";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState } from "../components/UIStates";

export default function CompetenciesPage({
  search,
  domainEnrollments = [],
  onOpenAddDomain,
}: {
  search: string;
  domainEnrollments?: DomainEnrollment[];
  onOpenAddDomain?: () => void;
}) {
  const [filter, setFilter] = useState<"All" | "Core" | "Advanced" | "Foundational">("All");
  const competencies = computeCompetenciesFromEnrollments(domainEnrollments);
  const q = search.toLowerCase();

  const filtered = competencies
    .filter((c) => filter === "All" || c.category === filter)
    .filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        (c.evidenceSource && c.evidenceSource.toLowerCase().includes(q))
    );

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
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Competency Framework</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            All competencies mapped to MoSPI role profiles & active learning domains · iGOT–Karmayogi v3.1 Standards
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {onOpenAddDomain && (
            <button
              onClick={onOpenAddDomain}
              style={{
                padding: "6px 14px",
                background: coral,
                border: `1px solid ${coral}`,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(255, 111, 89, 0.25)",
              }}
            >
              + Add Domain
            </button>
          )}

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: 1, background: border }}>
            {(["All", "Core", "Advanced", "Foundational"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 14px",
                  border: "none",
                  background: filter === f ? slate : "#fff",
                  color: filter === f ? "#fff" : muted,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Competencies Found"
          description={
            domainEnrollments.length === 0
              ? "You haven't enrolled in any learning domains yet. Click '+ Add Domain' to start building your competency framework."
              : `No competencies matched your filter "${filter}" or query "${search}".`
          }
          actionLabel={domainEnrollments.length === 0 ? "Add Domain" : "Reset Filters"}
          onAction={() => {
            if (domainEnrollments.length === 0 && onOpenAddDomain) {
              onOpenAddDomain();
            } else {
              setFilter("All");
            }
          }}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {filtered.map((c) => {
            const pct = Math.round((c.level / c.required) * 100);
            const warn = pct < 65;
            const mastered = c.level >= c.required;
            return (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${border}`,
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: slate, marginBottom: 4 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>{c.desc}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        border: `1px solid ${border}`,
                        fontSize: 10,
                        fontWeight: 700,
                        color: muted,
                        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                        background: panel,
                      }}
                    >
                      {c.category.toUpperCase()}
                    </span>
                    {mastered ? (
                      <span
                        style={{
                          padding: "2px 8px",
                          border: `1px solid ${emerald}`,
                          fontSize: 10,
                          fontWeight: 700,
                          color: emerald,
                          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                          background: "#D1FAE5",
                        }}
                      >
                        MASTERED
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: "2px 8px",
                          border: `1px solid ${coral}`,
                          fontSize: 10,
                          fontWeight: 700,
                          color: coral,
                          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                          background: "#FFF5F3",
                        }}
                      >
                        GAP
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    fontWeight: 600,
                    color: slate,
                    marginBottom: 6,
                    marginTop: "auto",
                  }}
                >
                  <span>
                    Level {c.level} of {c.required}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                      color: warn ? coral : emerald,
                      fontWeight: 700,
                    }}
                  >
                    {pct}%
                  </span>
                </div>
                <div style={{ height: 6, background: panel, border: `1px solid ${border}`, overflow: "hidden", borderRadius: 3 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(pct, 100)}%`,
                      background: warn ? coral : emerald,
                    }}
                  />
                </div>

                {c.evidenceSource && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "6px 10px",
                      background: bg,
                      border: `1px solid ${border}`,
                      fontSize: 11,
                      color: muted,
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: slate, fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                      EVIDENCE:
                    </span>
                    <span>{c.evidenceSource}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
