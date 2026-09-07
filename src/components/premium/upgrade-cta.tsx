"use client";

import { useState } from "react";
import { PREMIUM_FEATURES, PREMIUM_PRICE_LABEL } from "@/lib/invitation/entitlements";

/**
 * Reusable premium upsell shown wherever a free invitation hits a gate. Payments aren't wired yet,
 * so the button just reveals a "coming soon" note — when checkout lands, swap that for the real flow.
 */
export function UpgradeCta({ title, feature, compact }: { title?: string; feature?: string; compact?: boolean }) {
  const [noted, setNoted] = useState(false);
  const feat = feature ? PREMIUM_FEATURES.find((f) => f.key === feature) : null;
  return (
    <div
      style={{
        border: "1px solid var(--line, #e2dcd2)",
        background: "var(--paper-2, #f5f1ea)",
        borderRadius: 14,
        padding: compact ? "12px 14px" : "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        color: "var(--ink, #1a1a2e)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "var(--wax-deep, #7b2d2e)" }}>✦ PREMIUM</div>
      <div style={{ fontSize: compact ? 14 : 15, fontWeight: 700, lineHeight: 1.5 }}>
        {title || feat?.label || "프리미엄 기능이에요"}
      </div>
      {!compact && (
        <ul style={{ margin: "2px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
          {PREMIUM_FEATURES.map((f) => (
            <li key={f.key} style={{ fontSize: 13, color: "var(--muted, #8a8a95)", lineHeight: 1.5 }}>· {f.label}</li>
          ))}
        </ul>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setNoted(true)}
          style={{
            border: "none",
            cursor: "pointer",
            background: "var(--wax, #e38b8b)",
            color: "#fff",
            padding: "9px 16px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          프리미엄 잠금 해제
        </button>
        <span style={{ fontSize: 12, color: "var(--muted, #8a8a95)" }}>{noted ? "결제 기능은 곧 제공돼요 🙏" : PREMIUM_PRICE_LABEL}</span>
      </div>
    </div>
  );
}
