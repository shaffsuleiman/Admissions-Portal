-- Evidence-backed Codex review of priority English-taught master's programmes.
-- These records remain explicitly AI-reviewed, not human-verified.

update public.programmes
set source_url = 'https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf',
    requirements = jsonb_build_object(
      'min_years_of_education', null,
      'min_grade_110', null,
      'min_cgpa_4', null,
      'subject_credits', '[]'::jsonb,
      'english', jsonb_build_object('ielts', 5.5, 'toefl', null, 'moi_accepted', false),
      'extras', jsonb_build_array(
        'A first-level degree (EQF 6) or equivalent qualification is required',
        'Recommended prior field: Engineering, Mathematics or Computer Science',
        'The academic commission assesses curricular fit and academic quality'
      )
    ),
    verification_evidence = jsonb_build_array(
      jsonb_build_object('field', 'English', 'quote', 'IELTS 5.5'),
      jsonb_build_object('field', 'Prior field', 'quote', 'Any field of Engineering, Mathematics, Computer science'),
      jsonb_build_object('field', 'Degree', 'quote', 'first level degree (EQF 6) or equivalent qualification')
    ),
    verification_status = 'ai_reviewed',
    verification_notes = 'Codex checked official Politecnico di Torino 2026/27 sources on 24 September 2026. Published numeric English evidence is encoded; curricular suitability remains a committee assessment.',
    review_started_at = now(),
    source_checked_at = now(),
    ai_reviewed_at = now(),
    ai_confidence = 94,
    ai_review_model = 'codex-official-source-review',
    verified_at = null,
    verified_by = null,
    updated_at = now()
where university_name = 'Politecnico di Torino'
  and programme_name = 'Data Science and Engineering'
  and academic_year = '2026/27';

update public.programmes
set source_url = 'https://www.polimi.it/en/education/laurea-programmes/programme-detail/computer-science-and-engineering',
    requirements = jsonb_build_object(
      'min_years_of_education', null,
      'min_grade_110', null,
      'min_cgpa_4', null,
      'subject_credits', '[]'::jsonb,
      'english', jsonb_build_object('ielts', null, 'toefl', null, 'moi_accepted', false),
      'extras', jsonb_build_array(
        'A first-level Bachelor degree is required',
        'Applicants outside Computer Science or Computer Engineering need fundamental Computer Science, basic science and engineering coursework',
        'An English-language certificate is required; confirm the accepted test and current threshold before applying'
      )
    ),
    verification_evidence = jsonb_build_array(
      jsonb_build_object('field', 'Degree', 'quote', 'holding a first-level (Bachelor’s) degree'),
      jsonb_build_object('field', 'Prior study', 'quote', 'fundamental courses in computer science, basic scientific subjects, and engineering'),
      jsonb_build_object('field', 'English', 'quote', 'certificate demonstrating a good command of the English language')
    ),
    verification_status = 'ai_reviewed',
    verification_notes = 'Codex checked the official Politecnico di Milano programme page on 24 September 2026. The page requires English certification but does not publish a numeric score there, so no score was invented.',
    review_started_at = now(),
    source_checked_at = now(),
    ai_reviewed_at = now(),
    ai_confidence = 90,
    ai_review_model = 'codex-official-source-review',
    verified_at = null,
    verified_by = null,
    updated_at = now()
where university_name = 'Politecnico di Milano'
  and programme_name = 'Computer Science and Engineering'
  and academic_year = '2026/27';

update public.programmes
set source_url = 'https://datascience.math.unipd.it/admission/',
    requirements = jsonb_build_object(
      'min_years_of_education', null,
      'min_grade_110', null,
      'min_cgpa_4', null,
      'subject_credits', '[]'::jsonb,
      'english', jsonb_build_object('ielts', null, 'toefl', null, 'moi_accepted', false),
      'extras', jsonb_build_array(
        'International applicants are assessed on Mathematics, Probability and Computer Science preparation',
        'Transcript grades and overall GPA are assessed',
        'English at CEFR B2 is required; confirm accepted proof before applying'
      )
    ),
    verification_evidence = jsonb_build_array(
      jsonb_build_object('field', 'Curriculum', 'quote', 'Mathematics, Probability, and Computer Science'),
      jsonb_build_object('field', 'Grades', 'quote', 'exam grades and the Grade Point Average (GPA)'),
      jsonb_build_object('field', 'English', 'quote', 'A B2 level of ENGLISH')
    ),
    verification_status = 'ai_reviewed',
    verification_notes = 'Codex checked the official University of Padua Data Science admissions page on 24 September 2026. The numeric ECTS and 85/110 rules shown for Italian degrees were not applied to Pakistani qualifications because the university specifies a separate international curriculum review.',
    review_started_at = now(),
    source_checked_at = now(),
    ai_reviewed_at = now(),
    ai_confidence = 92,
    ai_review_model = 'codex-official-source-review',
    verified_at = null,
    verified_by = null,
    updated_at = now()
where university_name = 'University of Padua'
  and programme_name = 'Data Science'
  and academic_year = '2026/27';

update public.programmes
set source_url = 'https://corsidilaurea.uniroma1.it/en/course/33519/apply',
    requirements = jsonb_build_object(
      'min_years_of_education', null,
      'min_grade_110', null,
      'min_cgpa_4', null,
      'subject_credits', jsonb_build_array(
        jsonb_build_object('area', 'Mathematics', 'ects', 12),
        jsonb_build_object('area', 'Statistics', 'ects', 6),
        jsonb_build_object('area', 'Computer science', 'ects', 6)
      ),
      'english', jsonb_build_object('ielts', null, 'toefl', null, 'moi_accepted', false),
      'extras', jsonb_build_array(
        'Bachelor curriculum relevance and grade or GPA are assessed',
        'English at CEFR B2 or higher is required',
        'The programme curricular requirements must also be satisfied'
      )
    ),
    verification_evidence = jsonb_build_array(
      jsonb_build_object('field', 'Mathematics', 'quote', '12 Credits ... MAT/03 ... MAT/05'),
      jsonb_build_object('field', 'Statistics', 'quote', '6 Credits ... MAT/06'),
      jsonb_build_object('field', 'Computer science', 'quote', '6 Credits ... INF/01 ... ING-INF/05'),
      jsonb_build_object('field', 'English', 'quote', 'at least a B2 level of English')
    ),
    verification_status = 'ai_reviewed',
    verification_notes = 'Codex checked the official Sapienza 2026/27 application page on 24 September 2026. The published subject-credit route is encoded; degree relevance, GPA and the remaining curricular assessment stay visible as committee checks.',
    review_started_at = now(),
    source_checked_at = now(),
    ai_reviewed_at = now(),
    ai_confidence = 95,
    ai_review_model = 'codex-official-source-review',
    verified_at = null,
    verified_by = null,
    updated_at = now()
where university_name = 'Sapienza University of Rome'
  and programme_name = 'Data Science'
  and academic_year = '2026/27';

do $$
begin
  if (
    select count(*)
    from public.programmes
    where ai_review_model = 'codex-official-source-review'
      and academic_year = '2026/27'
      and (university_name, programme_name) in (
        ('Politecnico di Torino', 'Data Science and Engineering'),
        ('Politecnico di Milano', 'Computer Science and Engineering'),
        ('University of Padua', 'Data Science'),
        ('Sapienza University of Rome', 'Data Science')
      )
  ) <> 4 then
    raise exception 'Expected four priority programmes to receive Codex review';
  end if;
end $$;
