-- Reusable bulk defaults for catalogue programmes that have no admission rules yet.
-- Deliberately provisional (confidence 50, ai_review_model 'eligify-bulk-defaults') so the
-- rows can be found and replaced by programme-specific reviews. Only 'unverified' rows with
-- empty requirements are touched. Re-run after any catalogue import:
--   select private.apply_bulk_programme_defaults();

create or replace function private.apply_bulk_programme_defaults()
returns integer
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  updated integer;
begin
  with families(priority, family, pattern, fields) as (
    values
      (1, 'medicine', 'medicine|medical school|medtec|surgery|dentistry|nursing|pharmacy|physiotherap|midwif', '["Biology", "Chemistry", "Medicine"]'::jsonb),
      (2, 'data', 'data|statistic|actuarial|analytics|machine learning', '["Statistics", "Mathematics", "Computer science", "Economics", "Physics", "Any field of Engineering"]'::jsonb),
      (3, 'computing', 'computer|computing|software|cyber|artificial intelligence|\yai\y|informatic|\yict\y|information technolog|digital|robotic', '["Computer science", "Information Technology", "Mathematics", "Physics", "Any field of Engineering"]'::jsonb),
      (4, 'electrical', 'electr|telecom|communication engineering|communications engineering|automation|control engineering|nanotechnolog|photonic', '["Any field of Engineering", "Physics", "Computer science"]'::jsonb),
      (5, 'mathematics', 'mathemat', '["Mathematics", "Physics", "Statistics", "Computer science", "Any field of Engineering"]'::jsonb),
      (6, 'physics', 'physic|astro|quantum|cosmolog', '["Physics", "Mathematics", "Any field of Engineering"]'::jsonb),
      (7, 'engineering', 'engineering|mechanic|aerospace|aeronaut|automotive|materials|energy|nuclear|civil|building|transport|mechatronic|biomedical|geotechn|georesource|naval', '["Any field of Engineering", "Physics"]'::jsonb),
      (8, 'business', 'business|management|economic|finance|financial|accounting|marketing|entrepreneur|banking|insurance|trade|innovation', '["Economics", "Business", "Management", "Finance", "Accounting", "Statistics", "Mathematics", "Any field of Engineering"]'::jsonb),
      (9, 'architecture', 'architect|design|urban|planning|landscape|heritage', '["Architecture", "Design", "Urban Planning", "Building Engineering", "Civil Engineering"]'::jsonb),
      (10, 'earth', 'geograph|territor|geoscien|planetary|geolog|earth', '["Geology", "Geography", "Physics", "Environmental Science", "Any field of Engineering"]'::jsonb),
      (11, 'life-sciences', 'genomic|cosmetic|natural systems|bio|molecular|genetic|neuro|food|agri|viticult|enolog|forest|environment|ecolog|marine|zoolog|plant|animal|veterinar|sustainab|climate', '["Biology", "Biotechnology", "Chemistry", "Agriculture", "Food Science", "Environmental Science"]'::jsonb),
      (12, 'chemistry', 'chemi|pharmac|material science', '["Chemistry", "Chemical Engineering", "Biology", "Pharmacy", "Physics"]'::jsonb),
      (13, 'social', 'human rights|governance|psycholog|cognitive|sociolog|social|political|international relations|international studies|global|government|public polic|law|legal|development|security|peace|diplomac|european', '["Political sciences", "International relations", "Economics", "Law", "Sociology", "Psychology", "History", "Social sciences"]'::jsonb),
      (14, 'humanities', 'english|anglo|italian|medieval|renaissance|humanities|fashion|language|linguist|literatur|philosoph|histor|archaeolog|\yart|music|cinema|media|communication|culture|classics|religio|tourism|translation', '["Humanities", "Languages", "Literature", "History", "Philosophy", "Arts", "Communication", "Media"]'::jsonb)
  ),
  candidates as (
    select
      p.id,
      case
        when lower(coalesce(p.degree_level, '')) like '%single%' then 'single-cycle'
        when lower(coalesce(p.degree_level, '')) like '%bachelor%' then 'bachelor'
        else 'master'
      end as level,
      (select f.family from families f where lower(p.programme_name) ~ f.pattern order by f.priority limit 1) as family,
      (select f.fields from families f where lower(p.programme_name) ~ f.pattern order by f.priority limit 1) as fields
    from public.programmes p
    where p.verification_status = 'unverified'
      and coalesce(p.requirements, '{}'::jsonb) = '{}'::jsonb
  )
  update public.programmes p
  set requirements = jsonb_build_object(
        'min_years_of_education', case when c.level = 'master' then 16 else 12 end,
        'min_grade_110', null,
        'min_cgpa_4', null,
        'subject_credits', '[]'::jsonb,
        'english', jsonb_build_object('ielts', 5.5, 'toefl', null, 'moi_accepted', false),
        'extras', case c.level
          when 'bachelor' then jsonb_build_array('An admission test (e.g. TOLC or SAT) or pre-assessment may be required; check the university''s call')
          when 'single-cycle' then jsonb_build_array('A national or university admission exam (e.g. IMAT for Medicine) is required; places are limited')
          else case when c.family = 'medicine' then jsonb_build_array('Health-sector programme: check professional prerequisites in the call') else '[]'::jsonb end
        end,
        'accepted_fields', coalesce(c.fields, '[]'::jsonb)
      ),
      verification_evidence = jsonb_build_array(jsonb_build_object(
        'field', 'Basis (bulk default, not a quote)',
        'quote', case c.level
          when 'master' then 'Master''s: a Bachelor''s degree (16 years of education for a Pakistani 4-year BS) and English at B2 (IELTS 5.5 floor)'
          when 'bachelor' then 'Bachelor''s: 12 years of schooling and English at B2 (IELTS 5.5 floor)'
          else 'Single-cycle: 12 years of schooling, English at B2 (IELTS 5.5 floor) and an admission exam'
        end
      )),
      verification_notes = 'Bulk university-wide defaults applied by Eligify; not checked against this programme''s own admissions call. '
        || case when c.family is null then 'No subject family inferred from the name; backgrounds not recorded.'
                else 'Accepted backgrounds inferred from the programme name (' || c.family || ' family).' end
        || ' Deadline not recorded. Replace with a programme-specific review before relying on it.',
      verification_status = 'ai_reviewed',
      ai_confidence = 50,
      ai_review_model = 'eligify-bulk-defaults',
      ai_reviewed_at = now(),
      review_started_at = coalesce(p.review_started_at, now()),
      verified_at = null,
      verified_by = null,
      updated_at = now()
  from candidates c
  where p.id = c.id;
  get diagnostics updated = row_count;
  return updated;
end;
$fn$;

revoke all on function private.apply_bulk_programme_defaults() from public, anon, authenticated;

select private.apply_bulk_programme_defaults();
