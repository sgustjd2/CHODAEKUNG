import Link from "next/link";

/** Branded 404 — shown for unknown routes and for invitation links that no longer resolve
 * (deleted, draft, or mistyped), so recipients of a dead share link get a friendly page
 * instead of a stray sample invitation. */
export default function NotFound() {
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
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "8px 0 0", letterSpacing: "-0.01em" }}>초대장을 찾을 수 없어요</h1>
      <p style={{ fontSize: 14, color: "var(--muted, #8a8a95)", lineHeight: 1.6, margin: 0, maxWidth: 320 }}>
        링크가 만료되었거나 삭제되었을 수 있어요. 주소를 다시 확인해 주세요.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 6,
          textDecoration: "none",
          background: "var(--wax, #e38b8b)",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        초대쿵 홈으로
      </Link>
    </main>
  );
}
