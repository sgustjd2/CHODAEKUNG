"use client";

import { ESection } from "./e-section";
import { Editable } from "../../editable";
import { photoUrl } from "@/lib/photo";
import { lightboxTriggerProps } from "../../lightbox";
import type { GalleryContent } from "@/lib/invitation/types";

export function EditorialGallery({ content }: { content: GalleryContent }) {
  const srcs = content.images.map((im) => photoUrl(im.src));
  return (
    <ESection num={content.num} label={content.eyebrow} headline={content.title}>
      <div className="e-mag-gallery">
        {content.images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} className={`iv-lb-src p${i + 1}`} src={srcs[i]} alt="" loading="lazy" decoding="async" {...lightboxTriggerProps(srcs, i)} />
        ))}
      </div>
      {content.caption && (
        <div className="e-photo-cap e-gallery-cap">
          <span><Editable path="caption.l">{content.caption.l}</Editable></span>
          <span><Editable path="caption.r">{content.caption.r}</Editable></span>
        </div>
      )}
    </ESection>
  );
}
