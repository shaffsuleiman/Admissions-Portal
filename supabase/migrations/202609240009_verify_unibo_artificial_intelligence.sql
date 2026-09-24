-- First end-to-end verified programme record.
-- Primary source: University of Bologna 2026/27 programme admissions page and call.
update public.programmes
set application_deadline = date '2026-04-09',
    application_url = 'https://corsi.unibo.it/2cycle/artificial-intelligence/how-to-enrol',
    source_url = 'https://corsi.unibo.it/2cycle/artificial-intelligence/how-to-enrol',
    requirements = jsonb_build_object(
      'min_years_of_education', null,
      'min_grade_110', null,
      'min_cgpa_4', null,
      'subject_credits', '[]'::jsonb,
      'english', jsonb_build_object(
        'ielts', 5.5,
        'toefl', 80,
        'moi_accepted', false
      ),
      'extras', jsonb_build_array(
        'Foreign degree suitability is assessed by the Degree Programme Board',
        'Academic preparation uses alternative API and computer-science-credit thresholds; counsellor must review the official calculation',
        'Italian certification or a mandatory Italian-language study activity may be required',
        'Curriculum vitae, transcript, identity document and English certificate are mandatory application documents'
      )
    ),
    verification_evidence = jsonb_build_array(
      jsonb_build_object('field', 'Foreign qualification', 'quote', 'degree obtained abroad deemed suitable'),
      jsonb_build_object('field', 'English level', 'quote', 'at least a B2-level English'),
      jsonb_build_object('field', 'MOI', 'quote', 'MOI certificates ... are not admissible'),
      jsonb_build_object('field', 'Non-EU deadline', 'quote', 'closed from April 9, 2026')
    ),
    verification_status = 'verified',
    verification_notes = 'Human-checked against the official 2026/27 University of Bologna admissions page and call on 24 September 2026. The programme uses alternative API/CSCI thresholds that require manual committee-style review; they are deliberately surfaced as an extra requirement rather than simplified into an unsafe automatic pass.',
    review_assigned_to = (select user_id from public.platform_admins order by created_at limit 1),
    review_started_at = now(),
    source_checked_at = now(),
    verified_at = now(),
    verified_by = (select user_id from public.platform_admins order by created_at limit 1),
    updated_at = now()
where official_programme_code = '6700'
  and academic_year = '2026/27';
