import { Rich } from "../../rich-text";
import { MinimalHead } from "./section-head";
import type { GalleryContent } from "@/lib/invitation/types";

export function MinimalGallery({ content, index }: { content: GalleryContent; index?: number }) {
  const [big, ...rest] = content.images;
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Rich lines={content.title} />
      </div>
      <div className="ivm-gallery">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {big && <img className="big" src={`/assets/photos/${big.src}.jpg`} alt="" />}
        <div className="col-r">
          {rest.map((im, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={`/assets/photos/${im.src}.jpg`} alt="" />
          ))}
        </div>
      </div>
    </div>
  );
}
