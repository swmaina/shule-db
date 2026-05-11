-- ============================================================
-- Migration 002: Verification reminders
-- Sets up the structure for 6-month re-verification pings.
-- The actual email sending is handled by a Supabase Edge Function
-- (see /supabase/functions/send-verification-reminders/).
-- ============================================================

-- Track verification reminder history
create table public.verification_reminders (
  id          uuid primary key default uuid_generate_v4(),
  school_id   uuid not null references public.schools(id) on delete cascade,
  sent_to     text not null,  -- email address reminder was sent to
  sent_at     timestamptz not null default now(),
  responded   boolean not null default false,
  responded_at timestamptz
);

alter table public.verification_reminders enable row level security;

create policy "Admins can manage reminders"
  on public.verification_reminders for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- View: schools that need re-verification (>6 months since last verified)
create view public.schools_needing_verification as
  select
    s.id,
    s.name,
    s.slug,
    s.county,
    s.last_verified_at,
    sa.user_id as admin_user_id,
    p.email as admin_email
  from public.schools s
  left join public.school_admins sa on sa.school_id = s.id and sa.verified_at is not null
  left join public.profiles p on p.id = sa.user_id
  where
    s.status = 'approved'
    and (
      s.last_verified_at is null
      or s.last_verified_at < now() - interval '6 months'
    )
  order by s.last_verified_at asc nulls first;

-- ── Useful admin queries ──────────────────────────────────
-- Run these manually in SQL Editor as needed:

-- Count schools by county:
-- select county, count(*) from schools where status = 'approved' group by county order by count desc;

-- Count schools by condition supported:
-- select unnest(conditions_supported) as condition, count(*) from schools where status='approved' group by condition order by count desc;

-- Schools with no contact info (need enrichment):
-- select id, name, county from schools where status='approved' and phone is null and email is null and website is null;
