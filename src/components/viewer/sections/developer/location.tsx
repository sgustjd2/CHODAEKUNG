import { DSection } from "./d-section";
import { LocationMap } from "../../location-map";
import type { LocationContent } from "@/lib/invitation/types";

export function DevLocation({ content }: { content: LocationContent }) {
  const rows = content.rows ?? [];
  const rowVal = (re: RegExp) => rows.find((r) => re.test(r.k))?.v;
  const lat = Number(rowVal(/^lat/i));
  const lng = Number(rowVal(/^(lng|lon)/i));
  const addr = rowVal(/addr|주소|location|장소|venue/i) ?? "";
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
      <LocationMap className="iv-locmap" address={addr} lat={Number.isNaN(lat) ? undefined : lat} lng={Number.isNaN(lng) ? undefined : lng} />
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
