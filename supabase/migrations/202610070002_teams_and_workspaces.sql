-- Teams and multiple workspaces: invitations, role changes, removing members, creating
-- workspaces, last-active times and the workspace each person last had open.
--
-- Membership changes go through the functions below, which enforce the role rules:
--   * admins and managers can invite, change roles and remove members;
--   * only an admin can grant the admin role or change another admin;
--   * a workspace always keeps at least one admin.

alter table public.profiles
  add column if not exists last_seen_at timestamptz,
  add column if not exists active_workspace_id uuid references public.workspaces(id) on delete set null;

create table if not exists public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null check (char_length(email) between 5 and 254 and email like '%_@_%'),
  role text not null default 'counsellor' check (role in ('admin', 'manager', 'counsellor', 'viewer')),
  token uuid not null unique default gen_random_uuid(),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null,
  revoked_at timestamptz
);

create unique index if not exists workspace_invites_pending_email
  on public.workspace_invites (workspace_id, lower(email))
  where accepted_at is null and revoked_at is null;

alter table public.workspace_invites enable row level security;
revoke all on public.workspace_invites from anon, authenticated;
grant select on public.workspace_invites to authenticated;
create policy workspace_invites_select on public.workspace_invites
  for select to authenticated using (private.is_workspace_manager(workspace_id));

-- Membership is written only by the functions below and by the workspace-creation trigger.
drop policy if exists workspace_members_insert on public.workspace_members;
drop policy if exists workspace_members_update on public.workspace_members;
drop policy if exists workspace_members_delete on public.workspace_members;
revoke insert, update, delete on public.workspace_members from authenticated;

create or replace function private.member_role(target_workspace uuid, target_user uuid)
returns text language sql security definer set search_path = '' stable as $$
  select role from public.workspace_members where workspace_id = target_workspace and user_id = target_user;
$$;

create or replace function private.admin_count(target_workspace uuid)
returns integer language sql security definer set search_path = '' stable as $$
  select count(*)::integer from public.workspace_members where workspace_id = target_workspace and role = 'admin';
$$;

-- Joins every pending, unexpired invite addressed to the given user's email.
create or replace function private.accept_invites_for(target_user uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  user_email text;
  joined integer := 0;
  invite record;
begin
  select lower(email) into user_email from auth.users where id = target_user;
  if user_email is null then
    return 0;
  end if;
  for invite in
    select * from public.workspace_invites
    where lower(email) = user_email and accepted_at is null and revoked_at is null and expires_at > now()
  loop
    insert into public.workspace_members (workspace_id, user_id, role)
    values (invite.workspace_id, target_user, invite.role)
    on conflict (workspace_id, user_id) do nothing;
    update public.workspace_invites set accepted_at = now(), accepted_by = target_user where id = invite.id;
    insert into public.activity_logs (workspace_id, actor_id, action, entity_type, entity_id, metadata)
    values (invite.workspace_id, target_user, 'member.joined', 'member', target_user::text, jsonb_build_object('role', invite.role));
    joined := joined + 1;
  end loop;
  return joined;
end;
$$;

create or replace function public.accept_pending_invites()
returns integer language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Sign in to accept invitations';
  end if;
  return private.accept_invites_for((select auth.uid()));
end;
$$;

create or replace function public.create_workspace(workspace_name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  new_id uuid := gen_random_uuid();
  clean_name text := btrim(coalesce(workspace_name, ''));
begin
  if me is null then
    raise exception 'Sign in to create a workspace';
  end if;
  if char_length(clean_name) < 2 or char_length(clean_name) > 80 then
    raise exception 'Workspace names need 2 to 80 characters';
  end if;
  insert into public.workspaces (id, name, slug, created_by, plan)
  values (new_id, clean_name, 'workspace-' || new_id::text, me, 'trial');
  update public.profiles set active_workspace_id = new_id where id = me;
  return new_id;
end;
$$;

create or replace function public.invite_member(target_workspace uuid, invite_email text, invite_role text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  my_role text := private.member_role(target_workspace, me);
  clean_email text := lower(btrim(coalesce(invite_email, '')));
  new_token uuid;
begin
  if my_role is null or my_role not in ('admin', 'manager') then
    raise exception 'Only admins and managers can invite people';
  end if;
  if invite_role not in ('admin', 'manager', 'counsellor', 'viewer') then
    raise exception 'Choose a valid role';
  end if;
  if invite_role = 'admin' and my_role <> 'admin' then
    raise exception 'Only an admin can invite another admin';
  end if;
  if clean_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Enter a valid email address';
  end if;
  if exists (
    select 1 from public.workspace_members m join auth.users u on u.id = m.user_id
    where m.workspace_id = target_workspace and lower(u.email) = clean_email
  ) then
    raise exception 'That person is already in this workspace';
  end if;
  update public.workspace_invites set revoked_at = now()
  where workspace_id = target_workspace and lower(email) = clean_email and accepted_at is null and revoked_at is null;
  insert into public.workspace_invites (workspace_id, email, role, invited_by)
  values (target_workspace, clean_email, invite_role, me)
  returning token into new_token;
  insert into public.activity_logs (workspace_id, actor_id, action, entity_type, metadata)
  values (target_workspace, me, 'member.invited', 'invite', jsonb_build_object('email', clean_email, 'role', invite_role));
  -- Someone who already has an account joins straight away.
  perform private.accept_invites_for(u.id) from auth.users u where lower(u.email) = clean_email;
  return new_token;
end;
$$;

create or replace function public.revoke_invite(invite_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  target public.workspace_invites;
begin
  select * into target from public.workspace_invites where id = invite_id;
  if target.id is null or not private.is_workspace_manager(target.workspace_id) then
    raise exception 'Invitation not found';
  end if;
  update public.workspace_invites set revoked_at = now() where id = invite_id and accepted_at is null;
end;
$$;

create or replace function public.set_member_role(target_workspace uuid, target_user uuid, new_role text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  my_role text := private.member_role(target_workspace, me);
  their_role text := private.member_role(target_workspace, target_user);
begin
  if my_role is null or my_role not in ('admin', 'manager') then
    raise exception 'Only admins and managers can change roles';
  end if;
  if their_role is null then
    raise exception 'That person is not in this workspace';
  end if;
  if new_role not in ('admin', 'manager', 'counsellor', 'viewer') then
    raise exception 'Choose a valid role';
  end if;
  if (new_role = 'admin' or their_role = 'admin') and my_role <> 'admin' then
    raise exception 'Only an admin can grant or change the admin role';
  end if;
  if their_role = 'admin' and new_role <> 'admin' and private.admin_count(target_workspace) = 1 then
    raise exception 'A workspace needs at least one admin. Make someone else an admin first.';
  end if;
  update public.workspace_members set role = new_role where workspace_id = target_workspace and user_id = target_user;
  insert into public.activity_logs (workspace_id, actor_id, action, entity_type, entity_id, metadata)
  values (target_workspace, me, 'member.role_changed', 'member', target_user::text, jsonb_build_object('from', their_role, 'to', new_role));
end;
$$;

create or replace function public.remove_member(target_workspace uuid, target_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  my_role text := private.member_role(target_workspace, me);
  their_role text := private.member_role(target_workspace, target_user);
begin
  if their_role is null then
    raise exception 'That person is not in this workspace';
  end if;
  if target_user <> me then
    if my_role is null or my_role not in ('admin', 'manager') then
      raise exception 'Only admins and managers can remove people';
    end if;
    if their_role in ('admin', 'manager') and my_role <> 'admin' then
      raise exception 'Only an admin can remove an admin or manager';
    end if;
  end if;
  if their_role = 'admin' and private.admin_count(target_workspace) = 1 then
    raise exception 'A workspace needs at least one admin. Make someone else an admin first.';
  end if;
  delete from public.workspace_members where workspace_id = target_workspace and user_id = target_user;
  insert into public.activity_logs (workspace_id, actor_id, action, entity_type, entity_id, metadata)
  values (target_workspace, me, case when target_user = me then 'member.left' else 'member.removed' end, 'member', target_user::text, jsonb_build_object('role', their_role));
end;
$$;

-- Members of a workspace with their email, for people in that workspace only.
create or replace function public.workspace_directory(target_workspace uuid)
returns table (user_id uuid, email text, full_name text, role text, last_seen_at timestamptz, joined_at timestamptz)
language sql security definer set search_path = '' stable as $$
  select m.user_id, u.email::text, p.full_name, m.role, p.last_seen_at, m.created_at
  from public.workspace_members m
  join auth.users u on u.id = m.user_id
  left join public.profiles p on p.id = m.user_id
  where m.workspace_id = target_workspace
    and target_workspace in (select private.user_workspace_ids())
  order by m.created_at;
$$;

-- What an invitation link shows before signing in: the workspace and the invited email only.
create or replace function public.invite_preview(invite_token uuid)
returns table (workspace_id uuid, workspace_name text, email text, role text)
language sql security definer set search_path = '' stable as $$
  select w.id, w.name, i.email, i.role
  from public.workspace_invites i join public.workspaces w on w.id = i.workspace_id
  where i.token = invite_token and i.accepted_at is null and i.revoked_at is null and i.expires_at > now();
$$;

revoke all on function private.member_role(uuid, uuid) from public;
revoke all on function private.admin_count(uuid) from public;
revoke all on function private.accept_invites_for(uuid) from public;
revoke all on function public.accept_pending_invites() from public, anon;
revoke all on function public.create_workspace(text) from public, anon;
revoke all on function public.invite_member(uuid, text, text) from public, anon;
revoke all on function public.revoke_invite(uuid) from public, anon;
revoke all on function public.set_member_role(uuid, uuid, text) from public, anon;
revoke all on function public.remove_member(uuid, uuid) from public, anon;
revoke all on function public.workspace_directory(uuid) from public, anon;
grant execute on function public.accept_pending_invites() to authenticated;
grant execute on function public.create_workspace(text) to authenticated;
grant execute on function public.invite_member(uuid, text, text) to authenticated;
grant execute on function public.revoke_invite(uuid) to authenticated;
grant execute on function public.set_member_role(uuid, uuid, text) to authenticated;
grant execute on function public.remove_member(uuid, uuid) to authenticated;
grant execute on function public.workspace_directory(uuid) to authenticated;
grant execute on function public.invite_preview(uuid) to anon, authenticated;

-- Invited people join the inviting workspace instead of getting a personal one.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));

  if exists (
    select 1 from public.workspace_invites
    where lower(email) = lower(new.email) and accepted_at is null and revoked_at is null and expires_at > now()
  ) then
    perform private.accept_invites_for(new.id);
    return new;
  end if;

  insert into public.workspaces (name, slug, created_by)
  values (
    coalesce(new.raw_user_meta_data ->> 'workspace_name', split_part(new.email, '@', 1) || '''s workspace'),
    'workspace-' || new.id::text,
    new.id
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Viewers can read a workspace but not change it. Every write policy that only checked
-- membership now also requires an editing role (admin, manager or counsellor).
create or replace function private.can_edit_workspace(target_workspace uuid)
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = target_workspace
      and user_id = (select auth.uid())
      and role in ('admin', 'manager', 'counsellor')
  );
$$;
grant execute on function private.can_edit_workspace(uuid) to authenticated;

do $$
declare
  policy record;
  editable constant text := 'private.can_edit_workspace(workspace_id)';
begin
  for policy in
    select tablename, policyname, cmd
    from pg_policies
    where schemaname = 'public'
      and cmd in ('INSERT', 'UPDATE', 'DELETE')
      and tablename not in ('workspaces', 'workspace_members', 'workspace_invites', 'activity_logs', 'profiles', 'website_enquiries')
      and coalesce(qual, '') || coalesce(with_check, '') like '%user_workspace_ids%'
  loop
    if policy.cmd = 'INSERT' then
      execute format('alter policy %I on public.%I with check (%s)', policy.policyname, policy.tablename, editable);
    elsif policy.cmd = 'UPDATE' then
      execute format('alter policy %I on public.%I using (%s) with check (%s)', policy.policyname, policy.tablename, editable, editable);
    else
      execute format('alter policy %I on public.%I using (%s)', policy.policyname, policy.tablename, editable);
    end if;
  end loop;
end;
$$;
