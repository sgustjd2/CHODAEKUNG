"use client";

import { CCard } from "./c-card";
import { photoUrl } from "@/lib/photo";
import { openLightbox } from "../../lightbox";
import type { GalleryContent } from "@/lib/invitation/types";

export function CuteGallery({ content }: { content: GalleryContent }) {
  const srcs = content.images.map((im) => photoUrl(im.src));
  return (
    <CCard eb={content.eyebrow} ebVariant="sage" title={content.title}>
      <div className="c-gallery">
        {content.images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={srcs[i]} alt="" loading="lazy" decoding="async" className="iv-lb-src" onClick={() => openLightbox(srcs, i)} />
        ))}
      </div>
    </CCard>
  );
}
