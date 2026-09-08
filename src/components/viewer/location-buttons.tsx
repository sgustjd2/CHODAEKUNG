"use client";

import { useState } from "react";
import { mapHref, isCopyLabel } from "@/lib/invitation/map-links";

type Btn = { label: string; primary?: boolean };

/**
 * Renders a location section's action buttons functionally: a "주소 복사"-type button copies the
 * address to the clipboard; every other button opens the relevant map (Kakao/Naver/Google) in a new
 * tab. `primaryClass`/`normalClass` supply each theme's own button class as plain strings, so the
 * styling stays theme-specific — and, unlike a function, they cross the Server→Client boundary
 * (the caller renders on the server). Kept as <button> (not <a>) so the theme classes render
 * identically — these were inert before.
 */
export function LocationButtons({
  buttons,
  query,
  address,
  primaryClass,
  normalClass,
}: {
  buttons: Btn[];
  query: string;
  address: string;
  primaryClass: string;
  normalClass: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard?.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <>
      {buttons.map((b, i) => {
        const isCopy = isCopyLabel(b.label);
        return (
          <button
            key={i}
            type="button"
            className={b.primary ? primaryClass : normalClass}
            onClick={isCopy ? copy : () => window.open(mapHref(b.label, query), "_blank", "noopener,noreferrer")}
          >
            {isCopy && copied ? "복사됨" : b.label}
          </button>
        );
      })}
    </>
  );
}
