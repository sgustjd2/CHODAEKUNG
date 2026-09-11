"use client";

import { useEffect, useState } from "react";
import { listAttendeesAction, attendingCountAction } from "@/lib/invitation/actions";

export type Party = {
  avatars: { label: string; tone?: number }[];
  more?: string;
  countLabel: string;
  countSub: string;
};

/**
 * The party block (avatars + "N명 확정 · 자리 남음") driven by real RSVPs on the published page.
 * In the editor/preview (no slug, or preview) it returns the template's `fallback` so the block
 * still looks populated while authoring. Live, it derives avatars from confirmed 참석 names and the
 * headcount, refreshing on this page's RSVP event and polling for others'. `capacity` fills
 * "N자리 남음"; without one that line is dropped rather than showing the template's sample number.
 */
export function useLiveParty(slug: string | undefined, preview: boolean, capacity: number | undefined, fallback?: Party): Party | undefined {
  const [live, setLive] = useState<{ names: string[]; count: number } | null>(null);
  const off = preview || !slug;

  useEffect(() => {
    if (off || !slug) return;
    let alive = true;
    const load = () =>
      Promise.all([listAttendeesAction(slug), attendingCountAction(slug)])
        .then(([a, c]) => {
          if (alive && a.ok && c.ok) setLive({ names: a.names, count: c.count });
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 12000);
    const onRsvp = () => load();
    window.addEventListener("chodaekung:rsvp", onRsvp);
    return () => {
      alive = false;
      clearInterval(id);
      window.removeEventListener("chodaekung:rsvp", onRsvp);
    };
  }, [slug, off]);

  if (off || !live) return fallback; // editor/preview, or before the first fetch → template party
  const avatars = live.names.slice(0, 5).map((n, i) => ({ label: n.trim().charAt(0) || "?", tone: (i % 5) + 1 }));
  const more = live.names.length > 5 ? `+${live.names.length - 5}` : undefined;
  const remaining = typeof capacity === "number" && capacity > 0 ? Math.max(0, capacity - live.count) : null;
  return {
    avatars,
    more,
    countLabel: `${live.count}명 확정`,
    countSub: remaining != null ? `${remaining}자리 남음` : "",
  };
}
