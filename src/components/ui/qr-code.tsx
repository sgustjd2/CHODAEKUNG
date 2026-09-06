import qrcode from "qrcode-generator";

/**
 * Rasterize the QR (with a quiet zone, no logo) to a PNG and trigger a download.
 * Logo-less on purpose: a printed/saved QR should be maximally scannable.
 * Browser-only (uses canvas) — call from a click handler.
 */
export async function downloadQrPng(value: string, filename = "qr.png", size = 1024) {
  const qr = qrcode(0, "H");
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 4;
  const total = n + quiet * 2;
  const scale = Math.max(1, Math.floor(size / total));
  const px = total * scale;
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, px, px);
  ctx.fillStyle = "#1A1A2E";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
    }
  }
  await new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
      resolve();
    }, "image/png");
  });
}

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
