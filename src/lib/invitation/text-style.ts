import type { CSSProperties } from "react";
import { fontById } from "./fonts";
import type { TextStyle } from "./types";

/** Discrete size steps offered in the editor (font-size multiplier, applied as `em`). */
export const TEXT_SIZE_STEPS: { label: string; value: number }[] = [
  { label: "작게", value: 0.85 },
  { label: "보통", value: 1 },
  { label: "크게", value: 1.3 },
  { label: "아주 크게", value: 1.7 },
];

/** Turn a per-field TextStyle into inline CSS. `size` is theme-relative (`em`), so it scales with
 * each theme's base font-size instead of pinning an absolute px. Returns undefined when empty. */
export function textStyleCss(ts?: TextStyle): CSSProperties | undefined {
  if (!ts) return undefined;
  const css: CSSProperties = {};
  if (ts.size && ts.size !== 1) css.fontSize = `${ts.size}em`;
  if (ts.color) css.color = ts.color;
  if (ts.font) {
    const f = fontById(ts.font);
    if (f) css.fontFamily = f.stack;
  }
  if (ts.bold) css.fontWeight = 700;
  if (ts.italic) css.fontStyle = "italic";
  return Object.keys(css).length ? css : undefined;
}

/** True when the style carries no actual override (so it can be dropped from the data). */
export function isEmptyTextStyle(ts?: TextStyle): boolean {
  return !ts || (!ts.color && !ts.font && !ts.bold && !ts.italic && (!ts.size || ts.size === 1));
}

/** Merge a partial override into a field's style, dropping no-op values. `partial === null` clears
 * the field entirely. Returns undefined when the result carries no override (so the caller drops it).
 * Pure — the single source of truth for how a per-field style edit is applied. */
export function mergeTextStyle(prev: TextStyle | undefined, partial: Partial<TextStyle> | null): TextStyle | undefined {
  if (partial === null) return undefined;
  const m: TextStyle = { ...prev, ...partial };
  if (!m.color) delete m.color;
  if (!m.font) delete m.font;
  if (!m.bold) delete m.bold;
  if (!m.italic) delete m.italic;
  if (!m.size || m.size === 1) delete m.size;
  return isEmptyTextStyle(m) ? undefined : m;
}
