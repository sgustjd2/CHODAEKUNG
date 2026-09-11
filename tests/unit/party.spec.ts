import { test, expect } from "@playwright/test";
import { partyFromRsvp } from "../../src/components/viewer/party";

/**
 * The participant block reflects real RSVPs — this locks the derivation the live page uses
 * (useLiveParty feeds attendee names + headcount + capacity into partyFromRsvp). The full DB
 * round-trip isn't covered here because it needs a configured backend (and would write to the
 * shared dev DB), which isn't available/safe in CI; the mobile e2e covers the editor fallback.
 */
test.describe("partyFromRsvp — RSVP → participant block", () => {
  test("no attendees yet → 0명 확정, no avatars, no 자리 남음 without capacity", () => {
    const p = partyFromRsvp([], 0);
    expect(p.avatars).toEqual([]);
    expect(p.more).toBeUndefined();
    expect(p.countLabel).toBe("0명 확정");
    expect(p.countSub).toBe("");
  });

  test("attendees → avatars from first char, tone cycles 1..5, headcount label", () => {
    const p = partyFromRsvp(["지수", "민준", "서연"], 4); // 4 = attendees + 동반 인원
    expect(p.avatars).toEqual([
      { label: "지", tone: 1 },
      { label: "민", tone: 2 },
      { label: "서", tone: 3 },
    ]);
    expect(p.more).toBeUndefined();
    expect(p.countLabel).toBe("4명 확정"); // headcount, not name count
  });

  test("more than 5 attendees → 5 avatars + '+N' chip, tone wraps at 6th", () => {
    const names = ["가", "나", "다", "라", "마", "바", "사"]; // 7
    const p = partyFromRsvp(names, 7);
    expect(p.avatars.map((a) => a.label)).toEqual(["가", "나", "다", "라", "마"]);
    expect(p.avatars.map((a) => a.tone)).toEqual([1, 2, 3, 4, 5]);
    expect(p.more).toBe("+2");
  });

  test("capacity set → 'M자리 남음' = capacity - headcount, clamped at 0", () => {
    expect(partyFromRsvp(["a", "b"], 3, 8).countSub).toBe("5자리 남음");
    expect(partyFromRsvp(["a"], 10, 8).countSub).toBe("0자리 남음"); // over capacity → 0, not negative
  });

  test("capacity 0 or absent → no 자리 남음 line (never leaks a sample number)", () => {
    expect(partyFromRsvp(["a"], 1, 0).countSub).toBe("");
    expect(partyFromRsvp(["a"], 1).countSub).toBe("");
  });

  test("blank/whitespace name → placeholder avatar, never empty", () => {
    expect(partyFromRsvp(["  "], 1).avatars).toEqual([{ label: "?", tone: 1 }]);
  });
});
