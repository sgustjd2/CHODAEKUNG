import { test, expect } from "@playwright/test";
import { icsContent } from "../../src/lib/calendar";

/**
 * The "add to calendar" .ics payload (share feature). icsContent is the pure builder (downloadIcs
 * only wraps it in a Blob download), so the format — VCALENDAR/VEVENT skeleton, floating-local
 * DTSTART/DTEND, all-day vs timed, and RFC-5545 text escaping — is verified here.
 */
test.describe("icsContent — .ics payload", () => {
  test("timed event: floating-local DTSTART + 2h DTEND, CRLF, VEVENT skeleton", () => {
    const ics = icsContent("2026-10-02T19:30", "파티", "강남", "저녁 한잔")!;
    expect(ics).not.toBeNull();
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("\r\n"); // CRLF line endings
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("DTSTART:20261002T193000"); // no trailing Z → floating local time
    expect(ics).toContain("DTEND:20261002T213000"); // +2h
    expect(ics).toContain("SUMMARY:파티");
    expect(ics).toContain("LOCATION:강남");
    expect(ics).toContain("DESCRIPTION:저녁 한잔");
  });

  test("all-day event: VALUE=DATE DTSTART + next-day DTEND", () => {
    const ics = icsContent("2026-10-02", "소풍", "", "")!;
    expect(ics).toContain("DTSTART;VALUE=DATE:20261002");
    expect(ics).toContain("DTEND;VALUE=DATE:20261003"); // +24h → next day
    // empty location/description lines are omitted
    expect(ics).not.toContain("LOCATION:");
    expect(ics).not.toContain("DESCRIPTION:");
  });

  test("timed DTEND rolls past midnight", () => {
    const ics = icsContent("2026-10-02T23:30", "심야", "", "")!;
    expect(ics).toContain("DTSTART:20261002T233000");
    expect(ics).toContain("DTEND:20261003T013000"); // +2h → next day 01:30
  });

  test("RFC-5545 escaping of comma/semicolon/backslash/newline", () => {
    const ics = icsContent("2026-10-02T19:30", "밥, 술; 파티\\게임\n2차", "", "")!;
    expect(ics).toContain("SUMMARY:밥\\, 술\\; 파티\\\\게임\\n2차");
  });

  test("invalid eventStart → null", () => {
    expect(icsContent("", "x", "", "")).toBeNull();
    expect(icsContent("not-a-date", "x", "", "")).toBeNull();
  });
});
