-- Funnel events for QuestPorts analytics.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.
-- Adds install_step, search_no_results, and video_preview_play.
-- analytics_daily already groups by event name, so it picks these up with no view change.

alter table public.analytics_events drop constraint if exists analytics_events_event_check;

alter table public.analytics_events
  add constraint analytics_events_event_check check (
    event in (
      'page_view',
      'port_view',
      'install_click',
      'install_success',
      'install_error',
      'install_step',
      'manual_download_click',
      'github_click',
      'suggest_submit',
      'feedback_submit',
      'filter_used',
      'search',
      'search_no_results',
      'unsupported_browser_view',
      'video_preview_play'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_install_step_check;

alter table public.analytics_events
  add constraint analytics_events_install_step_check check (
    event <> 'install_step'
    or (
      props->>'step' in ('connect', 'authorize', 'download_apk', 'install_apk', 'copy_game_files')
      and props->>'status' in ('start', 'ok', 'fail')
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_search_no_results_check;

alter table public.analytics_events
  add constraint analytics_events_search_no_results_check check (
    event <> 'search_no_results'
    or (
      char_length(coalesce(props->>'q', '')) between 1 and 80
      and props->>'q' = lower(props->>'q')
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_video_preview_play_check;

alter table public.analytics_events
  add constraint analytics_events_video_preview_play_check check (
    event <> 'video_preview_play'
    or props->>'surface' in ('card', 'detail')
  );

alter table public.analytics_events drop constraint if exists analytics_events_campaign_ref_check;

alter table public.analytics_events
  add constraint analytics_events_campaign_ref_check check (
    props->>'ref' is null
    or (
      event in (
        'page_view',
        'install_click',
        'install_success',
        'install_error',
        'install_step'
      )
      and props->>'ref' ~ '^[a-z0-9][a-z0-9._-]{0,39}$'
    )
  );
