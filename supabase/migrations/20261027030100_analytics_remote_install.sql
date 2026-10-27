-- Send to Quest analytics. Compare remote installs with USB, and split ports that
-- still need the player's game files (props.needs_files = 'true' or 'false').
-- Apply this manually in the Supabase SQL editor after merge. Do not run it from CI.
-- Do not drop analytics_events_install_step_check or analytics_events_install_error_reason.

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
      'remote_send_click',
      'remote_pair_shown',
      'remote_pair_success',
      'remote_pair_fail',
      'remote_request_created',
      'remote_status',
      'remote_app_outdated'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_install_method_check;

alter table public.analytics_events
  add constraint analytics_events_install_method_check check (
    event not in ('install_click', 'install_success')
    or props->>'method' is null
    or props->>'method' in ('usb', 'remote', 'app')
  );

alter table public.analytics_events drop constraint if exists analytics_events_remote_needs_files_check;

alter table public.analytics_events
  add constraint analytics_events_remote_needs_files_check check (
    (
      event not in ('remote_send_click', 'remote_request_created')
      and not (event = 'install_success' and props->>'method' = 'remote')
    )
    or props->>'needs_files' in ('true', 'false')
  );

alter table public.analytics_events drop constraint if exists analytics_events_remote_send_click_check;

alter table public.analytics_events
  add constraint analytics_events_remote_send_click_check check (
    event <> 'remote_send_click'
    or (
      props->>'paired' in ('true', 'false')
      and props->>'needs_files' in ('true', 'false')
      and (props->>'blocked' is null or props->>'blocked' = 'app_outdated')
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_remote_pair_fail_check;

alter table public.analytics_events
  add constraint analytics_events_remote_pair_fail_check check (
    event <> 'remote_pair_fail'
    or props->>'reason' in (
      'invalid_code',
      'expired',
      'too_many_attempts',
      'rate_limited',
      'unavailable',
      'disabled'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_remote_status_check;

alter table public.analytics_events
  add constraint analytics_events_remote_status_check check (
    event <> 'remote_status'
    or (
      props->>'status' in (
        'received',
        'downloading',
        'awaiting_confirm',
        'installed',
        'failed',
        'cancelled',
        'expired'
      )
      and (
        props->>'reason' is null
        or props->>'reason' in (
          'user_cancelled',
          'no_webusb',
          'adb_fail',
          'download_fail',
          'storage',
          'unauthorized',
          'usb_locked',
          'pm_fail',
          'timeout',
          'too_large',
          'other',
          'signature_conflict',
          'busy'
        )
      )
      and (
        props->>'progress' is null
        or (
          props->>'progress' ~ '^[0-9]+$'
          and (props->>'progress')::integer between 0 and 100
        )
      )
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_remote_app_outdated_check;

alter table public.analytics_events
  add constraint analytics_events_remote_app_outdated_check check (
    event <> 'remote_app_outdated'
    or (
      props->>'surface' in ('pair_modal', 'paired', 'send')
      and (props->>'app_version' is null or props->>'app_version' ~ '^[A-Za-z0-9][A-Za-z0-9._+-]{0,31}$')
      and (props->>'min_app_version' is null or props->>'min_app_version' ~ '^[A-Za-z0-9][A-Za-z0-9._+-]{0,31}$')
    )
  );
