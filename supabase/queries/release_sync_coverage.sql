-- Ports the daily GitHub release sync (scripts/sync-github-stats.js) cannot keep current.
-- Read-only. Run in the Supabase SQL editor after adding ports.
-- The sync reads ports.github_url. A row only moves when github_url is a GitHub repo and
-- port_download_url is that repo's release (pinned /releases/download/<tag>/<asset> or /releases/latest).

select slug,
       latest_version,
       github_url,
       port_download_url,
       case
         when github_url is null or github_url = '' then 'no github_url: never synced'
         when github_url !~* '^https://(www\.)?github\.com/[^/]+/[^/]+' then 'github_url is not a GitHub repo: never synced'
         when port_download_url !~* '^https://(www\.)?github\.com/'
           or lower(split_part(regexp_replace(port_download_url, '^https://(www\.)?github\.com/', '', 'i'), '/', 1)
                    || '/' || split_part(regexp_replace(port_download_url, '^https://(www\.)?github\.com/', '', 'i'), '/', 2))
              <> lower(split_part(regexp_replace(github_url, '^https://(www\.)?github\.com/', '', 'i'), '/', 1)
                    || '/' || split_part(regexp_replace(github_url, '^https://(www\.)?github\.com/', '', 'i'), '/', 2))
           then 'download is not this repo''s release: version never bumps'
       end as problem
from public.ports
where github_url is null
   or github_url = ''
   or github_url !~* '^https://(www\.)?github\.com/[^/]+/[^/]+'
   or port_download_url !~* '^https://(www\.)?github\.com/'
   or lower(split_part(regexp_replace(port_download_url, '^https://(www\.)?github\.com/', '', 'i'), '/', 1)
            || '/' || split_part(regexp_replace(port_download_url, '^https://(www\.)?github\.com/', '', 'i'), '/', 2))
      <> lower(split_part(regexp_replace(github_url, '^https://(www\.)?github\.com/', '', 'i'), '/', 1)
            || '/' || split_part(regexp_replace(github_url, '^https://(www\.)?github\.com/', '', 'i'), '/', 2))
order by problem, slug;
