# Deploy on Cloudflare (questports.com)

The site runs as a Cloudflare Worker with static assets. Vercel Hobby paused the old
deployment on 31 Oct 2026 after 3M CDN requests (limit 1M). Everything here stays on free tiers.

## One-time setup
1. `npx wrangler login`
2. Put the secrets on the Worker (copy the values from the old Vercel project):
   `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY`, then `VERIFICATION_ADMIN_SECRET`,
   `ANALYTICS_SALT`, `SUPABASE_URL`, `SUPABASE_KEY`.
   Optional: `NUXT_PUBLIC_*` values and `ANALYTICS_ENABLED`. Nuxt reads `SUPABASE_URL`,
   `SUPABASE_KEY` and `NUXT_PUBLIC_*` at **build** time, so export them before `npm run build:cf`.
3. In the Cloudflare dashboard, zone `questports.com` → Caching → Cache Rules, one rule:
   - Match: hostname equals `questports.com` and path is not under `/api/` or `/admin/`
   - Cache eligibility: Eligible for cache
   - Edge TTL: Use cache-control header if present
   - Cache key: ignore query string
   Cache hits never start the Worker, which keeps the free 100k Worker requests per day.

## Deploy
```bash
npm run deploy:cf
```
`wrangler.jsonc` attaches `questports.com` and `www.questports.com` as custom domains.

## Check
```bash
curl -sI https://questports.com/ | grep -i "cf-cache-status\|cache-control"
```
`cf-cache-status: HIT` on the second request means the edge serves the page.

## Redirect from the old host
`questports.vercel.app` answers 402 while the Vercel team is paused, so it cannot redirect.
When Vercel lifts the pause, deploy a project there with only 308 redirects to `https://questports.com`.
The Android app (`questports-android`) still has the old origin in `UpdateUrls.kt`,
`RemoteUrlsPolicy.kt`, `RemoteModels.kt` and `strings.xml`. Ship a version that uses
`questports.com` and accepts both hosts.
