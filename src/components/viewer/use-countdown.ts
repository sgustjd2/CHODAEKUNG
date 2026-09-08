"use client";

import { useEffect, useState } from "react";

export type CountdownDiff = { d: number; h: number; m: number; s: number };

/**
 * Live countdown to `target` (ISO datetime, or a bare date). Returns null until the first client
 * tick — so the server render and first client render match (no hydration mismatch) — then updates
 * every second and clamps to zero once the target has passed. Returns null when there's no valid
 * target, so callers can fall back to their template values.
 */
export function useCountdown(target?: string): CountdownDiff | null {
  const targetDate = target ? new Date(target.includes("T") ? target : `${target}T00:00`) : null;
  const valid = !!targetDate && !Number.isNaN(targetDate.getTime());
  const [diff, setDiff] = useState<CountdownDiff | null>(null);

  useEffect(() => {
    if (!valid) return;
    const tick = () => {
      const ms = Math.max(0, targetDate!.getTime() - Date.now());
      const s = Math.floor(ms / 1000);
      setDiff({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, target]);

  return valid ? diff : null;
}
