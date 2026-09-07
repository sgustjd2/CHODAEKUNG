"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/ui/error-screen";

/**
 * App-wide error boundary — the safety net for every route without its own error.tsx
 * (editor, dashboard, settings, rsvp, …). A render/data error there degrades to a
 * friendly branded page with a retry instead of a raw 500. The editor keeps its draft
 * in localStorage, so "다시 시도" (or reload) recovers the in-progress invitation.
 * The public invitation route has its own boundary (i/[slug]/error.tsx) with tailored copy.
 */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[chodaekung] app error:", error.digest ?? "", error);
  }, [error]);

  return (
    <ErrorScreen
      title="문제가 발생했어요"
      body="예상치 못한 오류가 생겼어요. 다시 시도하거나 홈으로 돌아가 주세요."
      onRetry={reset}
    />
  );
}
