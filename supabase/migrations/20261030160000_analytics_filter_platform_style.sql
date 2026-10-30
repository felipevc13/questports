-- Catalog filters "Original platform" and "VR style" send filter_used with
-- props.filter = 'platform' or 'style'. Widen the filter name check to allow them.
-- Apply this manually in the Supabase SQL editor after merge. Do not run it from CI.
-- Apply it before the deploy that ships the filters: until then the database rejects
-- those two filter names (the site keeps working; the events are just not stored).
-- Only analytics_events_filter_used changes. The value length rule is unchanged.

alter table public.analytics_events drop constraint if exists analytics_events_filter_used;

alter table public.analytics_events
  add constraint analytics_events_filter_used check (
    event <> 'filter_used'
    or (
      props->>'filter' in ('category', 'status', 'hardware', 'developer', 'quest', 'platform', 'style', 'sort')
      and char_length(coalesce(props->>'value', '')) between 1 and 60
    )
  );
