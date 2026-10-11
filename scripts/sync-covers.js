// Retired on 2026-10-11. Do not upload covers or the OG card to Supabase Storage.
//
// This script used to push files into the Supabase Storage bucket 'port-covers'.
// Serving covers from there blew through Supabase's free cached-egress quota
// (Oct 5-8, 2026), so every cover now lives on the Cloudflare media host:
//
//   https://questports-media.questports.workers.dev/covers/<file>
//   https://questports-media.questports.workers.dev/covers/thumbs/<name>.jpg
//
// To add or change a cover: commit it under public/covers/ (and its thumb under
// public/covers/thumbs/), then ask the Produto & UX agent to publish it to the
// media host (box tooling: /workspace/qp-media, see its README). In the database,
// set ports.cover_image_url to the media-host URL above (or to /covers/<file>).
// The site-wide share card is served from the site itself (/covers/questports-og.png).

console.error(
  'scripts/sync-covers.js is retired: covers no longer go to Supabase Storage.\n' +
  'Commit the file under public/covers/ and publish it to the Cloudflare media host ' +
  '(https://questports-media.questports.workers.dev) via the /workspace/qp-media tooling.'
)
process.exit(1)
