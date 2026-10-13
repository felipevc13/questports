-- Let install_step say where the connect started.
-- props.surface is navbar (the header Connect Quest button) or install (reserved).
-- Null surface stays valid: one-click install events do not set it.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.

alter table public.analytics_events drop constraint if exists analytics_events_install_step_check;

alter table public.analytics_events
  add constraint analytics_events_install_step_check check (
    event <> 'install_step'
    or (
      props->>'step' in ('connect', 'authorize', 'download_apk', 'install_apk', 'copy_game_files')
      and props->>'status' in ('start', 'ok', 'fail')
      and (
        props->>'surface' is null
        or props->>'surface' in ('navbar', 'install')
      )
    )
  );
