alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

-- Do not interrupt people already using the product. Accounts created after
-- this migration begin with a null value and receive the quick-start flow.
update public.profiles
set onboarding_completed_at = now()
where onboarding_completed_at is null;

comment on column public.profiles.onboarding_completed_at is
  'Set when the user dismisses or completes the first-login quick-start tutorial.';
