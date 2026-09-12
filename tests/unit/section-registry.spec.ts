import { test, expect } from "@playwright/test";
import { themeRegistry } from "@/components/viewer/section-registry";
import { blankInvitation } from "@/lib/invitation/samples";
import type { ThemeId } from "@/lib/invitation/types";

/**
 * The section renderer registry (CLAUDE.md §7.3) is theme → (section.type → renderer). A type with
 * no renderer for its theme renders `null` — a whole section silently vanishes from a published
 * invitation. Lock: every theme is registered, carries the shared sections, and has a renderer for
 * every section type its own default "new" flow produces (the create → view contract).
 */
const THEMES: ThemeId[] = ["romantic", "minimal", "cute", "editorial", "developer", "battle", "timeline", "gaming"];
const COMMON = ["account", "dday", "guestbook", "attendees"] as const;

test("every ThemeId has a renderer set", () => {
  for (const theme of THEMES) {
    expect(themeRegistry[theme], `registry missing theme: ${theme}`).toBeTruthy();
  }
});

test("every theme exposes the shared (theme-agnostic) sections", () => {
  for (const theme of THEMES) {
    const set = themeRegistry[theme]!;
    for (const t of COMMON) {
      expect(typeof set[t], `${theme} is missing shared renderer: ${t}`).toBe("function");
    }
  }
});

for (const theme of THEMES) {
  test(`${theme}: every default-flow section type has a renderer (no silent null sections)`, () => {
    const set = themeRegistry[theme]!;
    const types = blankInvitation(theme).sections.map((s) => s.type);
    expect(types.length).toBeGreaterThan(0);
    for (const t of types) {
      expect(typeof set[t], `${theme} has no renderer for default section: ${t}`).toBe("function");
    }
  });
}
