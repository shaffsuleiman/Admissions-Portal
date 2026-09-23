-- Persist the workspace profile/settings currently exposed by the product UI.
alter table public.workspaces
  add column if not exists business_email text,
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists tagline text not null default 'Your trusted partner for European admissions',
  add column if not exists settings jsonb not null default '{
    "destinations": {"Italy": true, "Germany": true, "France": false},
    "notifications": {"deadline_reminders": true, "profile_ready": true, "weekly_summary": false},
    "privacy": {"require_consent": true, "auto_delete_inactive": false, "activity_log": true}
  }'::jsonb;

-- A small verified starter catalogue keeps a new workspace useful immediately.
-- The rows are global and remain read-only to authenticated users.
insert into public.programmes (
  university_name, programme_name, country_code, city, degree_level,
  teaching_language, annual_tuition_eur, intake, application_deadline,
  application_url, source_url, requirements, academic_year,
  verification_status, verified_at
)
values
  ('University of Padua', 'MSc Data Science', 'IT', 'Padua', 'Master''s', 'English', 2700, 'Fall 2027', '2026-12-18', 'https://apply.unipd.it/', 'https://www.unipd.it/en/', '{"minimum_cgpa": 3.0, "math_ects": 18, "cs_ects": 30}'::jsonb, '2027/28', 'verified', '2026-09-12T00:00:00Z'),
  ('University of Bologna', 'MSc Computer Science', 'IT', 'Bologna', 'Master''s', 'English', 3200, 'Fall 2027', '2027-01-11', 'https://studenti.unibo.it/', 'https://www.unibo.it/en', '{"minimum_cgpa": 3.0, "english_ielts": 6.5}'::jsonb, '2027/28', 'verified', '2026-09-18T00:00:00Z'),
  ('Politecnico di Torino', 'MSc ICT Engineering', 'IT', 'Turin', 'Master''s', 'English', 2600, 'Fall 2027', '2027-02-02', 'https://apply.polito.it/', 'https://www.polito.it/en', '{"minimum_cgpa": 3.0, "math_ects": 26, "cs_ects": 45}'::jsonb, '2027/28', 'verified', '2026-09-08T00:00:00Z'),
  ('University of Milan', 'MSc Artificial Intelligence', 'IT', 'Milan', 'Master''s', 'English', 3900, 'Fall 2027', '2026-09-28', 'https://elixforms.unimi.it/', 'https://www.unimi.it/en', '{"minimum_cgpa": 3.0, "math_ects": 36}'::jsonb, '2027/28', 'verified', '2026-09-20T00:00:00Z'),
  ('University of Pisa', 'MSc Computer Engineering', 'IT', 'Pisa', 'Master''s', 'English', 2400, 'Fall 2027', '2027-01-16', 'https://applymscenglish.unipi.it/', 'https://www.unipi.it/en/', '{"minimum_cgpa": 3.0}'::jsonb, '2027/28', 'verified', '2026-09-15T00:00:00Z'),
  ('Ca'' Foscari University', 'MSc Data Analytics', 'IT', 'Venice', 'Master''s', 'English', 2100, 'Fall 2027', '2027-02-07', 'https://apply.unive.it/', 'https://www.unive.it/web/en', '{"minimum_cgpa": 3.0, "english_ielts": 6.5}'::jsonb, '2027/28', 'verified', '2026-09-21T00:00:00Z')
on conflict (university_name, programme_name, academic_year) do update set
  city = excluded.city,
  annual_tuition_eur = excluded.annual_tuition_eur,
  intake = excluded.intake,
  application_deadline = excluded.application_deadline,
  application_url = excluded.application_url,
  source_url = excluded.source_url,
  requirements = excluded.requirements,
  verification_status = excluded.verification_status,
  verified_at = excluded.verified_at;
