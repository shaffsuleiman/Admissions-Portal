-- One-time rollout: let existing users experience the new quick-start flow.
-- Completing or dismissing it writes the timestamp again, so it only auto-opens once.
update public.profiles
set onboarding_completed_at = null;
