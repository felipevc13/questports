# Deploy on Cloudflare (questports.com)

The site runs as a Cloudflare Worker with static assets. Vercel Hobby paused the old
deployment on 31 Oct 2026 after 3M CDN requests (limit 1M). Everything here stays on free tiers.

## One-time setup
1. `npx wrangler login`
2. Put the secrets on the Worker (copy the values from the old Vercel project):
   `npx wrangler --cwd .output secret put NUXT_SUPABASE_SERVICE_ROLE_KEY`, then `NUXT_VERIFICATION_ADMIN_SECRET`,
   `NUXT_ANALYTICS_SALT`. The `NUXT_` prefix is what Nuxt reads at runtime.
   Optional: `NUXT_PUBLIC_*` values and `ANALYTICS_ENABLED`. Nuxt reads `SUPABASE_URL`,
   `SUPABASE_KEY` and `NUXT_PUBLIC_*` at **build** time, so export them before `npm run build:cf`.

## Request budget
Static files (`/_nuxt`, `/covers`, `/previews`) are Workers static assets and do not count against
the Worker limit. Page HTML and `/api/**` run the Worker: 100k requests per day on the free plan.
A Cache Rule does **not** help here, because Cache Rules do not apply to responses a Worker generates
(checked on 31 Oct 2026: no `cf-cache-status` on HTML). Watch Workers & Pages → questports → Metrics.
Because the free plan allows about 10 ms of CPU per request and the SSR of `/` is heavier than that, the
home page returned some 503 (`exceededResources`) on 31 Oct 2026 (mostly GPTBot). So on Cloudflare the catalog
is **prerendered at build time** (`nitro.prerender` with `crawlLinks`, rule `catalogPrerenderRule()`): `/`, `/app`,
`/library` and every `/ports/<slug>` become static assets, which cost no Worker request and no CPU.
`wrangler.jsonc` sets `html_handling: "drop-trailing-slash"` so `/ports/<slug>` serves without a 307.
The build reads Supabase, so export `SUPABASE_URL` and `SUPABASE_KEY` first. The pages are frozen until the next
deploy: run `npm run deploy:cf` again after the 04:00 UTC release sync (or after any catalog change) to refresh
"Recently updated" and install counts. `/api/**` and `/admin/**` still run in the Worker.

## Deploy
```bash
npm run deploy:cf
```
`wrangler.jsonc` attaches `questports.com` and `www.questports.com` as custom domains.

## Check
```bash
curl -sI https://questports.com/ | head -5
```

## Redirect from the old host
`questports.vercel.app` answers 402 while the Vercel team is paused, so it cannot redirect.
When Vercel lifts the pause, deploy a project there with only 308 redirects to `https://questports.com`.
The Android app (`questports-android`) still has the old origin in `UpdateUrls.kt`,
`RemoteUrlsPolicy.kt`, `RemoteModels.kt` and `strings.xml`. Ship a version that uses
`questports.com` and accepts both hosts.
