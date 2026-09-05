import { Fragment } from "react";
import { Rich } from "../../rich-text";
import type { CoverContent } from "@/lib/invitation/types";

export function BattleCover({ content }: { content: CoverContent }) {
  return (
    <div className="ivb-cover" style={{ backgroundImage: `url('/assets/photos/${content.image}.jpg')` }}>
      <div className="ivb-cover-top">
        {content.headerLeft && <div className="ivb-issue">{content.headerLeft}</div>}
        {content.headerRightLines && (
          <div className="ivb-date-tag">
            {content.headerRightLines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {l}
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="ivb-cover-bot">
        {content.eyebrow && <div className="ivb-challenge-lbl">{content.eyebrow}</div>}
        {content.titleLines && (
          <div className="ivb-title-huge">
            <Rich lines={content.titleLines} />
          </div>
        )}
        {content.subtitle && <div className="ivb-title-sub">{content.subtitle}</div>}
      </div>
    </div>
  );
}
