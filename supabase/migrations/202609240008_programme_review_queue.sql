-- Persistent reviewer workflow and field-level evidence for programme verification.
alter table public.programmes
  add column if not exists verification_evidence jsonb not null default '[]'::jsonb,
  add column if not exists review_assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists review_started_at timestamptz,
  add column if not exists source_checked_at timestamptz;

create index if not exists programmes_review_queue_idx
  on public.programmes (verification_status, review_started_at, university_name);

comment on column public.programmes.verification_evidence is
  'Short source excerpts supporting extracted admission fields; a human verifier must still confirm them.';
comment on column public.programmes.source_checked_at is
  'When a verifier last checked the saved admission rules against the primary source.';
