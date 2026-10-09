-- QuestPorts Supabase Database Schema
-- Phase 1: MVP Ports Table & Enums

create type port_category as enum (
  'source_port',
  'vr_injection',
  'emulator',
  'game_mod'
);

create type port_status as enum (
  'released',
  'playable_beta',
  'in_development'
);

create table if not exists public.ports (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text,
  developer text not null default 'Team Beef',
  developer_url text,
  category port_category not null default 'source_port',
  status port_status not null default 'released',
  
  -- Media
  cover_image_url text,
  youtube_video_id text,
  
  -- Hardware & Compatibility
  supported_hardware text[] not null default '{"Quest 2", "Quest 3", "Quest 3S"}',
  locomotion_types text[] default '{"Smooth Locomotion"}',
  has_6dof_controls boolean not null default true,
  -- Optional recorded VR claims. Missing keys mean unknown. Shape check and
  -- backfill live in supabase/migrations/20261008230000_port_features.sql
  -- and 20261008230100_port_features_seed.sql. Do not invent values here.
  features jsonb,
  
  -- Installation details & Links
  internal_storage_path text,
  base_game_url text,
  base_game_store text, -- e.g. Steam, GOG, Google Play
  port_download_url text not null,
  port_download_source text, -- e.g. GitHub Releases, SideQuest, Discord
  
  -- Detailed Guide (Markdown)
  installation_guide text,
  troubleshooting_notes text,

  -- Release metadata shown on the catalog. Present in production; kept here so new databases match.
  github_url text,
  last_github_update timestamptz,
  latest_version text,

  -- Metadata
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.ports enable row level security;

-- Public read access
create policy "Allow public read-only access on ports"
  on public.ports for select
  using (true);

-- Anonymous product feedback (features / bugs). Insert-only for the public API.
create table if not exists public.site_feedback (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('feature', 'bug')),
  message text not null check (char_length(btrim(message)) >= 8 and char_length(message) <= 4000),
  page_path text,
  submitted_by text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'done')),
  created_at timestamptz not null default now()
);

alter table public.site_feedback enable row level security;

create policy "Allow anonymous insert on site_feedback"
  on public.site_feedback
  for insert
  to anon, authenticated
  with check (true);

grant insert on table public.site_feedback to anon, authenticated;

-- Headset verification history. Canonical copy for new databases.
-- Existing projects apply supabase/migrations/20261008220000_port_verifications.sql instead.
-- Public read is approved rows only. There is no browser write policy.

create table if not exists public.port_verifications (
  id uuid primary key default gen_random_uuid(),
  port_id uuid references public.ports (id) on delete cascade,
  port_slug text not null,
  tested_version text not null,
  headset_model text not null,
  checked_at timestamptz not null default now(),
  source text not null,
  checks jsonb not null default '{}'::jsonb,
  result text not null,
  notes text,
  moderation_status text not null default 'pending',
  device_fingerprint text,
  ip_hash text,
  created_at timestamptz not null default now(),
  constraint port_verifications_slug_format check (port_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint port_verifications_version_len check (char_length(btrim(tested_version)) between 1 and 80),
  constraint port_verifications_headset_len check (char_length(btrim(headset_model)) between 1 and 40),
  constraint port_verifications_source check (source in ('manual', 'install')),
  constraint port_verifications_result check (result in ('works', 'works_with_issues', 'doesnt_work')),
  constraint port_verifications_moderation check (moderation_status in ('pending', 'approved', 'rejected')),
  constraint port_verifications_checks_object check (jsonb_typeof(checks) = 'object'),
  constraint port_verifications_notes_len check (notes is null or char_length(notes) <= 2000),
  constraint port_verifications_device_fingerprint check (
    device_fingerprint is null or device_fingerprint ~ '^[a-f0-9]{64}$'
  ),
  constraint port_verifications_ip_hash check (
    ip_hash is null or ip_hash ~ '^[a-f0-9]{64}$'
  )
);

alter table public.port_verifications enable row level security;

create policy "Public reads approved port verifications"
  on public.port_verifications
  for select
  to anon, authenticated
  using (moderation_status = 'approved');

revoke all on table public.port_verifications from public;
revoke all on table public.port_verifications from anon, authenticated;
grant select (
  id,
  port_id,
  port_slug,
  tested_version,
  headset_model,
  checked_at,
  source,
  checks,
  result,
  notes,
  moderation_status
) on table public.port_verifications to anon, authenticated;
grant all on table public.port_verifications to service_role;

-- Automatic installs are a positive install. A stored works_with_issues on
-- source = install meant game files were not copied through the site, which
-- is not a broken port. Manual rows keep their result. See
-- supabase/migrations/20261009190000_install_not_issues.sql.
create or replace view public.port_verification_summaries
with (security_invoker = true) as
select distinct on (port_slug, headset_model)
  id,
  port_id,
  port_slug,
  tested_version,
  headset_model,
  checked_at,
  source,
  case
    when source = 'install'
      and not (checks ? 'data_copied_by_site')
      and jsonb_typeof(checks -> 'game_files_detected') = 'boolean'
    then checks || jsonb_build_object('data_copied_by_site', checks -> 'game_files_detected')
    else checks
  end as checks,
  case
    when source = 'install' and result = 'works_with_issues' then 'works'
    else result
  end as result,
  notes,
  moderation_status
from public.port_verifications
where moderation_status = 'approved'
order by port_slug, headset_model, checked_at desc;

revoke all on table public.port_verification_summaries from public, anon, authenticated;
grant select on table public.port_verification_summaries to anon, authenticated, service_role;

-- Distinct devices that installed each port through the site. The public view
-- is security_invoker and only returns aggregates. Fingerprints stay in
-- private.port_install_count_rows. See
-- supabase/migrations/20261009201000_port_install_counts.sql.
create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create or replace function private.port_install_count_rows()
returns table (
  port_slug text,
  installs bigint,
  last_install_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    v.port_slug,
    (
      count(distinct v.device_fingerprint) filter (where v.device_fingerprint is not null)
      + count(*) filter (where v.device_fingerprint is null)
    )::bigint as installs,
    max(v.checked_at) as last_install_at
  from public.port_verifications v
  where v.moderation_status = 'approved'
    and v.source = 'install'
    and v.result in ('works', 'works_with_issues')
  group by v.port_slug
$$;

revoke all on function private.port_install_count_rows() from public, anon, authenticated;
grant execute on function private.port_install_count_rows() to anon, authenticated, service_role;

create or replace view public.port_install_counts
with (security_invoker = true) as
select port_slug, installs, last_install_at
from private.port_install_count_rows();

revoke all on table public.port_install_counts from public, anon, authenticated;
grant select on table public.port_install_counts to anon, authenticated, service_role;

create index if not exists port_verifications_install_count_idx
  on public.port_verifications (port_slug, device_fingerprint, checked_at desc)
  where moderation_status = 'approved'
    and source = 'install'
    and result in ('works', 'works_with_issues');

create or replace function public.ports_install_count(port public.ports)
returns setof public.port_install_counts
language sql
stable
security invoker
set search_path = ''
as $$
  select c.port_slug, c.installs, c.last_install_at
  from public.port_install_counts c
  where c.port_slug = port.slug
$$;

revoke all on function public.ports_install_count(public.ports) from public, anon, authenticated;
grant execute on function public.ports_install_count(public.ports) to anon, authenticated, service_role;
