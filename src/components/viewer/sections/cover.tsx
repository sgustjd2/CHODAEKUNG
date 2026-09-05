import { Fragment } from "react";
import type { CoverContent } from "@/lib/invitation/types";

export function CoverSection({ content }: { content: CoverContent }) {
  const { image, brand, seal, eyebrow, names, connector, title, dateLabel } = content;
  return (
    <div className="iv-cover" style={{ backgroundImage: `url('/assets/photos/${image}.jpg')` }}>
      <div className="iv-cover-top">
        {brand && <div className="iv-brand">{brand}</div>}
        {seal && <div className="iv-mini-seal">{seal}</div>}
      </div>
      <div className="iv-cover-bot">
        <div className="iv-cover-eb">{eyebrow}</div>
        <div className="iv-cover-couple">
          {names
            ? names.map((n, i) => (
                <Fragment key={i}>
                  {i > 0 && (connector ? <span className="and">{connector}</span> : <br />)}
                  {n}
                </Fragment>
              ))
            : title}
        </div>
        <div className="iv-cover-date">{dateLabel}</div>
      </div>
    </div>
  );
}
