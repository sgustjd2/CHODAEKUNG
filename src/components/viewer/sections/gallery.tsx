"use client";

import { Rich } from "../rich-text";
import { photoUrl } from "@/lib/photo";
import { openLightbox } from "../lightbox";
import type { GalleryContent } from "@/lib/invitation/types";

export function GallerySection({ content }: { content: GalleryContent }) {
  const srcs = content.images.map((im) => photoUrl(im.src));
  return (
    <div className="iv-section iv-gallery">
      <div className="iv-eb">{content.eyebrow}</div>
      <div className="iv-title" style={{ marginBottom: 20 }}>
        <Rich lines={content.title} />
      </div>
      <div className="iv-gallery-grid">
        {content.images.map((im, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={srcs[i]} alt="" loading="lazy" decoding="async" className={`iv-lb-src${im.tall ? " tall" : ""}`} onClick={() => openLightbox(srcs, i)} />
        ))}
      </div>
    </div>
  );
}
