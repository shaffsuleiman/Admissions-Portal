-- Contact messages and consultation requests from the public website.
-- Visitors can submit but never read; the team reviews rows in the dashboard.

create table public.website_enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact', 'consultation')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254 and email like '%_@_%'),
  phone text check (char_length(phone) <= 40),
  consultancy_name text check (char_length(consultancy_name) <= 160),
  team_size text check (team_size in ('1-3', '4-10', '11-25', '26+')),
  preferred_date date,
  preferred_time text check (preferred_time in ('morning', 'afternoon', 'evening')),
  timezone text check (char_length(timezone) <= 64),
  topic text check (char_length(topic) <= 80),
  message text check (char_length(message) <= 4000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  constraint consultation_needs_slot check (
    kind = 'contact' or (preferred_date is not null and preferred_time is not null)
  ),
  constraint contact_needs_message check (
    kind = 'consultation' or char_length(coalesce(message, '')) >= 10
  )
);

create index website_enquiries_created_idx on public.website_enquiries (created_at desc);

alter table public.website_enquiries enable row level security;
revoke all on public.website_enquiries from anon, authenticated;
grant insert on public.website_enquiries to anon, authenticated;

-- New rows always start as 'new'; visitors cannot set the review status.
create policy website_enquiries_insert on public.website_enquiries
  for insert to anon, authenticated
  with check (status = 'new');
