import React, { useState } from "react";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { IntegrationBadge } from "../components/UIStates";

export default function CourseIntegrationPage({
  showToast,
}: {
  showToast: (m: string) => void;
}) {
  const [providerMode, setProviderMode] = useState<"MOCK" | "LIVE_IGOT">("MOCK");
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Today · 09:10:09 IST");

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSyncTime("Just now");
      showToast("Catalogue sync complete: 6 course metadata definitions updated.");
    }, 1200);
  };

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
            iGOT Karmayogi Integration Adapter
          </div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            External Learning Provider abstraction boundary · PRD §8 Architecture
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <IntegrationBadge status={providerMode === "LIVE_IGOT" ? "iGOT" : "DEMO"} />
        </div>
      </div>

      <div style={{ maxWidth: 840 }}>
        {/* Active Provider Card */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>
            ADAPTER PROVIDER CONFIGURATION
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* Mock Provider */}
            <div
              onClick={() => {
                setProviderMode("MOCK");
                showToast("Switched to MockLearningProvider");
              }}
              style={{
                border: `2px solid ${providerMode === "MOCK" ? coral : border}`,
                background: providerMode === "MOCK" ? "#FFF5F3" : "#fff",
                padding: 16,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: slate }}>MockLearningProvider</div>
                {providerMode === "MOCK" && (
                  <span style={{ fontSize: 10, color: coral, fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: muted, marginTop: 6, lineHeight: 1.5 }}>
                Local synthetic course catalogue aligned with MoSPI Statistical competencies for hackathon demonstration.
              </div>
            </div>

            {/* Live Provider */}
            <div
              onClick={() => {
                setProviderMode("LIVE_IGOT");
                showToast("iGOT Sandbox Gateway configured");
              }}
              style={{
                border: `2px solid ${providerMode === "LIVE_IGOT" ? emerald : border}`,
                background: providerMode === "LIVE_IGOT" ? "#F0FDF4" : "#fff",
                padding: 16,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: slate }}>IGOTLearningProvider</div>
                {providerMode === "LIVE_IGOT" && (
                  <span style={{ fontSize: 10, color: emerald, fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>
                    CONNECTED
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: muted, marginTop: 6, lineHeight: 1.5 }}>
                Authorized API endpoint connector for live iGOT Karmayogi course sync and completion webhook ingestion.
              </div>
            </div>
          </div>

          {/* Sync Trigger Strip */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: panel, border: `1px solid ${border}` }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: slate }}>Course Catalogue Synchronization</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                Last synced: <span style={{ fontFamily: "JetBrains Mono, monospace", color: slate }}>{lastSyncTime}</span>
              </div>
            </div>
            <button
              disabled={syncing}
              onClick={handleSync}
              style={{
                padding: "8px 20px",
                background: syncing ? muted : coral,
                border: "none",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: syncing ? "not-allowed" : "pointer",
              }}
            >
              {syncing ? "Syncing Modules…" : "Trigger Immediate Sync ↻"}
            </button>
          </div>
        </div>

        {/* Technical Contracts (from PRD.md § 8) */}
        <div style={{ background: "#fff", border: `1px solid ${border}`, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>
            ADAPTER INTERFACE CONTRACT (PRD §8)
          </div>

          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, background: panel, padding: 16, border: `1px solid ${border}`, lineHeight: 1.7, color: slate }}>
            <div>class LearningProvider(ABC):</div>
            <div style={{ paddingLeft: 20 }}>@abstractmethod</div>
            <div style={{ paddingLeft: 20 }}>async def search_courses(query: str, competency: str) -&gt; List[Course]: ...</div>
            <div style={{ paddingLeft: 20 }}>@abstractmethod</div>
            <div style={{ paddingLeft: 20 }}>async def get_course(course_id: str) -&gt; Course: ...</div>
            <div style={{ paddingLeft: 20 }}>@abstractmethod</div>
            <div style={{ paddingLeft: 20 }}>async def get_course_catalog() -&gt; CatalogSummary: ...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
