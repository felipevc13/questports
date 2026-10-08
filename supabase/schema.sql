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
