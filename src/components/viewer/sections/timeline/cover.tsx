import { Fragment } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { Icon } from "@/components/ui/icon";
import type { CoverContent } from "@/lib/invitation/types";

export function TimelineCover({ content }: { content: CoverContent }) {
  return (
    <div className={`tl-cover${content.bg ? ` tl-cover-${content.bg}` : ""}`}>
      {content.eyebrow && <div className="tl-brand-line"><Editable path="eyebrow">{content.eyebrow}</Editable></div>}
      {content.titleLines && (
        <h1>
          <Editable path="titleLines" multiline><Rich lines={content.titleLines} /></Editable>
        </h1>
      )}
      {content.subtitleLines && (
        <div className="sub">
          {content.subtitleLines.map((l, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              <Editable path={`subtitleLines.${i}`}>{l}</Editable>
            </Fragment>
          ))}
        </div>
      )}
      {content.badges && (
        <div className="tl-badge-row">
          {content.badges.map((b, i) => (
            <div key={i} className={`tl-badge${b.variant ? " " + b.variant : ""}`}>
              {b.icon && <Icon name={b.icon} />}
              {b.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
