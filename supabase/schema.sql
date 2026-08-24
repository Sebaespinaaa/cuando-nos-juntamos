-- ============================================
-- SCHEMA: cuando-nos-juntamos
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLE: users
-- ============================================
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  username text not null unique,
  password_hash text not null,
  display_name text not null,
  avatar text not null default '😊',
  avatar_color text not null default '#6366f1',
  role text not null default 'user' check (role in ('admin', 'user')),
  login_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz default now() not null
);

-- ============================================
-- TABLE: calendars
-- ============================================
create table public.calendars (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamptz default now() not null,
  created_by uuid references public.users(id) on delete set null
);

-- ============================================
-- TABLE: availability
-- ============================================
create table public.availability (
  id uuid default uuid_generate_v4() primary key,
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  status text not null default 'unknown' check (status in ('available', 'unavailable', 'unknown')),
  updated_at timestamptz default now() not null,
  unique(calendar_id, user_id, date)
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_availability_calendar_date on public.availability(calendar_id, date);
create index idx_availability_user on public.availability(user_id);
create index idx_users_username on public.users(username);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.users enable row level security;
alter table public.calendars enable row level security;
alter table public.availability enable row level security;

-- Users: readable by all (for showing avatars), writable only via service role
create policy "Users are viewable by all" on public.users
  for select using (true);

-- Calendars: readable by all
create policy "Calendars are viewable by all" on public.calendars
  for select using (true);

-- Availability: readable by all
create policy "Availability is viewable by all" on public.availability
  for select using (true);

create policy "Availability insertable via service role" on public.availability
  for insert with check (true);

create policy "Availability updatable via service role" on public.availability
  for update using (true);

create policy "Availability deletable via service role" on public.availability
  for delete using (true);

-- ============================================
-- REALTIME
-- ============================================
alter publication supabase_realtime add table public.availability;
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.calendars;

-- ============================================
-- FUNCTION: update updated_at automatically
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_availability_updated
  before update on public.availability
  for each row execute function public.handle_updated_at();
