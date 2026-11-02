-- Steam/GOG funnel: base_game_click (a click on the base game link of a port page) and
-- game_files_ready (the port page saw the player's game files on the headset).
-- Apply this manually in the Supabase SQL editor after merge. Do not run it from CI.
-- Apply it before the deploy that ships the events: until then the database rejects
-- them (the site keeps working; the events are just not stored).
-- The event check below keeps every event from 20261027050100_analytics_remote_install.sql.
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
      'game_files_ready'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_base_game_click_check;

alter table public.analytics_events
  add constraint analytics_events_base_game_click_check check (
    event <> 'base_game_click'
    or (
      port_slug is not null
      and props->>'store' in ('steam', 'gog', 'store', 'info')
      and props->>'surface' in ('action', 'details', 'campaign')
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_game_files_ready_check;

alter table public.analytics_events
  add constraint analytics_events_game_files_ready_check check (
    event <> 'game_files_ready'
    or (
      port_slug is not null
      and props->>'source' in ('copied', 'found', 'confirmed')
    )
  );
