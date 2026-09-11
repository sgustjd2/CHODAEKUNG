import { ESection } from "./e-section";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { MessageContent } from "@/lib/invitation/types";

export function EditorialArticle({ content }: { content: MessageContent }) {
  return (
    <ESection num={content.num} label={content.eyebrow} headline={content.title}>
      <div className={`e-body${content.twoCol ? " two-col" : ""}`}>
        {content.body.map((line, i) => (
          <p key={i}>
            {i === 0 && content.dropCap && <span className="drop"><Editable path="dropCap">{content.dropCap}</Editable></span>}
            <Editable path={`body.${i}`}><Rich lines={[line]} /></Editable>
          </p>
        ))}
      </div>
    </ESection>
  );
}
