-- Bulk university-wide defaults for every programme without reviewed rules.
-- Deliberately provisional: confidence 50 and ai_review_model = 'eligify-bulk-defaults',
-- so these rows can be found and replaced by programme-specific reviews later.
-- Only rows still 'unverified' are touched; reviewed or verified rows are left alone.

update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '163c407a-448e-4e8f-9157-29613c90a369' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '03124c1c-951b-4c08-9c8a-94b6716441e8' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'e5bb278c-8cd5-493e-9e27-64a6329f1cef' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'de80211b-7c35-4e61-9317-2aacef99239a' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b6691444-4206-4fba-93be-dba019353088' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9218a7db-6f56-4dfd-86eb-705909e02dc5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2a2c3c7c-f38b-4419-80da-5dbb45848e0c' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '13464828-8a80-4b13-a72d-7cc296b03a51' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '4d57ea10-6f5c-4690-80b1-4ce023f3f6a0' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'f2f1adf7-9755-44a3-bb13-a7340a5e22e7' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c453decb-0525-41b3-a2f1-e5da5bf5a95e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0b0b9e3f-79c2-4063-b249-38755737aacf' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '71749b08-ae8e-4870-9eed-29dfb6c7d25c' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'dc99c5a0-7d86-4154-9515-89ce77be0256' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '77f34767-b7a0-406a-bbaf-ae62a570d8f3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd379f9cb-4553-4aae-a1bd-2b22fd9d357d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ccc6f54e-92b3-4fa4-bb57-73c626c2cdc8' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'f9f4ec1e-7f5c-4843-8dee-02fd4e84660f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3bcb8725-5346-4f0e-b76b-642c7fba3893' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'df3f7583-602b-46ff-ae25-4349c51f71bb' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '03070c11-ff08-4f42-b0ba-8ea764edd1fe' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '46aed56b-3b5f-475e-b9d1-cdc02e21d9a2' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0b5c74b8-6da5-4171-b74b-b85e0b314b07' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'bba8bd8c-1c83-4b87-9add-46f6577a19fe' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'fd5bed6f-6cf3-4b31-9d33-bbcb5cd5b2c3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b6abf051-e7b2-48af-a7b7-671257183285' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'e7021fff-2d8f-46f1-a473-ab4a599b9bcd' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'dedd89c3-6398-46d3-b367-68f1dcc8f0f4' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c70dec0c-c92e-4b59-a827-c1f52cb9c9bb' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7d6da916-d571-4a1d-9360-040f6fc43c2e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b94ab43b-82de-47d8-b858-95ff75be2114' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '040028d8-8364-4a23-b521-2d25789db019' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ce9084a1-fe4f-4a66-a7b3-ac8cf18df750' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0dfd7ca7-0a7f-4fad-ad10-690c14d920a3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '05fad350-5f31-4a32-a7a2-3bdc47bcd11d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7f1fc89e-b8b9-4a0c-87bd-275199553e6e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Mathematics", "Physics", "Statistics", "Computer science", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (mathematics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '8945d5d0-2be6-46d6-abd2-0f5d12ef1391' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'dc7e9b3f-774b-4044-91ad-07f8933bbe1d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '52ea8dfb-ae70-4fcd-b0a5-4893ed17104d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '81afc9cd-2e8d-46e2-af3d-b4ef8ad55b9e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5cf2ee9b-538e-4b9e-8c09-41763ec47a80' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '73641caa-9fbf-4546-a400-16626be66edf' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3b51ad8f-9ec5-40e3-9011-16eaa1069f54' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '69363f89-392e-427e-9128-a33a19c6c163' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '57ba0adc-f6f4-48f9-82d7-5fcc4c46bef3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '121cd0b8-585b-40b3-b762-fe41e13ce94e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '1740e31a-bdbf-41e1-ab29-09d2f481e984' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b2f6a637-3309-4a9d-9639-a2488f224231' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'e7ba26c3-5328-4c19-955b-fb17c0a66e67' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2286ebe3-bf69-4073-a89c-6c7ff7907de6' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '773feef6-eb69-4d53-961f-ac87ff9ed916' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'a307dbc1-9c94-465d-929d-c55d4d572ba1' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2d0e3cc5-338e-464a-a3bb-246523755e48' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ad0fd239-fa10-4464-b321-439d19f7d88a' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5789c99e-bc58-4f29-b897-941cfe4634b1' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Geology", "Geography", "Physics", "Environmental Science", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (earth family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b0c93313-9c59-4595-bd4d-91d250d40fbf' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9adecfce-a445-4476-90b7-9250edc18487' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '472a8040-5aa3-4c13-871d-2baadb169b2b' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '23beefba-ca50-43de-8b83-4bc9ae1dea9c' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '8484416d-da95-409e-88f1-4068ca4f34f9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2709b8d2-9706-4492-b64b-1db5eadf7f12' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '32d6d30a-e62b-4b8e-b148-d969edb6046d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0d3dabe1-bf0c-446a-881b-d2f0623bb0b0' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '12b6a9df-a88c-40fd-8377-6e0e6d789613' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '321415d9-8159-490f-87e4-9c75f23639ab' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '041b05f0-69dc-48ca-b253-5a255862ea99' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd83f5d6b-3dbb-4194-9408-a19da590a65e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9216a469-0392-46e2-846a-a3464a0c6d55' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0db964fe-80c6-4cac-a592-dbac3354da2e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'df81f978-e92b-4425-a504-ce287524a613' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'da5962be-0c28-4677-9feb-c6871ab72a7d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2ca40e0a-096e-49fe-ae4f-0aa3cddd66fe' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0f5dac09-b99d-4fee-ae09-56889501158b' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd8d6af82-ad88-45df-adad-6833337abb73' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5303943d-27e9-481d-aa0f-50853fd5fbb8' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0df6f8dd-28ae-4bcb-b3aa-c9a53a8d62a3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd45483d5-1ad4-4788-aeee-a4173f0c923d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '905969ab-986f-4a51-be73-ff920ac499e5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c81f9ba4-bac5-42d0-b756-b605ec8076f0' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '4b9b2964-4219-4069-850b-880d8d2cac8a' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '24a6f57b-e5ab-4378-9f2d-2145b34d8eee' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'e9a91780-3085-4792-a5db-920d62c5e3a0' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '53d6d271-18b7-4d83-8b0b-f76331528e79' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c3f1bc12-7d0d-4e04-92cf-acf442daffbd' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7cdf1a81-dd2a-4ad4-b23e-36903766a208' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b8e54eff-2661-457f-b414-243824de6093' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["A national or university admission exam (e.g. IMAT for Medicine) is required; places are limited"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Single-cycle: 12 years of schooling, English at B2 (IELTS 5.5 floor) and an admission exam"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b3de026c-aec2-4aaa-898c-ff14c79bef51' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'bdd8ed51-ac0b-4cb1-9483-da448f388153' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b442c25f-0e83-4682-b9f6-0b734a98fa46' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '1ef1e211-21be-4ee7-923e-9a1a405f8e5b' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c42bcb77-d17d-4743-9f8a-be474450acdc' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7b266695-81ae-46a3-a4be-abfdad09cf9f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '97a45ebd-407d-4609-a17b-ffc3d5d19a02' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '529fa4d8-e052-4c8c-ba40-80fb786593a3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9fb94307-f853-477e-9118-ac002cfd2021' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b8710db2-985a-44b1-9edd-fed30b8a7915' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '488b1e75-3ffc-4693-a7af-b7ef8dff4a5b' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'a4fa96d7-5a53-44fd-9496-c022babbd42b' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'efb6c869-c6c6-43f9-9b40-1b0a484078b2' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '927b8c4d-72a2-4021-8f21-d2341d6ae6ee' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '98a2d533-2380-4a31-8c3c-3722e460315d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '69381d6b-1b25-4716-ad79-1896145347c5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2e4ac083-1794-4768-b359-dfba1463799e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '77ffc5d7-208d-4729-b199-1505d0cc0659' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '1e0aced2-77c7-424c-b10e-a4461788fdfb' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b6762965-0272-4c4d-8ea5-7786bdab5e75' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3b963c37-1459-4dad-bbf0-80bb4dcd76a9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ab1aafae-9fd1-4b43-8f23-51998d2850c9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '6c46fddc-5470-4d86-8cc7-d91980bdfdd9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '34c5a69f-db7c-4b58-b0b5-a39ff5af28f9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '70ec6db4-3cf5-4f4a-b0f8-3a2f96f74070' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd9751c14-d29c-4847-9a13-e73fe6e3d3c9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["A national or university admission exam (e.g. IMAT for Medicine) is required; places are limited"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Single-cycle: 12 years of schooling, English at B2 (IELTS 5.5 floor) and an admission exam"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd2deff88-d4de-470c-aeaf-188f7583bca5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c757bb54-f012-4643-bed3-744a8843a5d5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3db4938f-8bf5-4f0b-9465-84c0037fd1e3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3434200e-650b-42da-8f63-c96586499360' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'cc4b86af-30d5-426f-a97d-91a7935dc20c' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5b23076a-9bce-48e2-b602-00f4c3cd4e5d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'bab0afb5-2ba5-446a-8ecf-b1a25943249f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '78e57ec9-06c6-4188-919e-705c36f442d1' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '29e9ffa7-d74f-4b38-97c4-ccfc20e98981' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'aed20488-0a49-4e35-9540-5af32b777e4d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '78820849-a959-4853-ad81-6f19bc86fd3c' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '900c4716-9681-4149-bbdb-1f319a870d84' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5e940891-c0f4-4c16-aa51-dc9c93ff3d7f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '23a6609c-e317-4710-b4df-37d1366d20dd' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'db139cb4-7d64-4a5c-88f6-d48a53570143' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b9284a5c-be31-4f51-b786-6ac768da7f23' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3123790b-0537-4957-a102-fecebf34507f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '003125eb-ab06-43f9-b359-e5e4f6e344dd' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '4bac84d1-fd72-4d79-8e14-9d6b64005059' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '98a4620a-f3b5-4e60-bb92-81e4835b6054' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '53371c77-4dfa-4c60-aab6-1baea8d80bbd' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'efcbfb6b-96eb-420a-a729-e5faf6adf874' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '1cbe9cc0-08b6-4af0-bcae-03d8a40e9b2a' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c326d859-0304-469b-a504-886f02962102' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '515e3772-d3a0-4bbb-926b-369683f6c679' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Chemistry", "Chemical Engineering", "Biology", "Pharmacy", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (chemistry family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd17dc820-c792-43a0-b68a-1d8714367805' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '83ec338b-9cbb-411d-9e7d-d9f270b9dbf1' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '596f99da-666d-4613-b8ae-b83880631dd3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'cad078cb-bf13-48d4-add6-4a20a9f2ce62' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5db07d40-9290-45a1-aaef-cb1397f89d50' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '36738a59-b103-4352-a4b4-318c1a94ba34' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (architecture family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd63be76c-6c13-4599-bc14-dfb94b721c0e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '10819551-0599-488a-b1c3-d20e9ea92ebf' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '93b8857b-17c0-4c45-bf40-d07b82303f63' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2bc4e5a3-3059-4087-ae87-aeeb3d15eccc' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '36085a6d-94d4-4165-834e-50b4e88de3b4' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '304ebdb6-6970-4eb1-a702-946a9f31ddb4' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c2897ea6-d536-48cb-b4ec-25fa72610a05' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'fad03bb5-8796-4937-a118-1492e13be85f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'e3d19a44-0239-4ddf-9fd7-6a47576cab8d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '771ff97a-80f5-4a16-80b7-b4aeedb481c1' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'a7083997-2356-47f1-a43c-227836708489' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0533d52c-a2ba-4be3-b092-5cbf382cbdff' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '6f3cd855-fe10-4cb9-8fa3-f7fe628b0327' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '72d71091-86dd-475c-99ac-2e48ceb9748a' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '81d2a53f-743e-415c-a073-d36106dfe2ba' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd17f5cb6-f640-4c81-b1de-4c7f5190e87e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c1ea364f-d94c-4d48-b5dd-7f086ff940b1' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '8137090e-659b-4c16-a3b4-d5709ddb34fb' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5561b1a7-d0a7-4bf6-961f-b293c938ebb9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7661d849-3207-4bc2-bf12-369c962003eb' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5869f7d5-003f-41f4-b248-7d33d68c71e8' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '51d3e094-7551-4458-9898-cda5610b5685' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '45bc7d48-89d6-4e14-b568-b5123cf86394' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '68b5cd5e-1981-4253-8337-95a07a5e9369' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd995fb7e-bb93-46ff-aea3-60b5ccf8073d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '55a966e5-d69b-4190-b3ae-eb34deae00f9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'e49e575e-2a8e-43a9-99d2-71e3c6da2763' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3dbbc998-b632-415b-9bce-c4e85ee892e9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '260f01f5-3ab0-4524-a9f3-ccd1015e110a' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '83870b7d-7e82-4d0b-9345-2d646e72d202' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5edea10f-429d-4389-81ad-c9fc4c35c506' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ac62d358-4b2f-4a94-8be3-362f70226b3e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd54f4180-6327-4b86-a430-a35bb5a3f70d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["A national or university admission exam (e.g. IMAT for Medicine) is required; places are limited"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Single-cycle: 12 years of schooling, English at B2 (IELTS 5.5 floor) and an admission exam"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '69f7d729-55c6-483d-b6dd-a718c426a19e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '95201bf2-0ea0-4692-99d8-771d6e92f006' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["A national or university admission exam (e.g. IMAT for Medicine) is required; places are limited"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Single-cycle: 12 years of schooling, English at B2 (IELTS 5.5 floor) and an admission exam"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7c8d0336-576e-455e-80c9-9128e3e439e3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["A national or university admission exam (e.g. IMAT for Medicine) is required; places are limited"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Single-cycle: 12 years of schooling, English at B2 (IELTS 5.5 floor) and an admission exam"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9a428e32-018d-4df3-b0ab-5c16ee52034e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '94d9a314-061c-4e07-8231-ed7459421aef' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ed0edfdd-3e0d-4c66-a8e9-2e2c427569f6' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ecbdab20-774e-4049-847b-87f00cb689bd' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'bcbe1e1e-2725-4f15-9ecd-3dadadfebc2a' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2b66dad4-5f21-4820-9848-793a05ad72fd' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'fd72576f-6f87-4c4d-ad80-f2b36d0e807d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '6bfcfb87-4d0d-4abb-8f3b-7df7f3080421' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c8d70976-6ac4-4071-adce-b090fb872b07' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '4329a36c-1197-4081-a396-729482cc1f6b' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '533c2752-bb3c-428a-97df-a1b237f01402' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'cca36a0a-5c2e-4866-9ec7-79270de1e3f4' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9f2d09ca-4279-429c-af02-b0903d60d9db' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '61b998dc-a5c4-47f3-ac74-c5b2a3420a60' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0eae19bd-ffd7-47cc-966b-1482411533d2' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'c23ac749-0fa2-4c20-8b99-6b63b7e097b5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '69146beb-e76f-498b-acba-70832acfface' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b8c9d857-2e08-450b-9a78-952116bf0530' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '43dca9f8-2157-49fe-8748-d3a3bdf9805d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '386d99ba-2a3f-49ed-ae5f-2db2e93b6cae' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Geology", "Geography", "Physics", "Environmental Science", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (earth family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'b4432559-fd15-4ac4-bd04-8ea7f8eee7fc' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Geology", "Geography", "Physics", "Environmental Science", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (earth family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7c9b7052-c9aa-418e-bcd8-c38afd08a9f9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '6af2c396-bcbd-458c-9d8f-69158e4f642d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '238d167b-b11a-434e-bf4b-44066931370f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3c59cd84-687d-4ad3-9650-3a9c0ada7de4' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '990bed1e-adc6-4e2c-b2ea-d536932ee538' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3f7da3e5-f798-4628-a4a4-06f5a71974b3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '0504f784-7c63-4db8-adc8-26af30d7b8d3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '248ba45c-8517-4828-8ec3-23813a755fde' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '4d8da694-b27f-4c3d-9108-cda54a8173d5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '8698d0a4-1706-4419-b4ac-41f30c31c010' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3bc82392-9afa-4005-a968-056c7b3d4cb9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '40563363-044d-4965-8f4a-a464654f53ef' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '8f2e3aed-e1bf-4894-9c60-d6fee886b569' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7fecafc0-ade2-47b3-90d1-18d089002a39' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '1ed55edd-390e-4753-88b6-e85838b674e3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ad8c016e-927d-4e47-a045-cc69ef922fea' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2e70dd2f-dc85-43dd-b8ec-46f1b11f2081' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '8ffdfdf1-5e60-44ed-957c-49fd9b6523bd' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'deeaa423-f29a-4554-be60-e407ac22f467' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7840a5f5-a344-4b53-b518-ba393a6b73de' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7710092c-f038-4024-b55b-da564e7163c9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'fe821fbf-5ee8-4fe2-b8a7-2e125d57b85f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '4ffd8c7a-bf76-4ec1-a165-cfe4484dc690' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3dc20b45-6fc4-401b-9434-6b2c0e67bb1b' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'f1d4c140-936f-40f5-b822-7540882e0f62' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Mathematics", "Physics", "Statistics", "Computer science", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (mathematics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9fa31284-c768-4f3a-8995-43ca71e6f8dc' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Mathematics", "Physics", "Statistics", "Computer science", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (mathematics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '6773d66a-b1a8-4e97-864b-a9db5e1c1cbe' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'fda64afd-ed6f-4bbf-b23e-949f2f1cfa9c' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2af01d71-991d-4ee6-8131-6f7124e15ff0' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '70763b5d-23eb-47bd-9d5a-4ca4f2a90d78' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["A national or university admission exam (e.g. IMAT for Medicine) is required; places are limited"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Single-cycle: 12 years of schooling, English at B2 (IELTS 5.5 floor) and an admission exam"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '039c8ed9-c1be-49b7-9181-55a9318a1e46' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["A national or university admission exam (e.g. IMAT for Medicine) is required; places are limited"], "accepted_fields": ["Biology", "Chemistry", "Medicine"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Single-cycle: 12 years of schooling, English at B2 (IELTS 5.5 floor) and an admission exam"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (medicine family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '60a83872-efe6-4d2c-b007-08a98fc75a88' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5f96a235-3307-4db2-bc07-3d07c2deece9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '4e6576d3-e5f3-407a-8c9d-1b2247021765' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '67d1d020-1367-4645-bbd3-22a55dea72ef' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '07d1197b-ed11-43ab-a027-dbd83d2de26f' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '603c53c3-582a-4ac9-9bc0-8e956dcba0f3' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Geology", "Geography", "Physics", "Environmental Science", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (earth family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5e82f033-2380-4dd1-b067-41979d418ea5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'deb60fca-9291-4450-aa30-c42ced8d15c4' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '2e7056c1-d492-4a1d-86ae-2cd18c278e9b' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'cc58e26d-0289-4682-9a7f-67d5cf0a31c5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '4dd34201-2933-4ec3-b7c6-139c57387cc5' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'cf0ec62a-e250-4063-a417-bb669b21ee90' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'cc93eb3f-eddc-4b49-838d-f2b00bb5a9c6' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (social family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '5362b849-bdef-4589-acc2-33d66f4c02ca' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9cc4d008-4fe2-4771-b47d-18907eb7d70d' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'eb0fc564-141a-4359-92e8-f58b49576017' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '7992e359-ff2f-4e85-8376-32dc68e67147' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '07adf785-0fb4-44ed-b547-99b13bcb3d9e' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '105333d3-00e6-4831-84c0-69aaaa82c056' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '31d9bb87-abfd-4c85-bb1d-46537071f83c' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'ac706fcf-9285-4f5c-b8ed-8897d5f5d581' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '9dc0b941-d352-46d2-8ee8-e3e2aadc9f81' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '106231c2-a67d-447f-8472-df773ac065bb' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '1b47005b-6f65-4e6a-9bd3-298f65757390' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (data family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'f6bef4fd-7bcf-44ea-88f8-67310b6dc053' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'a3bac479-60e6-4176-82fe-6dce5847caf9' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'fda89a8f-348f-4b0e-8750-2edde7c2a0b0' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '69043293-dd8a-4ce7-98c5-83ebfddf7579' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Physics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (physics family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '6ba89d6d-e9ce-4741-b405-3e1352e14429' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '73366733-3abc-4468-a876-fa014ba86d68' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (humanities family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'dfb4bc5e-4b48-48b2-b91b-e3deb3ad1b49' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 12, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": ["An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university's call"], "accepted_fields": ["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Bachelor's: 12 years of schooling and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (business family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '935121ed-4215-417d-a48a-060a29cde474' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics", "Computer science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (electrical family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '1c9b3541-90ad-4212-9e5a-c0efffbe5fbb' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (computing family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'd4644143-6c25-45b3-b27b-019fb9dd6cd4' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (life-sciences family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = 'f8bfbcc4-4a20-41f2-833b-ea14d9dc0d73' and verification_status = 'unverified';
update public.programmes set
  requirements = $q${"min_years_of_education": 16, "min_grade_110": null, "min_cgpa_4": null, "subject_credits": [], "english": {"ielts": 5.5, "toefl": null, "moi_accepted": false}, "extras": [], "accepted_fields": ["Any field of Engineering", "Physics"]}$q$::jsonb,
  verification_evidence = $q$[{"field": "Basis (bulk default, not a quote)", "quote": "Master's: a Bachelor's degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)"}]$q$::jsonb,
  verification_notes = $q$Bulk university-wide defaults applied by Eligify on 24 September 2026; not checked against this programme's own admissions call. Accepted backgrounds inferred from the programme name (engineering family). Deadline not recorded. Replace with a programme-specific review before relying on it.$q$,
  verification_status = 'ai_reviewed', ai_confidence = 50, ai_review_model = 'eligify-bulk-defaults',
  ai_reviewed_at = now(), review_started_at = coalesce(review_started_at, now()), verified_at = null, verified_by = null, updated_at = now()
where id = '3cfb82c9-8b6e-499e-88a8-b448b1f6eaa7' and verification_status = 'unverified';
