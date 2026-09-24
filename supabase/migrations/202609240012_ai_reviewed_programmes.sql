-- Let evidence-backed AI extraction power the MVP while keeping human verification distinct.
alter table public.programmes
  drop constraint if exists programmes_verification_status_check;

alter table public.programmes
  add constraint programmes_verification_status_check
  check (verification_status in ('unverified', 'in_review', 'ai_reviewed', 'verified', 'stale')),
  add column if not exists ai_reviewed_at timestamptz,
  add column if not exists ai_confidence numeric(5,2)
    check (ai_confidence between 0 and 100),
  add column if not exists ai_review_model text;

comment on column public.programmes.ai_confidence is
  'Model-reported confidence. AI-reviewed records require >=70, quoted evidence, and at least one explicit eligibility rule.';
