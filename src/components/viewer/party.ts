/** The participant block shown in a details section (avatars + "N명 확정 · 자리 남음"). */
export type Party = {
  avatars: { label: string; tone?: number }[];
  more?: string;
  countLabel: string;
  countSub: string;
};

/**
 * Derive the participant block from real RSVPs (pure — no React/DB, so it's unit-testable).
 * `names` are confirmed 참석 attendees; `count` is the headcount (attendees + 동반 인원); `capacity`
 * is the invitation's 정원, if any.
 * - up to 5 avatars from the first character of each name, tone cycling 1..5;
 * - a "+N" chip when there are more than 5 attendees;
 * - "N명 확정" from the headcount;
 * - "M자리 남음" when a capacity is set (never negative), else no sub-line (so a template's sample
 *   "자리 남음" number never leaks onto a live invite without a real capacity).
 */
export function partyFromRsvp(names: string[], count: number, capacity?: number): Party {
  const avatars = names.slice(0, 5).map((n, i) => ({ label: n.trim().charAt(0) || "?", tone: (i % 5) + 1 }));
  const more = names.length > 5 ? `+${names.length - 5}` : undefined;
  const remaining = typeof capacity === "number" && capacity > 0 ? Math.max(0, capacity - count) : null;
  return {
    avatars,
    more,
    countLabel: `${count}명 확정`,
    countSub: remaining != null ? `${remaining}자리 남음` : "",
  };
}
