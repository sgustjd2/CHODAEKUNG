/** Readable text color to place on an accent (--wax) background, so buttons stay legible whatever
 * accent the user picks. Picks white or dark navy — whichever has the higher WCAG contrast ratio. */

export const WAX_INK_LIGHT = "#ffffff";
export const WAX_INK_DARK = "#2A2A3E";

function lum(r: number, g: number, b: number): number {
  const f = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

const DARK_LUM = lum(42, 42, 62); // luminance of WAX_INK_DARK

function parseHex(hex: string): [number, number, number] | null {
  const h = hex.trim().replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

/** hex ("#RRGGBB" or "#RGB") → the more-legible of white / dark navy for text on that color. */
export function waxInk(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return WAX_INK_LIGHT;
  const L = lum(rgb[0], rgb[1], rgb[2]);
  const contrastWhite = 1.05 / (L + 0.05); // (1.0 + 0.05) / (L + 0.05)
  const contrastDark = (L + 0.05) / (DARK_LUM + 0.05);
  return contrastWhite >= contrastDark ? WAX_INK_LIGHT : WAX_INK_DARK;
}

/** A darker shade of the accent for accent-COLORED TEXT (eyebrows, dates, D-day numbers) so it stays
 * legible on the light page. Darkens the hue toward black until it clears ~4:1 vs white; a dark accent
 * is returned unchanged. Hue is preserved (uniform RGB scale), so it still reads as the accent. */
export function waxDeep(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  for (let k = 1; k >= 0.15; k -= 0.05) {
    const R = rgb[0] * k, G = rgb[1] * k, B = rgb[2] * k;
    if (1.05 / (lum(R, G, B) + 0.05) >= 4) return toHex(R, G, B);
  }
  return toHex(rgb[0] * 0.15, rgb[1] * 0.15, rgb[2] * 0.15);
}
