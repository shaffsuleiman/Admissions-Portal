-- Merit Admissions OS: initial multi-tenant schema
-- Apply with `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;
create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country_code text not null default 'PK',
  plan text not null default 'starter' check (plan in ('trial', 'starter', 'growth', 'enterprise')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'counsellor' check (role in ('admin', 'manager', 'counsellor', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  city text,
  date_of_birth date,
  status text not null default 'profile_processing' check (status in ('profile_processing', 'needs_review', 'shortlist_ready', 'applying', 'enrolled', 'archived')),
  target_countries text[] not null default array['Italy']::text[],
  target_intake text,
  annual_budget_eur integer,
  consent_recorded_at timestamptz,
  consent_recorded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.academic_profiles (
  student_id uuid primary key references public.students(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  degree_level text,
  degree_title text,
  institution text,
  graduation_year integer,
  cgpa numeric(5,2),
  cgpa_scale numeric(5,2),
  english_test_type text,
  english_overall numeric(4,1),
  medium_of_instruction boolean not null default false,
  extraction_confidence numeric(5,2),
  confirmed_at timestamptz,
  confirmed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subject_credits (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  subject_area text not null,
  local_credits numeric(7,2),
  ects numeric(7,2) not null default 0,
  source_courses jsonb not null default '[]'::jsonb,
  confirmed boolean not null default false,
  unique (student_id, subject_area)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  document_type text not null check (document_type in ('transcript', 'degree', 'english_test', 'passport', 'sop', 'cv', 'other')),
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  extraction_status text not null default 'pending' check (extraction_status in ('pending', 'processing', 'review', 'verified', 'failed')),
  extraction_confidence numeric(5,2),
  extracted_data jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  verified_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  university_name text not null,
  programme_name text not null,
  country_code text not null,
  city text,
  degree_level text not null,
  teaching_language text not null default 'English',
  annual_tuition_eur integer,
  intake text,
  application_deadline date,
  application_url text,
  source_url text not null,
  requirements jsonb not null default '{}'::jsonb,
  academic_year text not null,
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'in_review', 'verified', 'stale')),
  verified_at timestamptz,
  verified_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (university_name, programme_name, academic_year)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  programme_id uuid not null references public.programmes(id) on delete cascade,
  result text not null check (result in ('eligible', 'borderline', 'not_eligible')),
  score numeric(5,2) not null check (score between 0 and 100),
  reasons jsonb not null default '[]'::jsonb,
  rules_snapshot jsonb not null,
  generated_at timestamptz not null default now(),
  unique (student_id, programme_id)
);

create table public.shortlists (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null default 'Programme shortlist',
  programme_ids uuid[] not null default '{}',
  shared_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  programme_id uuid not null references public.programmes(id),
  stage text not null default 'shortlisted' check (stage in ('shortlisted', 'application_ready', 'submitted', 'pre_admitted', 'universitaly', 'visa', 'enrolled', 'rejected')),
  submitted_at timestamptz,
  decision_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, programme_id)
);

create table public.deadlines (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  programme_id uuid references public.programmes(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  deadline_type text not null check (deadline_type in ('application', 'scholarship', 'pre_enrolment', 'document', 'visa', 'custom')),
  title text not null,
  due_at timestamptz not null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index workspace_members_user_id_idx on public.workspace_members(user_id);
create index students_workspace_id_idx on public.students(workspace_id);
create index students_assigned_to_idx on public.students(assigned_to);
create index academic_profiles_workspace_id_idx on public.academic_profiles(workspace_id);
create index subject_credits_workspace_id_idx on public.subject_credits(workspace_id);
create index documents_workspace_id_idx on public.documents(workspace_id);
create index documents_student_id_idx on public.documents(student_id);
create index programmes_country_intake_idx on public.programmes(country_code, intake);
create index programmes_verification_idx on public.programmes(verification_status, verified_at);
create index matches_workspace_id_idx on public.matches(workspace_id);
create index matches_student_id_idx on public.matches(student_id);
create index shortlists_workspace_id_idx on public.shortlists(workspace_id);
create index applications_workspace_id_idx on public.applications(workspace_id);
create index applications_student_id_idx on public.applications(student_id);
create index deadlines_workspace_due_idx on public.deadlines(workspace_id, due_at);
create index activity_logs_workspace_created_idx on public.activity_logs(workspace_id, created_at desc);

create or replace function private.user_workspace_ids()
returns setof uuid language sql security definer set search_path = '' stable as $$
  select workspace_id from public.workspace_members where user_id = (select auth.uid());
$$;

create or replace function private.is_workspace_manager(target_workspace uuid)
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = target_workspace
      and user_id = (select auth.uid())
      and role in ('admin', 'manager')
  );
$$;

create or replace function private.shares_workspace(target_user uuid)
returns boolean language sql security definer set search_path = '' stable as $$
  select target_user = (select auth.uid()) or exists (
    select 1 from public.workspace_members target
    where target.user_id = target_user
      and target.workspace_id in (select private.user_workspace_ids())
  );
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
grant execute on function private.user_workspace_ids() to authenticated;
grant execute on function private.is_workspace_manager(uuid) to authenticated;
grant execute on function private.shares_workspace(uuid) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));

  insert into public.workspaces (name, slug, created_by)
  values (
    coalesce(new.raw_user_meta_data ->> 'workspace_name', split_part(new.email, '@', 1) || '''s workspace'),
    'workspace-' || new.id::text,
    new.id
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.add_workspace_creator()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.created_by, 'admin');
  return new;
end;
$$;

create trigger on_workspace_created
  after insert on public.workspaces
  for each row execute procedure public.add_workspace_creator();

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger workspaces_set_updated_at before update on public.workspaces for each row execute procedure public.set_updated_at();
create trigger students_set_updated_at before update on public.students for each row execute procedure public.set_updated_at();
create trigger academic_profiles_set_updated_at before update on public.academic_profiles for each row execute procedure public.set_updated_at();
create trigger programmes_set_updated_at before update on public.programmes for each row execute procedure public.set_updated_at();
create trigger applications_set_updated_at before update on public.applications for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.students enable row level security;
alter table public.academic_profiles enable row level security;
alter table public.subject_credits enable row level security;
alter table public.documents enable row level security;
alter table public.programmes enable row level security;
alter table public.matches enable row level security;
alter table public.shortlists enable row level security;
alter table public.applications enable row level security;
alter table public.deadlines enable row level security;
alter table public.activity_logs enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.workspaces, public.workspace_members, public.students,
  public.academic_profiles, public.subject_credits, public.documents, public.matches,
  public.shortlists, public.applications, public.deadlines to authenticated;
grant select on public.programmes to authenticated;
grant select, insert on public.activity_logs to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create policy profiles_select on public.profiles for select to authenticated using (private.shares_workspace(id));
create policy profiles_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy workspaces_select on public.workspaces for select to authenticated using (id in (select private.user_workspace_ids()));
create policy workspaces_insert on public.workspaces for insert to authenticated with check (created_by = (select auth.uid()));
create policy workspaces_update on public.workspaces for update to authenticated using (private.is_workspace_manager(id)) with check (private.is_workspace_manager(id));
create policy workspaces_delete on public.workspaces for delete to authenticated using (exists (select 1 from public.workspace_members m where m.workspace_id = id and m.user_id = (select auth.uid()) and m.role = 'admin'));

create policy workspace_members_select on public.workspace_members for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy workspace_members_insert on public.workspace_members for insert to authenticated with check (private.is_workspace_manager(workspace_id));
create policy workspace_members_update on public.workspace_members for update to authenticated using (private.is_workspace_manager(workspace_id)) with check (private.is_workspace_manager(workspace_id));
create policy workspace_members_delete on public.workspace_members for delete to authenticated using (private.is_workspace_manager(workspace_id));

create policy students_select on public.students for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy students_insert on public.students for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()));
create policy students_update on public.students for update to authenticated using (workspace_id in (select private.user_workspace_ids())) with check (workspace_id in (select private.user_workspace_ids()));
create policy students_delete on public.students for delete to authenticated using (workspace_id in (select private.user_workspace_ids()));

create policy academic_profiles_select on public.academic_profiles for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy academic_profiles_insert on public.academic_profiles for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()));
create policy academic_profiles_update on public.academic_profiles for update to authenticated using (workspace_id in (select private.user_workspace_ids())) with check (workspace_id in (select private.user_workspace_ids()));
create policy academic_profiles_delete on public.academic_profiles for delete to authenticated using (workspace_id in (select private.user_workspace_ids()));

create policy subject_credits_select on public.subject_credits for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy subject_credits_insert on public.subject_credits for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()));
create policy subject_credits_update on public.subject_credits for update to authenticated using (workspace_id in (select private.user_workspace_ids())) with check (workspace_id in (select private.user_workspace_ids()));
create policy subject_credits_delete on public.subject_credits for delete to authenticated using (workspace_id in (select private.user_workspace_ids()));

create policy documents_select on public.documents for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy documents_insert on public.documents for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()));
create policy documents_update on public.documents for update to authenticated using (workspace_id in (select private.user_workspace_ids())) with check (workspace_id in (select private.user_workspace_ids()));
create policy documents_delete on public.documents for delete to authenticated using (workspace_id in (select private.user_workspace_ids()));

create policy programmes_select on public.programmes for select to authenticated using (true);

create policy matches_select on public.matches for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy matches_insert on public.matches for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()));
create policy matches_update on public.matches for update to authenticated using (workspace_id in (select private.user_workspace_ids())) with check (workspace_id in (select private.user_workspace_ids()));
create policy matches_delete on public.matches for delete to authenticated using (workspace_id in (select private.user_workspace_ids()));

create policy shortlists_select on public.shortlists for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy shortlists_insert on public.shortlists for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()) and created_by = (select auth.uid()));
create policy shortlists_update on public.shortlists for update to authenticated using (workspace_id in (select private.user_workspace_ids())) with check (workspace_id in (select private.user_workspace_ids()));
create policy shortlists_delete on public.shortlists for delete to authenticated using (workspace_id in (select private.user_workspace_ids()));

create policy applications_select on public.applications for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy applications_insert on public.applications for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()));
create policy applications_update on public.applications for update to authenticated using (workspace_id in (select private.user_workspace_ids())) with check (workspace_id in (select private.user_workspace_ids()));
create policy applications_delete on public.applications for delete to authenticated using (workspace_id in (select private.user_workspace_ids()));

create policy deadlines_select on public.deadlines for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy deadlines_insert on public.deadlines for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()));
create policy deadlines_update on public.deadlines for update to authenticated using (workspace_id in (select private.user_workspace_ids())) with check (workspace_id in (select private.user_workspace_ids()));
create policy deadlines_delete on public.deadlines for delete to authenticated using (workspace_id in (select private.user_workspace_ids()));

create policy activity_logs_select on public.activity_logs for select to authenticated using (workspace_id in (select private.user_workspace_ids()));
create policy activity_logs_insert on public.activity_logs for insert to authenticated with check (workspace_id in (select private.user_workspace_ids()) and actor_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'student-documents',
  'student-documents',
  false,
  20971520,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy student_documents_select on storage.objects for select to authenticated
using (bucket_id = 'student-documents' and (storage.foldername(name))[1] in (select workspace_id::text from private.user_workspace_ids() as workspace_ids(workspace_id)));

create policy student_documents_insert on storage.objects for insert to authenticated
with check (bucket_id = 'student-documents' and (storage.foldername(name))[1] in (select workspace_id::text from private.user_workspace_ids() as workspace_ids(workspace_id)));

create policy student_documents_update on storage.objects for update to authenticated
using (bucket_id = 'student-documents' and (storage.foldername(name))[1] in (select workspace_id::text from private.user_workspace_ids() as workspace_ids(workspace_id)))
with check (bucket_id = 'student-documents' and (storage.foldername(name))[1] in (select workspace_id::text from private.user_workspace_ids() as workspace_ids(workspace_id)));

create policy student_documents_delete on storage.objects for delete to authenticated
using (bucket_id = 'student-documents' and (storage.foldername(name))[1] in (select workspace_id::text from private.user_workspace_ids() as workspace_ids(workspace_id)));

comment on table public.programmes is 'Global verified catalogue. Writes are service-role only; authenticated workspace users can read.';
comment on table public.matches is 'Deterministic match results with an immutable rules snapshot for auditability.';
comment on column public.documents.storage_path is 'Private bucket path: {workspace_id}/{student_id}/{document_id}-{filename}';
