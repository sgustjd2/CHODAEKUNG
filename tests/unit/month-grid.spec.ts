import { test, expect } from "@playwright/test";
import { monthGrid } from "../../src/lib/invitation/month-grid";

/**
 * The Sun-first calendar grid (romantic date section + wizard blank-start fill). Off-by-one prone:
 * leading days from the previous month, trailing days from the next, the 1-based highlight, and
 * padding to whole weeks. Verified structurally across ordinary, leap, week-boundary and year-wrap
 * months, plus one fully hardcoded month.
 */
type Day = { n: number; dim?: boolean; today?: boolean };

// [year, month0, highlight]
const CASES: [number, number, number][] = [
  [2026, 1, 14], // Feb 2026 — 28 days, starts Sunday (lead 0) → exactly 4 weeks
  [2026, 9, 5], // Oct 2026
  [2024, 1, 29], // Feb 2024 — leap, 29 days
  [2026, 10, 1], // Nov 2026
  [2027, 0, 31], // Jan 2027
  [2026, 7, 1], // Aug 2026
];

for (const [y, m0, hl] of CASES) {
  test(`monthGrid(${y}, ${m0}, ${hl}) — structure holds`, () => {
    const lead = new Date(y, m0, 1).getDay();
    const daysInMonth = new Date(y, m0 + 1, 0).getDate();
    const prevDays = new Date(y, m0, 0).getDate();
    const g = monthGrid(y, m0, hl) as Day[];

    expect(g.length % 7).toBe(0); // whole weeks
    expect(g.length).toBe(Math.ceil((lead + daysInMonth) / 7) * 7);

    // leading = previous-month tail, ascending, all dimmed
    for (let i = 0; i < lead; i++) {
      expect(g[i].dim).toBe(true);
      expect(g[i].n).toBe(prevDays - lead + 1 + i);
    }
    // the month's own days, in order, not dimmed
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = g[lead + d - 1];
      expect(cell.n).toBe(d);
      expect(cell.dim).toBeFalsy();
    }
    // trailing = next-month head, ascending from 1, all dimmed
    for (let i = lead + daysInMonth; i < g.length; i++) {
      expect(g[i].dim).toBe(true);
      expect(g[i].n).toBe(i - (lead + daysInMonth) + 1);
    }
    // exactly one highlighted day, at the highlight, not dimmed
    const todays = g.filter((c) => c.today);
    expect(todays).toHaveLength(1);
    expect(g[lead + hl - 1].today).toBe(true);
    expect(g[lead + hl - 1].dim).toBeFalsy();
  });
}

test("Feb 2026 is a clean 4-week block (lead 0, no dim days)", () => {
  const g = monthGrid(2026, 1, 14) as Day[];
  expect(g).toHaveLength(28);
  expect(g[0]).toEqual({ n: 1 });
  expect(g[13]).toEqual({ n: 14, today: true });
  expect(g.some((c) => c.dim)).toBe(false);
});

test("out-of-range highlight → no highlighted day", () => {
  expect((monthGrid(2026, 9, 0) as Day[]).some((c) => c.today)).toBe(false);
  expect((monthGrid(2026, 9, 99) as Day[]).some((c) => c.today)).toBe(false);
});
