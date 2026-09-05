"use client";

import { useState } from "react";
import { TlSection } from "./tl-section";
import type { ChecklistContent } from "@/lib/invitation/types";

export function TimelineChecklist({ content }: { content: ChecklistContent }) {
  const [checked, setChecked] = useState<boolean[]>(content.items.map((i) => !!i.checked));
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="checklist">
        {content.items.map((it, i) => (
          <div
            key={i}
            className={`check-item${checked[i] ? " checked" : ""}`}
            role="checkbox"
            aria-checked={checked[i]}
            tabIndex={0}
            onClick={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
          >
            <div className="check-box">
              {checked[i] && (
                <svg fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="check-text">{it.text}</span>
            <span className="check-owner">{it.owner}</span>
          </div>
        ))}
      </div>
    </TlSection>
  );
}
