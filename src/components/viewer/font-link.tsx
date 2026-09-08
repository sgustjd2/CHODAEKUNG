"use client";

import { useEffect } from "react";
import { googleFontHref } from "@/lib/invitation/fonts";

/**
 * Loads a user-selected Google font on demand by injecting one <link> into <head>.
 * Idempotent (keyed by the family query) and additive — switching fonts in the editor just
 * appends the new one; Google auto-subsets so only the glyphs actually on the page download.
 * ponytail: injected client-side, so a non-default font on the published page swaps in after
 * hydration (font-display:swap). Render it server-side on /i/[slug] later if that flash matters.
 */
export function FontLink({ google }: { google?: string }) {
  useEffect(() => {
    if (!google || typeof document === "undefined") return;
    const id = `iv-font-${google}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = googleFontHref(google);
    document.head.appendChild(link);
  }, [google]);
  return null;
}
