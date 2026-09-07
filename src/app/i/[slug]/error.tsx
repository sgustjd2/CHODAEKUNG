"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/ui/error-screen";

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
    <ErrorScreen
      title="초대장을 여는 중 문제가 생겼어요"
      body="잠시 후 다시 시도해 주세요. 문제가 계속되면 초대장을 만든 분께 알려주세요."
      onRetry={reset}
    />
  );
}
