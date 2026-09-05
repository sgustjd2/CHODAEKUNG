import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "wax" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  wax: "btn-wax",
  ghost: "btn-ghost",
  outline: "btn-outline",
};
const SIZE: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

/** Design-system button — maps to tokens.css .btn variants. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      type={type}
      className={["btn", VARIANT[variant], SIZE[size], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
