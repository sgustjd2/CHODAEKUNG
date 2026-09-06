/**
 * "Add to calendar" via a downloaded .ics — handled natively by iOS, Android,
 * Apple Calendar, Outlook, and importable by Google. Built from an invitation's
 * canonical eventStart (ISO `YYYY-MM-DD` all-day, or `YYYY-MM-DDTHH:mm`).
 */
const pad = (n: number) => String(n).padStart(2, "0");

function parseEvent(eventStart: string): { start: Date; end: Date; allDay: boolean } | null {
  const allDay = !eventStart.includes("T");
  const start = new Date(allDay ? `${eventStart}T00:00` : eventStart);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + (allDay ? 24 : 2) * 3600_000);
  return { start, end, allDay };
}

/** Floating local stamp (no Z): the event happens at the stated local time. */
const stamp = (d: Date, allDay: boolean) => {
  const day = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  return allDay ? day : `${day}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
};
const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

export function icsContent(eventStart: string, title: string, location: string, details: string): string | null {
  const ev = parseEvent(eventStart);
  if (!ev) return null;
  const dt = ev.allDay
    ? `DTSTART;VALUE=DATE:${stamp(ev.start, true)}\r\nDTEND;VALUE=DATE:${stamp(ev.end, true)}`
    : `DTSTART:${stamp(ev.start, false)}\r\nDTEND:${stamp(ev.end, false)}`;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//chodaekung//invite//KO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@chodaekung`,
    `DTSTAMP:${dtstamp}`,
    dt,
    `SUMMARY:${esc(title || "초대")}`,
    location ? `LOCATION:${esc(location)}` : "",
    details ? `DESCRIPTION:${esc(details)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadIcs(eventStart: string, title: string, location: string, details: string) {
  const content = icsContent(eventStart, title, location, details);
  if (!content) return;
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(title || "event").replace(/[^\w가-힣-]+/g, "_").slice(0, 40) || "event"}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
