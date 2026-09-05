import { CCard } from "./c-card";
import type { DateContent } from "@/lib/invitation/types";

export function CuteDate({ content }: { content: DateContent }) {
  const cd = content.countdown;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <CCard eb={content.eyebrow} ebVariant="butter" title={content.title}>
      {content.pill && (
        <div className="c-date-pill">
          <span className="en">{content.pill.en}</span> {content.pill.text}
        </div>
      )}
      {cd && (
        <div className="c-countdown">
          <div className="c-cd">
            <div className="n">{pad(cd.days)}</div>
            <div className="l">Days</div>
          </div>
          <div className="c-cd">
            <div className="n">{pad(cd.hrs)}</div>
            <div className="l">Hrs</div>
          </div>
          <div className="c-cd">
            <div className="n">{pad(cd.min)}</div>
            <div className="l">Min</div>
          </div>
        </div>
      )}
    </CCard>
  );
}
