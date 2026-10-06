create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null default 'Untitled project',
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
drop policy if exists "own projects" on public.projects;
create policy "own projects" on public.projects for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.project_shares (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  owner_id uuid not null references auth.users on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  shared_with_email text not null,
  created_at timestamptz not null default now(),
  unique (project_id, user_id)
);
alter table public.project_shares enable row level security;
drop policy if exists "project share owner or recipient read" on public.project_shares;
create policy "project share owner or recipient read" on public.project_shares for select
  using (auth.uid() = owner_id or auth.uid() = user_id);
drop policy if exists "project share owner remove" on public.project_shares;
create policy "project share owner remove" on public.project_shares for delete
  using (auth.uid() = owner_id);
grant select, delete on public.project_shares to authenticated;

drop policy if exists "shared project read" on public.projects;
create policy "shared project read" on public.projects for select
  using (exists (
    select 1 from public.project_shares
    where project_shares.project_id = projects.id and project_shares.user_id = auth.uid()
  ));
drop policy if exists "shared project edit" on public.projects;
create policy "shared project edit" on public.projects for update
  using (exists (
    select 1 from public.project_shares
    where project_shares.project_id = projects.id and project_shares.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.project_shares
    where project_shares.project_id = projects.id
      and project_shares.user_id = auth.uid()
      and project_shares.owner_id = projects.user_id
  ));

drop function if exists public.share_project_with_email(uuid, text);
create function public.share_project_with_email(p_project_id uuid, p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_user_id uuid;
  project_owner_id uuid;
  normalized_email text := lower(trim(p_email));
begin
  select projects.user_id into project_owner_id
  from public.projects
  where projects.id = p_project_id;

  if project_owner_id is null or project_owner_id <> auth.uid() then
    raise exception 'Only the project owner can share this project';
  end if;

  if normalized_email = '' then
    raise exception 'Enter an email address';
  end if;

  select users.id into target_user_id
  from auth.users as users
  where lower(users.email) = normalized_email
  limit 1;

  if target_user_id is null then
    raise exception 'No NewJoinees account exists for that email';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'You already own this project';
  end if;

  insert into public.project_shares (project_id, owner_id, user_id, shared_with_email)
  values (p_project_id, project_owner_id, target_user_id, normalized_email)
  on conflict (project_id, user_id) do update
    set shared_with_email = excluded.shared_with_email;
end;
$$;
revoke all on function public.share_project_with_email(uuid, text) from public;
grant execute on function public.share_project_with_email(uuid, text) to authenticated;

-- public bucket so images work inside emails
insert into storage.buckets (id, name, public) values ('photos','photos',true) on conflict do nothing;
drop policy if exists "read photos" on storage.objects;
create policy "read photos" on storage.objects for select using (bucket_id = 'photos');
drop policy if exists "upload own photos" on storage.objects;
create policy "upload own photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- optional: lets the app upload default PNG icons once per user (only needed if you see broken icons)
drop policy if exists "update own photos" on storage.objects;
create policy "update own photos" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

notify pgrst, 'reload schema';
