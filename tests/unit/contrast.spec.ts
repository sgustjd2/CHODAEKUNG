import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { waxInk, waxDeep, accentOn, accentVars, TEXT_COVER_OVERLAY_WORST, WAX_INK_LIGHT, WAX_INK_DARK } from "../../src/lib/invitation/contrast";

/**
 * The accent-readability math (contrast.ts) underpins every custom-accent + a11y contrast decision.
 * Verified here against an INDEPENDENT WCAG contrast implementation (not the module's own private
 * helpers), so the assertions are a real check, not a tautology.
 */
function relLum(hex: string): number {
  const h = hex.replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const chan = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}
function contrast(a: string, b: string): number {
  const la = relLum(a), lb = relLum(b);
  return la >= lb ? (la + 0.05) / (lb + 0.05) : (lb + 0.05) / (la + 0.05);
}
const rgb = (hex: string) => {
  const n = parseInt(hex.replace(/^#/, ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const LIGHT_ACCENTS = ["#F5D896", "#B5CAB2", "#F5B5B0", "#FCE0DC", "#F5D896"];
const MID_DARK_ACCENTS = ["#C25C5C", "#2A2A3E", "#1A1A2E", "#3A6EA5"];

test.describe("waxInk — legible text color on an accent background", () => {
  test("picks whichever of white / dark navy has the higher contrast", () => {
    for (const a of [...LIGHT_ACCENTS, ...MID_DARK_ACCENTS]) {
      const cw = contrast(a, WAX_INK_LIGHT);
      const cd = contrast(a, WAX_INK_DARK);
      expect(waxInk(a), `ink on ${a}`).toBe(cw >= cd ? WAX_INK_LIGHT : WAX_INK_DARK);
    }
  });
  test("light accents get dark ink; deep accents get white ink", () => {
    expect(waxInk("#F5D896")).toBe(WAX_INK_DARK); // pale gold
    expect(waxInk("#1A1A2E")).toBe(WAX_INK_LIGHT); // near-black
  });
  test("invalid hex falls back to white", () => {
    expect(waxInk("nope")).toBe(WAX_INK_LIGHT);
  });
});

test.describe("waxDeep — darken an accent to ~4:1 text on white, hue-preserving", () => {
  for (const a of ["#F5D896", "#B5CAB2", "#F5B5B0", "#C25C5C", "#E38B8B"]) {
    test(`${a} → ≥4:1 on white`, () => {
      const out = waxDeep(a);
      expect(contrast(out, "#ffffff"), `${a}→${out}`).toBeGreaterThanOrEqual(3.95);
      // hue preserved: uniform RGB scale keeps channel proportions (tolerant of rounding)
      const [ir, ig, ib] = rgb(a);
      const [or, og, ob] = rgb(out);
      if (ig > 8 && og > 0) expect(or / og).toBeCloseTo(ir / ig, 1);
      if (ib > 8 && ob > 0) expect(or / ob).toBeCloseTo(ir / ib, 1);
    });
  }
  test("an already-dark accent still clears 4:1 (returned ~unchanged)", () => {
    expect(contrast(waxDeep("#2A2A3E"), "#ffffff")).toBeGreaterThanOrEqual(3.95);
  });
});

test.describe("accentOn — accent text made legible on a given background", () => {
  test("dark background → lightened to ≥4.5:1", () => {
    for (const bg of ["#14101E", "#1A1A2E", "#0D0F0A"]) {
      const out = accentOn("#C25C5C", bg);
      expect(contrast(out, bg), `#C25C5C on ${bg} → ${out}`).toBeGreaterThanOrEqual(4.5);
    }
  });
  test("light background → darkened to ≥4.5:1", () => {
    const out = accentOn("#C25C5C", "#ffffff");
    expect(contrast(out, "#ffffff"), `→ ${out}`).toBeGreaterThanOrEqual(4.5);
  });
  test("already-legible accent is returned unchanged", () => {
    expect(accentOn("#2A2A3E", "#ffffff")).toBe("#2A2A3E"); // dark on white already passes
  });
  test("invalid input returns the original", () => {
    expect(accentOn("nope", "#ffffff")).toBe("nope");
  });
});

/** HSL → hex, to sweep the whole colour space (hues × lightness × saturation) rather than hand-pick. */
function hsl(h: number, s: number, l: number): string {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return "#" + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
}
const SWEEP: string[] = [];
for (const h of [0, 20, 40, 60, 90, 120, 160, 200, 230, 260, 290, 320])
  for (const l of [0.2, 0.35, 0.5, 0.65, 0.8, 0.92]) for (const s of [0.35, 0.8]) SWEEP.push(hsl(h, s, l));

test.describe("accentVars — every custom-accent token is AA for its role", () => {
  // The viewer's per-theme text surfaces (light) + dark page backgrounds.
  for (const page of ["#FFFFFF", "#FEF9F9", "#FBE9E7", "#F2EFE9", "#FCECC4", "#1A1A2E", "#14101E", "#0D0F0A"]) {
    test(`${SWEEP.length} swept accents on ${page}`, () => {
      const dark = relLum(page) < 0.18;
      for (const a of SWEEP) {
        const v = accentVars(a, page);
        const tag = `${a} on ${page}`;
        expect(contrast(v["--wax"], v["--wax-ink"]), `fill/ink ${tag}`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(v["--wax-hover"], v["--wax-ink"]), `hover/ink ${tag}`).toBeGreaterThanOrEqual(4.5);
        expect(v["--wax-hover"].toLowerCase(), `hover differs ${tag}`).not.toBe(v["--wax"].toLowerCase());
        expect(contrast(v["--wax-onpage"], page), `onpage ${tag}`).toBeGreaterThanOrEqual(4.5);
        if (dark) {
          expect(contrast(v["--wax-deep"], "#ffffff"), `deep panel ${tag}`).toBeGreaterThanOrEqual(6.5);
          expect(contrast(v["--wax-light"], v["--wax-deep"]), `light-on-deep ${tag}`).toBeGreaterThanOrEqual(4.5);
        } else {
          expect(contrast(v["--wax-deep"], page), `deep text ${tag}`).toBeGreaterThanOrEqual(4.5);
          expect(contrast(v["--wax-light"], TEXT_COVER_OVERLAY_WORST), `light on text-cover overlay ${tag}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });
  }

  test("keeps the user's colour as the fill when an ink already reaches 4.5", () => {
    expect(accentVars("#3B6FD4", "#FFFFFF")["--wax"].toLowerCase()).toBe("#3b6fd4"); // blue → white ink
    expect(accentVars("#F5D896", "#FFFFFF")["--wax"].toLowerCase()).toBe("#f5d896"); // pale gold → navy ink
  });

  test("a mid-tone accent (no ink reaches 4.5) is darkened just enough, hue kept", () => {
    const a = "#2E9E5B";
    expect(Math.max(contrast(a, WAX_INK_LIGHT), contrast(a, WAX_INK_DARK))).toBeLessThan(4.5); // precondition
    const fill = accentVars(a, "#FFFFFF")["--wax"];
    expect(fill.toLowerCase()).not.toBe(a.toLowerCase());
    const [ir, ig, ib] = rgb(a), [or, og, ob] = rgb(fill);
    expect(or / og).toBeCloseTo(ir / ig, 1);
    expect(ob / og).toBeCloseTo(ib / ig, 1);
  });

  test("invalid accent → only the raw --wax (defaults cover the rest)", () => {
    expect(accentVars("nope", "#FFFFFF")).toEqual({ "--wax": "nope" });
  });
});

test.describe("generic 'text' cover overlay — accent text on a photo", () => {
  test("TEXT_COVER_OVERLAY_WORST really is the CSS overlay over a white photo (kept in sync)", () => {
    const css = readFileSync("src/components/viewer/viewer.css", "utf8");
    const m = css.match(/\.gcover-text \.gcover-photo::after \{ background: rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\); \}/);
    expect(m, "overlay rule not found — update this test with the CSS").not.toBeNull();
    const [r, g, b, a] = m!.slice(1).map(Number);
    const over = (c: number) => Math.round(c * a + 255 * (1 - a));
    const [er, eg, eb] = rgb(TEXT_COVER_OVERLAY_WORST);
    expect(Math.abs(over(r) - er)).toBeLessThanOrEqual(1);
    expect(Math.abs(over(g) - eg)).toBeLessThanOrEqual(1);
    expect(Math.abs(over(b) - eb)).toBeLessThanOrEqual(1);
  });
  test("the default --wax-light (#F5B5B0) clears AA on that worst case", () => {
    expect(contrast("#F5B5B0", TEXT_COVER_OVERLAY_WORST)).toBeGreaterThanOrEqual(4.5);
  });
});
