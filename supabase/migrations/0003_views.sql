-- CHODAE KUNG — view counter for dashboard analytics.

alter table public.invitations add column if not exists views integer not null default 0;

-- Atomic increment, callable from the server (service role). security definer so it can update
-- regardless of RLS.
create or replace function public.increment_views(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.invitations set views = views + 1 where slug = p_slug;
$$;

grant execute on function public.increment_views(text) to anon, authenticated, service_role;
