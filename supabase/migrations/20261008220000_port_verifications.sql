-- Headset verification history for QuestPorts.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.
-- The browser anon key can only read approved rows. Inserts use the service role
-- from the Nuxt server (one-click install and the admin form). Felipe can also
-- insert from this SQL editor; see supabase/manual_verification.sql.

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
  -- Server-only. Hashed device id and IP used for dedupe and rate limits.
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

comment on table public.port_verifications is
  'One row per headset check. Public reads approved rows only. Browsers cannot insert.';

comment on column public.port_verifications.source is
  'manual = Felipe. install = technical evidence from a successful one-click WebUSB install.';

comment on column public.port_verifications.checks is
  'What that check could confirm: apk_installed, game_files_detected, storage_path_confirmed.';

comment on column public.port_verifications.moderation_status is
  'approved rows are visible on the site. pending and rejected stay hidden.';

comment on column public.port_verifications.device_fingerprint is
  'SHA-256 of the headset serial (or IP fallback). Not granted to the public API.';

create index if not exists port_verifications_port_id_idx
  on public.port_verifications (port_id);

create index if not exists port_verifications_approved_lookup_idx
  on public.port_verifications (port_slug, headset_model, checked_at desc)
  where moderation_status = 'approved';

create index if not exists port_verifications_dedupe_idx
  on public.port_verifications (port_slug, device_fingerprint, checked_at desc);

create index if not exists port_verifications_rate_idx
  on public.port_verifications (ip_hash, created_at desc);

alter table public.port_verifications enable row level security;

drop policy if exists "Public reads approved port verifications" on public.port_verifications;
create policy "Public reads approved port verifications"
  on public.port_verifications
  for select
  to anon, authenticated
  using (moderation_status = 'approved');

-- No insert, update, or delete policy: the Data API cannot write this table.
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

-- Latest approved check per port and headset. security_invoker keeps the RLS filter.
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
  checks,
  result,
  notes,
  moderation_status
from public.port_verifications
where moderation_status = 'approved'
order by port_slug, headset_model, checked_at desc;

comment on view public.port_verification_summaries is
  'Latest approved check for each port and headset. Invoker RLS still applies.';

revoke all on table public.port_verification_summaries from public, anon, authenticated;
grant select on table public.port_verification_summaries to anon, authenticated, service_role;

notify pgrst, 'reload schema';
