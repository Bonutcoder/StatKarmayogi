import React from "react";

export function AIStatusBadge({
  status = "AVAILABLE",
}: {
  status?: "AVAILABLE" | "PROCESSING" | "UNAVAILABLE";
}) {
  const configs = {
    AVAILABLE: { bg: "#D1FAE5", border: "#059669", color: "#059669", text: "AI ENGINE · OPERATIONAL" },
    PROCESSING: { bg: "#EFF6FF", border: "#3B82F6", color: "#1D4ED8", text: "AI ENGINE · GENERATING" },
    UNAVAILABLE: { bg: "#FEF2F2", border: "#DC2626", color: "#DC2626", text: "AI ENGINE · DEGRADED (FALLBACK ACTIVE)" },
  };
  const cfg = configs[status];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        fontSize: 10,
        fontWeight: 700,
        color: cfg.color,
        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
        letterSpacing: "0.06em",
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
      {cfg.text}
    </div>
  );
}

export function IntegrationBadge({
  status = "OFFLINE",
}: {
  status?: "iGOT" | "LOCAL" | "OFFLINE";
}) {
  if (status === "iGOT") {
    return (
      <span
        style={{
          padding: "2px 8px",
          border: "1px solid #059669",
          background: "#D1FAE5",
          color: "#059669",
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
        }}
      >
        iGOT KARMAYOGI · CONNECTED
      </span>
    );
  }
  if (status === "LOCAL") {
    return (
      <span
        style={{
          padding: "2px 8px",
          border: "1px solid #E2E8F0",
          background: "#F1F5F9",
          color: "#64748B",
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
        }}
      >
        LOCAL CATALOGUE · ACTIVE
      </span>
    );
  }
  return (
    <span
      style={{
        padding: "2px 8px",
        border: "1px solid #DC2626",
        background: "#FEF2F2",
        color: "#DC2626",
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
      }}
    >
      iGOT · UNAVAILABLE
    </span>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        background: "#fff",
        border: "1px solid #E2E8F0",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8, color: "#94A3B8" }}>⌕</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#2C302E", marginBottom: 6 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#64748B",
          maxWidth: 420,
          margin: "0 auto 16px",
          lineHeight: 1.6,
        }}
      >
        {description}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: "8px 18px",
            background: "#FF6F59",
            border: "none",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Service Interruption",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      style={{
        padding: "24px",
        background: "#FEF2F2",
        border: "1px solid #DC2626",
        margin: "16px 0",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 800, color: "#DC2626", marginBottom: 4 }}>
        ⚠ {title}
      </div>
      <div style={{ fontSize: 12, color: "#2C302E", lineHeight: 1.6, marginBottom: 12 }}>
        {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "6px 14px",
            background: "#DC2626",
            border: "none",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Retry Request
        </button>
      )}
    </div>
  );
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm Action",
  isDestructive = false,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 39, 68, 0.45)",
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
          maxWidth: 460,
          background: "#fff",
          border: `2px solid ${isDestructive ? "#DC2626" : "#FF6F59"}`,
          padding: 24,
          boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: isDestructive ? "#DC2626" : "#2C302E",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 20 }}>
          {message}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 18px",
              background: "#fff",
              border: "1px solid #E2E8F0",
              color: "#64748B",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 20px",
              background: isDestructive ? "#DC2626" : "#FF6F59",
              border: "none",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
