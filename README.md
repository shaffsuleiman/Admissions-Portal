# SHAFFMINNA Admissions OS

Admissions matching and application management for education consultancies. The frontend is built with Next.js 16 and the backend foundation uses Supabase Auth, Postgres, Storage, and Row Level Security.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Add the Project URL and publishable key from **Supabase Dashboard → Connect** to `.env.local`.

4. Apply [`supabase/migrations/202609230001_initial_schema.sql`](supabase/migrations/202609230001_initial_schema.sql) through the Supabase SQL editor, or with the Supabase CLI:

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

5. Add these redirect URLs under **Authentication → URL Configuration**:

   ```text
   http://localhost:3000/auth/callback
   https://YOUR_PRODUCTION_DOMAIN/auth/callback
   ```

6. Enable Google under **Authentication → Sign In / Providers** if Google login is required.

7. Start the application:

   ```bash
   npm run dev
   ```

Without Supabase environment variables, the application remains usable in demo mode. With credentials configured, email/password, account creation, password reset, Google OAuth, cookie-based sessions, and sign-out use Supabase Auth.

## Backend model

- `workspaces` and `workspace_members`: consultancy tenancy and roles
- `students`, `academic_profiles`, `subject_credits`: reviewed student profiles
- `documents`: metadata for files in the private `student-documents` bucket
- `programmes`: global, verified programme catalogue
- `matches`: deterministic results with immutable rule snapshots
- `shortlists`, `applications`, `deadlines`: admissions workflow
- `activity_logs`: workspace audit trail

Every consultancy-owned table has RLS enabled. Policies resolve membership in Postgres, so changing client-side identifiers cannot expose another consultancy’s data. The programme catalogue is readable by authenticated users and writable only through trusted server-side credentials.

Storage paths must follow:

```text
{workspace_id}/{student_id}/{document_id}-{filename}
```

The service-role key is reserved for trusted background workers and must never be exposed to the browser.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build -- --webpack
```
