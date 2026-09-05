"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { RevealAnim } from "@/lib/invitation/types";

/**
 * Wraps one section and reveals it as it scrolls into view (public viewer only).
 * Starts hidden via CSS (`.iv-rv-<anim>`), adds `.in` when intersecting.
 * `prefers-reduced-motion` disables the effect in CSS; if IntersectionObserver
 * is unavailable, content reveals immediately so nothing stays hidden.
 */
export function Reveal({ anim, index, children }: { anim: RevealAnim; index: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    // Already in view on load (e.g. the cover)? Reveal now — IO's first callback can be
    // delayed or paused for a backgrounded tab, and a share page must never stay blank.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`iv-reveal iv-rv-${anim}${shown ? " in" : ""}`}
      style={shown ? { transitionDelay: `${Math.min(index, 5) * 60}ms` } : undefined}
    >
      {children}
    </div>
  );
}
