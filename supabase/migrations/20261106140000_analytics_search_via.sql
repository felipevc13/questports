-- Let `search` events carry props.via again.
--
-- 20261012130000_analytics_app_banner.sql added analytics_events_app_install_via_check, which only
-- allows props.via on install events (page or modal). Since 27 Oct 2026 the catalog search sends
-- via (text, alias, fuzzy, none), so every search row violated that check. /api/track inserts a
-- visit as one batch, so the whole batch was rejected: the search and the page_view, port_view and
-- install events that left in the same beacon were lost.
--
-- analytics_events_search_query (20261027020000_analytics_catalog_search.sql) already pins the
-- search values of via and their pairing with count. This only widens the install check.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.

alter table public.analytics_events drop constraint if exists analytics_events_app_install_via_check;

alter table public.analytics_events
  add constraint analytics_events_app_install_via_check check (
    props->>'via' is null
    or (
      event in ('install_click', 'install_success', 'install_error')
      and props->>'via' in ('page', 'modal')
    )
    or (
      event = 'search'
      and props->>'via' in ('text', 'alias', 'fuzzy', 'none')
    )
  );

notify pgrst, 'reload schema';
