# QuestPorts

Resumo para o Felipe (o restante deste arquivo está em inglês de propósito: a interface do site, os commits e os outros agentes seguem em inglês):

- Não faça push na `main`. Branch, PR pequeno, `npm ci && npx vitest run` verde, e no corpo do PR o que foi testado (e prints, se mudou a UI).
- Banco: toda mudança vira SQL novo em `supabase/migrations/` (nome com data e hora). Não edite migration já aplicada. O agente só prepara o arquivo. Você aplica no SQL editor do Supabase **depois** do merge. Nenhum bot aplica isso. Projeto `ccjteoxolasldhfgnoyx`.
- Capas e vídeos **não** passam pela Vercel nem pelo Storage do Supabase. Arquivos em `public/covers`, `public/covers/thumbs` e `public/previews`. O deploy do Worker `questports-media` troca o conjunto inteiro e só sai quando você aprovar (`npm run media:deploy`; o dry-run é `npm run media:deploy:dry`). APKs saem pelo Worker `questports-apk-proxy`, não por função da Vercel.
- Papéis: Curador só pesquisa. Testador usa o Quest simulado e abre PR. Produto & UX analisa. Divulgação só rascunha, não publica.
- Não rode `scripts/add-*.js`, `scripts/update-*-cover.js`, `scripts/sync-covers.js`, `scripts/upload-og.js` nem os outros one-offs. Não apague esses arquivos.
- Cartão mostra pouca coisa. Contagem de installs pode aparecer a partir de 3. `⚠ Issues` fica na tabela, não no cartão, e só quando alguém marcou problema de verdade. Site em inglês. Você fala PT-BR; o agente pode te responder em português.
- Gorjeta: uma linha no sucesso da instalação e um link no rodapé. URL em `NUXT_PUBLIC_KOFI_URL` (vazio esconde). Evento `tip_click`. Migration `20261011180000_analytics_tip_click.sql` — aplicar no SQL editor depois do merge.
- Busca: apelidos em `app/data/searchAliases.ts` (não é coluna). Migration `20261027020000_analytics_catalog_search.sql` — aplicar no SQL editor depois do merge. Consultas prontas em `supabase/queries/catalog_search.sql`.
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

Felipe reviews and merges. Agents do not push to `main`, do not apply SQL to production, and do not deploy Workers. There is no bot that does those steps after merge. Stay on the free tiers: Vercel Hobby, Supabase free, and Cloudflare Workers free.

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
| `app/data/` | Catalog code that is not the database: package map, on-screen folders, offline copy of the catalog, covers, previews |
| `app/lib/` | Pure helpers (analytics, verification, version format, APK proxy, app bridge) |
| `app/plugins/analytics.client.ts` | Browser analytics batching |
| `app/plugins/portPrefetch.client.ts` | Drops fake hover prefetch while scrolling |
| `server/api/` | `track.post.ts`, `verifications.post.ts`, `admin/verifications.post.ts`, `apk-proxy.get.ts` (fallback only) |
| `server/utils/` | Service-role Supabase, analytics decisions, APK proxy gate |
| `public/covers/` | Cover source of truth (jpg/png). 85 files on `0003e66` (27 Oct 2026). Recount after adding one |
| `public/covers/thumbs/` | 120px JPEG thumbs. 84 files on that commit. `ut99vr.png` and `ut99vr.jpg` share `thumbs/ut99vr.jpg` |
| `public/previews/` | Hover MP4s, `<slug>.mp4`. 76 files, same slugs as `AVAILABLE_VIDEO_PREVIEWS` |
| `supabase/migrations/` | The only schema/data changes agents add |
| `supabase/schema.sql` | Canonical shape for a new database. Not a place to patch production |
| `supabase/seed.sql` | Historical seed. Still has Unsplash and Storage URLs. Do not apply it |
| `scripts/media/` | Build and deploy the media Worker |
| `workers/questports-apk-proxy/` | APK proxy Worker source. Not deployed by npm scripts |
| `scripts/sync-github-stats.js` | Daily version sync used by GitHub Actions |
| `tests/` | Vitest only. There is no install-flow end-to-end suite |
| `e2e/mobile-overflow.mjs` | Overflow check (`npm run test:mobile`). Not part of vitest |
| `.github/workflows/sync-releases.yml` | Daily 04:00 UTC GitHub release sync |

## Key files

- `app/composables/useQuestAdb.ts` — WebUSB/ADB singleton: connect, install, push game files, list folders. `?mockQuest=1` uses the simulator in `app/lib/mockQuest.ts`.
- `app/data/portPackageMap.ts` — `PORT_PACKAGE_CONFIGS`. Android `packageName`, optional `altPackages`, `installType` (`direct_apk`, `apk_and_assets`, `pc_builder_required`), and the folders or `criticalFiles` one-click install checks. `ports` has no install-type column. `isPortInstalledOnQuest` / `installedPackageOnQuest` only know packages listed here, including `altPackages`. `normalizeQuestPath` turns a stored path into `/sdcard/.../` (a value that starts with `N/A` becomes `''`).
- `app/data/expansions.ts` — `getPortCampaigns` / `getDefaultFolderInfo`. This is the folder the detail page shows. `PORT_EXPANSIONS[slug]` wins. Otherwise a hardcoded map inside `getDefaultFolderInfo` wins. `internal_storage_path` is used only when the slug is in neither, after `normalizeQuestPath`. Changing only the database column does not move the folder for a slug that is already in that file (WinlatorXR’s on-screen folder is `/sdcard/Download/` from the map, not from the column).
- `app/data/mockPorts.ts` — `INITIAL_PORTS`. Production reads Supabase when it is configured (`usePorts.ts`). This file is the offline fallback, the sitemap, the 404 popular links, and most catalog tests. Paths, guides, and credits are copied here. A change to those has to update this file in the same PR or the tests and the fallback stay on the old text. WinlatorXR’s mock row repeats `internal_storage_path: '/sdcard/Download/'` and its own `installation_guide`.
- `app/lib/patchOnlyInstall.ts` — `isOneClickApkAsset`, `refusesOneClickInstall`, `pcPatchCardFor`, `patchOnlyGuideFor`. One-click is not “any URL”.
- `app/data/coverUrl.ts` — `resolveCoverUrl`, `versionedCoverUrl`, `coverThumbUrl`, `DEFAULT_MEDIA_BASE`, `COVER_CACHE_VERSION`. Maps Storage URLs, media-host URLs, and SteamGridDB ids onto `/covers/...`, then adds `?v=` and the media host.
- `app/data/videoPreviews.ts` — `AVAILABLE_VIDEO_PREVIEWS`, `GAME_VIDEO_PREVIEWS`, `previewMp4Url`, YouTube embed helpers. MP4s stay off unless `mediaBase` is set. Touch never starts a hover preview (`canHoverPreview`).
- `app/data/searchAliases.ts` — extra search phrases keyed by port slug. Abbreviations and nicknames that are not in the title. See Search aliases below.
- `app/lib/catalogSearch.ts` — client-side catalog match: folded text, aliases, and a one-edit typo. No search service.
- `app/components/PortCard.vue` — Card UI. Cover, optional hover MP4, New / In Dev, title, Installed, one meta line, a short description when it fits. It does not print the version. The dense table prints it with `PortVersion.vue`.
- `app/pages/ports/[slug].vue` — Detail page: guide (`installation_guide`), troubleshooting, storage path, install, YouTube click-to-play.
- Analytics: `app/lib/analytics.ts` (event names and privacy rules), `app/composables/useTrack.ts`, `app/plugins/analytics.client.ts`, `server/utils/analytics.ts`, `server/api/track.post.ts`.
- App-mode bridge: `app/lib/appBridge.ts` (`window.QuestPortsApp`, user-agent `QuestPortsApp/<version>`), `app/composables/useAppBridge.ts` (real app after hydration; `?inApp=1` is the mock). The native wrapper installs with PackageInstaller instead of WebUSB. The bridge does not open URLs. Ko-fi links stay `target="_blank"`. In the app, the click uses `window.open(url, '_blank')` first (no `noopener` feature: Chrome returns null for that even when the tab opened) and then clears `opener`. If `open` returns null, the https URL is assigned so `shouldOverrideUrlLoading` can send it to the system browser (`app/lib/kofi.ts`).
- Quest Browser: `app/lib/questBrowser.ts`. Unsupported browsers: `app/lib/unsupportedBrowser.ts`.
- Versions: `app/lib/versionFormat.ts` (`formatPortVersion`, re-exported by `app/lib/portVersion.ts`). One leading `v` on semver-like tags (`1.0.84` and `vv1.0.84` both display as `v1.0.84`). Do not prefix another `v` in a template. Build names (`b004`, `cats27`) stay as names. Placeholders such as `Latest` are hidden. `PortCard.vue` does not render the version; `PortVersion.vue` does, on the dense table and anywhere else that imports it.
- APK routing: `app/lib/apkProxyPolicy.ts`. Default base `https://questports-apk-proxy.questports.workers.dev`. Empty `NUXT_PUBLIC_APK_PROXY_BASE` keeps `/api/apk-proxy` on this origin, which is capped (`APK_PROXY_MAX_BYTES`, default 150 MiB) because that path is a Vercel function.

## Dev, test, build

```bash
npm ci
npx vitest run
npm run dev          # http://localhost:3000
npm run build        # nuxt build
```

`npm test` is `vitest run`. That is the automated suite. `npm run test:mobile` runs `e2e/mobile-overflow.mjs` (layout overflow only) and is not part of vitest. There is no end-to-end test of the install flow.

Install states are checked by hand with the simulated headset. The script is the table in `TESTING.md`. `?mockQuest=1` is the only switch (`app/lib/mockQuest.ts`). `mockChrome=0` hides the Simulated Quest panel and leaves the simulation running, which is what screenshots use. Example: `/ports/rtcwquest?mockQuest=1&mockPhase=connected&mockGame=absent&mockChrome=0`. `mockQuest=0`, `false`, `off`, or `no` disables it. Leave the flag off and the page uses real WebUSB, including on a production build.

`?inApp=1` is a different flag. It pretends the page is inside the QuestPorts Android app (`ensureMockAppBridge` in `app/lib/appBridge.ts`) and is not a headset.

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
- Do not apply SQL, do not deploy Workers, and do not run the production GitHub sync from an agent. Felipe merges, then applies migrations in the Supabase SQL editor, and Felipe approves Worker deploys. Agents prepare the migration file and the PR. Nothing in CI, and no bot, applies production SQL or uploads `questports-media`. `scripts/migrate.js` is retired. A `questports-media` deploy replaces the whole asset set.

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

Event names are the check constraint `analytics_events_event_check`. The current list is `ANALYTICS_EVENTS` in `app/lib/analytics.ts`, last extended by `20261027020000_analytics_catalog_search.sql`:

`page_view`, `port_view`, `install_click`, `install_success`, `install_error`, `install_step`, `manual_download_click`, `github_click`, `suggest_submit`, `feedback_submit`, `filter_used`, `search`, `search_no_results`, `unsupported_browser_view`, `video_preview_play`, `tip_click`, `banner_shown`, `banner_click`, `banner_dismiss`, `modal_shown`, `modal_click`, `modal_dismiss`, `app_page_view`, `app_open`, `game_launch`, `app_download_click`, `search_result_click`, `game_request_shown`, `game_request_click`, `game_request_submit`.

`search` is still one settled query. It may also store `count`, `via` (`text`, `alias`, `fuzzy`, `none`), and `results` (slugs shown). Older rows that only have `q` and `length` stay valid. `search_no_results` is unchanged. `search_result_click` is a click on a result (`q`, `position`, `via`, and `port_slug`). `game_request_shown`, `game_request_click`, and `game_request_submit` (`result` `success` or `fail`) are the empty-state request. Ready-made reads are in `supabase/queries/catalog_search.sql`.

`page_view` may store `utm_source`, `utm_medium`, and `utm_campaign` (`cleanUtmValue`). `ref` wins over `utm_source` for the campaign token (`campaignRefFromSearch`). `game_launch` is the headset app opening an installed game (`port_slug` required). `app_download_click` is the QuestPorts app APK link; `props.surface` is `page`, `banner`, or `modal`.

The Quest Browser banner uses `banner_shown`, `banner_click`, and `banner_dismiss`. The desktop install modal uses `modal_shown`, `modal_click`, and `modal_dismiss`. `app_page_view` is a visit to `/app` with `props.source` (`banner`, `modal`, `nav`, `footer`, `direct`) and `props.device` (`quest`, `desktop`, `mobile`). Installing the app reuses `install_click` (start), `install_success` (ok), and `install_error` (fail) with path `/app` and `props.via` `page` or `modal`. The native app WebView sends `app_open` with `props.version` and `props.first`. A successful install on this browser sets `questports_app_installed` and hides the banner and the modal. `20261012130000_analytics_app_banner.sql` must not drop `analytics_events_install_step_check`: `20261013120000_analytics_install_step_surface.sql` is already applied and allows `install_step` `props.surface` to be null, `navbar`, or `install`.

A **new event name** needs a migration that drops and re-adds `analytics_events_event_check` (same pattern as the funnel migration) **and** a matching entry in `ANALYTICS_EVENTS`. `props` allowlists are separate constraints (`install_error` reasons, `install_step`, `filter_used`, `search`, `video_preview_play`, `tip_click` surface, `app_page_view` source and device, `app_open` version and first, `install_*` `via`, `page_view` utm fields, `app_download_click` surface). `too_large` was added that way in `20261010120000_analytics_too_large.sql`. If the constraint does not mention the new value, the insert fails.

Privacy, implemented in `server/utils/analytics.ts` and `app/lib/analytics.ts`:

- No cookies and no stored visitor id.
- `visitor_hash` is SHA-256 of a daily UTC salt, the IP, and the user-agent. The raw IP and user-agent are not stored. The hash changes at UTC midnight.
- Do Not Track and Global Privacy Control skip the write (`dnt: 1`, `sec-gpc: 1`, `navigator.doNotTrack`, `navigator.globalPrivacyControl`).
- Prefetch requests and `?mockQuest=1` are not recorded.
- Production collects unless `ANALYTICS_ENABLED=false`. Local dev and Vercel preview stay off unless `ANALYTICS_ENABLED=true`.
- The browser cannot read or insert `analytics_events`. `POST /api/track` writes with the service role.

## Media and cost

Stay on the free tiers. Felipe is not paying for bandwidth. Do not enable a paid Vercel, Supabase, or Cloudflare add-on.

Measured limits to stay inside:

- Vercel: Fast Origin Transfer 10 GB, Fast Data Transfer 100 GB, 1M CDN requests, deployment storage.
- Supabase: cached egress 5 GB, database 500 MB. The `port-covers` bucket already blew the egress quota (5–8 Oct 2026). That is why covers left Storage.
- Cloudflare Workers free CPU time is 10 ms per request. The preview Worker only parses a `Range` header and streams a slice. Do not decode video, recompress images, or buffer a whole MP4 or APK inside a Worker.

Consequences:

- Nothing heavy is served by Vercel. `/`, `/app`, `/library`, and `/ports/**` are on-demand ISR (`nuxt.config.ts` `routeRules`, `catalogIsrRule()` in `app/lib/isrCache.ts`: `expiration` 86400, `allowQuery: []`, `passQuery: false`). Query strings share one CDN entry. `?mockQuest=1` still works because the client reads `window.location` after hydration, and it does not fetch a fresh document. A new deploy starts a new cache. The 04:00 UTC release sync still lands within a day. `/api/**` and `/admin/**` stay dynamic (`isr: false`).
- Install counts are part of that HTML (`ports_install_count` in `usePorts.ts`). A cache HIT can show a count up to a day behind the database. The same delay applies to a guide or `latest_version` that changed only in Supabase.
- Check freshness with `curl -sI`. `x-vercel-cache: HIT` plus `age` means the edge is serving the stored document. `cache-control` on a 200 is `public, max-age=0, must-revalidate` (the browser revalidates; the edge still holds the ISR entry). There is no query-string cache buster.
- A `/ports/<slug>` visit before the row exists throws a fatal 404 (`createError` in `app/pages/ports/[slug].vue`). That response is on the same route rule. On 27 Oct 2026 a missing slug on production was stored by the edge (`x-vercel-cache: HIT`, `cache-control: no-cache`). Do not open the production URL until the row exists. A cached 404 clears when a new production deploy starts a new cache, or when the one-day expiration passes. To see the row without that cache, use `npm run dev`. A Vercel preview is a separate deployment and has its own cache.
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

### Search aliases

Catalog search folds case, accents, and punctuation, so `half life`, `half-life`, and `halflife` already match a title that says Half-Life. Roman numerals in a title match the digit (`Quake II` matches `quake 2`). Abbreviations and nicknames that are not in the title live in `app/data/searchAliases.ts`, keyed by port slug (`rdr` for `red-dead-redemption-vr`).

When you add a port, add a line in that map in the same change if people will search a name the title does not contain. One slug, a list of phrases. There is no `search_aliases` column. A short code (under 4 characters) matches as a whole word, so `hl` does not hide inside an unrelated word.

Matching runs in the browser (`app/lib/catalogSearch.ts`). A one-character typo still matches. Do not call a search service.

A search with no catalog match shows **Request this game**. That opens the existing suggestion form (`SuggestModal`, table `port_suggestions`) with the search filled in. The form still requires a title and a URL. It is the same insert as Suggest a port.

### Cover files

Cards use `aspect-[460/215]` (about 2.14:1). New art is a SteamGridDB horizontal capsule, 920×430 or the 460×215 size already in the tree, with no console branding. An older sentence in this file counted 35 files at 460×215 and 19 at 920×430. That split is stale. Recount before quoting it. Exceptions already in the tree, which are not the template for a new port: `questports-og.png` is the 1200×630 share card (the site serves that URL from `questports.vercel.app`, via `absoluteCoverUrl`), plus a few non-capsule images.

`npm run media:build` writes `scripts/media/dist` and does not modify `public/`:

- Covers wider than 600px are resized with Lanczos. JPEG quality 82, progressive. PNG optimized. Same filename and extension. If the new file is not smaller, the original bytes are kept.
- Thumbs are 120px wide JPEG (`THUMB_WIDTH`). The thumb URL is the cover basename, not the port slug: `gran_turismo_2_vr.jpg` → `/covers/thumbs/gran_turismo_2_vr.jpg`. `ut99vr.png` and `ut99vr.jpg` share `thumbs/ut99vr.jpg`. A 460/215 capsule becomes about 120×56. If the thumb file is missing, the build generates it. The build does not write a 460×215 derivative back into `public/`.
- Previews, when `ffmpeg` is on PATH: H.264, CRF 30, preset `slow`, no audio (`-an`), width at most 854 (`PREVIEW_MAX_WIDTH`), `yuv420p`, profile `main`, `+faststart`. The encoder does not trim to 15 seconds and does not force 640×360. If the re-encode is not smaller, the original MP4 is kept. If `ffmpeg` is missing, the MP4 is copied and the log says so.

Commit the source files. The dist directory is gitignored.

### Database row for the cover

New migration, not an edit of an old one:

```sql
update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/<file>'
where slug = '<slug>'
  and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/<file>';
```

Keep the file’s real extension. Metal Gear Solid is `metal-gear-solid-vr.jpg`, not `.png`. The filename is usually `<slug>.<ext>` and sometimes is not (`gran_turismo_2_vr.jpg` for slug `gran-turismo-2-vr`).

`resolveCoverUrl` maps that host back to `/covers/<file>`, `withCoverVersion` adds `?v=`, and `prefixMediaBase` sends the request to `NUXT_PUBLIC_MEDIA_BASE`. A root-relative `/covers/<file>` also works. Old Storage URLs and the SteamGridDB ids in `STEAMGRID_COVERS` still map. New rows use the full media-host URL.

The migration does not upload bytes. The image changes on the live site only after Felipe applies that SQL **and** the file is on `questports-media`. Upload the media before the site deploy that references a new filename. Felipe applies the SQL after merge. Agents do not do either.

### One-click install

One-click exists only when both are true (`refusesOneClickInstall` in `app/lib/patchOnlyInstall.ts`):

- `PORT_PACKAGE_CONFIGS[slug].packageName` is set. No entry means a manual or PC port. The install button stays off. `isPortInstalledOnQuest` cannot see the package either.
- `port_download_url` is a real APK asset: a `.apk`, a `.zip` the proxy can unwrap, or a GitHub releases URL with no file extension (`isOneClickApkAsset`). `installType: 'pc_builder_required'` also refuses one-click, even with a package id.

`port_download_url` is the Quest build’s fixed GitHub release asset (`browser_download_url`), not a SideQuest app page and not an itch.io page. Before changing a link, confirm the bytes download and that they are the Quest build, not the PC build. `pickPreferredReleaseDownload` in `server/utils/apkAssetPicker.ts` scores filenames (`quest`, `openxr`, `vr`) and penalizes `windows`, `pico`, and `pc`. A `/releases/latest` page can still resolve, and it can also resolve to the wrong asset when the newest release is PC-only.

Read the Android package id from the APK the user actually downloads, not from the filename. `scripts/verify-apk-packages.mjs` does that with HTTP Range (ZIP central directory plus `AndroidManifest.xml`, a few KB). It does not write the catalog.

```bash
node scripts/verify-apk-packages.mjs ports.json
# ports.json = [{ "slug", "port_download_url" }]
# GITHUB_TOKEN=... raises the GitHub API limit. Optional.
```

It prints `OK` when the manifest package equals `packageName`, `ALT_ONLY` when it equals an `altPackages` entry, `MISMATCH` otherwise, and `UNVERIFIED` when the URL is not an APK it can read. `altPackages` are older or sibling ids that still count as installed (`installedPackageOnQuest`). OpenMW’s id in the map is `org.openmw.vr`.

The APK proxy allowlist is `APK_PROXY_ALLOWED_HOSTS` in `server/utils/apkAssetPicker.ts`, copied in `workers/questports-apk-proxy/worker.js`: `github.com`, the GitHub release CDNs, `sidequestvr.com`, `goldeneyevr.com`, `lambda1vr.com`, `doom3quest.com`, `questzdoom.com`, `ut99vr.pages.dev`, `ppsspp.org`. itch.io is not on that list. A SideQuest host is allowlisted for a direct `.apk` URL only. An HTML listing (`sidequestvr.com/app/...`, an itch.io page) fails `isOneClickApkAsset` because it is not an `.apk`, a `.zip`, or a GitHub releases path. Do not store one as `port_download_url`. Itch download links are short-lived signed URLs, which is why that host stays off the proxy.

`installType` is code, not a column. Say it in the guide as well as in the map:

- `direct_apk` — the APK is enough to play.
- `apk_and_assets` — the player still supplies game files or a ROM.
- `pc_builder_required` — a PC tool builds or installs the port. The short card is the shared “Step 1: Automated PC Builder Required” block in `app/pages/ports/[slug].vue` (the paragraph is the GTA / Vice City wording for every slug with this type). The button is “Open PC Builder & Instructions (GitHub)”. The long guide stays lower on the page.

Crazy Taxi is the xdelta case, not `pc_builder_required`. `pcPatchCardFor` shows “Step 1: PC patch required” and “Open Patch Instructions (GitHub)”. The steps in `CRAZY_TAXI_INSTALL_STEPS` follow that repo’s README. QuestPorts does not install the patch.

There is no “Check Headset” button and no “install a local APK” button. `tests/patch-only-install.test.ts` asserts the pages do not contain `Check Headset`. Do not add either control back. This site is not a generic APK installer.

For a new port, in the same PR:

1. Package id from the real APK, in `portPackageMap.ts`, plus `altPackages` when older ids still exist. Declare `installType`.
2. Folders and `criticalFiles` copied from that port’s README and code. PRs [#5](https://github.com/felipevc13/questports/pull/5), [#6](https://github.com/felipevc13/questports/pull/6), and [#8](https://github.com/felipevc13/questports/pull/8) had invented paths. The corrections that are in the tree now: Aliens versus Predator is ready on `avp_huds/alien.rif`, `avp_rifs/temple.rif`, and `fastfile/ffinfo.txt` (`gamedata.ff` does not count). Vice City’s package id is `com.miamivr.quest` (`com.rockstargames.gtavc` is only an `altPackages` entry). Time Crisis VR is `direct_apk` with empty `criticalFiles` because the release APK already bundles the ROM. Do not ask the player for that ROM.
3. The on-screen folder in `expansions.ts` (`PORT_EXPANSIONS` or the `getDefaultFolderInfo` map), and the same path and credits in `mockPorts.ts`.
4. Cover, thumb, and, when Quest footage exists, a preview registered in `AVAILABLE_VIDEO_PREVIEWS`.
5. English `installation_guide` that follows the README and matches the `latest_version` you are listing. Nothing in the code checks that the guide text and the version still agree. When the sync bumps `latest_version`, re-read the guide.
6. `pc_builder_required` only when the port really has no installable Quest APK and needs the PC tool. A ROM the player must supply is `apk_and_assets`, not `direct_apk`. Smash Remix (`smash-remix-vr`) is already `apk_and_assets` with `packageName` `com.ssb64.recompiled` and empty `criticalFiles`. It is not `direct_apk`. Empty `criticalFiles` means the installer is not checking a ROM file yet. Do not “fix” that data in a docs PR.

The testing agent checks the catalog with `?mockQuest=1`. Felipe is the one who installs on a Quest.

### Android/data

ADB often cannot list `Android/data/<package>/files`. `verifyFolderOnQuest` sets `needsUserConfirm` when `acceptance` is `'confirm'`, or when every candidate listing was denied and no required file was found (`listingDenied`). The card then shows **I already imported the files** (`confirmImportedFiles` in `app/pages/ports/[slug].vue`). The copy for a denied listing is `confirmCopy`: USB cannot list the folder, and a stray file somewhere else is not enough.

Some ports have to be opened once so Android creates the app folder. Do not `mkdir` `files/` by hand. Vice City’s `fileGuidance` says that in those words: launch once, do not create `Android/data/com.miamivr.quest/files` yourself, then copy into `files/gamedata/`. GoldenEye and Harry Potter say the same pattern. `normalizeQuestPath` is applied to `internal_storage_path` only in that fallback (`Android/data/...` becomes `/sdcard/Android/data/.../`; a value that starts with `N/A` becomes empty). Folders written in `portPackageMap.ts` are already absolute and do not pass through it.

### Video preview

1. Add `public/previews/<slug>.mp4`. The filename is the port slug (`gran-turismo-2-vr.mp4`), which can differ from the cover filename (`gran_turismo_2_vr.jpg`). Commit about 15 seconds of Quest gameplay, no menus, no audio. 640×360 is a good source size. The media build does not enforce either number. It strips audio and caps width at 854.
2. Append that slug to `AVAILABLE_VIDEO_PREVIEWS`. `previewMp4Url` then requests `/previews/<slug>.mp4` on the media host. Hover waits `PREVIEW_HOVER_MS` (400) and only runs for a fine pointer. A port with no Quest footage stays off this list and shows the cover only. That is the case for `magic-carpet-vr`, `animal-crossing-vr`, and `descent-3-vr` (`hasVideoPreview` is false). `red-dead-redemption-vr` is on the list and has `public/previews/red-dead-redemption-vr.mp4`. Mega Man 64 is not a slug in this repo.
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

Upload the media **before** the site deploy that references a new file. The catalog asks for a preview as soon as its slug is in `AVAILABLE_VIDEO_PREVIEWS`, so a merge that lands first makes visitors request a file that is not uploaded yet. `worker.js` answers a missing preview with `Cache-Control: no-store` for that reason. A missing cover is still stamped `immutable` by `_headers`, which cannot match on status, so order matters more there.

Wrangler config is `scripts/media/wrangler.toml`: `compatibility_date = "2026-10-01"`, `workers_dev = true`, `preview_urls = false`, assets directory `./dist`, binding `ASSETS`, `html_handling = "none"`, `not_found_handling = "none"`, `run_worker_first = ["/previews/*"]`. `worker.js` runs only for previews so Safari can get `206` byte ranges. The account id is not stored in the toml.

`workers/questports-apk-proxy/` is the source of the live APK proxy (`worker.js` plus `wrangler.toml`, compatibility date `2026-10-01`). Optional Worker secret `GITHUB_TOKEN` (higher GitHub API rate limit). Nothing in `package.json` deploys it. Do not deploy it from a drive-by PR.

## Product and UX

Keep the site small. Do not add a feature unless current usage shows it is needed.

`PortCard.vue` carries very little: cover, New or In Dev, title, Installed, one meta line (`buildCatalogCardMeta`), and a description only when it is at most 46 characters (`CARD_DESCRIPTION_MAX`). Category, developer, and version are on the dense table. The table’s verification line is `VerificationBadge` → `buildCardVerificationLabel`. The card itself does not render `⚠ Issues`.

- Versions on screen go through `formatPortVersion`. A stored `vv1.2` displays as `v1.2`. Do not add another `v` in a template. `latest_version` in the database already has one leading `v` for semver-like tags.
- `✓ Verified` is only an approved manual `source = 'manual'` and `result = 'works'` whose `tested_version` matches the current `latest_version` (`portVerificationSignal`). A one-click install never produces it. Do not hard-code the badge. The card shows it only when that signal is `verified`. A muted install count can follow it on the table (`buildCardVerificationLabel`). On the card, the install count is a usage count and only at 3 or more (`CATALOG_CARD_INSTALL_MIN`). It is not “this port works” and not “it is on your headset”.
- `⚠ Issues` is the dense table’s `VerificationBadge` line, and only when a **manual** report for this catalog version is `works_with_issues`. A one-click install never produces that label. The detail page does not use `VerificationBadge`. Its “✓ Verified on Quest” pill means `currentDetectedCampaign.exists` (ADB listed the required files). The confirm button’s alternate pill is “Confirmed by you — not verified over USB”. Do not treat that pill as the catalog badge.
- Sort, in `app/lib/catalogSort.ts`, default `recent`: **Recently updated** (`last_github_update`), **Newest** (`created_at`; the menu does not say “Recently added”), **A–Z**, **Most installed** (the install count, highest first; the card hides counts under 3, the sort does not). There is no Featured sort. A stored `featured` value sorts as installs (`LEGACY_CATALOG_SORT_ALIASES`). The `featured` column still exists. The fetch orders by it before the client sort, and `error.vue` uses it for four links. Cards do not show a Featured badge.
- **New** is once per visit (`app/lib/catalogVisit.ts`, `isPortNew`, `localStorage` key `questports_last_visit`). The stamp is written on `pagehide` and after 30 seconds, and the open visit keeps the stamp it read. A first visit treats `created_at` within 7 days as new. Installed ports hide New. **In Dev** is `status === 'in_development'`, separate from New.
- List a game only when it already exists on another platform and someone ported or injected it onto Quest. Do not list a Quest-original game. Nothing in the schema enforces that. `original_game` on the TypeScript `Port` type has no migration.
- Guides stay in English and follow the project README. They have to describe the listed `latest_version`, not an older APK the guide was written for.
- Quest Browser visitors get the banner in `app/lib/questAppBanner.ts` (“Install games right from your Quest — get the QuestPorts app”, href `/app`). It stays off inside the app, on phones, after dismiss, and after this browser has installed the app. The desktop modal is `app/lib/questAppModal.ts`. `/app` (`app/data/questPortsApp.ts`) is the install page. Steer headset visitors to the app. The app installs catalog ports on the Quest and updates itself from `github.com/felipevc13/questports-app`. Do not add a second download path.
- Do not add illustrations that look clickable and are not. Covers are real capsule art. Do not drop in Unsplash or generated "gameplay" as a stand-in. The Unsplash URLs in `seed.sql` are leftovers.
- Mobile has to work. Touch targets on small screens use at least 44px (`min-h-11`). Hover video does not run on touch.
- Quest Browser cannot install onto itself. Keep `QuestBrowserNotice`. Browsers without WebUSB (in-app browsers, iOS, non-Chromium desktop) keep `UnsupportedBrowserNotice`.
- The site stays English. Talk to Felipe in Portuguese when he writes in Portuguese. Code, UI strings, migrations, and commit messages stay English.

## Agent roles

These are process, not code.

| Role | What they do |
| --- | --- |
| Curador | Scouting and curation. Read-only. Does not edit the catalog. |
| Testador | Exercises the catalog with `?mockQuest=1` and opens a PR. Does not push to `main` and does not touch production. |
| Produto & UX | Reads the product and writes the analysis. Does not ship a feature from that analysis alone. |
| Divulgação | Drafts promo copy. Does not publish it. |

Felipe merges, applies SQL, approves media deploys, and tests on a real Quest.

## Vercel preview

Each PR gets a Preview link from `vercel[bot]` on the GitHub comment, and the Vercel check points at the same deployment. On 27 Oct 2026 an anonymous request to a preview host (`questports-git-…vercel.app`, PR #98) returned 302 to `https://vercel.com/sso-api` and then the Vercel login page. Deployment Protection is on. Someone without a Vercel login on this team cannot open the preview. Felipe can.

`isAnalyticsEnabled` keeps analytics off when `VERCEL_ENV` is `preview` or `development`, unless `ANALYTICS_ENABLED=true`.

`?mockQuest=1` is client-side, so it works on a preview after the HTML loads. The APK proxy base defaults to the public Worker `https://questports-apk-proxy.questports.workers.dev` (`NUXT_PUBLIC_APK_PROXY_BASE` unset). That host is not behind the preview login. The preview page that calls it is. This pass could not load the preview HTML, so the mock and a real proxy download were not clicked through there.

## Quest app and the headset

This repo has no Android project. `?inApp=1` is the only app simulator here. It installs `createMockQuestPortsApp` and then behaves like the bridge (download progress, then success). The real bridge is `window.QuestPortsApp` plus user-agent `QuestPortsApp/<version>`, which exists only inside the installed app. `ensureMockAppBridge` leaves a real bridge alone.

The public release repo is [felipevc13/questports-app](https://github.com/felipevc13/questports-app). Its README says the source is private, the download is `QuestPorts.apk` from the latest release, the first install is Quest Browser → Files → Package Installer, and the app updates itself. The site copy in `questPortsApp.ts` still says the first install is from a PC with Developer Mode. Do not rewrite one to match the other unless Felipe asks. Neither document describes an Android emulator, and this repo has no emulator script. Do not invent that path.

What only Felipe can confirm on a headset: the USB debugging prompt, an `Android/data` listing that ADB cannot read, the PackageInstaller permission, Quest Browser, and the real `window.QuestPortsApp` bridge. Agents stop at `?mockQuest=1` and `?inApp=1`.

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
