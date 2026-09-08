"use client";

import { useEffect } from "react";
import { bumpViewAction } from "@/lib/invitation/actions";

/**
 * Counts one view the first time *this browser* opens a given published invitation.
 * Refreshes and repeat opens from the same browser don't re-count (localStorage guard),
 * so the dashboard shows unique views, not raw hits. If storage is blocked (private mode),
 * we count anyway — better a slight over-count than losing the view entirely.
 */
export function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `chodaekung:viewed:${slug}`;
    try {
      if (localStorage.getItem(key)) return; // already counted on this browser
      localStorage.setItem(key, "1");
    } catch {
      /* storage unavailable — fall through and count */
    }
    bumpViewAction(slug);
  }, [slug]);
  return null;
}
