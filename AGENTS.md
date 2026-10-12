# QuestPorts

Resumo para o Felipe (o restante deste arquivo está em inglês de propósito: a interface do site, os commits e os outros agentes seguem em inglês):

- Não faça push na `main`. Branch, PR pequeno, `npm ci && npx vitest run` verde, e no corpo do PR o que foi testado (e prints, se mudou a UI).
- Banco: todo cambio vira SQL novo em `supabase/migrations/` (nome com data e hora). Não edite migration já aplicada. Só aplique no Supabase **depois** que você fizer merge. Projeto `ccjteoxolasldhfgnoyx`.
- Capas e vídeos **não** passam pela Vercel nem pelo Storage do Supabase. Arquivos em `public/covers`, `public/covers/thumbs` e `public/previews`. Publica com `npm run media:deploy` (o dry-run é `npm run media:deploy:dry`). APKs saem pelo Worker `questports-apk-proxy`, não por função da Vercel.
- Não rode `scripts/add-*.js`, `scripts/update-*-cover.js`, `scripts/sync-covers.js`, `scripts/upload-og.js` nem os outros one-offs. Não apague esses arquivos.
- Cartão mostra pouca coisa. Contagem de installs pode aparecer. `⚠ Issues` só quando alguém marcou problema de verdade. Site em inglês. Você fala PT-BR; o agente pode te responder em português.
- Gorjeta: uma linha no sucesso da instalação e um link no rodapé. URL em `NUXT_PUBLIC_KOFI_URL` (vazio esconde). Evento `tip_click`. Migration `20261011180000_analytics_tip_click.sql` — aplicar no SQL editor depois do merge.
- Nada de segredo no git. Token da Cloudflare é `CLOUDFLARE_API_TOKEN`.

---

## Overview

QuestPorts (`questports.vercel.app`) is a catalog of standalone Meta Quest ports, emulators, and injections. No PC streaming. The UI is English.

Stack, from `package.json` and `nuxt.config.ts`:

- **Nuxt 4** (`nuxt` ^4.5.2) and **Vue 3**, SSR on **Vercel** (Nitro). `README.md` used to say Nuxt 3; the installed package is Nuxt 4.
- **Tailwind CSS** via `@nuxtjs/tailwindcss` (`tailwind.config.js`, `app/assets/css/main.css`).
- **Supabase** project `ccjteoxolasldhfgnoyx` (`https://ccjteoxolasldhfgnoyx.supabase.co`). The browser uses the anon/publishable key. Writes go through the Nuxt server with the service role.
- Covers, thumbs, and MP4 previews are **not** on Vercel and **not** in Supabase Storage. They are Cloudflare Workers static assets: `https://questports-media.questports.workers.dev`.
- APK bytes for one-click install go through `https://questports-apk-proxy.questports.workers.dev`, not through a Vercel function.

Felipe reviews and merges. Agents do not push to `main` and do not apply SQL to production.

## Folder map

| Path | What it is |
| --- | --- |
| `app/pages/index.vue` | Catalog (cards, filters, dense table) |
| `app/pages/ports/[slug].vue` | Port detail, install, guide |
| `app/pages/admin/verify.vue` | Unlisted manual verification form |
| `app/components/PortCard.vue` | Catalog card |
| `app/components/VerificationBadge.vue` | Install count / Verified / Issues line |
| `app/components/QuestBrowserNotice.vue` | In-headset browser notice |
| `app/components/UnsupportedBrowserNotice.vue` | Chrome/Edge, iOS, in-app browser notice |
| `app/components/AppBridgeInstall.vue` | Native QuestPorts app install |
| `app/composables/` | Client state. See key files below |
| `app/data/` | Catalog code that is not the database: package map, covers, previews |
| `app/lib/` | Pure helpers (analytics, verification, version format, APK proxy, app bridge) |
| `app/plugins/analytics.client.ts` | Browser analytics batching |
| `app/plugins/portPrefetch.client.ts` | Drops fake hover prefetch while scrolling |
| `server/api/` | `track.post.ts`, `verifications.post.ts`, `admin/verifications.post.ts`, `apk-proxy.get.ts` (fallback only) |
| `server/utils/` | Service-role Supabase, analytics decisions, APK proxy gate |
| `public/covers/` | Cover source of truth (jpg/png). 59 files |
| `public/covers/thumbs/` | 120px JPEG thumbs. 58 files |
| `public/previews/` | Hover MP4s, `<slug>.mp4`. 52 files |
| `supabase/migrations/` | The only schema/data changes agents add |
| `supabase/schema.sql` | Canonical shape for a new database. Not a place to patch production |
| `supabase/seed.sql` | Historical seed. Still has Unsplash and Storage URLs. Do not apply it |
| `scripts/media/` | Build and deploy the media Worker |
| `workers/questports-apk-proxy/` | APK proxy Worker source. Not deployed by npm scripts |
| `scripts/sync-github-stats.js` | Daily version sync used by GitHub Actions |
| `tests/` | Vitest. `e2e/mobile-overflow.mjs` is a separate overflow check |
| `.github/workflows/sync-releases.yml` | Daily 04:00 UTC GitHub release sync |

## Key files

- `app/composables/useQuestAdb.ts` — WebUSB/ADB singleton: connect, install, push game files, list folders. `?mockQuest=1` uses the simulator in `app/lib/mockQuest.ts`.
- `app/data/portPackageMap.ts` — `PORT_PACKAGE_CONFIGS`. Android `packageName`, install type, and the on-device folders one-click install checks. `isPortInstalledOnQuest` only knows packages listed here.
- `app/data/coverUrl.ts` — `resolveCoverUrl`, `versionedCoverUrl`, `coverThumbUrl`, `DEFAULT_MEDIA_BASE`, `COVER_CACHE_VERSION`. Maps Storage URLs, media-host URLs, and SteamGridDB ids onto `/covers/...`, then adds `?v=` and the media host.
- `app/data/videoPreviews.ts` — `AVAILABLE_VIDEO_PREVIEWS`, `GAME_VIDEO_PREVIEWS`, `previewMp4Url`, YouTube embed helpers. MP4s stay off unless `mediaBase` is set. Touch never starts a hover preview (`canHoverPreview`).
- `app/components/PortCard.vue` — Card UI. Cover, optional hover MP4, category, status, title, developer, version, verification line.
- `app/pages/ports/[slug].vue` — Detail page: guide (`installation_guide`), troubleshooting, storage path, install, YouTube click-to-play.
- Analytics: `app/lib/analytics.ts` (event names and privacy rules), `app/composables/useTrack.ts`, `app/plugins/analytics.client.ts`, `server/utils/analytics.ts`, `server/api/track.post.ts`.
- App-mode bridge: `app/lib/appBridge.ts` (`window.QuestPortsApp`, user-agent `QuestPortsApp/<version>`), `app/composables/useAppBridge.ts` (real app after hydration; `?inApp=1` is the mock). The native wrapper installs with PackageInstaller instead of WebUSB. The bridge does not open URLs. Ko-fi links stay `target="_blank"`. In the app, the click uses `window.open(url, '_blank')` first (no `noopener` feature: Chrome returns null for that even when the tab opened) and then clears `opener`. If `open` returns null, the https URL is assigned so `shouldOverrideUrlLoading` can send it to the system browser (`app/lib/kofi.ts`).
- Quest Browser: `app/lib/questBrowser.ts`. Unsupported browsers: `app/lib/unsupportedBrowser.ts`.
- Versions: `app/lib/versionFormat.ts` (`formatPortVersion`). One leading `v` on semver-like tags (`1.0.84` → `v1.0.84`). Build names (`b004`, `cats27`) stay as names. Placeholders such as `Latest` are hidden.
- APK routing: `app/lib/apkProxyPolicy.ts`. Default base `https://questports-apk-proxy.questports.workers.dev`. Empty `NUXT_PUBLIC_APK_PROXY_BASE` keeps `/api/apk-proxy` on this origin, which is capped (`APK_PROXY_MAX_BYTES`, default 150 MiB) because that path is a Vercel function.

## Dev, test, build

```bash
npm ci
npx vitest run
npm run dev          # http://localhost:3000
npm run build        # nuxt build
```

`npm test` is `vitest run`. Simulated headset: any page with `?mockQuest=1` (`TESTING.md`). `npm run test:mobile` runs `e2e/mobile-overflow.mjs` and is not part of vitest.

Media (does not start the Nuxt app):

```bash
npm run media:build       # public/ → scripts/media/dist
npm run media:deploy:dry  # build, guard, wrangler deploy --dry-run
npm run media:test        # guard the built dir, then live read-only smoke
npm run media:deploy      # real upload. Needs the two Cloudflare env vars
```

## Workflow

- Never push to `main`. Branch and open a PR.
- Keep PRs small and focused.
- `npx vitest run` passes before the PR is ready.
- PR body says what changed and what was tested. UI changes describe screenshots or the pages that were exercised. Media deploys paste the dry-run output. Do not paste secrets.
- Do not apply SQL, do not deploy Workers, and do not run the production GitHub sync from an agent. Felipe merges, then applies migrations in the Supabase SQL editor.

## Database

Project ref `ccjteoxolasldhfgnoyx`.

Every schema or data change is a new file `supabase/migrations/YYYYMMDDHHMMSS_short_name.sql`, same pattern as `20261010120000_analytics_too_large.sql`. Do not edit a migration that is already on `main`. Do not run migrations from CI. `scripts/migrate.js` posts `full_setup.sql` at the management API; do not run it.

Rules that existing migrations already follow:

- Idempotent (`create table if not exists`, `drop constraint if exists` before re-adding, `add column if not exists`).
- Data updates use `is distinct from` so a re-run changes nothing when the value is already right (`20261008210000_storage_paths.sql`, `20261008233000_normalize_latest_version.sql`).
- New tables: `enable row level security`. Grant only the columns and commands the browser actually needs. `analytics_events` has RLS and **no** policies, so anon cannot read or insert. `port_verifications` allows anon/authenticated `select` of approved rows only, and not `device_fingerprint` or `ip_hash`.
- Views that sit on those tables use `with (security_invoker = true)` (`port_verification_summaries`, `port_install_counts`, `analytics_daily`, `analytics_top_ports`).
- Functions set `search_path = ''` and schema-qualify tables (`port_features_valid`, `private.port_install_count_rows`, `ports_install_count`).

`ports` columns that `supabase/schema.sql` and the migrations actually define:

- Identity: `id`, `slug`, `title`, `short_description`, `developer`, `developer_url`, `category`, `status`, `featured`, `created_at`, `updated_at`.
- Media: `cover_image_url`, `youtube_video_id`. New cover URLs are the full media-host URL (see below). `COVER_CACHE_VERSION` in `coverUrl.ts` is the cache buster, not a column.
- Hardware: `supported_hardware`, `locomotion_types`, `has_6dof_controls`.
- `features jsonb`, checked by `port_features_valid` (`20261008230000_port_features.sql`). Missing keys mean unknown. Do not show them as confirmed. Do not invent keys outside that function.
- Install text: `internal_storage_path`, `base_game_url`, `base_game_store`, `port_download_url`, `port_download_source`, `installation_guide`, `troubleshooting_notes`.
- GitHub sync: `github_url`, `last_github_update`, `latest_version`. `latest_version` is stored in the same shape as `formatPortVersion`: semver-like values have exactly one leading `v`.

The TypeScript `Port` type also has optional fields that **no migration in this repo creates**: `video_url`, `video_preview_url`, `video_preview_start`, `video_preview_end`, `download_bytes`, `install_workflow`, `original_game`, `has_motion_controls`. Hover clips and YouTube windows live in `videoPreviews.ts`. One-click package names live in `portPackageMap.ts`. Do not add a column for those unless Felipe asks.

Related tables and views:

- `port_verifications` — one headset check. `source` is `manual` (Felipe's form) or `install` (a successful one-click). `result` is `works`, `works_with_issues`, or `doesnt_work`. Public reads `moderation_status = 'approved'` only.
- `port_verification_summaries` — latest approved row per port and headset. `security_invoker`. An automatic install stored as `works_with_issues` is returned as `works` (`20261009190000_install_not_issues.sql`).
- `private.port_install_count_rows()` — security definer, `search_path = ''`. Counts distinct devices. Does not return hashes.
- `port_install_counts` and `ports_install_count(ports)` — what `usePorts.ts` embeds (`ports_install_count(installs, last_install_at)`).
- `analytics_events` — see below.
- `site_feedback` — anon insert of feature/bug notes. Not a port table.

`supabase/seed.sql` still points some early rows at Unsplash and at `https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/...`. That file is historical. Do not re-seed production from it. `resolveCoverUrl` still maps those Storage URLs onto `/covers/<file>` so old rows keep working.

### Analytics and privacy

Event names are the check constraint `analytics_events_event_check`. The current list is in `app/lib/analytics.ts` `ANALYTICS_EVENTS` and was last updated by `20261011180000_analytics_tip_click.sql`:

`page_view`, `port_view`, `install_click`, `install_success`, `install_error`, `install_step`, `manual_download_click`, `github_click`, `suggest_submit`, `feedback_submit`, `filter_used`, `search`, `search_no_results`, `unsupported_browser_view`, `video_preview_play`, `tip_click`.

A **new event name** needs a migration that drops and re-adds `analytics_events_event_check` (same pattern as the funnel migration) **and** a matching entry in `ANALYTICS_EVENTS`. `props` allowlists are separate constraints (`install_error` reasons, `install_step`, `filter_used`, `search`, `video_preview_play`, `tip_click` surface). `too_large` was added that way in `20261010120000_analytics_too_large.sql`. If the constraint does not mention the new value, the insert fails.

Privacy, implemented in `server/utils/analytics.ts` and `app/lib/analytics.ts`:

- No cookies and no stored visitor id.
- `visitor_hash` is SHA-256 of a daily UTC salt, the IP, and the user-agent. The raw IP and user-agent are not stored. The hash changes at UTC midnight.
- Do Not Track and Global Privacy Control skip the write (`dnt: 1`, `sec-gpc: 1`, `navigator.doNotTrack`, `navigator.globalPrivacyControl`).
- Prefetch requests and `?mockQuest=1` are not recorded.
- Production collects unless `ANALYTICS_ENABLED=false`. Local dev and Vercel preview stay off unless `ANALYTICS_ENABLED=true`.
- The browser cannot read or insert `analytics_events`. `POST /api/track` writes with the service role.

## Media and cost

Hosting stays on free tiers. Felipe is not paying for bandwidth.

Measured limits to stay inside:

- Vercel: Fast Origin Transfer 10 GB, Fast Data Transfer 100 GB, 1M CDN requests, deployment storage.
- Supabase: cached egress 5 GB, database 500 MB. The `port-covers` bucket already blew the egress quota (5–8 Oct 2026). That is why covers left Storage.
- Cloudflare Workers free CPU time is 10 ms per request. The preview Worker only parses a `Range` header and streams a slice. Do not decode video, recompress images, or buffer a whole MP4 or APK inside a Worker.

Consequences:

- Nothing heavy is served by Vercel. Catalog HTML is ISR (`nuxt.config.ts` `routeRules`, 1 hour, `passQuery`) so a view can be a CDN hit instead of origin transfer. API and `/admin/**` stay dynamic.
- Covers and previews come from `questports-media` (`NUXT_PUBLIC_MEDIA_BASE`, default `https://questports-media.questports.workers.dev`):
  - `/covers/<file>`
  - `/covers/thumbs/<file>`
  - `/previews/<slug>.mp4`
- Empty `NUXT_PUBLIC_MEDIA_BASE` means covers stay on this origin and MP4 previews turn off (`localVideoPreviewsEnabled`). Do not use that in production.
- APKs go through `questports-apk-proxy`. Do not stream them through `server/api/apk-proxy.get.ts` except as the explicit empty-base fallback.
- Never upload or serve covers from Supabase Storage.
- Cache: `vercel.json` and the `/covers/**` and `/previews/**` route rules set `public, max-age=31536000, immutable`. The media Worker `_headers` file does the same, plus CORS. Favicons and `/_nuxt/**` are cached for a year. After replacing a cover file, bump `COVER_CACHE_VERSION` in `coverUrl.ts` so `?v=` changes.
- NuxtLink prefetch is interaction only. `nuxt.config.ts` sets `experimental.defaults.nuxtLink.prefetchOn` to `{ visibility: false, interaction: true }` because Nuxt 4.5 otherwise downloads `/ports/<slug>/_payload.json` for every card that scrolls into view. `app/plugins/portPrefetch.client.ts` also ignores `pointerenter` when the pointer has not moved, so a resting mouse does not prefetch every card that slides underneath. Do not turn visibility prefetch back on.

`scripts/media/dist` is the Worker asset directory. A static-asset deploy **replaces the whole set**. `npm run media:deploy` refuses to upload if that directory is missing any file referenced by `public/covers`, `public/covers/thumbs`, `public/previews`, `AVAILABLE_VIDEO_PREVIEWS`, or a `/covers/...` path in `coverUrl.ts` (including the thumb `coverThumbUrl` would request).

### Deprecated scripts

Do not run these. Do not delete them. They are one-offs, and several still target Supabase Storage or the management API:

- `scripts/add-*.js` (`add-avp.js`, `add-carnage.js`, `add-galaxyquest.js`, `add-github-url.js`, `add-goldeneye.js`, `add-gothic2-update-gt2.js`, `add-gt2.js`, `add-gtasa.js`, `add-haloce.js`, `add-harrypotter.js`, `add-ironlung.js`, `add-nolf.js`, `add-perfectdark.js`, `add-qualyx.js`, `add-questsam.js`, `add-roadrash.js`, `add-simpsons.js`, `add-vicecity.js`)
- `scripts/update-galaxyquest-cover.js`, `scripts/update-gtasa-cover.js`, `scripts/update-vicecity-cover.js`
- `scripts/sync-covers.js` and `scripts/upload-og.js` — retired, they exit 1
- `scripts/migrate.js` — would run `full_setup.sql` against the project
- `scripts/download-all-previews.cjs` — `yt-dlp` into `public/previews`. Not the publish path

`scripts/sync-github-stats.js` is the supported version sync. Preview with `--dry-run`. The daily job is `.github/workflows/sync-releases.yml`. `scripts/verify-apk-packages.mjs` only reads a few KB of a remote APK via HTTP Range to check `packageName`; it does not write the catalog. `npm run build:og` (`scripts/build-modern-og.js`) regenerates the local share card. It does not upload.

## Add a port, a cover, or a preview

### Cover files

Cards use `aspect-[460/215]` (about 2.14:1). In `public/covers` today, 35 files are 460×215 and 19 are 920×430. New gameplay covers should be one of those two. Exceptions already in the tree, which are not the template for a new port: `questports-og.png` is the 1200×630 share card (the site serves that URL from `questports.vercel.app`, via `absoluteCoverUrl`), plus a few non-capsule images (1920×1080, 419×196, 272×366).

`npm run media:build` writes `scripts/media/dist` and does not modify `public/`:

- Covers wider than 600px are resized with Lanczos. JPEG quality 82, progressive. PNG optimized. Same filename and extension. If the new file is not smaller, the original bytes are kept.
- Thumbs are 120px wide JPEG. The thumb URL is the cover basename, not the port slug: `gran_turismo_2_vr.jpg` → `/covers/thumbs/gran_turismo_2_vr.jpg`. `ut99vr.png` and `ut99vr.jpg` share `thumbs/ut99vr.jpg` (59 covers, 58 thumbs). Most thumbs are 120×56. If the thumb file is missing, the build generates it.
- Previews, when `ffmpeg` is on PATH: H.264, CRF 30, preset `slow`, no audio, width at most 854, `yuv420p`, profile `main`, `+faststart`. If the re-encode is not smaller, the original MP4 is kept. If `ffmpeg` is missing, the MP4 is copied and the log says so.

Commit the source files. The dist directory is gitignored.

### Database row for the cover

New migration, not an edit of an old one:

```sql
update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/<file>'
where slug = '<slug>'
  and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/<file>';
```

`resolveCoverUrl` maps that host back to `/covers/<file>`, `withCoverVersion` adds `?v=`, and `prefixMediaBase` sends the request to `NUXT_PUBLIC_MEDIA_BASE`. A root-relative `/covers/<file>` also works. Old Storage URLs and the SteamGridDB ids in `STEAMGRID_COVERS` still map. New rows use the full media-host URL.

### One-click install

Add a `PORT_PACKAGE_CONFIGS` entry in `app/data/portPackageMap.ts` keyed by `slug`. Required shape is `PortPackageConfig`: `packageName` (Android application id), `installType` (`direct_apk`, `apk_and_assets`, or `pc_builder_required`), and the folders or `criticalFiles` the installer should look for. Copy the closest existing port. Without this entry the card cannot tell that the package is installed.

`internal_storage_path`, `installation_guide`, and `troubleshooting_notes` are columns, changed with an idempotent migration, not by a `scripts/add-*.js` file.

### Video preview

1. Add `public/previews/<slug>.mp4`. The filename is the port slug (`gran-turismo-2-vr.mp4`), which can differ from the cover filename (`gran_turismo_2_vr.jpg`).
2. Append that slug to `AVAILABLE_VIDEO_PREVIEWS`. `previewMp4Url` then requests `/previews/<slug>.mp4` on the media host. Hover waits `PREVIEW_HOVER_MS` (400) and only runs for a fine pointer.
3. YouTube, on the detail page, is click-to-play. Put the window in `GAME_VIDEO_PREVIEWS` twice when you have both keys: the slug and the `youtube_video_id`.

```ts
'time-crisis-vr': { start: '7:30', end: '8:30' },
'PGUc8b3VIu0': { start: '7:30', end: '8:30' },
```

`start` / `end` are `M:SS` or a number of seconds (`parseSeconds`). `youtubePreviewEmbed` turns them into `start` and `end` on `youtube-nocookie.com`. The iframe is created on click. A missing MP4 is fine: the detail page still uses YouTube.

### Publish media

```bash
npm run media:build
npm run media:test
npm run media:deploy:dry
# after Felipe is ready to upload:
# CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=42ef7aadef9e38f2860f59f826a090e9 npm run media:deploy
```

`media:deploy` runs the build, the guard, then `wrangler deploy` for Worker `questports-media`. It requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` equal to `42ef7aadef9e38f2860f59f826a090e9`. Any other account id is refused. The dry-run does not upload and does not need those variables.

Wrangler config is `scripts/media/wrangler.toml`: `compatibility_date = "2026-10-01"`, `workers_dev = true`, `preview_urls = false`, assets directory `./dist`, binding `ASSETS`, `html_handling = "none"`, `not_found_handling = "none"`, `run_worker_first = ["/previews/*"]`. `worker.js` runs only for previews so Safari can get `206` byte ranges. The account id is not stored in the toml.

`workers/questports-apk-proxy/` is the source of the live APK proxy (`worker.js` plus `wrangler.toml`, compatibility date `2026-10-01`). Optional Worker secret `GITHUB_TOKEN` (higher GitHub API rate limit). Nothing in `package.json` deploys it. Do not deploy it from a drive-by PR.

## Product and UX

Keep the site small. Do not add a feature unless current usage shows it is needed.

Cards carry very little: cover, category, status, title, developer, version, a two-line description, headset badges, and one verification line (`app/lib/verification.ts` `buildCardVerificationLabel`).

- Install count on the card is a usage count (`↓ 12 installs`), from approved one-click installs, all versions. It is not "this port works" and not "it is on your headset".
- `⚠ Issues` only when a **manual** report for this catalog version is `works_with_issues`. A one-click install never produces that label.
- `✓ Verified` is a manual `works` for the current `latest_version`. A muted install count can follow it.
- Do not add illustrations that look clickable and are not. Covers are real capsule art. Do not drop in Unsplash or generated "gameplay" as a stand-in. The Unsplash URLs in `seed.sql` are leftovers.
- Mobile has to work. Touch targets on small screens use at least 44px (`min-h-11`). Hover video does not run on touch.
- Quest Browser cannot install onto itself. Keep `QuestBrowserNotice`. Browsers without WebUSB (in-app browsers, iOS, non-Chromium desktop) keep `UnsupportedBrowserNotice`.
- The site stays English. Talk to Felipe in Portuguese when he writes in Portuguese. Code, UI strings, migrations, and commit messages stay English.

## Secrets

Never commit tokens, service-role keys, or `.env`. Names only:

| Name | Where |
| --- | --- |
| `SUPABASE_URL` | Public project URL. Also a GitHub Actions secret for the daily sync |
| `SUPABASE_KEY` | Anon/publishable key, `runtimeConfig.public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Vercel and the Actions secret. Never `public` |
| `VERIFICATION_ADMIN_SECRET` | Header for `POST /api/admin/verifications` |
| `ANALYTICS_SALT` | Optional. Else the server hashes the service role key |
| `ANALYTICS_ENABLED` | `true` / `false` override described above |
| `NUXT_PUBLIC_MEDIA_BASE` | Unset → media Worker. Empty → covers on this origin, no MP4s |
| `NUXT_PUBLIC_APK_PROXY_BASE` | Unset → APK Worker. Empty → Vercel `/api/apk-proxy` |
| `NUXT_PUBLIC_KOFI_URL` | Unset → `https://ko-fi.com/questports`. Empty → hide the tip line and the footer link |
| `APK_PROXY_MAX_BYTES` | Cap for the Vercel route only |
| `GITHUB_TOKEN` | Actions, `sync-github-stats.js`, and optional APK-proxy Worker secret |
| `CLOUDFLARE_API_TOKEN` | `npm run media:deploy` only |
| `CLOUDFLARE_ACCOUNT_ID` | Must be `42ef7aadef9e38f2860f59f826a090e9` to deploy |
| `SUPABASE_ACCESS_TOKEN` | Only the retired `scripts/migrate.js` / `add-github-url.js`. Do not use |

`.env.example` lists the same names with empty secrets.

## MCP (optional)

Checked against the docs on 2026-10-11. If those pages move, follow the current page.

Gemini CLI reads `mcpServers` in `~/.gemini/settings.json` or the project `.gemini/settings.json`. Remote HTTP servers use `httpUrl` (SSE uses `url`). Header and env values can reference `$VAR` or `${VAR}`. Do not paste a token into the file. Docs: [Gemini CLI MCP](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md).

Supabase's hosted server is `https://mcp.supabase.com/mcp` ([Supabase MCP](https://supabase.com/docs/guides/getting-started/mcp)). Their Gemini example requires Gemini CLI 0.20.2+ and `httpUrl`. Scope this repo with `project_ref=ccjteoxolasldhfgnoyx`. `read_only=true` until Felipe wants a write. Then `/mcp auth supabase`.

GitHub's remote server is `https://api.githubcopilot.com/mcp/` ([GitHub MCP](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md)). The read-only path is `https://api.githubcopilot.com/mcp/readonly`. Gemini CLI wants `httpUrl`, not the `url` field other editors use.

```json
{
  "mcpServers": {
    "supabase": {
      "httpUrl": "https://mcp.supabase.com/mcp?project_ref=ccjteoxolasldhfgnoyx&read_only=true"
    },
    "github": {
      "httpUrl": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

That block is not committed. It belongs in the local Gemini settings file.
