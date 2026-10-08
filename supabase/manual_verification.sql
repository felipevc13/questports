-- Manual headset check by Felipe.
-- Run in the Supabase SQL editor (the postgres role bypasses RLS).
-- Change the slug, version, headset, result, checks, and notes.
-- This does not run from CI. One row is one check; run it again to add history.
--
-- result: 'works' | 'works_with_issues' | 'doesnt_work'
-- headset_model: 'Quest 2' | 'Quest 3' | 'Quest 3S' | 'Quest Pro'
-- source stays 'manual' so the site can tell this apart from a one-click install.
-- moderation_status 'approved' is what the public site is allowed to read.

insert into public.port_verifications (
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
)
select
  id,
  slug,
  'v1.0.16',
  'Quest 3',
  now(),
  'manual',
  jsonb_build_object(
    'apk_installed', true,
    'game_files_detected', true,
    'storage_path_confirmed', true
  ),
  'works',
  'Played the opening section on a Quest 3. Game files were in the catalog storage path.',
  'approved'
from public.ports
where slug = 'halocequest';

-- Hide a bad or outdated row without deleting history:
-- update public.port_verifications
-- set moderation_status = 'rejected'
-- where id = '00000000-0000-0000-0000-000000000000';
