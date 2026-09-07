"use client";

import type { ReactNode } from "react";

/**
 * Branded full-screen error/recovery state, shared by the app-wide and per-route error
 * boundaries so every crash degrades to the same friendly page (never a raw 500).
 * Presentational only — the boundary owns error logging and passes `onRetry` (its reset).
 */
export function ErrorScreen({ title, body, onRetry }: { title: string; body: ReactNode; onRetry?: () => void }) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "40px 24px",
        textAlign: "center",
        background: "var(--paper-2, #f5f1ea)",
        color: "var(--ink, #1a1a2e)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon.svg" alt="초대쿵" width={72} height={72} />
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "8px 0 0", letterSpacing: "-0.01em" }}>{title}</h1>
      <p style={{ fontSize: 14, color: "var(--muted, #8a8a95)", lineHeight: 1.6, margin: 0, maxWidth: 320 }}>{body}</p>
      <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              border: "none",
              cursor: "pointer",
              background: "var(--wax, #e38b8b)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            다시 시도
          </button>
        )}
        <a
          href="/"
          style={{
            textDecoration: "none",
            background: "transparent",
            color: "var(--ink, #1a1a2e)",
            border: "1px solid var(--line, #e2dcd2)",
            padding: "12px 24px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          초대쿵 홈으로
        </a>
      </div>
    </main>
  );
}
