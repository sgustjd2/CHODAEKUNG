import { test, expect } from "@playwright/test";
import { publishedFromRow } from "@/lib/invitation/store";

/** Reading a published invitation: "not there" must be a 404 (null), but a DB error must NOT be — it
 * throws so the viewer shows its retryable error page (500) instead of telling every guest (and the link
 * scrapers that cache previews) that the invitation doesn't exist. */
const inv = { slug: "x", theme: "romantic", sections: [] };

test("a live row (unlisted / published) returns the invitation", () => {
  expect(publishedFromRow({ data: { data: inv, visibility: "unlisted" }, error: null })).toEqual(inv);
  expect(publishedFromRow({ data: { data: inv, visibility: "published" }, error: null })).toEqual(inv);
});

test("no row, or a draft, is genuinely not found (null → 404)", () => {
  expect(publishedFromRow({ data: null, error: null })).toBeNull();
  expect(publishedFromRow({ data: { data: inv, visibility: "draft" }, error: null })).toBeNull();
});

test("a DB error throws instead of masquerading as not-found", () => {
  expect(() => publishedFromRow({ data: null, error: { message: "fetch failed" } })).toThrow(/invitation read failed/);
});
