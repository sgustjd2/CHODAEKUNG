import type { CountdownContent } from "@/lib/invitation/types";

export function BattleCountdown({ content }: { content: CountdownContent }) {
  return (
    <div className="ivb-countdown">
      <div className="ivb-cd-lbl">{content.label}</div>
      <div className="ivb-cd-time">
        {content.cells.map((c, i) => (
          <div className={`ivb-cd-cell${c.warn ? " warn" : ""}`} key={i}>
            <div className="n">{c.n}</div>
            <div className="l">{c.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
