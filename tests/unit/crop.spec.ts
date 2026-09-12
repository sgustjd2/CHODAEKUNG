import { test, expect } from "@playwright/test";
import { clampPos, coverScale, cropRegion } from "@/lib/invitation/crop";

/**
 * Cover ImageCropper geometry. Locks the crop math (used by image-cropper.tsx via canvas.drawImage):
 * the output keeps the frame aspect, the source region matches what the frame shows, zoom crops
 * tighter, and a centered crop stays within the image bounds.
 */

test("coverScale is the larger ratio so the image covers the frame", () => {
  // square image into a 3:4 portrait frame → height binds (300/1000=0.3 vs 400/1000=0.4)
  expect(coverScale(1000, 1000, 300, 400)).toBeCloseTo(0.4, 5);
  // wide image into the same frame → width would leave a vertical gap, so height still binds larger
  expect(coverScale(1600, 900, 300, 400)).toBeCloseTo(400 / 900, 5);
});

test("clampPos keeps the scaled image covering the frame (no gaps)", () => {
  // disp 400×400 in a 300×400 frame: x ∈ [-100, 0], y ∈ [0, 0]
  expect(clampPos({ x: 100, y: 100 }, 400, 400, 300, 400)).toEqual({ x: 0, y: 0 }); // can't pan past top-left
  expect(clampPos({ x: -1000, y: -1000 }, 400, 400, 300, 400)).toEqual({ x: -100, y: 0 }); // clamped to bottom-right
  expect(clampPos({ x: -50, y: 0 }, 400, 400, 300, 400)).toEqual({ x: -50, y: 0 }); // in range, unchanged
});

test("cropRegion output keeps the frame aspect", () => {
  const r = cropRegion({ imgW: 1000, imgH: 1000, frameW: 300, frameH: 400, zoom: 1, pos: { x: -50, y: 0 }, aspect: 3 / 4 });
  expect(r.outW / r.outH).toBeCloseTo(3 / 4, 2);
  expect(r.sw / r.sh).toBeCloseTo(3 / 4, 5); // source region matches the frame's aspect
});

test("a centered zoom-1 crop maps to a valid in-bounds source region", () => {
  const imgW = 1000, imgH = 1000, frameW = 300, frameH = 400;
  const scale = coverScale(imgW, imgH, frameW, frameH); // 0.4
  const dispW = imgW * scale, dispH = imgH * scale; // 400 × 400
  const pos = clampPos({ x: (frameW - dispW) / 2, y: (frameH - dispH) / 2 }, dispW, dispH, frameW, frameH);
  const r = cropRegion({ imgW, imgH, frameW, frameH, zoom: 1, pos, aspect: 3 / 4 });
  expect(r.sx).toBeGreaterThanOrEqual(0);
  expect(r.sy).toBeGreaterThanOrEqual(0);
  expect(r.sx + r.sw).toBeLessThanOrEqual(imgW + 1e-6);
  expect(r.sy + r.sh).toBeLessThanOrEqual(imgH + 1e-6);
});

test("zooming in crops a tighter (smaller) source region", () => {
  const base = { imgW: 1000, imgH: 1000, frameW: 300, frameH: 400, pos: { x: 0, y: 0 }, aspect: 3 / 4 };
  const at1 = cropRegion({ ...base, zoom: 1 });
  const at2 = cropRegion({ ...base, zoom: 2 });
  expect(at2.sw).toBeCloseTo(at1.sw / 2, 5);
  expect(at2.sh).toBeCloseTo(at1.sh / 2, 5);
});

test("output width is capped at maxOut", () => {
  const r = cropRegion({ imgW: 4000, imgH: 6000, frameW: 1200, frameH: 1600, zoom: 1, pos: { x: 0, y: 0 }, aspect: 3 / 4, maxOut: 1600 });
  expect(r.outW).toBe(1600); // frameW*2 = 2400 → capped
  expect(r.outH).toBe(Math.round(1600 / (3 / 4)));
});
