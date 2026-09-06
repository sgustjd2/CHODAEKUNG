"use client";

import { useEffect, useState } from "react";
import type { DdayContent } from "@/lib/invitation/types";
import { lineText } from "@/lib/invitation/meta";

type Diff = { d: number; h: number; m: number; s: number };

function diffTo(target: Date): Diff | null {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/**
 * Live D-Day countdown to the invitation's eventStart (passed as `target`).
 * State starts null so server and first client render match (no hydration mismatch),
 * then a 1s interval fills it in. Renders nothing when there's no valid target.
 */
export function DdaySection({ content, target }: { content: DdayContent; target?: string }) {
  const title = lineText(content.title);
  const targetDate = target ? new Date(target.includes("T") ? target : `${target}T00:00`) : null;
  const valid = !!targetDate && !Number.isNaN(targetDate.getTime());

  const [t, setT] = useState<Diff | null>(null);
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (!valid) return;
    const tick = () => {
      const d = diffTo(targetDate!);
      if (d) setT(d);
      else {
        setReached(true);
        setT(null);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, target]);

  if (!valid) return null;

  const cells: [string, number | null][] = [
    ["일", t?.d ?? null],
    ["시", t?.h ?? null],
    ["분", t?.m ?? null],
    ["초", t?.s ?? null],
  ];

  return (
    <section className="iv-dday">
      {content.eyebrow && <div className="dday-eb">{content.eyebrow}</div>}
      {title && <h3 className="dday-title">{title}</h3>}
      {reached ? (
        <div className="dday-now">D-DAY 🎉</div>
      ) : (
        <div className="dday-grid">
          {cells.map(([l, n]) => (
            <div className="dday-cell" key={l}>
              <div className="dday-n">{n === null ? "--" : String(n).padStart(2, "0")}</div>
              <div className="dday-l">{l}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
