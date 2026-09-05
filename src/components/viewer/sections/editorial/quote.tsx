import { Rich } from "../../rich-text";
import type { QuoteContent } from "@/lib/invitation/types";

export function EditorialQuote({ content }: { content: QuoteContent }) {
  return (
    <div className="e-quote">
      <Rich lines={content.text} />
    </div>
  );
}
