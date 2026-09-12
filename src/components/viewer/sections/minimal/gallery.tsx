"use client";

import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { MinimalHead } from "./section-head";
import { photoUrl } from "@/lib/photo";
import { lightboxTriggerProps } from "../../lightbox";
import type { GalleryContent } from "@/lib/invitation/types";

export function MinimalGallery({ content, index }: { content: GalleryContent; index?: number }) {
  const [big, ...rest] = content.images;
  const srcs = content.images.map((im) => photoUrl(im.src));
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <div className="ivm-gallery">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {big && <img className="big iv-lb-src" src={srcs[0]} alt="" loading="lazy" decoding="async" {...lightboxTriggerProps(srcs, 0)} />}
        <div className="col-r">
          {rest.map((im, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={srcs[i + 1]} alt="" loading="lazy" decoding="async" className="iv-lb-src" {...lightboxTriggerProps(srcs, i + 1)} />
          ))}
        </div>
      </div>
    </div>
  );
}
