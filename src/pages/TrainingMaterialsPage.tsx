import React, { useState } from "react";
import { TrainingMaterial } from "../types";
import { materialsData } from "../data/mockData";
import { slate, coral, emerald, muted, border, panel, bg } from "../components/AppShell";
import { EmptyState } from "../components/UIStates";

export default function TrainingMaterialsPage({
  search,
  showToast,
}: {
  search: string;
  showToast: (m: string) => void;
}) {
  const [materials, setMaterials] = useState<TrainingMaterial[]>(materialsData);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStage, setUploadStage] = useState<
    "idle" | "Uploading" | "Extracting" | "Chunking" | "Embedding" | "Indexing" | "Ready" | "Failed"
  >("idle");
  const [fileName, setFileName] = useState("National_Accounts_Compilation_Handbook_2026.pdf");
  const [fileSize, setFileSize] = useState("3.4 MB");

  const q = search.toLowerCase();

  const filtered = materials.filter(
    (m) =>
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.tag.toLowerCase().includes(q) ||
      m.type.toLowerCase().includes(q) ||
      m.sha256.toLowerCase().includes(q)
  );

  const startSimulatedUpload = () => {
    setUploadStage("Uploading");
    setTimeout(() => {
      setUploadStage("Extracting");
      setTimeout(() => {
        setUploadStage("Chunking");
        setTimeout(() => {
          setUploadStage("Embedding");
          setTimeout(() => {
            setUploadStage("Indexing");
            setTimeout(() => {
              setUploadStage("Ready");
              // Add to materials list
              const newMat: TrainingMaterial = {
                id: `mat-${Date.now()}`,
                title: fileName.replace(".pdf", "").replace(/_/g, " "),
                type: "PDF",
                size: fileSize,
                pages: 142,
                tag: "Core Reading",
                uploaded: "Just now",
                status: "Ready",
                sha256: "e7b910a827419f02c91823746591029384756102938475610293847561029384",
              };
              setMaterials((prev) => [newMat, ...prev]);
              showToast(`Document "${newMat.title}" successfully indexed into ChromaDB!`);
            }, 700);
          }, 700);
        }, 600);
      }, 600);
    }, 500);
  };

  const stages = ["Uploading", "Extracting", "Chunking", "Embedding", "Indexing", "Ready"];

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
          <div style={{ fontSize: 20, fontWeight: 800, color: slate }}>Training Materials & RAG Repository</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            Official approved documents indexed for source-grounded assessment generation · {materials.length} files
          </div>
        </div>
        <button
          onClick={() => {
            setShowUploadModal(true);
            setUploadStage("idle");
          }}
          style={{
            padding: "9px 18px",
            background: coral,
            border: "none",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(255, 111, 89, 0.2)",
          }}
        >
          + Ingest New Training PDF
        </button>
      </div>

      {/* Materials Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Documents Found"
          description="No training materials match your search parameters."
        />
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: panel }}>
                {["Document Title", "Type", "Size", "Pages", "Tag", "SHA-256 Hash", "Uploaded", "Actions"].map((h) => (
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
                      letterSpacing: "0.07em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} style={{ background: i % 2 === 0 ? "#fff" : bg }}>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color: slate, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    {m.title}
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    <span style={{ padding: "2px 8px", border: `1px solid ${border}`, fontSize: 10, fontWeight: 700, color: muted, fontFamily: "JetBrains Mono, monospace", background: panel }}>
                      {m.type}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 11, color: muted, fontFamily: "JetBrains Mono, monospace", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    {m.size}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 11, color: muted, fontFamily: "JetBrains Mono, monospace", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}`, textAlign: "center" }}>
                    {m.pages ?? "—"}
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    <span style={{ padding: "2px 8px", border: `1px solid ${emerald}`, fontSize: 10, fontWeight: 700, color: emerald, fontFamily: "JetBrains Mono, monospace", background: "#D1FAE5" }}>
                      {m.tag}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 10, color: muted, fontFamily: "JetBrains Mono, monospace", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
                    {m.sha256.substring(0, 16)}…
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 11, color: muted, fontFamily: "JetBrains Mono, monospace", borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}`, whiteSpace: "nowrap" }}>
                    {m.uploaded}
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: `1px solid ${border}` }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => showToast(`Previewing verified chunks for: ${m.title}`)}
                        style={{ padding: "4px 8px", border: `1px solid ${border}`, background: "#fff", fontSize: 11, color: muted, cursor: "pointer" }}
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => showToast(`Downloading verified source PDF: ${m.title}`)}
                        style={{ padding: "4px 8px", border: `1px solid ${coral}`, background: "#FFF5F3", fontSize: 11, color: coral, fontWeight: 700, cursor: "pointer" }}
                      >
                        PDF ⤓
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive 6-Stage PDF Upload & Processing Modal (UI_UX.md § PDF Processing) */}
      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 39, 68, 0.4)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 580,
              background: "#fff",
              border: `2px solid ${coral}`,
              padding: 28,
              boxShadow: "0 14px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: coral, fontFamily: "JetBrains Mono, monospace" }}>
                  SECURITY VALIDATED PIPELINE (SECURITY.md § 10)
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: slate, marginTop: 2 }}>
                  Ingest & Vectorize Training Document
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: "none", border: "none", color: muted, fontSize: 20, cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            {uploadStage === "idle" ? (
              <div>
                <div
                  style={{
                    border: `2px dashed ${border}`,
                    padding: 28,
                    textAlign: "center",
                    background: panel,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8, color: muted }}>📄</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: slate }}>
                    Select Official Training Document
                  </div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>
                    Only verified PDF manuals permitted (Max 50MB)
                  </div>
                  <div style={{ marginTop: 12, display: "inline-block", padding: "6px 12px", background: "#fff", border: `1px solid ${border}`, fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: slate }}>
                    Selected: {fileName} ({fileSize})
                  </div>
                </div>

                <div style={{ padding: 10, background: "#F0FDF4", border: `1px solid ${emerald}`, fontSize: 11, color: slate, marginBottom: 20 }}>
                  <span style={{ fontWeight: 700, color: emerald, fontFamily: "JetBrains Mono, monospace" }}>
                    SHA-256 CHECK:{" "}
                  </span>
                  Pre-flight cryptographic signature computed and verified against tamper threshold.
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    style={{ padding: "8px 16px", background: "#fff", border: `1px solid ${border}`, color: muted, fontSize: 12, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startSimulatedUpload}
                    style={{ padding: "8px 20px", background: coral, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    Execute Ingest & Vector Indexing →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 16 }}>
                  Executing sandboxed extraction, PyMuPDF chunking, and ChromaDB vector indexing:
                </div>

                {/* 6-Stage Progress Stepper */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {stages.map((st, idx) => {
                    const currentStageIdx = stages.indexOf(uploadStage);
                    const isDone = currentStageIdx > idx || uploadStage === "Ready";
                    const isCurrent = uploadStage === st;
                    return (
                      <div
                        key={st}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          border: `1px solid ${isCurrent ? coral : isDone ? emerald : border}`,
                          background: isCurrent ? "#FFF5F3" : isDone ? "#F0FDF4" : panel,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: isDone ? emerald : isCurrent ? coral : border,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 700,
                              fontFamily: "JetBrains Mono, monospace",
                            }}
                          >
                            {isDone ? "✓" : idx + 1}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: isCurrent || isDone ? 700 : 500, color: slate }}>
                            {st}
                          </span>
                        </div>
                        <span style={{ fontSize: 10, color: isDone ? emerald : isCurrent ? coral : muted, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
                          {isDone ? "COMPLETED" : isCurrent ? "IN PROGRESS…" : "QUEUED"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {uploadStage === "Ready" && (
                  <div style={{ textAlign: "right" }}>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      style={{ padding: "8px 24px", background: emerald, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      Done & Close Modal ✓
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
