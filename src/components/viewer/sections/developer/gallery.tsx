"use client";

import { DSection } from "./d-section";
import { photoUrl } from "@/lib/photo";
import { lightboxTriggerProps } from "../../lightbox";
import type { GalleryContent } from "@/lib/invitation/types";

export function DevGallery({ content }: { content: GalleryContent }) {
  const srcs = content.images.map((im) => photoUrl(im.src));
  return (
    <DSection name={content.eyebrow} badge="./past-events">
      <div className="d-gallery">
        {content.images.map((img, i) => (
          <div className="d-gallery-item" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={srcs[i]} alt="" loading="lazy" decoding="async" className="iv-lb-src" {...lightboxTriggerProps(srcs, i)} />
            <div className="cap">v0{i + 1}.jpg</div>
          </div>
        ))}
      </div>
    </DSection>
  );
}
