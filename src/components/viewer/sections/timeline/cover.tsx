import { Fragment } from "react";
import { Rich } from "../../rich-text";
import { Icon } from "@/components/ui/icon";
import type { CoverContent } from "@/lib/invitation/types";

export function TimelineCover({ content }: { content: CoverContent }) {
  return (
    <div className={`tl-cover${content.bg ? ` tl-cover-${content.bg}` : ""}`}>
      {content.eyebrow && <div className="tl-brand-line">{content.eyebrow}</div>}
      {content.titleLines && (
        <h1>
          <Rich lines={content.titleLines} />
        </h1>
      )}
      {content.subtitleLines && (
        <div className="sub">
          {content.subtitleLines.map((l, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {l}
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
