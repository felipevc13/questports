-- Pair modal exits: remote_pair_exit says how the "Pair your Quest" modal ended without a
-- pairing. action is get_app (clicked the link to /app) or closed (X or click outside);
-- typed says whether a code had been typed. Together with remote_pair_shown and
-- remote_pair_success it shows how many people leave because they do not have the app.
-- Apply this manually in the Supabase SQL editor after merge. Do not run it from CI.
-- Apply it before the deploy that ships the event: until then the database rejects it
-- (the site keeps working; the event is just not stored).
-- The event check below keeps every event from 20261102120000_analytics_base_game_and_files_ready.sql.
-- Do not drop analytics_events_install_step_check, analytics_events_install_error_reason,
-- analytics_events_install_error_detail, or analytics_events_install_success_recovered.

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
      'video_preview_play',
      'tip_click',
      'banner_shown',
      'banner_click',
      'banner_dismiss',
      'modal_shown',
      'modal_click',
      'modal_dismiss',
      'app_page_view',
      'app_open',
      'game_launch',
      'app_download_click',
      'search_result_click',
      'game_request_shown',
      'game_request_click',
      'game_request_submit',
      'remote_send_click',
      'remote_pair_shown',
      'remote_pair_success',
      'remote_pair_fail',
      'remote_request_created',
      'remote_status',
      'remote_app_outdated',
      'base_game_click',
      'game_files_ready',
      'remote_pair_exit'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_remote_pair_exit_check;

alter table public.analytics_events
  add constraint analytics_events_remote_pair_exit_check check (
    event <> 'remote_pair_exit'
    or (
      port_slug is not null
      and props->>'action' in ('get_app', 'closed')
      and props->>'typed' in ('true', 'false')
    )
  );
