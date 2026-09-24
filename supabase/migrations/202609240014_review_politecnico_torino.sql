-- Politecnico di Torino master's programmes, A.Y. 2026/27 official sources
-- Eligify reviewed each programme against its official admissions sources.
-- Records are AI-reviewed (provisional), never marked human-verified, and each
-- rule keeps a verbatim quote from the source. Verified rows are left untouched.

-- Politecnico di Torino: Architecture Construction City
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "ARCHITECTURE CONSTRUCTION CITY English IELTS 5.5 Architecture Recommended"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'ade480e2-e220-44ac-b7cf-9b5ede6744e3' and verification_status <> 'verified';

-- Politecnico di Torino: Architecture for Heritage
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "ARCHITECTURE FOR HERITAGE English IELTS 5.5 Architecture Recommended"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'bbbfb5d5-674d-4afe-b071-7686ceaacbec' and verification_status <> 'verified';

-- Politecnico di Torino: Architecture for Sustainability
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "ARCHITECTURE FOR SUSTAINABILITY English IELTS 5.5 Architecture Recommended"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '2cec5920-193e-4d3f-a4d8-1eb52f0f7658' and verification_status <> 'verified';

-- Politecnico di Torino: Automotive Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Automotive Engineering", "Mechanical Engineering", "Electrical Engineering", "Aerospace Engineering", "Biomedical Engineering", "Chemical Engineering", "Food Engineering", "Material Engineering", "Industrial Engineering", "Energy Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "AUTOMOTIVE ENGINEERING English IELTS 5.5 Automotive Engineering , Mechanical Engineering, Industrial Engineering*, Electrical Engineering. Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '23edcf94-4bd9-4768-bec3-36e49ab6d751' and verification_status <> 'verified';

-- Politecnico di Torino: Building Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Civil Engineering", "Building Engineering", "Architectural Engineering", "Architecture"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "BUILDING ENGINEERING English IELTS 5.5 Civil Engineering, Building Engineering, Architectural Engineering, Architecture Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'f6c1c59d-710e-41b5-8b70-83d9c26d265a' and verification_status <> 'verified';

-- Politecnico di Torino: Civil Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "CIVIL ENGINEERING English IELTS 5.5 Any field of Engineering Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '9aacc00e-e15e-41ef-b731-4b88d943c5eb' and verification_status <> 'verified';

-- Politecnico di Torino: Communications Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Computer science", "Mathematics", "Physics"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "COMMUNICATIONS ENGINEERING English IELTS 5.5 Any field of Engineering, Computer science, Mathematics, Physics Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'cfc3d590-dfd4-4a5b-a026-3077ac3d763d' and verification_status <> 'verified';

-- Politecnico di Torino: Computer Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Computer science"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "COMPUTER ENGINEERING English IELTS 5.5 Any field of Engineering, Computer science Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '7f381ac3-851a-4865-8d22-8662196a5368' and verification_status <> 'verified';

-- Politecnico di Torino: Cybersecurity Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Computer science"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "CYBERSECURITY ENGINEERING English IELTS 5.5 Any field of Engineering, Computer science Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '165ffd44-60cc-49f8-8a4c-90c2677243b5' and verification_status <> 'verified';

-- Politecnico di Torino: Digital Skills for Sustainable Societal Transitions
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Information Technology", "Computer science", "Architecture", "Landscape Architecture", "Architectural Engineering", "Urban Engineering", "Urban Planning", "Civil Engineering", "Building Engineering", "Environmental Engineering", "Electrical Engineering", "Electronics Engineering", "Industrial Engineering", "Economics", "Accounting", "Public Policy", "Public Management", "Media", "Arts", "Geography"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "TERRITORIAL SCIENCES DIGITAL SKILLS FOR SUSTAINABLE SOCIETAL TRANSITIONS English IELTS 5.5 Syllabus Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'd29e9db4-0961-46b7-b187-999d1190cbf4' and verification_status <> 'verified';

-- Politecnico di Torino: Electrical Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Electrical Engineering", "Electronic Engineering", "ICT Engineering", "Mechanical Engineering", "Aerospace Engineering", "Biomedical Engineering", "Chemical Engineering", "Food Engineering", "Material Engineering", "Automotive Engineering", "Industrial Engineering", "Energy Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "ELECTRICAL ENGINEERING NEW! English IELTS 5.5 Electrical and Electronic Engineering, ICT Engineering, Mechanical Engineering, Industrial Engineering* Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '92b0f19b-e647-4bc5-b769-9fafe08a8967' and verification_status <> 'verified';

-- Politecnico di Torino: Electronic Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "ELECTRONIC ENGINEERING English IELTS 5.5 Any field of Engineering, Physics Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '096b773b-a3de-4b23-9182-4e527a69494b' and verification_status <> 'verified';

-- Politecnico di Torino: Energy and Nuclear Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Mechanical Engineering", "Aerospace Engineering", "Biomedical Engineering", "Chemical Engineering", "Food Engineering", "Material Engineering", "Automotive Engineering", "Industrial Engineering", "Electrical Engineering", "Energy Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "ENERGY AND NUCLEAR ENGINEERING English IELTS 5.5 Industrial engineering* Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '07608f7f-31f0-4f44-9644-11fe0f54504d' and verification_status <> 'verified';

-- Politecnico di Torino: Engineering and Management
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Management Engineering", "Industrial Engineering and Management", "Mechanical Engineering", "Aerospace Engineering", "ICT Engineering", "Automotive Engineering", "Process Engineering", "Automation Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "Management engineering, Industrial engineering and management, Mechanical engineering, Aerospace engineering,"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet. Not accepted: Biomedical, Chemical and Food, Material, Electrical, Electronic and Energy Engineering bachelors.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '914be4f2-d0a3-4307-949a-0571ec485f35' and verification_status <> 'verified';

-- Politecnico di Torino: Environmental and Land Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "ENVIRONMENTAL AND LAND ENGINEERING Climate Change English IELTS 5.5 Any field of Engineering Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '3f847147-eb02-4eee-9571-3b07251ae25d' and verification_status <> 'verified';

-- Politecnico di Torino: Georesources and Geoenergy Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Geology", "Physics", "Mathematics"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "GEORESOURCES AND GEOENERGY ENGINEERING English IELTS 5.5 Any field of Engineering, Geology, Phyisics, Mathematics Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'd9a6a439-4c3a-4581-a3df-614b84d07ee0' and verification_status <> 'verified';

-- Politecnico di Torino: ICT Engineering for Smart Societies
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Computer science", "Physics", "Mathematics"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "ICT ENGINEERING FOR SMART SOCIETIES English IELTS 5.5 Any field of Engineering, Computer science, Physics, Mathematics Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '08225efc-46ed-4eca-9c51-923aded5c13f' and verification_status <> 'verified';

-- Politecnico di Torino: Materials Engineering for Industry 4.0
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "MATERIALS ENGINEERING FOR INDUSTRY 4.0 English IELTS 5.5 Any field of Engineering Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'a3e6d8b3-fe9a-4f5e-911c-912fae13e5a0' and verification_status <> 'verified';

-- Politecnico di Torino: Mechanical Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Mechanical Engineering", "Aerospace Engineering", "Automotive Engineering", "Industrial Engineering", "Management Engineering", "Energy Engineering", "Biomedical Engineering", "Material Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "Mechanical engineering, Aerospace engineering, Automotive engineering, Industrial engineering*, Management"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '04e46eb2-68d6-4698-be2e-50fb17651774' and verification_status <> 'verified';

-- Politecnico di Torino: Mechatronic Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "MECHATRONIC ENGINEERING English IELTS 5.5 Any field of Engineering Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = '9c2dd4a2-dc67-44e1-972d-e533d40b96df' and verification_status <> 'verified';

-- Politecnico di Torino: Quantum Engineering
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Mathematics"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "QUANTUM ENGINEERING English IELTS 5.5 Any field of Engineering, Phyisics, Mathematics Optional"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'c9b7d9be-76d0-4ae7-8bea-09f39598948e' and verification_status <> 'verified';

-- Politecnico di Torino: Urban and Regional Planning
update public.programmes
set requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Urban Planning", "Regional Planning", "Urban Engineering", "Geography", "Civil Engineering", "Environmental Engineering", "Building Engineering", "Architectural Engineering", "Architecture", "Landscape Architecture", "Political sciences", "Law", "Geographic information systems"]}$q$::jsonb,
    verification_evidence = $q$[{"field": "English and accepted backgrounds", "quote": "Urban and Regional planning, Urban Engineering, Geography, Civil Engineering, Environmental Engineering, Building"}, {"field": "Degree", "quote": "have a Bachelor's degree (level 6 EQF) or an equivalent academic qualification"}, {"field": "Committee", "quote": "An Academic Committee will verify if your educational background is adequate"}, {"field": "Deadline (1st call, extended)", "quote": "13 February 2026, 2:00 p.m. (Italian time)"}]$q$::jsonb,
    source_url = $q$https://www.polito.it/sites/default/files/2026-03/Annex%201_TABELLA%20REQUISITI%20LM%202627.pdf$q$,
    application_deadline = '2026-02-13',
    verification_notes = $q$Eligify checked Politecnico di Torino's official A.Y. 2026/27 entry-requirements table (last update 02/03/2026) and the admissions page for non-Italian qualifications on 24 September 2026. English: IELTS 5.5 (other accepted certificates are in PoliTo's equivalence chart). 16 years of education reflects the Bachelor's (EQF 6) requirement for a Pakistani degree, i.e. a 4-year BS. An academic committee also judges curricular fit; an online interview may be required. The 2026/27 deadline shown is the extended 1st call; the 2nd call closed 20 April 2026. 2027/28 rules and dates are not published yet.$q$,
    verification_status = 'ai_reviewed',
    ai_confidence = 90,
    ai_review_model = 'eligify-official-source-review',
    ai_reviewed_at = now(),
    source_checked_at = now(),
    review_started_at = coalesce(review_started_at, now()),
    verified_at = null,
    verified_by = null,
    updated_at = now()
where id = 'ed1e46fd-795b-46ac-be62-6e9e21ddeb88' and verification_status <> 'verified';
