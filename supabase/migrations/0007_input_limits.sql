-- CHODAE KUNG — input limits for the guest-writable tables (RSVP / 방명록).
-- The anon RLS policies (0001 rsvps, 0005 guestbook) let anyone insert a row straight through Supabase
-- REST with the public anon key, bypassing the Next server's validation. These CHECKs make the database
-- itself refuse oversized text and out-of-range guest counts — e.g. a negative 참석 count that would
-- LOWER the public headcount and let others past the 정원 cap.
-- Values mirror LIMITS in src/lib/invitation/validate.ts (tests/unit/validate.spec.ts checks they match).
-- NOT VALID: enforced for every new/updated row, without re-checking rows that already exist.

alter table public.rsvps drop constraint if exists rsvps_input_limits;
alter table public.rsvps add constraint rsvps_input_limits check (
  btrim(name) <> '' and char_length(name) <= 40
  and btrim(response) <> '' and char_length(response) <= 20
  and char_length(message) <= 200
  and guests between 0 and 20
) not valid;

alter table public.guestbook drop constraint if exists guestbook_input_limits;
alter table public.guestbook add constraint guestbook_input_limits check (
  char_length(name) <= 20
  and btrim(message) <> '' and char_length(message) <= 200
) not valid;
