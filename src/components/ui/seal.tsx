import type { CSSProperties, ReactNode } from "react";

/** Wax-seal accent (.seal). Override size/font via `style`. */
export function Seal({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={["seal", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </span>
  );
}
