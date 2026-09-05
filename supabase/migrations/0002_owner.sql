-- CHODAE KUNG — add account ownership to invitations.
-- Run after 0001. Existing (anonymous/link) invitations keep working via edit_token; new ones
-- published while logged in are tied to the account and appear in that user's dashboard.

alter table public.invitations add column if not exists owner_id uuid references auth.users(id) on delete set null;
create index if not exists invitations_owner_idx on public.invitations (owner_id, updated_at desc);

-- Owners can read / update / delete their own invitations (server writes still use the service role;
-- these cover reads via the user session and are good hygiene).
drop policy if exists "owner reads own invitations" on public.invitations;
create policy "owner reads own invitations" on public.invitations for select
  to authenticated using (owner_id = auth.uid());

drop policy if exists "owner updates own invitations" on public.invitations;
create policy "owner updates own invitations" on public.invitations for update
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "owner deletes own invitations" on public.invitations;
create policy "owner deletes own invitations" on public.invitations for delete
  to authenticated using (owner_id = auth.uid());
