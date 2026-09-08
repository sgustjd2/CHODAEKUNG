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

/** hex ("#RRGGBB" or "#RGB") → the more-legible of white / dark navy for text on that color. */
export function waxInk(hex: string): string {
  const h = hex.trim().replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return WAX_INK_LIGHT;
  const n = parseInt(full, 16);
  const L = lum((n >> 16) & 255, (n >> 8) & 255, n & 255);
  const contrastWhite = 1.05 / (L + 0.05); // (1.0 + 0.05) / (L + 0.05)
  const contrastDark = (L + 0.05) / (DARK_LUM + 0.05);
  return contrastWhite >= contrastDark ? WAX_INK_LIGHT : WAX_INK_DARK;
}
