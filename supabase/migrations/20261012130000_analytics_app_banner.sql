-- QuestPorts app funnel.
-- Banner (Quest Browser): banner_shown, banner_click, banner_dismiss.
-- Desktop modal: modal_shown, modal_click, modal_dismiss.
-- /app visit: app_page_view props.source (banner, modal, nav, footer, direct)
--   and props.device (quest, desktop, mobile).
-- Native app WebView: app_open props.version and props.first (true on first launch).
-- Install start/ok/fail reuse install_click, install_success, and install_error
-- with path /app. props.via is page or modal. Game installs leave via null.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.

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
      'app_open'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_banner_surface_check;

alter table public.analytics_events drop constraint if exists analytics_events_app_page_view_check;

alter table public.analytics_events
  add constraint analytics_events_app_page_view_check check (
    event <> 'app_page_view'
    or (
      props->>'source' in ('banner', 'modal', 'nav', 'footer', 'direct')
      and props->>'device' in ('quest', 'desktop', 'mobile')
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_app_open_check;

alter table public.analytics_events
  add constraint analytics_events_app_open_check check (
    event <> 'app_open'
    or (
      props->>'version' ~ '^[A-Za-z0-9][A-Za-z0-9._+-]{0,31}$'
      and props->>'first' in ('true', 'false')
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_app_install_via_check;

alter table public.analytics_events
  add constraint analytics_events_app_install_via_check check (
    props->>'via' is null
    or (
      event in ('install_click', 'install_success', 'install_error')
      and props->>'via' in ('page', 'modal')
    )
  );
