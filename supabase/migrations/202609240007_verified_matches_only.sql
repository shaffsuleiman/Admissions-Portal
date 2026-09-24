-- Unverified catalogue records must never appear as final eligibility results.
-- These results can be regenerated after a verifier publishes the programme rules.
delete from public.matches
where coalesce(rules_snapshot ->> 'verification_status', 'unverified') <> 'verified';
