-- ============================================================
-- Elimu Finder — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "unaccent";

-- ── Profiles (extends Supabase auth.users) ─────────────────
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'user' check (role in ('user', 'school_admin', 'admin')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Schools ────────────────────────────────────────────────
create table public.schools (
  id                     uuid primary key default uuid_generate_v4(),
  slug                   text unique not null,
  name                   text not null,

  -- Location
  county                 text not null,
  town                   text not null,
  estate                 text,
  physical_address       text,
  lat                    double precision,
  lng                    double precision,

  -- Classification
  school_type            text not null check (school_type in ('special', 'integrated', 'inclusive')),
  levels                 text[] not null default '{}',
  conditions_supported   text[] not null default '{}',

  -- Contact
  phone                  text,
  email                  text,
  website                text,
  facebook_url           text,

  -- Details
  is_boarding            boolean not null default false,
  fee_range              text check (fee_range in ('free', 'low', 'medium', 'high', 'unknown')),
  fee_notes              text,
  admission_requirements text,
  description            text,
  photos                 text[] default '{}',

  -- Trust & verification
  status                 text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_verified            boolean not null default false,
  last_verified_at       timestamptz,
  verified_by_admin_id   uuid references public.profiles(id),

  -- Metadata
  submitted_by           uuid references public.profiles(id),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  -- Full-text search vector (auto-maintained by trigger below)
  search_vector          tsvector
);

-- ── Full-text search ────────────────────────────────────────
create index schools_search_idx on public.schools using gin(search_vector);
create index schools_county_idx on public.schools (county);
create index schools_status_idx on public.schools (status);
create index schools_type_idx   on public.schools (school_type);
create index schools_levels_idx on public.schools using gin(levels);
create index schools_conditions_idx on public.schools using gin(conditions_supported);

create or replace function public.schools_search_vector_update()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', unaccent(coalesce(new.name, ''))), 'A') ||
    setweight(to_tsvector('english', unaccent(coalesce(new.county, ''))), 'B') ||
    setweight(to_tsvector('english', unaccent(coalesce(new.town, ''))), 'B') ||
    setweight(to_tsvector('english', unaccent(coalesce(new.estate, ''))), 'C') ||
    setweight(to_tsvector('english', unaccent(coalesce(new.description, ''))), 'D') ||
    setweight(to_tsvector('english', unaccent(coalesce(new.admission_requirements, ''))), 'D');
  return new;
end;
$$;

create trigger schools_search_vector_trigger
  before insert or update on public.schools
  for each row execute procedure public.schools_search_vector_update();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger schools_updated_at
  before update on public.schools
  for each row execute procedure public.set_updated_at();

-- ── RLS: Schools ───────────────────────────────────────────
alter table public.schools enable row level security;

-- Anyone can read approved schools
create policy "Anyone can view approved schools"
  on public.schools for select
  using (status = 'approved');

-- Admins can see all
create policy "Admins can view all schools"
  on public.schools for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Anyone (including unauthenticated) can submit
create policy "Anyone can submit a school"
  on public.schools for insert
  with check (status = 'pending');

-- School admins can update their own claimed school
create policy "School admins can update their school"
  on public.schools for update
  using (
    exists (
      select 1 from public.school_admins
      where school_id = schools.id and user_id = auth.uid()
    )
  );

-- Site admins can do anything
create policy "Site admins can do anything"
  on public.schools for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── School Admins (claim table) ────────────────────────────
create table public.school_admins (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  school_id   uuid not null references public.schools(id) on delete cascade,
  verified_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (user_id, school_id)
);

alter table public.school_admins enable row level security;

create policy "Users can view their own admin claims"
  on public.school_admins for select
  using (user_id = auth.uid());

create policy "Users can claim a school"
  on public.school_admins for insert
  with check (user_id = auth.uid());

-- ── Submissions Log ────────────────────────────────────────
create table public.submissions_log (
  id               uuid primary key default uuid_generate_v4(),
  school_id        uuid references public.schools(id) on delete cascade,
  submitter_name   text,
  submitter_email  text,
  submitter_role   text,
  created_at       timestamptz not null default now()
);

alter table public.submissions_log enable row level security;

create policy "Only admins can view submissions log"
  on public.submissions_log for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Insert allowed for submission API"
  on public.submissions_log for insert
  with check (true);

-- ── Suggested Edits ────────────────────────────────────────
create table public.suggested_edits (
  id           uuid primary key default uuid_generate_v4(),
  school_id    uuid not null references public.schools(id) on delete cascade,
  field_name   text,
  old_value    text,
  new_value    text,
  note         text,
  submitted_by text, -- submitter email (no auth required)
  status       text not null default 'pending' check (status in ('pending', 'applied', 'dismissed')),
  created_at   timestamptz not null default now()
);

alter table public.suggested_edits enable row level security;

create policy "Anyone can suggest edits"
  on public.suggested_edits for insert
  with check (true);

create policy "Admins can manage edits"
  on public.suggested_edits for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- SEED DATA — 5 example schools across Kenya
-- (replace with real data as you gather it)
-- ============================================================

insert into public.schools (
  slug, name, county, town, estate,
  school_type, levels, conditions_supported,
  phone, email, website,
  is_boarding, fee_range, description,
  status, is_verified, last_verified_at,
  lat, lng
) values

(
  'joytown-special-school-kiambu',
  'Joytown Special School',
  'Kiambu', 'Thika', 'Joytown',
  'special',
  ARRAY['primary', 'junior_secondary'],
  ARRAY['cerebral_palsy', 'physical_disability', 'intellectual_disability', 'multiple_disabilities'],
  '0722 000 001', 'info@joytownspecial.ac.ke', null,
  true, 'free',
  'Government-sponsored special school for learners with physical and neurological conditions. Established 1970s, boarding available.',
  'approved', true, now() - interval '30 days',
  -1.0509, 37.0944
),

(
  'interact-centre-nairobi',
  'Interact Centre',
  'Nairobi', 'Lavington', 'Lavington',
  'special',
  ARRAY['ECD', 'primary', 'TVET'],
  ARRAY['autism', 'intellectual_disability', 'down_syndrome', 'ADHD'],
  '0722 000 002', 'info@interactcentre.org', 'https://interactcentre.org',
  false, 'high',
  'Nairobi-based centre offering holistic programmes for learners with autism and intellectual disabilities, including vocational skills training.',
  'approved', true, now() - interval '14 days',
  -1.2795, 36.7733
),

(
  'st-lucy-school-mombasa',
  'St. Lucy School for the Visually Impaired',
  'Mombasa', 'Mombasa', 'Tudor',
  'special',
  ARRAY['primary', 'junior_secondary', 'senior_secondary'],
  ARRAY['visual_impairment', 'deafblind'],
  '0722 000 003', null, null,
  true, 'low',
  'Catholic mission school providing specialised education for learners with visual impairments. Braille literacy and mobility training offered.',
  'approved', false, now() - interval '200 days',
  -4.0490, 39.6606
),

(
  'kisumu-day-school-deaf-kisumu',
  'Kisumu Day School for the Deaf',
  'Kisumu', 'Kisumu', 'Milimani',
  'special',
  ARRAY['ECD', 'primary', 'junior_secondary'],
  ARRAY['hearing_impairment', 'deafblind'],
  '0733 000 004', null, null,
  false, 'free',
  'County government school for learners who are deaf or hard of hearing. Kenyan Sign Language (KSL) is the medium of instruction.',
  'approved', false, now() - interval '150 days',
  -0.0917, 34.7679
),

(
  'greenacres-inclusive-school-nairobi',
  'Greenacres School',
  'Nairobi', 'Karen', 'Karen',
  'inclusive',
  ARRAY['ECD', 'primary', 'junior_secondary'],
  ARRAY['dyslexia', 'ADHD', 'dyscalculia', 'dyspraxia', 'anxiety_disorders', 'speech_language'],
  '0700 000 005', 'admissions@greenacres.ac.ke', 'https://greenacres.ac.ke',
  false, 'high',
  'International-curriculum mainstream school with a strong learning support department. Individual Education Plans (IEPs) available.',
  'approved', true, now() - interval '7 days',
  -1.3282, 36.7062
);
