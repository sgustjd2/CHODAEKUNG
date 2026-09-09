-- CHODAE KUNG — admin allowlist (관리자 콘솔 /admin 접근 권한).
-- A row here grants that email access to /admin. Managed directly in the DB, so admins can be
-- added/removed without a redeploy. Only the Next server (service role) reads this table; there is
-- intentionally NO anon/authenticated policy, so the anon key can never enumerate admins.

create table if not exists public.admins (
  email      text primary key,          -- the email the admin signs into 초대쿵 with (lowercased)
  note       text not null default '',
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- No policies on purpose: the server's service role bypasses RLS; anon/authenticated keys get nothing.

-- Seed the first admin. CHANGE this to the email you actually sign into 초대쿵 with (Kakao/email),
-- then re-run. Add more admins later with: insert into public.admins (email) values ('a@b.com');
insert into public.admins (email, note) values ('sgustjd1234@gmail.com', 'initial admin')
  on conflict (email) do nothing;
