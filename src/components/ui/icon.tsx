import type { SVGProps } from "react";

/**
 * Renders one symbol from the shared sprite at /public/assets/moi-symbols.svg.
 * Size via width/height or CSS; color via `color` (icons use currentColor).
 */
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: string }) {
  return (
    <svg aria-hidden="true" focusable="false" {...props}>
      <use href={`/assets/moi-symbols.svg#${name}`} />
    </svg>
  );
}
