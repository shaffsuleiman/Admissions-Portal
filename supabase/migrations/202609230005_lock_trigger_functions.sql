-- The sign-up and workspace-creation trigger functions run with elevated rights
-- (security definer). They should only ever run as triggers, never be callable
-- through the public API (/rest/v1/rpc/...). Triggers still fire after this:
-- Postgres does not check EXECUTE privilege when a trigger calls its function.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.add_workspace_creator() from public, anon, authenticated;
