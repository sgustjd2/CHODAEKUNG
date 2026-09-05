import { DSection } from "./d-section";
import type { GalleryContent } from "@/lib/invitation/types";

export function DevGallery({ content }: { content: GalleryContent }) {
  return (
    <DSection name={content.eyebrow} badge="./past-events">
      <div className="d-gallery">
        {content.images.map((img, i) => (
          <div className="d-gallery-item" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/assets/photos/${img.src}.jpg`} alt="" />
            <div className="cap">v0{i + 1}.jpg</div>
          </div>
        ))}
      </div>
    </DSection>
  );
}
