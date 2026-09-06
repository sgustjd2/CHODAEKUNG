"use client";

import { useEffect, useState } from "react";
import type { AttendeesContent } from "@/lib/invitation/types";
import { lineText } from "@/lib/invitation/meta";
import { listAttendeesAction } from "@/lib/invitation/actions";

/**
 * Live 참석자 roster — fills with the names of people who RSVP'd 참석. Fetches on the
 * live page, refetches immediately when someone RSVPs on this page (the "chodaekung:rsvp"
 * event from ShareBar), and polls every 12s for others' responses. Empty in preview/editor.
 */
export function AttendeesSection({ content, slug, preview }: { content: AttendeesContent; slug?: string; preview?: boolean }) {
  const title = lineText(content.title);
  const [names, setNames] = useState<string[]>([]);
  const noDb = preview || !slug;

  useEffect(() => {
    if (noDb || !slug) return;
    let alive = true;
    const load = () =>
      listAttendeesAction(slug)
        .then((r) => {
          if (alive && r.ok) setNames(r.names);
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
  }, [slug, noDb]);

  return (
    <section className="iv-attendees">
      {content.eyebrow && <div className="att-eb">{content.eyebrow}</div>}
      {title && <h3 className="att-title">{title}</h3>}
      {content.note && <p className="att-note">{content.note}</p>}
      {names.length > 0 && <div className="att-count">{names.length}명 참석</div>}
      <div className="att-list">
        {names.length === 0 ? (
          <div className="att-empty">참석을 눌러 첫 번째 참석자가 되어보세요 🙌</div>
        ) : (
          names.map((n, i) => (
            <span className="att-chip" key={`${n}-${i}`}>
              {n}
            </span>
          ))
        )}
      </div>
    </section>
  );
}
