/** Minimal numbered section header (eyebrow + zero-padded index). */
export function MinimalHead({ eyebrow, index }: { eyebrow: string; index?: number }) {
  return (
    <div className="ivm-sec-num">
      <span>{eyebrow}</span>
      <span className="n">{index != null ? String(index).padStart(2, "0") : ""}</span>
    </div>
  );
}
