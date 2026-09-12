import { test, expect } from "@playwright/test";
import { waxInk, waxDeep, accentOn, WAX_INK_LIGHT, WAX_INK_DARK } from "../../src/lib/invitation/contrast";

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
