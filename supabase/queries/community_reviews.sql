-- Player reports: which ports look broken, and why.
-- Read-only. Run in the Supabase SQL editor. Flagged reviews are excluded everywhere.
-- A port in query 1 usually means the guide, the APK link, or the file paths are wrong.
-- Check it before trusting the votes: they are anonymous and need no install.

-- 1. Alert: ports where at least 3 players could not run it, and that is at least half the reports.
select port_slug,
       count(*) as reports,
       count(*) filter (where verdict = 'cant_run') as cant_run,
       count(*) filter (where verdict = 'needs_tweaks') as needs_tweaks,
       count(*) filter (where verdict = 'works_great') as works_great,
       max(updated_at)::date as last_report
from public.port_community_reviews
where is_flagged is false
group by port_slug
having count(*) filter (where verdict = 'cant_run') >= 3
   and count(*) filter (where verdict = 'cant_run') * 2 >= count(*)
order by cant_run desc, reports desc;

-- 2. What went wrong, per port, for "Couldn't Run" and "Needs Tweaks".
select port_slug,
       verdict,
       coalesce(issue_tag, '(no tag)') as issue,
       count(*) as reports
from public.port_community_reviews
where is_flagged is false
  and verdict in ('cant_run', 'needs_tweaks')
group by 1, 2, 3
order by port_slug, reports desc;

-- 3. Same port, split by headset and version. A failure only on one headset or one old
--    version is a different fix than a failure everywhere.
select port_slug,
       coalesce(headset, '(unknown)') as headset,
       coalesce(port_version, '(unknown)') as version,
       count(*) filter (where verdict = 'cant_run') as cant_run,
       count(*) as reports
from public.port_community_reviews
where is_flagged is false
group by 1, 2, 3
having count(*) filter (where verdict = 'cant_run') > 0
order by port_slug, cant_run desc;

-- 4. How many ports the catalog table can label (COMMUNITY_TABLE_MIN = 5 in app/lib/communityReviews.ts).
select count(*) filter (where total_reviews >= 5) as ports_labeled,
       count(*) filter (where total_reviews between 1 and 4) as ports_below_min,
       sum(total_reviews) as reports
from public.port_community_summaries;
