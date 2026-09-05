-- CHODAE KUNG — public Storage bucket for uploaded invitation photos (gallery, later cover).

insert into storage.buckets (id, name, public)
values ('invite-photos', 'invite-photos', true)
on conflict (id) do nothing;

-- Anyone can read (public bucket); anyone can upload (creation is anonymous/link-based for now).
drop policy if exists "public read invite-photos" on storage.objects;
create policy "public read invite-photos" on storage.objects
  for select to public using (bucket_id = 'invite-photos');

drop policy if exists "anyone can upload invite-photos" on storage.objects;
create policy "anyone can upload invite-photos" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'invite-photos');
