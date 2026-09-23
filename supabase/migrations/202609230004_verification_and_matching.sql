-- Verification workflow, per-university conversions and auditable match checks.
--
-- After applying, make yourself a programme verifier (run once in the SQL editor):
--   insert into public.platform_admins (user_id)
--   select id from auth.users where email = 'you@example.com';

-- Platform verifiers: the people allowed to publish programme rules.
create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.platform_admins enable row level security;
revoke all on public.platform_admins from anon, authenticated;
grant select on public.platform_admins to authenticated;
create policy platform_admins_select_self on public.platform_admins
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function private.is_platform_admin()
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.platform_admins where user_id = (select auth.uid())
  );
$$;
grant execute on function private.is_platform_admin() to authenticated;

-- Programmes stay read-only for consultancies; verifiers can add and edit them.
alter table public.programmes
  add column if not exists extraction_draft jsonb,
  add column if not exists verification_notes text;
grant insert, update on public.programmes to authenticated;
create policy programmes_insert_verifier on public.programmes
  for insert to authenticated with check (private.is_platform_admin());
create policy programmes_update_verifier on public.programmes
  for update to authenticated
  using (private.is_platform_admin()) with check (private.is_platform_admin());

-- Conversions are stored per university, not globally (credit hours → ECTS,
-- and the passing CGPA as a fraction of the scale for the 110 conversion).
alter table public.universities
  add column if not exists ects_per_credit_hour numeric(5,2) not null default 1.8
    check (ects_per_credit_hour > 0),
  add column if not exists grade_pass_ratio numeric(4,3) not null default 0.5
    check (grade_pass_ratio > 0 and grade_pass_ratio < 1),
  add column if not exists conversion_source_url text;
grant update (ects_per_credit_hour, grade_pass_ratio, conversion_source_url)
  on public.universities to authenticated;
create policy universities_update_verifier on public.universities
  for update to authenticated
  using (private.is_platform_admin()) with check (private.is_platform_admin());

-- Student facts the eligibility engine needs.
alter table public.academic_profiles
  add column if not exists years_of_education integer
    check (years_of_education between 10 and 22),
  add column if not exists total_credit_hours numeric(6,1);

-- Each match keeps the individual check results for auditability.
alter table public.matches
  add column if not exists checks jsonb not null default '[]'::jsonb;

-- The starter rules were sample values, not checked against the admissions calls.
-- Never present them as verified: a verifier must re-check each one first.
update public.programmes
set verification_status = 'unverified',
    verified_at = null,
    verified_by = null,
    verification_notes = 'Starter sample rules. Check every field against the 2027/28 admissions call before verifying.'
where verified_by is null
  and academic_year = '2027/28'
  and university_name in (
    'University of Padua', 'University of Bologna', 'Politecnico di Torino',
    'University of Milan', 'University of Pisa', 'Ca'' Foscari University'
  );
