-- CHODAE KUNG — initial schema (anonymous / link-based MVP)
-- Run this in the Supabase SQL editor (or `supabase db push`) after creating the project.
--
-- Ownership model (MVP): no login. Each invitation has a secret `edit_token`; whoever holds it
-- may edit. All writes go through the Next.js server using the service role (which bypasses RLS)
-- and verifies the token. Public share pages read published/unlisted rows. Auth (Kakao) can be
-- layered on later by adding an owner column + policies.

create extension if not exists "pgcrypto";

create table if not exists public.invitations (
  slug        text primary key,
  title       text not null default '',
  theme       text not null default 'romantic',
  visibility  text not null default 'draft' check (visibility in ('draft', 'unlisted', 'published')),
  data        jsonb not null,                          -- full Invitation: { slug, theme, shareCta, sections[] }
  edit_token  uuid not null default gen_random_uuid(), -- secret owner token (link-based ownership)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.rsvps (
  id               uuid primary key default gen_random_uuid(),
  invitation_slug  text not null references public.invitations(slug) on delete cascade,
  name             text not null default '',
  response         text not null default '',   -- option label, e.g. 참석 / 미정 / 불참
  guests           int  not null default 1,
  message          text not null default '',
  created_at       timestamptz not null default now()
);
create index if not exists rsvps_slug_idx on public.rsvps (invitation_slug, created_at desc);

-- RLS on. The service role (server-only) bypasses these; the policies below are what the public
-- anon key is allowed to do directly.
alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;

-- Anyone may read a live (published/unlisted) invitation — these are the shareable pages.
drop policy if exists "public read live invitations" on public.invitations;
create policy "public read live invitations"
  on public.invitations for select
  to anon, authenticated
  using (visibility in ('published', 'unlisted'));

-- Anyone may submit an RSVP to a live invitation (guests are anonymous).
drop policy if exists "anyone can rsvp to a live invitation" on public.rsvps;
create policy "anyone can rsvp to a live invitation"
  on public.rsvps for insert
  to anon, authenticated
  with check (
    exists (select 1 from public.invitations i where i.slug = invitation_slug and i.visibility in ('published', 'unlisted'))
  );

-- Creating/editing invitations and reading the RSVP list have NO anon policy on purpose:
-- those go through the Next server (service role) which checks the edit_token.
