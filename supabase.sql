create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null default 'Untitled project',
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "own projects" on public.projects for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- public bucket so images work inside emails
insert into storage.buckets (id, name, public) values ('photos','photos',true) on conflict do nothing;
create policy "read photos" on storage.objects for select using (bucket_id = 'photos');
create policy "upload own photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- optional: lets the app upload default PNG icons once per user (only needed if you see broken icons)
create policy "update own photos" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
