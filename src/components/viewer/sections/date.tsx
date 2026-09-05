import { Rich } from "../rich-text";
import type { DateContent } from "@/lib/invitation/types";

const pad = (n: number) => String(n).padStart(2, "0");

export function DateSection({ content }: { content: DateContent }) {
  const { eyebrow, title, calendar, countdown, tint } = content;
  const cd = countdown
    ? [
        { n: String(countdown.days), l: "Days" },
        { n: pad(countdown.hrs), l: "Hrs" },
        { n: pad(countdown.min), l: "Min" },
        { n: pad(countdown.sec), l: "Sec" },
      ]
    : [];
  return (
    <div className={`iv-section${tint ? " iv-tint" : ""}`}>
      <div className="iv-eb">{eyebrow}</div>
      <div className="iv-title">
        <Rich lines={title} />
      </div>

      {calendar && (
        <div className="iv-calendar">
          <div className="iv-cal-head">
            <Rich lines={[calendar.monthLabel]} />
          </div>
          <div className="iv-cal-grid">
            {calendar.weekdays.map((w, i) => (
              <div key={`h${i}`} className="iv-cal-day head">{w}</div>
            ))}
            {calendar.days.map((d, i) => (
              <div key={i} className={`iv-cal-day${d.dim ? " dim" : ""}${d.today ? " today" : ""}`}>{d.n}</div>
            ))}
          </div>
        </div>
      )}

      {cd.length > 0 && (
        <div className="iv-countdown">
          {cd.map((c) => (
            <div className="iv-cd" key={c.l}>
              <div className="n">{c.n}</div>
              <div className="l">{c.l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
