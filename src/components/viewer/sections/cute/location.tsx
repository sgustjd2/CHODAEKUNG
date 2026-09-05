import { CCard } from "./c-card";
import { Icon } from "@/components/ui/icon";
import { photoUrl } from "@/lib/photo";
import type { LocationContent } from "@/lib/invitation/types";

export function CuteLocation({ content }: { content: LocationContent }) {
  return (
    <CCard eb={content.eyebrow} ebVariant="sage" title={content.title}>
      {content.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="c-photo" src={photoUrl(content.photo)} alt="" />
      )}
      {content.address && (
        <div className="c-addr">
          <div className="ic">
            <Icon name="ic-pin" width={18} height={18} />
          </div>
          <div>
            <div className="t">{content.address.t}</div>
            <div className="a">{content.address.a}</div>
          </div>
        </div>
      )}
      {content.mapButtons.length > 0 && (
        <div className="c-loc-actions">
          {content.mapButtons.map((b, i) => (
            <div className={`c-loc-btn${b.primary ? " primary" : ""}`} key={i}>
              {b.label}
            </div>
          ))}
        </div>
      )}
    </CCard>
  );
}
