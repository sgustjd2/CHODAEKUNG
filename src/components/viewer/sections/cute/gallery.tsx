import { CCard } from "./c-card";
import { photoUrl } from "@/lib/photo";
import type { GalleryContent } from "@/lib/invitation/types";

export function CuteGallery({ content }: { content: GalleryContent }) {
  return (
    <CCard eb={content.eyebrow} ebVariant="sage" title={content.title}>
      <div className="c-gallery">
        {content.images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={photoUrl(img.src)} alt="" />
        ))}
      </div>
    </CCard>
  );
}
