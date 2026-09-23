import type { ThemeId } from "./types";
import type { Visibility } from "./store";

/**
 * Input limits for the writes a stranger can make (guest RSVP, guestbook, anonymous publish). Server
 * actions are directly callable, so the forms' maxLength is not a boundary — these checks are. The
 * guest-writable tables also enforce them as DB CHECK constraints
 * (supabase/migrations/0007_input_limits.sql), because the anon RLS policies allow inserting RSVPs /
 * guestbook rows straight through Supabase REST, bypassing the Next server entirely.
 */
export const LIMITS = {
  rsvpName: 40,
  rsvpResponse: 20,
  rsvpMessage: 200,
  rsvpGuests: 20, // the RSVP stepper's max; 0 = not attending
  guestbookName: 20, // optional — anonymous messages are allowed
  guestbookMessage: 200,
  title: 200,
  invitationBytes: 256 * 1024, // largest bundled sample is ~4KB; photos are Storage URLs, not inline
} as const;

/** Every theme the viewer can render (a unit test keeps this in sync with the section registry). */
export const THEME_IDS: readonly ThemeId[] = ["romantic", "minimal", "cute", "editorial", "developer", "battle", "timeline", "gaming"];
const VISIBILITIES: readonly Visibility[] = ["draft", "unlisted", "published"];

type Result<T> = { ok: true; value: T } | { ok: false; error: string };
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateRsvp(e: { name?: unknown; response?: unknown; guests?: unknown; message?: unknown }): Result<{
  name: string;
  response: string;
  guests: number;
  message: string;
}> {
  const name = str(e.name);
  const response = str(e.response);
  const message = str(e.message);
  const guests = e.guests === undefined ? 1 : e.guests;
  if (!name) return { ok: false, error: "이름을 입력해주세요." };
  if (name.length > LIMITS.rsvpName) return { ok: false, error: `이름은 ${LIMITS.rsvpName}자 이내로 입력해주세요.` };
  if (!response || response.length > LIMITS.rsvpResponse) return { ok: false, error: "참석 여부를 선택해주세요." };
  // An integer in range — a negative count under 참석 would LOWER the public headcount (and let others
  // past the 정원 cap); a huge one would vandalize it.
  if (typeof guests !== "number" || !Number.isInteger(guests) || guests < 0 || guests > LIMITS.rsvpGuests)
    return { ok: false, error: `인원은 0~${LIMITS.rsvpGuests}명 사이로 입력해주세요.` };
  if (message.length > LIMITS.rsvpMessage) return { ok: false, error: `메시지는 ${LIMITS.rsvpMessage}자 이내로 입력해주세요.` };
  return { ok: true, value: { name, response, guests, message } };
}

export function validateGuestbook(e: { name?: unknown; message?: unknown }): Result<{ name: string; message: string }> {
  const name = str(e.name);
  const message = str(e.message);
  if (!message) return { ok: false, error: "메시지를 입력해주세요" };
  if (message.length > LIMITS.guestbookMessage) return { ok: false, error: `메시지는 ${LIMITS.guestbookMessage}자 이내로 입력해주세요.` };
  if (name.length > LIMITS.guestbookName) return { ok: false, error: `이름은 ${LIMITS.guestbookName}자 이내로 입력해주세요.` };
  return { ok: true, value: { name, message } };
}

/** Anonymous publish (no login needed): bound what a stranger can store and reject unknown enums. */
export function validatePublish(input: { title?: unknown; theme?: unknown; visibility?: unknown; data?: unknown }): Result<{
  title: string;
  theme: ThemeId;
  visibility: Visibility;
}> {
  const title = str(input.title);
  if (title.length > LIMITS.title) return { ok: false, error: `제목은 ${LIMITS.title}자 이내로 입력해주세요.` };
  if (!THEME_IDS.includes(input.theme as ThemeId)) return { ok: false, error: "지원하지 않는 테마예요." };
  if (!VISIBILITIES.includes(input.visibility as Visibility)) return { ok: false, error: "공개 범위가 올바르지 않아요." };
  const data = input.data as { sections?: unknown } | null;
  if (!data || typeof data !== "object" || !Array.isArray(data.sections)) return { ok: false, error: "초대장 데이터가 올바르지 않아요." };
  let bytes: number;
  try {
    bytes = new TextEncoder().encode(JSON.stringify(data)).length;
  } catch {
    return { ok: false, error: "초대장 데이터가 올바르지 않아요." };
  }
  if (bytes > LIMITS.invitationBytes) return { ok: false, error: "초대장 내용이 너무 커요. 섹션이나 문구를 줄여주세요." };
  return { ok: true, value: { title, theme: input.theme as ThemeId, visibility: input.visibility as Visibility } };
}

/** A media path the signed-in user may delete: exactly `u/<their id>/<file>` — no traversal, no subfolder. */
export function isOwnMediaPath(path: unknown, userId: string): boolean {
  if (typeof path !== "string") return false;
  const prefix = `u/${userId}/`;
  const file = path.slice(prefix.length);
  return path.startsWith(prefix) && file.length > 0 && !file.includes("/") && !file.includes("\\") && !path.includes("..");
}
