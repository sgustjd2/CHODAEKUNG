-- 방명록 (guestbook): congratulatory messages guests leave on a live invitation.
-- Public: anyone can post to and read a live (published/unlisted) invitation's guestbook.
-- The Next server (service role) does the actual reads/writes and gates by live status;
-- the anon policies below mirror rsvps so direct client access stays consistent.

create table if not exists public.guestbook (
  id               uuid primary key default gen_random_uuid(),
  invitation_slug  text not null references public.invitations(slug) on delete cascade,
  name             text not null default '',
  message          text not null default '',
  created_at       timestamptz not null default now()
);
create index if not exists guestbook_slug_idx on public.guestbook (invitation_slug, created_at desc);

alter table public.guestbook enable row level security;

drop policy if exists "anyone can post to a live guestbook" on public.guestbook;
create policy "anyone can post to a live guestbook"
  on public.guestbook for insert
  to anon, authenticated
  with check (
    exists (select 1 from public.invitations i where i.slug = invitation_slug and i.visibility in ('published', 'unlisted'))
  );

drop policy if exists "public read live guestbook" on public.guestbook;
create policy "public read live guestbook"
  on public.guestbook for select
  to anon, authenticated
  using (
    exists (select 1 from public.invitations i where i.slug = invitation_slug and i.visibility in ('published', 'unlisted'))
  );
