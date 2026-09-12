/**
 * Pure geometry for the cover ImageCropper (no DOM/React) — extracted so the crop math is
 * unit-testable. The image is displayed "cover" over a fixed-aspect frame and panned/zoomed:
 * `dispScale = coverScale × zoom`, `pos` is the image's top-left offset (px) within the frame.
 */

export type Pos = { x: number; y: number };

/** Scale at which the image just covers the frame (the zoom=1 baseline). */
export function coverScale(imgW: number, imgH: number, frameW: number, frameH: number): number {
  return Math.max(frameW / imgW, frameH / imgH);
}

/** Clamp the pan offset so the (scaled) image always fully covers the frame — no empty gaps. */
export function clampPos(pos: Pos, dispW: number, dispH: number, frameW: number, frameH: number): Pos {
  return {
    x: Math.min(0, Math.max(frameW - dispW, pos.x)),
    y: Math.min(0, Math.max(frameH - dispH, pos.y)),
  };
}

/** The source-pixel region of the image that the frame currently shows, plus the output canvas size
 * (frame aspect, capped at `maxOut` px wide). `drawImage(img, sx,sy,sw,sh, 0,0, outW,outH)`. */
export function cropRegion(params: {
  imgW: number;
  imgH: number;
  frameW: number;
  frameH: number;
  zoom: number;
  pos: Pos;
  aspect: number;
  maxOut?: number;
}): { sx: number; sy: number; sw: number; sh: number; outW: number; outH: number; dispScale: number } {
  const { imgW, imgH, frameW, frameH, zoom, pos, aspect, maxOut = 1600 } = params;
  const dispScale = coverScale(imgW, imgH, frameW, frameH) * zoom;
  const outW = Math.min(maxOut, Math.round(frameW * 2));
  const outH = Math.round(outW / aspect);
  return {
    sx: -pos.x / dispScale,
    sy: -pos.y / dispScale,
    sw: frameW / dispScale,
    sh: frameH / dispScale,
    outW,
    outH,
    dispScale,
  };
}
