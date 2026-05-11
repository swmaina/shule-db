-- ============================================================
-- Migration 003: School claim requests
-- ============================================================

create table public.claim_requests (
  id              uuid primary key default uuid_generate_v4(),
  school_id       uuid not null references public.schools(id) on delete cascade,
  email           text not null,
  full_name       text,
  role_at_school  text,
  status          text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected')),
  reviewed_by     uuid references public.profiles(id),
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.claim_requests enable row level security;

-- Anyone can submit a claim (the OTP step in the UI handles identity verification)
create policy "Anyone can submit a claim"
  on public.claim_requests for insert
  with check (true);

-- Admins can view and manage all claims
create policy "Admins can manage claim requests"
  on public.claim_requests for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Add claim_requests to admin dashboard view
-- Useful query to run manually:
-- select cr.*, s.name as school_name
-- from claim_requests cr
-- join schools s on s.id = cr.school_id
-- where cr.status = 'pending'
-- order by cr.created_at asc;
