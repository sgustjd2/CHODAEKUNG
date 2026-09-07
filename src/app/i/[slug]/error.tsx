"use client";

import { useEffect } from "react";

/**
 * Route error boundary for the public invitation page — the share-driven money page.
 * If a section renderer throws (e.g. an invitation published before a content-shape
 * change, whose stale data no longer matches the current renderer), the recipient of
 * a shared link gets this friendly, branded recovery page instead of a raw 500.
 * A 404 (notFound) is handled separately by not-found.tsx, not here.
 */
export default function InvitationError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface the real cause in logs (with Next's digest) for diagnosis; guests never see it.
    console.error("[chodaekung] invitation render error:", error.digest ?? "", error);
  }, [error]);

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
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "8px 0 0", letterSpacing: "-0.01em" }}>초대장을 여는 중 문제가 생겼어요</h1>
      <p style={{ fontSize: 14, color: "var(--muted, #8a8a95)", lineHeight: 1.6, margin: 0, maxWidth: 320 }}>
        잠시 후 다시 시도해 주세요. 문제가 계속되면 초대장을 만든 분께 알려주세요.
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={reset}
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
