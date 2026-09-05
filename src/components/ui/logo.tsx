/** CHODAEKUNG horizontal lockup (MOMO + 초대 + 쿵 seal). Size via .ck-logo* classes. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={["ck-logo", className].filter(Boolean).join(" ")}
      viewBox="0 0 400 140"
      role="img"
      aria-label="초대쿵"
    >
      <use href="/assets/moi-symbols.svg#chodaekung-lockup" />
    </svg>
  );
}
