import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { QuoteContent } from "@/lib/invitation/types";

export function EditorialQuote({ content }: { content: QuoteContent }) {
  return (
    <div className="e-quote">
      <Editable path="text" multiline><Rich lines={content.text} /></Editable>
    </div>
  );
}
