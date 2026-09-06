import { Icon } from "@/components/ui/icon";
import type { EndingContent } from "@/lib/invitation/types";

export function DevEnding({ content }: { content: EndingContent }) {
  return (
    <>
      <div className="d-section">
        <div className="d-sec-head">share</div>
        <div className="d-btns d-btns-4">
          <button type="button" className="d-btn">$ share --kakao</button>
          <button type="button" className="d-btn">$ copy-url</button>
          <button type="button" className="d-btn">$ gen-qr</button>
          <button type="button" className="d-btn primary">$ export-cal</button>
        </div>
      </div>

      <div className="d-end">
        <div className="d-cmd">
          <span className="prompt">$</span> echo &quot;{content.signature}&quot;
        </div>
        <div className="d-output">{content.signature}</div>
        <br />
        <div>
          CHODAEKUNG · <span className="accent">v0.1.0</span> · MIT License
        </div>
        <div className="d-made">
          Made in Seoul · <Icon name="ic-heart-fill" className="d-heart" width={10} height={10} /> · {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
}
