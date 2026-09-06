"use client";

import { useState } from "react";
import type { AccountContent } from "@/lib/invitation/types";
import { lineText } from "@/lib/invitation/meta";

/**
 * "마음 전하기" — gift/congratulatory bank accounts with copy-to-clipboard.
 * One theme-agnostic renderer (a neutral info card) registered for every theme.
 */
export function AccountSection({ content }: { content: AccountContent }) {
  const [copied, setCopied] = useState<number | null>(null);
  const title = lineText(content.title);

  const copy = (i: number, number: string) => {
    try {
      navigator.clipboard?.writeText(number.trim());
      setCopied(i);
      setTimeout(() => setCopied((c) => (c === i ? null : c)), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <section className="iv-account">
      {content.eyebrow && <div className="acc-eb">{content.eyebrow}</div>}
      {title && <h3 className="acc-title">{title}</h3>}
      {content.note && <p className="acc-note">{content.note}</p>}
      <div className="acc-list">
        {content.accounts.map((a, i) => (
          <div className="acc-card" key={i}>
            <div className="acc-info">
              {a.side && <span className="acc-side">{a.side}</span>}
              <div className="acc-bank">
                {a.bank} {a.number}
              </div>
              {a.holder && <div className="acc-holder">{a.holder}</div>}
            </div>
            <button type="button" className="acc-copy" onClick={() => copy(i, a.number)} aria-label={`${a.bank} 계좌번호 복사`}>
              {copied === i ? "복사됨" : "복사"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
