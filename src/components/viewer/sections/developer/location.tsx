import { DSection } from "./d-section";
import type { LocationContent } from "@/lib/invitation/types";

export function DevLocation({ content }: { content: LocationContent }) {
  return (
    <DSection name={content.eyebrow} badge="GEO">
      {content.rows?.map((r, i) => {
        const isNum = /^[\d.]+$/.test(r.v);
        return (
          <div className="d-output" key={i}>
            <span className="key">{r.k}</span>:{" "}
            {isNum ? <span style={{ color: "#A0A8B8" }}>{r.v}</span> : <span className="str">&quot;{r.v}&quot;</span>}
          </div>
        );
      })}
      {content.mapButtons.length > 0 && (
        <div className="d-btns">
          {content.mapButtons.map((b, i) => (
            <button type="button" key={i} className={`d-btn${b.primary ? " primary" : ""}`}>
              {b.label}
            </button>
          ))}
        </div>
      )}
    </DSection>
  );
}
