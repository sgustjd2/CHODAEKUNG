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

/** Contrast ratio between two relative luminances (order-independent). */
function ratio(l1: number, l2: number): number {
  return l1 >= l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
}

/**
 * Accent shade that stays legible as TEXT on the given background. Unlike `waxDeep` (which always
 * targets white), this adapts to the actual page: on a dark background it LIGHTENS the accent toward
 * white; on a light one it darkens toward black — until it clears ~4.5:1. Hue-preserving. Used for
 * accent-colored text on dark themes so a custom accent doesn't vanish into the dark page.
 */
export function accentOn(hex: string, bgHex: string): string {
  const rgb = parseHex(hex);
  const bg = parseHex(bgHex);
  if (!rgb || !bg) return hex;
  const bgL = lum(bg[0], bg[1], bg[2]);
  if (ratio(lum(rgb[0], rgb[1], rgb[2]), bgL) >= 4.5) return hex; // already legible
  return bgL < DARK_BG_LUM
    ? lightenUntil(rgb, (l) => ratio(l, bgL) >= 4.5) // dark background → lighten toward white
    : darkenUntil(rgb, (l) => ratio(l, bgL) >= 4.5); // light background → darken toward black
}

/** Below this background luminance, accent text must be lightened (not darkened) to stay legible. */
const DARK_BG_LUM = 0.18;

type RGB = [number, number, number];
const round3 = (r: number, g: number, b: number): RGB => [Math.round(r), Math.round(g), Math.round(b)];
const lumOf = (c: RGB) => lum(c[0], c[1], c[2]);

/** Scale toward black (uniform RGB → hue kept) until `ok(luminance)`. Checks the ROUNDED colour, so the
 * returned hex really meets the threshold (rounding can't land it at 4.49). */
function darkenUntil(rgb: RGB, ok: (l: number) => boolean): string {
  for (let k = 1; k >= 0; k -= 0.01) {
    const c = round3(rgb[0] * k, rgb[1] * k, rgb[2] * k);
    if (ok(lumOf(c))) return toHex(...c);
  }
  return "#000000";
}

/** Mix toward white (hue kept) until `ok(luminance)`; rounded-colour check as above. */
function lightenUntil(rgb: RGB, ok: (l: number) => boolean): string {
  for (let k = 0; k <= 1; k += 0.01) {
    const c = round3(rgb[0] + (255 - rgb[0]) * k, rgb[1] + (255 - rgb[1]) * k, rgb[2] + (255 - rgb[2]) * k);
    if (ok(lumOf(c))) return toHex(...c);
  }
  return "#ffffff";
}

/**
 * Every accent-derived CSS var for a custom accent, each AA-safe (≥4.5:1) FOR ITS ROLE on the page it
 * renders on, hue-preserving. One place so the viewer can't set some tokens from the accent and leave
 * others on the default coral (which painted coral headings on a blue invitation).
 *
 * - `--wax`       button/badge FILL. The user's colour as-is, unless neither ink reaches 4.5 on it
 *                 (mid-tones, luminance ≈0.18–0.28) → darkened just until white text does.
 * - `--wax-ink`   text on the fill (white or navy, whichever contrasts more).
 * - `--wax-hover` hover fill: moves AWAY from the ink (darker under white, lighter under navy), so hover
 *                 can only raise contrast. (`--wax-deep` used to be the hover fill — wrong for light accents.)
 * - `--wax-onpage` accent TEXT on the page background.
 * - `--wax-deep`  accent text on light surfaces (white cards) + accent PANELS carrying light text. On a
 *                 light page it equals `--wax-onpage`; on a dark page it's a deep shade (≥6.5:1 vs white,
 *                 matching the verified default battle panel) so translucent/pastel panel text still passes.
 * - `--wax-light` pastel accent text on a DARK surface — on dark pages legible on the deep panels (and the
 *                 darker page); on light pages legible on the darkest-case photo overlay a light theme puts
 *                 accent text on (the generic "text" cover), so it keeps the accent's hue there too.
 */
export function accentVars(accent: string, pageBg: string): Record<string, string> {
  const rgb = parseHex(accent);
  const bg = parseHex(pageBg);
  if (!rgb || !bg) return { "--wax": accent };
  const bgL = lumOf(bg);
  const dark = bgL < DARK_BG_LUM;
  const L = lumOf(rgb);

  const inkOk = Math.max(ratio(L, 1), ratio(L, DARK_LUM)) >= 4.5;
  const fill = inkOk ? toHex(...rgb) : darkenUntil(rgb, (l) => ratio(l, 1) >= 4.5);
  const ink = waxInk(fill);
  const f = parseHex(fill)!;
  const hover =
    ink === WAX_INK_LIGHT
      ? toHex(...round3(f[0] * 0.85, f[1] * 0.85, f[2] * 0.85))
      : toHex(...round3(f[0] + (255 - f[0]) * 0.3, f[1] + (255 - f[1]) * 0.3, f[2] + (255 - f[2]) * 0.3));
  const onpage = accentOn(toHex(...rgb), pageBg);
  const deep = dark ? darkenUntil(rgb, (l) => ratio(l, 1) >= 6.5) : onpage;

  const light = accentOn(toHex(...rgb), dark ? deep : TEXT_COVER_OVERLAY_WORST);
  return { "--wax": fill, "--wax-ink": ink, "--wax-hover": hover, "--wax-onpage": onpage, "--wax-deep": deep, "--wax-light": light };
}

/** The LIGHTEST the generic "text" cover's overlay can get: rgba(14,14,22,0.74) (viewer.css
 * `.gcover-text .gcover-photo::after`) composited over a pure-white photo region. Accent text drawn there
 * (`--wax-light`) must clear 4.5:1 against it — keep in sync if that overlay changes. */
export const TEXT_COVER_OVERLAY_WORST = "#4D4D53";

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
