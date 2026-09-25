-- Second priority expansion: selected 2026/27 English-taught programmes from
-- Florence, Federico II Naples, Rome Tor Vergata, and Bocconi. These catalogue
-- discoveries remain unverified until their admission rules are reviewed.

with catalogues (university_slug, university_name, city, catalogue_source_url) as (
  values
    ('firenze', 'University of Florence', 'Florence', 'https://www.unifi.it/en/study-us/degree-programmes/international-courses'),
    ('napoli-federico-ii', 'University of Naples Federico II', 'Naples', 'https://www.dises.unina.it/en_GB/web/guest/unina-international/education/courses'),
    ('roma-tor-vergata', 'University of Rome Tor Vergata', 'Rome', 'https://web.uniroma2.it/en/percorso/international_vision/sezione/courses_held_in_english'),
    ('milano-bocconi', 'Bocconi University', 'Milan', 'https://www.unibocconi.it/en/programs')
), incoming (
  university_slug, programme_name, degree_level, duration_years,
  official_programme_code, degree_class
) as (
  values
    ('firenze', 'Sustainable Business for Societal Challenges', 'Bachelor', 3.0, null, null),
    ('firenze', 'Geological Hazards and Environmental Sustainability', 'Bachelor', 3.0, null, null),
    ('firenze', 'Medicine and Surgery', 'Single-cycle', 6.0, null, 'LM-41'),
    ('firenze', 'Mechanical Engineering for Sustainability', 'Master', 2.0, null, null),
    ('firenze', 'Management Engineering', 'Master', 2.0, null, null),
    ('firenze', 'Geoengineering', 'Master', 2.0, null, null),
    ('firenze', 'Advanced Molecular Sciences', 'Master', 2.0, null, null),
    ('firenze', 'Software: Science and Technology', 'Master', 2.0, null, null),

    ('napoli-federico-ii', 'Biology for One-Health', 'Bachelor', 3.0, null, null),
    ('napoli-federico-ii', 'Electrical Engineering and Information Technology', 'Bachelor', 3.0, null, null),
    ('napoli-federico-ii', 'Medicine and Surgery', 'Single-cycle', 6.0, null, 'LM-41'),
    ('napoli-federico-ii', 'Veterinary Medicine', 'Single-cycle', 5.0, null, 'LM-42'),
    ('napoli-federico-ii', 'Data Science', 'Master', 2.0, null, null),
    ('napoli-federico-ii', 'Economics and Finance', 'Master', 2.0, null, null),
    ('napoli-federico-ii', 'Sustainable Food Systems', 'Master', 2.0, null, null),
    ('napoli-federico-ii', 'Industrial Chemistry for Circular and Bio Economy', 'Master', 2.0, null, 'LM-71'),

    ('roma-tor-vergata', 'Business Administration and Economics', 'Bachelor', 3.0, null, 'L-18/L-33'),
    ('roma-tor-vergata', 'Engineering Sciences', 'Bachelor', 3.0, null, null),
    ('roma-tor-vergata', 'Global Governance', 'Bachelor', 3.0, null, null),
    ('roma-tor-vergata', 'Medicine and Surgery', 'Single-cycle', 6.0, null, 'LM-41'),
    ('roma-tor-vergata', 'ICT and Internet Engineering', 'Master', 2.0, null, null),
    ('roma-tor-vergata', 'Management Engineering', 'Master', 2.0, null, null),
    ('roma-tor-vergata', 'Astrophysics and Space Science', 'Master', 2.0, null, null),
    ('roma-tor-vergata', 'Physics of Complex Systems and Big Data', 'Master', 2.0, null, null),

    ('milano-bocconi', 'Economics', 'Bachelor', 3.0, null, null),
    ('milano-bocconi', 'Finance', 'Bachelor', 3.0, null, null),
    ('milano-bocconi', 'International Politics and Government', 'Bachelor', 3.0, null, null),
    ('milano-bocconi', 'Management and Computer Science', 'Bachelor', 3.0, null, null),
    ('milano-bocconi', 'Mathematical and Computing Sciences for Artificial Intelligence', 'Bachelor', 3.0, null, null),
    ('milano-bocconi', 'International Management', 'Master', 2.0, null, null),
    ('milano-bocconi', 'Data Science and Business Analytics', 'Master', 2.0, null, null),
    ('milano-bocconi', 'Artificial Intelligence', 'Master', 2.0, null, null)
), resolved as (
  select
    incoming.*,
    catalogues.university_name,
    catalogues.city,
    catalogues.catalogue_source_url,
    universities.id as university_id
  from incoming
  join catalogues using (university_slug)
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
  catalogue_source_url,
  catalogue_source_url,
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
