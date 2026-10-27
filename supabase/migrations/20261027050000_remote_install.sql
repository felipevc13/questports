-- Send to Quest. Pair a browser with the QuestPorts headset app and queue an APK install.
-- Apply this manually in the Supabase SQL editor after merge. Do not run it from CI.
-- RLS is on and there are no anon policies. The Nuxt server uses the service role.
-- Only hashes of device secrets, browser tokens, and pairing codes are stored.

create table if not exists public.remote_devices (
  id uuid primary key default gen_random_uuid(),
  model text not null,
  name text not null,
  app_version text not null,
  secret_hash text not null,
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  created_ip_hash text not null,
  constraint remote_devices_model_len check (char_length(model) between 1 and 40),
  constraint remote_devices_name_len check (char_length(name) between 1 and 40),
  constraint remote_devices_app_version check (app_version ~ '^[A-Za-z0-9][A-Za-z0-9._+-]{0,31}$'),
  constraint remote_devices_secret_hash check (secret_hash ~ '^[a-f0-9]{64}$'),
  constraint remote_devices_ip_hash check (created_ip_hash ~ '^[a-f0-9]{64}$')
);

create unique index if not exists remote_devices_secret_hash_idx
  on public.remote_devices (secret_hash);

create index if not exists remote_devices_created_ip_idx
  on public.remote_devices (created_ip_hash, created_at);

create table if not exists public.remote_pair_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null,
  device_id uuid not null references public.remote_devices (id),
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint remote_pair_codes_hash check (code_hash ~ '^[a-f0-9]{64}$'),
  constraint remote_pair_codes_attempts check (attempts >= 0 and attempts <= 20)
);

create index if not exists remote_pair_codes_hash_idx
  on public.remote_pair_codes (code_hash);

create index if not exists remote_pair_codes_device_created_idx
  on public.remote_pair_codes (device_id, created_at);

create unique index if not exists remote_pair_codes_active_hash_idx
  on public.remote_pair_codes (code_hash)
  where used_at is null;

create table if not exists public.remote_links (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.remote_devices (id),
  token_hash text not null,
  label text,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  constraint remote_links_token_hash check (token_hash ~ '^[a-f0-9]{64}$'),
  constraint remote_links_label_len check (label is null or char_length(label) between 1 and 60)
);

create unique index if not exists remote_links_token_hash_idx
  on public.remote_links (token_hash);

create index if not exists remote_links_device_idx
  on public.remote_links (device_id);

create table if not exists public.remote_install_requests (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.remote_links (id),
  device_id uuid not null references public.remote_devices (id),
  port_slug text not null,
  title text not null,
  package_id text not null,
  version text,
  cover_url text,
  needs_files boolean not null default false,
  status text not null default 'queued',
  progress integer,
  error_reason text,
  detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  received_at timestamptz,
  installed_at timestamptz,
  constraint remote_install_requests_slug check (port_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint remote_install_requests_status check (
    status in (
      'queued',
      'received',
      'downloading',
      'awaiting_confirm',
      'installed',
      'failed',
      'cancelled',
      'expired'
    )
  ),
  constraint remote_install_requests_progress check (progress is null or progress between 0 and 100),
  constraint remote_install_requests_detail_len check (detail is null or char_length(detail) <= 180)
);

create index if not exists remote_install_requests_device_status_idx
  on public.remote_install_requests (device_id, status, expires_at);

create index if not exists remote_install_requests_link_created_idx
  on public.remote_install_requests (link_id, created_at);

create table if not exists public.remote_rate_limits (
  id bigserial primary key,
  action text not null,
  subject_hash text not null,
  created_at timestamptz not null default now(),
  constraint remote_rate_limits_action check (action in ('claim_fail')),
  constraint remote_rate_limits_subject check (subject_hash ~ '^[a-f0-9]{64}$')
);

create index if not exists remote_rate_limits_lookup_idx
  on public.remote_rate_limits (action, subject_hash, created_at);

comment on table public.remote_devices is
  'QuestPorts headset installs. secret_hash is sha256 of the device secret. The secret is not stored.';

comment on column public.remote_install_requests.needs_files is
  'True when the port still needs the player''s own game files after the APK install. Set by the server from portPackageMap.';

alter table public.remote_devices enable row level security;
alter table public.remote_pair_codes enable row level security;
alter table public.remote_links enable row level security;
alter table public.remote_install_requests enable row level security;
alter table public.remote_rate_limits enable row level security;

revoke all on table public.remote_devices from public, anon, authenticated;
revoke all on table public.remote_pair_codes from public, anon, authenticated;
revoke all on table public.remote_links from public, anon, authenticated;
revoke all on table public.remote_install_requests from public, anon, authenticated;
revoke all on table public.remote_rate_limits from public, anon, authenticated;

grant all on table public.remote_devices to service_role;
grant all on table public.remote_pair_codes to service_role;
grant all on table public.remote_links to service_role;
grant all on table public.remote_install_requests to service_role;
grant all on table public.remote_rate_limits to service_role;

revoke all on sequence public.remote_rate_limits_id_seq from public, anon, authenticated;
grant usage, select on sequence public.remote_rate_limits_id_seq to service_role;
