"use client";

import { useState } from "react";
import { DSection } from "./d-section";
import { Rich } from "../../rich-text";
import type { RsvpContent } from "@/lib/invitation/types";

export function DevRsvp({ content }: { content: RsvpContent }) {
  const [sel, setSel] = useState(content.defaultSelected ?? 0);
  const p = content.progress;
  const filled = p ? Math.round((p.filled / p.total) * 25) : 0;
  const bar = p ? "▓".repeat(filled) + "░".repeat(25 - filled) : "";
  return (
    <DSection name={content.eyebrow} badge="required">
      <div className="d-rsvp">
        <div className="q">
          <span className="prompt">?</span> <Rich lines={content.title} />
        </div>
        <div className="d-rsvp-opts">
          {content.options.map((o, i) => (
            <div
              key={i}
              className={`d-rsvp-opt${sel === i ? " selected" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={sel === i}
              onClick={() => setSel(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(i)}
            >
              {o}
            </div>
          ))}
        </div>
      </div>
      {p && (
        <>
          <div className="d-progress">
            <span className="bar">{bar}</span>
            <span className="pct">
              {p.filled} / {p.total}
            </span>
          </div>
          <div className="d-output">
            <span className="comment">{`// ${p.filled} of ${p.total} seats filled · ${p.total - p.filled} remaining`}</span>
          </div>
        </>
      )}
    </DSection>
  );
}
