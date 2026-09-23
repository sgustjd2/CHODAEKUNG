import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { LIMITS, THEME_IDS, validateRsvp, validateGuestbook, validatePublish, isOwnMediaPath } from "@/lib/invitation/validate";
import { themeRegistry } from "@/components/viewer/section-registry";

/** The public-write boundary (guest RSVP, guestbook, anonymous publish, media delete). These are server
 * actions — directly callable — so this, not the forms' maxLength, is what keeps bad input out. */

test.describe("validateRsvp", () => {
  test("accepts a normal RSVP and trims text", () => {
    expect(validateRsvp({ name: "  홍길동 ", response: " 참석 ", guests: 2, message: " 축하해요! " })).toEqual({
      ok: true,
      value: { name: "홍길동", response: "참석", guests: 2, message: "축하해요!" },
    });
  });
  test("guests defaults to 1; 0 (not attending) is allowed", () => {
    expect(validateRsvp({ name: "a", response: "참석" })).toMatchObject({ ok: true, value: { guests: 1 } });
    expect(validateRsvp({ name: "a", response: "불참", guests: 0 })).toMatchObject({ ok: true, value: { guests: 0 } });
  });
  test("rejects a guest count that is negative, too large, fractional or not a number", () => {
    // negative under 참석 would LOWER the public headcount and let others past the 정원 cap
    for (const guests of [-1, -50, LIMITS.rsvpGuests + 1, 99999, 1.5, NaN, "3", null]) {
      expect(validateRsvp({ name: "a", response: "참석", guests }).ok, `guests=${String(guests)}`).toBe(false);
    }
  });
  test("rejects blank / too-long / non-string name, missing response, too-long message", () => {
    expect(validateRsvp({ name: "   ", response: "참석" }).ok).toBe(false);
    expect(validateRsvp({ name: "가".repeat(LIMITS.rsvpName + 1), response: "참석" }).ok).toBe(false);
    expect(validateRsvp({ name: 123, response: "참석" }).ok).toBe(false);
    expect(validateRsvp({ name: "a", response: "" }).ok).toBe(false);
    expect(validateRsvp({ name: "a", response: "x".repeat(LIMITS.rsvpResponse + 1) }).ok).toBe(false);
    expect(validateRsvp({ name: "a", response: "참석", message: "가".repeat(LIMITS.rsvpMessage + 1) }).ok).toBe(false);
    expect(validateRsvp({ name: "가".repeat(LIMITS.rsvpName), response: "참석", message: "가".repeat(LIMITS.rsvpMessage) }).ok).toBe(true); // at the limit
  });
});

test.describe("validateGuestbook", () => {
  test("name is optional (anonymous messages), text is trimmed", () => {
    expect(validateGuestbook({ name: "", message: " 축하해요 " })).toEqual({ ok: true, value: { name: "", message: "축하해요" } });
  });
  test("rejects an empty or too-long message and a too-long name", () => {
    expect(validateGuestbook({ name: "a", message: "   " }).ok).toBe(false);
    expect(validateGuestbook({ name: "a", message: "가".repeat(LIMITS.guestbookMessage + 1) }).ok).toBe(false);
    expect(validateGuestbook({ name: "가".repeat(LIMITS.guestbookName + 1), message: "hi" }).ok).toBe(false);
    expect(validateGuestbook({ name: 5, message: undefined }).ok).toBe(false);
  });
});

test.describe("validatePublish (anonymous publish)", () => {
  const ok = { title: "우리 결혼해요", theme: "romantic", visibility: "unlisted", data: { sections: [] } };
  test("accepts a normal publish", () => {
    expect(validatePublish(ok)).toEqual({ ok: true, value: { title: "우리 결혼해요", theme: "romantic", visibility: "unlisted" } });
  });
  test("rejects unknown theme / visibility, malformed data, a too-long title", () => {
    expect(validatePublish({ ...ok, theme: "hacker" }).ok).toBe(false);
    expect(validatePublish({ ...ok, visibility: "public" }).ok).toBe(false);
    expect(validatePublish({ ...ok, data: null }).ok).toBe(false);
    expect(validatePublish({ ...ok, data: { sections: "nope" } }).ok).toBe(false);
    expect(validatePublish({ ...ok, title: "가".repeat(LIMITS.title + 1) }).ok).toBe(false);
  });
  test("rejects an invitation over the size cap", () => {
    const big = { sections: [{ id: "x", type: "message", content: { body: ["a".repeat(LIMITS.invitationBytes)] } }] };
    expect(validatePublish({ ...ok, data: big }).ok).toBe(false);
  });
});

test.describe("isOwnMediaPath (media delete)", () => {
  const id = "0b6a7c1e-1111-4222-8333-944455556666";
  test("only a file directly inside the user's own folder", () => {
    expect(isOwnMediaPath(`u/${id}/1700000000-abc.jpg`, id)).toBe(true);
    expect(isOwnMediaPath(`u/other-user/1.jpg`, id)).toBe(false);
    expect(isOwnMediaPath(`u/${id}/../other-user/1.jpg`, id)).toBe(false); // traversal
    expect(isOwnMediaPath(`u/${id}/sub/1.jpg`, id)).toBe(false);
    expect(isOwnMediaPath(`u/${id}/..\\x.jpg`, id)).toBe(false);
    expect(isOwnMediaPath(`u/${id}/`, id)).toBe(false);
    expect(isOwnMediaPath(`g/1.jpg`, id)).toBe(false);
    expect(isOwnMediaPath(42, id)).toBe(false);
  });
});

test.describe("limits stay in sync", () => {
  test("THEME_IDS lists exactly the themes the viewer can render", () => {
    expect([...THEME_IDS].sort()).toEqual(Object.keys(themeRegistry).sort());
  });
  test("the DB CHECK constraints (migration 0007) use the same numbers as LIMITS", () => {
    const sql = readFileSync("supabase/migrations/0007_input_limits.sql", "utf8");
    const rsvps = sql.slice(sql.indexOf("rsvps_input_limits check"), sql.indexOf("guestbook drop constraint"));
    const guestbook = sql.slice(sql.indexOf("guestbook_input_limits check"));
    expect(rsvps).toContain(`char_length(name) <= ${LIMITS.rsvpName}`);
    expect(rsvps).toContain(`char_length(response) <= ${LIMITS.rsvpResponse}`);
    expect(rsvps).toContain(`char_length(message) <= ${LIMITS.rsvpMessage}`);
    expect(rsvps).toContain(`guests between 0 and ${LIMITS.rsvpGuests}`);
    expect(guestbook).toContain(`char_length(name) <= ${LIMITS.guestbookName}`);
    expect(guestbook).toContain(`char_length(message) <= ${LIMITS.guestbookMessage}`);
  });
});
