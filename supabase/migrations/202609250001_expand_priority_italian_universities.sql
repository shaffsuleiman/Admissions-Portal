-- Reviewed 2026/27 English-taught catalogue selections from four additional
-- leading Italian universities. Catalogue discovery only: admission rules,
-- fees, and deadlines remain unverified until a source review is published.

with incoming (
  university_slug, university_name, programme_name, city, degree_level,
  official_programme_code, degree_class, duration_years, source_url,
  catalogue_source_url
) as (
  values
    ('milano', 'University of Milan', 'Artificial Intelligence', 'Milan, Pavia', 'Bachelor', null, null, 3.0, 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english', 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english'),
    ('milano', 'University of Milan', 'Economics: Behavior, Data and Policy', 'Milan', 'Bachelor', null, null, 3.0, 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english', 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english'),
    ('milano', 'University of Milan', 'International Politics, Law and Economics', 'Milan', 'Bachelor', null, null, 3.0, 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english', 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english'),
    ('milano', 'University of Milan', 'International Medical School', 'Milan', 'Single-cycle', null, null, 6.0, 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english', 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english'),
    ('milano', 'University of Milan', 'Data Science for Economics and Health', 'Milan', 'Master', null, 'LM-DATA', 2.0, 'https://www.unimi.it/en/education/master-programme/data-science-economics-and-health', 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english'),
    ('milano', 'University of Milan', 'Computational Social and Political Science', 'Milan', 'Master', null, 'LM-62/88', 2.0, 'https://www.unimi.it/en/education/master-programme/computational-social-and-political-science', 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english'),
    ('milano', 'University of Milan', 'Human-Centered Artificial Intelligence', 'Milan', 'Master', null, null, 2.0, 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english', 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english'),
    ('milano', 'University of Milan', 'Management of Innovation and Entrepreneurship', 'Milan', 'Master', null, null, 2.0, 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english', 'https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english'),

    ('torino', 'University of Turin', 'Business & Management', 'Turin', 'Bachelor', null, null, 3.0, 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english', 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english'),
    ('torino', 'University of Turin', 'Economics and Finance with Data Science', 'Turin', 'Bachelor', null, null, 3.0, 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english', 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english'),
    ('torino', 'University of Turin', 'Global Law and Transnational Legal Studies', 'Turin', 'Bachelor', null, null, 3.0, 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english', 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english'),
    ('torino', 'University of Turin', 'Medicine and Surgery', 'Turin', 'Single-cycle', null, 'LM-41', 6.0, 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english', 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english'),
    ('torino', 'University of Turin', 'Artificial Intelligence and High Performance Computing Technologies', 'Turin', 'Master', '0805M21', 'LM-18', 2.0, 'https://en.unito.it/studying-unito/programs/degree-programs/artificial-intelligence-and-high-performance-computing', 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english'),
    ('torino', 'University of Turin', 'Artificial Intelligence for Biomedicine and Healthcare', 'Turin', 'Master', null, null, 2.0, 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english', 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english'),
    ('torino', 'University of Turin', 'Quantitative Finance and Insurance', 'Turin', 'Master', null, null, 2.0, 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english', 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english'),
    ('torino', 'University of Turin', 'Stochastics and Data Science', 'Turin', 'Master', null, null, 2.0, 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english', 'https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english'),

    ('trento', 'University of Trento', 'Comparative, European and International Legal Studies', 'Trento', 'Bachelor', null, null, 3.0, 'https://www.unitn.it/en/study/courses', 'https://www.unitn.it/en/study/courses'),
    ('trento', 'University of Trento', 'Economics and Management', 'Trento', 'Bachelor', null, null, 3.0, 'https://www.unitn.it/en/admission-courses-taught-english', 'https://www.unitn.it/en/admission-courses-taught-english'),
    ('trento', 'University of Trento', 'Data Science', 'Trento', 'Master', null, null, 2.0, 'https://corsi.unitn.it/en/data-science', 'https://www.unitn.it/en/admission-courses-taught-english'),
    ('trento', 'University of Trento', 'Human-Computer Interaction', 'Trento', 'Master', null, null, 2.0, 'https://www.unitn.it/en/admission-courses-taught-english', 'https://www.unitn.it/en/admission-courses-taught-english'),
    ('trento', 'University of Trento', 'Innovation Management', 'Trento', 'Master', null, null, 2.0, 'https://www.unitn.it/en/admission-courses-taught-english', 'https://www.unitn.it/en/admission-courses-taught-english'),
    ('trento', 'University of Trento', 'International Management', 'Trento', 'Master', null, null, 2.0, 'https://www.unitn.it/en/admission-courses-taught-english', 'https://www.unitn.it/en/admission-courses-taught-english'),
    ('trento', 'University of Trento', 'Mechatronics Engineering', 'Trento', 'Master', null, null, 2.0, 'https://www.unitn.it/en/admission-courses-taught-english', 'https://www.unitn.it/en/admission-courses-taught-english'),
    ('trento', 'University of Trento', 'Quantitative and Computational Biology', 'Trento', 'Master', null, null, 2.0, 'https://www.unitn.it/en/admission-courses-taught-english', 'https://www.unitn.it/en/admission-courses-taught-english'),

    ('pavia', 'University of Pavia', 'Artificial Intelligence', 'Pavia', 'Bachelor', null, 'L-31', 3.0, 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs', 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs'),
    ('pavia', 'University of Pavia', 'Agri-food Sustainability', 'Pavia', 'Master', null, 'LM-69', 2.0, 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs', 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs'),
    ('pavia', 'University of Pavia', 'Computer Engineering', 'Pavia', 'Master', '06431', 'LM-32', 2.0, 'https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/second-cycle-degree-course/computer-engineering', 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs'),
    ('pavia', 'University of Pavia', 'Electronic Engineering', 'Pavia', 'Master', null, null, 2.0, 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs', 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs'),
    ('pavia', 'University of Pavia', 'Molecular Biology and Genetics', 'Pavia', 'Master', null, null, 2.0, 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs', 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs'),
    ('pavia', 'University of Pavia', 'Industrial Nanobiotechnologies for Pharmaceuticals', 'Pavia', 'Master', '07407', 'LM-8', 2.0, 'https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/second-cycle-degree-course/industrial-nanobiotechnologies-pharmaceuticals', 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs'),
    ('pavia', 'University of Pavia', 'International Business and Entrepreneurship', 'Pavia', 'Master', '02418', 'LM-77', 2.0, 'https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/second-cycle-degree-course/international-business-and-entrepreneurship', 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs'),
    ('pavia', 'University of Pavia', 'World Politics and International Relations', 'Pavia', 'Master', '03415', null, 2.0, 'https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/second-cycle-degree-course/world-politics-and-international-relations', 'https://en.unipv.it/en/education/bachelors-and-master-degree-programs/degree-programs')
), resolved as (
  select incoming.*, universities.id as university_id
  from incoming
  join public.universities on universities.slug = incoming.university_slug
)
insert into public.programmes (
  university_id, university_name, programme_name, country_code, city,
  degree_level, teaching_language, intake, source_url, application_url,
  academic_year, verification_status, verification_notes, requirements,
  official_programme_code, degree_class, catalogue_source_url,
  catalogue_checked_at, duration_years
)
select
  university_id,
  university_name,
  programme_name,
  'IT',
  city,
  degree_level,
  'English',
  'Fall 2026',
  source_url,
  source_url,
  '2026/27',
  'unverified',
  'Selected from the university''s official English-taught catalogue on 25 September 2026. Admission requirements, fees, and deadlines require human verification.',
  '{}'::jsonb,
  official_programme_code,
  degree_class,
  catalogue_source_url,
  date '2026-09-25',
  duration_years
from resolved
on conflict (university_name, programme_name, academic_year, degree_level)
do update set
  university_id = excluded.university_id,
  city = excluded.city,
  teaching_language = excluded.teaching_language,
  official_programme_code = coalesce(excluded.official_programme_code, public.programmes.official_programme_code),
  degree_class = coalesce(excluded.degree_class, public.programmes.degree_class),
  duration_years = coalesce(excluded.duration_years, public.programmes.duration_years),
  catalogue_source_url = excluded.catalogue_source_url,
  catalogue_checked_at = excluded.catalogue_checked_at,
  updated_at = now();
