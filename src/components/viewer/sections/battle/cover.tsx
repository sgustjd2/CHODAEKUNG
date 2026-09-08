import { Fragment } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { photoUrl } from "@/lib/photo";
import type { CoverContent } from "@/lib/invitation/types";

export function BattleCover({ content }: { content: CoverContent }) {
  return (
    <div className="ivb-cover" style={{ backgroundImage: `url('${photoUrl(content.image)}')` }}>
      <div className="ivb-cover-top">
        {content.headerLeft && <div className="ivb-issue"><Editable path="headerLeft">{content.headerLeft}</Editable></div>}
        {content.headerRightLines && (
          <div className="ivb-date-tag">
            {content.headerRightLines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                <Editable path={`headerRightLines.${i}`}>{l}</Editable>
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="ivb-cover-bot">
        {content.eyebrow && <div className="ivb-challenge-lbl"><Editable path="eyebrow">{content.eyebrow}</Editable></div>}
        {content.titleLines && (
          <div className="ivb-title-huge">
            <Editable path="titleLines" multiline><Rich lines={content.titleLines} /></Editable>
          </div>
        )}
        {content.subtitle && <div className="ivb-title-sub"><Editable path="subtitle">{content.subtitle}</Editable></div>}
      </div>
    </div>
  );
}
