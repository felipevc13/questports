-- Remove 18 Wheeler VR from the catalog.
-- The developer's GitHub account (f1nal-b0ss) and the 18-wheeler-decomp repo now
-- return 404, so port_download_url is dead and the port cannot be installed.
-- All 6 player reports on it were "Couldn't Run".
--
-- port_community_reviews and port_verifications reference ports with
-- ON DELETE CASCADE, so this also deletes that port's player reports (6) and
-- verifications (12). That is intended: they describe a build nobody can get.
-- analytics_events, port_install_counts and remote_install_requests have no
-- foreign key and keep their rows.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
-- A re-run deletes nothing.

begin;

delete from public.ports
 where slug = '18-wheeler-vr';

commit;
