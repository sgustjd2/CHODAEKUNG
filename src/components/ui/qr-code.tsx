import qrcode from "qrcode-generator";

/**
 * Scannable QR as a crisp, printable SVG (one path of 1×1 module rects).
 * Error correction "H" (~30% recovery) tolerates the center logo overlay.
 * Deterministic from `value`, so it renders the same on server and client.
 */
export function QrCode({ value, className }: { value: string; className?: string }) {
  const qr = qrcode(0, "H");
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  return (
    <svg
      className={className}
      viewBox={`0 0 ${n} ${n}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="초대장 QR 코드"
    >
      <rect width={n} height={n} fill="#fff" />
      <path d={d} fill="#1A1A2E" />
    </svg>
  );
}
