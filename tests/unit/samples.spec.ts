import { test, expect } from "@playwright/test";
import {
  getInvitation,
  getSampleOrNull,
  blankSection,
  exampleSection,
  blankInvitation,
  sampleInvitations,
} from "@/lib/invitation/samples";
import type { SectionType, ThemeId } from "@/lib/invitation/types";

/** The demo/creation data contract: sample lookup (strict vs lenient), and the blank/example
 * section + blank invitation factories that the editor "add section" picker and the /new flow
 * build on. Locks the type/shape invariants and the deep-clone guard. */

// Every section type blankSection() handles (its switch is the authoritative list).
const TYPES: SectionType[] = [
  "cover", "message", "date", "location", "gallery", "schedule", "rsvp", "ending",
  "details", "timeline", "menu", "checklist", "cost", "route", "dayPlan", "quote",
  "notice", "versus", "matchInfo", "countdown", "rules", "roster", "accept", "gInfo",
  "lanes", "tierChart", "champions", "account", "dday", "guestbook", "attendees",
];
const THEMES: ThemeId[] = ["romantic", "minimal", "cute", "editorial", "developer", "battle", "timeline", "gaming"];

test.describe("getSampleOrNull / getInvitation", () => {
  test("known slug resolves; unknown → null (strict) vs romantic (lenient)", () => {
    expect(getSampleOrNull("jisoo-minjun")?.theme).toBe("romantic");
    expect(getSampleOrNull("does-not-exist")).toBeNull();
    expect(getInvitation("jisoo-minjun").slug).toBe("jisoo-minjun");
    expect(getInvitation("does-not-exist").theme).toBe("romantic"); // lenient fallback
  });
});

test.describe("blankSection", () => {
  test("every type returns a matching, well-formed shell", () => {
    for (const t of TYPES) {
      const s = blankSection(t);
      expect(s.type, `blankSection(${t}).type`).toBe(t);
      expect(typeof s.content, `blankSection(${t}).content`).toBe("object");
      expect(s.id.startsWith(t), `blankSection(${t}).id should start with type`).toBe(true);
    }
  });
  test("ids are unique across a batch of calls", () => {
    const ids = TYPES.map((t) => blankSection(t).id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

test.describe("exampleSection", () => {
  test("returns the requested type for every theme×type and never throws", () => {
    for (const theme of THEMES) {
      for (const t of TYPES) {
        const s = exampleSection(t, theme);
        expect(s.type, `exampleSection(${t}, ${theme}).type`).toBe(t);
        expect(s.id.startsWith(t)).toBe(true);
      }
    }
  });

  test("deep-clones the sample — mutating the result never corrupts the bundled sample", () => {
    const before = structuredClone(sampleInvitations["jisoo-minjun"]);
    const sec = exampleSection("cover", "romantic") as { id: string; content: Record<string, unknown> };
    sec.content.eyebrow = "MUTATED";
    if (Array.isArray(sec.content.names)) (sec.content.names as string[])[0] = "MUTATED";
    expect(sampleInvitations["jisoo-minjun"]).toEqual(before);

    const srcId = sampleInvitations["jisoo-minjun"].sections.find((x) => x.type === "cover")?.id;
    expect(sec.id).not.toBe(srcId); // fresh id, not the sample's
  });
});

test.describe("blankInvitation", () => {
  test("each theme yields its default flow, a cover-first section set, theme cover, slug 'new'", () => {
    for (const theme of THEMES) {
      const inv = blankInvitation(theme);
      expect(inv.theme, `${theme} theme`).toBe(theme);
      expect(inv.slug).toBe("new");
      expect(inv.sections.length).toBeGreaterThan(0);
      expect(inv.sections[0].type, `${theme} first section`).toBe("cover");
      const cover = inv.sections.find((s) => s.type === "cover");
      const img = cover && cover.type === "cover" ? cover.content.image : null;
      expect(img, `${theme} cover image`).toBeTruthy();
    }
  });
  test("defaults to the romantic theme", () => {
    expect(blankInvitation().theme).toBe("romantic");
  });
});
