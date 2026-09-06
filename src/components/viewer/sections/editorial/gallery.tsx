import { ESection } from "./e-section";
import { photoUrl } from "@/lib/photo";
import type { GalleryContent } from "@/lib/invitation/types";

export function EditorialGallery({ content }: { content: GalleryContent }) {
  return (
    <ESection num={content.num} label={content.eyebrow} headline={content.title}>
      <div className="e-mag-gallery">
        {content.images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} className={`p${i + 1}`} src={photoUrl(img.src)} alt="" loading="lazy" decoding="async" />
        ))}
      </div>
      {content.caption && (
        <div className="e-photo-cap e-gallery-cap">
          <span>{content.caption.l}</span>
          <span>{content.caption.r}</span>
        </div>
      )}
    </ESection>
  );
}
