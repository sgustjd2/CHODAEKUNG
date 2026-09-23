/**
 * Shrink a camera photo before upload. Phone photos are ~4000px / 3–8MB — far more than a phone screen
 * shows, yet every guest downloaded them in full (gallery uploads went up untouched), and anything over
 * the 5MB upload cap was simply rejected. Downscales JPEG-family photos to a `maxEdge` long edge and
 * re-encodes as JPEG.
 *
 * Left untouched: PNG / WebP / GIF / SVG (may carry transparency or animation), images already small, and
 * anything the browser can't decode (e.g. HEIC outside Safari) — the caller falls back to the original.
 * Never returns a larger file than it was given.
 *
 * Self-contained on purpose (no module-scope references): the e2e test runs this exact function in a real
 * browser via its source.
 */
export async function shrinkForUpload(file: File, maxEdge = 2048, quality = 0.85): Promise<File> {
  if (!/^image\/(jpe?g|heic|heif)$/i.test(file.type)) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode(); // natural size is EXIF-orientation-corrected in current browsers
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const scale = Math.min(1, maxEdge / Math.max(w, h));
    if (scale === 1 && file.size <= 1.5 * 1024 * 1024) return file; // already small enough
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file; // never make it worse
    const base = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(url);
  }
}
