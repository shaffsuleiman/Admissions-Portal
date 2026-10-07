-- School-leaver profiles, programme access restrictions and university rankings.

-- Students applying to bachelor's programmes come from Matric/FSc or O/A levels,
-- not from a degree, so their profile records school results as percentages.
alter table public.academic_profiles
  add column if not exists highest_qualification text not null default 'bachelor'
    check (highest_qualification in ('bachelor', 'higher_secondary')),
  add column if not exists school_system text
    check (school_system in ('pakistani_board', 'cambridge', 'other')),
  add column if not exists secondary_percent numeric(5,2)
    check (secondary_percent between 0 and 100),
  add column if not exists higher_secondary_percent numeric(5,2)
    check (higher_secondary_percent between 0 and 100),
  add column if not exists a_level_grades text
    check (char_length(a_level_grades) <= 40);

-- Restricted access ("accesso programmato") caps places and usually adds a test.
-- null means it has not been confirmed for that programme yet.
alter table public.programmes
  add column if not exists access_restricted boolean;

-- Italian law sets national places for these single-cycle degrees every year.
update public.programmes
set access_restricted = true
where access_restricted is null
  and degree_level = 'Single-cycle'
  and programme_name ~* '(medicine|medical doctor|dentist|dental|veterinar|architect)';

alter table public.universities
  add column if not exists qs_rank integer check (qs_rank > 0),
  add column if not exists qs_rank_label text check (char_length(qs_rank_label) <= 20),
  add column if not exists qs_rank_year integer check (qs_rank_year between 2004 and 2100);

comment on column public.universities.qs_rank is
  'QS World University Rankings position (lower bound when QS publishes a band).';
comment on column public.universities.qs_rank_label is
  'Rank as QS prints it, for example "=123" or "801-850".';

-- QS World University Rankings 2026 positions published for Italian universities
-- (topuniversities.com; confirmed by each university's own announcements where available).
update public.universities u
set qs_rank = v.rank, qs_rank_label = v.label, qs_rank_year = 2026
from (values
  ('milano-politecnico', 98, '98'),
  ('sapienza', 128, '128'),
  ('bologna', 138, '138'),
  ('padova', 233, '233'),
  ('torino-politecnico', 242, '242'),
  ('milano', 276, '276'),
  ('pisa', 343, '343'),
  ('roma-tor-vergata', 355, '355'),
  ('napoli-federico-ii', 379, '379'),
  ('firenze', 404, '404'),
  ('milano-cattolica', 409, '409'),
  ('pavia', 423, '423'),
  ('milano-san-raffaele', 461, '461'),
  ('genova', 547, '547')
) as v(slug, rank, label)
where u.slug = v.slug;
