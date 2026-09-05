import { Rich } from "../rich-text";
import type { GalleryContent } from "@/lib/invitation/types";

export function GallerySection({ content }: { content: GalleryContent }) {
  return (
    <div className="iv-section iv-gallery">
      <div className="iv-eb">{content.eyebrow}</div>
      <div className="iv-title" style={{ marginBottom: 20 }}>
        <Rich lines={content.title} />
      </div>
      <div className="iv-gallery-grid">
        {content.images.map((im, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={`/assets/photos/${im.src}.jpg`} alt="" className={im.tall ? "tall" : undefined} />
        ))}
      </div>
    </div>
  );
}
