# Send to Quest API

Shared contract for the QuestPorts site and the QuestPorts Android app. Base URL is the site origin (`https://questports.vercel.app` in production). Routes live under `/api/remote/*`.

The browser and the headset app never write the tables. Nuxt calls Supabase with the service role. Row level security is on and there are no anon or authenticated policies. Only SHA-256 hashes of `device_secret`, `browser_token`, and pairing codes are stored. The plaintext secret and token are returned once.

Apply these files in the Supabase SQL editor after merge. Do not run them from CI.

- `supabase/migrations/20261027050000_remote_install.sql`
- `supabase/migrations/20261027050100_analytics_remote_install.sql`
- `supabase/migrations/20261027113000_remote_device_accepting.sql` (`remote_devices.accepting_requests`, nullable)

Ready-made read queries are in `supabase/queries/remote_install.sql`.

## Feature flag

`NUXT_PUBLIC_REMOTE_INSTALL` defaults to off (`unset`, empty, or anything other than `true`, `1`, `on`, or `yes`). The button stays hidden and every `/api/remote/*` call returns `404 { "error": "disabled" }`.

It stays off by default because the tables do not exist until the SQL above is applied, and the public app build does not have Remote install yet. A visible button would fail for everyone.

Turn it on for the headset app with `NUXT_PUBLIC_REMOTE_INSTALL=true`. The Android app cannot send a preview header, so device routes need the env var.

The site can be previewed before that flip:

- `?remoteInstall=1` shows the button after hydration. Catalog HTML is cached, so the query is read in the browser and does not create a new CDN entry.
- Browser API calls from that page send `x-questports-remote-preview: 1`. The server treats that header as enabled for the request. Rate limits still apply.
- `?remoteInstall=1&remotePreview=pair|outdated|waiting|downloading|confirm|installed|queued|not-accepting|failed` draws the UI states without calling the API. Review only.

The button is only on one-click-eligible port pages (a package id in `portPackageMap.ts` and a real APK or GitHub releases asset). It is hidden in Quest Browser and inside the QuestPorts app webview. The USB Install button and the navbar Connect Quest control are unchanged.

## Auth

| Caller | Header |
| --- | --- |
| Headset app | `Authorization: Bearer <device_secret>` |
| Browser | `Authorization: Bearer <browser_token>` |

Optional heartbeat: `x-questports-app-version: 1.1.0`, or `app_version` in a JSON body. Any authenticated device call updates `last_seen_at` and, when a version is present, `app_version`.

Accept install requests, from the headset app only:

- Header `x-questports-accepting: 1` when the toggle is on, `0` when it is off. `true` / `false` are accepted too.
- A JSON body may include `"accepting": true` or `false`. If both are present and the body value parses, the body wins.
- Send it on every device-authenticated call, especially `GET /api/remote/requests` (the 30 second poll). Older builds omit both. The column stays null and the site does not treat that as off.
- A call that omits the field does not clear a value already stored.
- Browser tokens cannot set it. `GET /api/remote/device` and `GET /api/remote/requests/:id` return `accepting` as `true`, `false`, or `null`.

`remote_devices.accepting_requests` is that value. Apply `20261027113000_remote_device_accepting.sql` before the app starts sending the header. Until the column exists, the server ignores the write and the browser still sees `null`.

Errors are `{ "error": "<code>", "message": "<text>", ...extra }`.

| HTTP | `error` | When |
| --- | --- | --- |
| 400 | `invalid` | Missing model, version, slug, or status |
| 400 | `invalid_code` | Code is malformed, unknown, or already used |
| 400 | `expired` | Pairing code past its 10 minute life |
| 401 | `unauthorized` | Missing or revoked secret or token |
| 403 | `not_eligible` | Port is not one-click eligible, or the catalog has no APK |
| 404 | `disabled` | Flag off and no preview header |
| 404 | `not_found` | Unknown route, port, request, or browser |
| 409 | `app_outdated` | `device.app_version` is below `1.1.0` |
| 409 | `conflict` | Pairing code was claimed by a parallel request |
| 409 | `expired` | Install request past its 24 hour life |
| 409 | `closed` | Status change is not allowed |
| 429 | `rate_limited` | Hourly cap |
| 429 | `too_many_attempts` | Claim lockout |
| 429 | `queue_full` | Three active installs already waiting on this Quest |
| 500 | `unavailable` | Unexpected failure. The message does not include secrets |

## Headset app

### `POST /api/remote/device/register`

```json
{ "model": "Quest 3", "app_version": "1.1.0" }
```

```json
{ "device_id": "<uuid>", "device_secret": "<base64url>" }
```

`model` is required, at most 40 characters, letters, digits, spaces, `.`, `+`, and `-`. `app_version` is required. Ten registrations per hour per IP hash. Pairing is allowed on older versions so the site can show the update message. Queuing is not.

### `POST /api/remote/pair/code`

Returns `{ "code": "K7P-4QX", "expires_at": "<iso>" }`.

Six characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no `0`, `O`, `1`, or `I`), shown as `XXX-XXX`. Stored as the hash of the six characters without the dash. Lives 10 minutes. A code dies after it is claimed or after five submissions that match that hash. Ten codes per hour per device.

### `GET /api/remote/requests`

```json
{
  "requests": [
    {
      "id": "<uuid>",
      "port_slug": "lambda1vr",
      "title": "Lambda1VR (Half-Life 1)",
      "package_id": "com.drbeef.lambda1vr",
      "version": "v1.7.4",
      "apk_url": "https://questports-apk-proxy.questports.workers.dev/...",
      "cover_url": "https://...",
      "created_at": "<iso>",
      "status": "queued",
      "progress": null
    }
  ]
}
```

Active rows only: `queued`, `received`, `downloading`, and `awaiting_confirm`, not expired. `apk_url` is resolved on this request from `ports.port_download_url` through the APK proxy (`redirect=1`). A URL sent by the client is ignored and is never stored. `status` and `progress` are included so a restarted app can resume a download. The contract originally listed only queued and received; the extra statuses and fields are backward compatible.

Poll this on start, on resume, and every 30 seconds while the app is in the foreground. Also subscribe to the broadcast below.

### `POST /api/remote/requests/:id/status`

```json
{ "status": "downloading", "progress": 40, "error_reason": null, "detail": null }
```

Device statuses: `received`, `downloading`, `awaiting_confirm`, `installed`, `failed`, `cancelled`. `expired` is server-only.

Forward only: `queued` → `received` → `downloading` → `awaiting_confirm` → `installed`. `downloading` may repeat so progress can move. `failed` and `cancelled` are allowed from any non-terminal status. A terminal row returns `409 closed`. An expired active row is flipped to `expired` and returns `409 expired`.

`error_reason` on `failed` is the same set as USB `install_error`, including `signature_conflict` and `busy`. An unknown or missing reason is stored as `other`. `progress` is an integer from 0 to 100. `detail` is short display text.

### `GET /api/remote/browsers` and `DELETE /api/remote/browsers/:id`

List or revoke browsers paired to this headset. A browser label is derived from the User-Agent at claim time. The client's `browser_label` is not trusted.

## Browser

### `POST /api/remote/pair/claim`

```json
{ "code": "K7P-4QX" }
```

```json
{
  "browser_token": "<base64url>",
  "device": {
    "id": "<uuid>",
    "name": "Quest 3",
    "model": "Quest 3",
    "app_version": "1.1.0"
  }
}
```

`app_version` is extra compared with the first contract draft so the site can refuse to queue on an old app. The token is stored in `localStorage` (`questports_remote_browser`).

Wrong codes cannot increment one code's attempt counter, because only the hash is stored. Five failed claims from the same IP hash in 60 seconds return `429 too_many_attempts`. A submission that matches a stored hash still increments that code (maximum 5) and then marks it used.

### `POST /api/remote/requests`

```json
{ "port_slug": "lambda1vr" }
```

```json
{ "id": "<uuid>", "status": "queued", "needs_files": "true" }
```

`needs_files` is `"true"` or `"false"`. It is the same rule as the game-files drop zone: the port has a package config and is not a self-contained sideload (`direct_apk` with workflow `direct` and no external files). The value is also stored on `remote_install_requests.needs_files`. The device list does not include it. The headset does not need it to install the APK.

One-click eligibility is required. While an active request for this browser and slug exists, the same id is returned and no new rate-limit slot is used. Otherwise: 10 creates per hour per browser, at most 3 active requests per Quest, expiry 24 hours.

If `app_version` is missing, unparseable, or below `1.1.0`, the response is `409`:

```json
{
  "error": "app_outdated",
  "message": "Update the QuestPorts app on your Quest. Send to Quest needs 1.1.0 or newer.",
  "app_version": "1.0.108",
  "min_app_version": "1.1.0"
}
```

No request row is inserted. USB install stays available in the page.

### `GET /api/remote/requests/:id`

```json
{
  "id": "<uuid>",
  "status": "downloading",
  "progress": 40,
  "error_reason": null,
  "updated_at": "<iso>",
  "expires_at": "<iso>",
  "needs_files": true,
  "accepting": false,
  "last_seen": "<iso>"
}
```

`expires_at` and `needs_files` are extra. `needs_files` here is a JSON boolean from the row. Analytics uses the strings `'true'` and `'false'`. `accepting` is the headset toggle (`true`, `false`, or `null` when the app has not reported it). `last_seen` is the device heartbeat.

The page polls every 2 seconds while the request is active. If it is still `queued` after 60 seconds, the interval becomes 15 seconds, except while `accepting` is `false` (that stays at 2 seconds so turning the toggle on updates the card on the next poll). Polling pauses while the tab is hidden and resumes when it is visible. A 24 hour poll at 2 seconds would burn the Vercel invocation budget, so this backoff replaces a hard 10 minute cap.

While the request is `queued` and `accepting` is `false`, the card says "Your Quest isn't accepting installs" and does not spin. Cancel request and Forget this Quest stay. When a later poll returns `accepting: true` and the request is still under 60 seconds old, the waiting spinner comes back. At 60 seconds or more, with the toggle unknown or already on, the card says "Your Quest hasn't picked this up yet" until the status leaves `queued`. A missing `accepting` field is the unknown case, not "off".

### `POST /api/remote/requests/:id/cancel`

Browser auth. Cancels a non-terminal request. `{ "id", "status": "cancelled" }`. The device should stop if it has not committed the install. Posting a further status on a cancelled row returns `409 closed`.

### `GET /api/remote/device`

```json
{
  "device": {
    "id": "<uuid>",
    "name": "Quest 3",
    "model": "Quest 3",
    "last_seen": "<iso>",
    "app_version": "1.1.0",
    "accepting": null
  }
}
```

### `DELETE /api/remote/pairing`

Revokes this browser token. The page also clears local storage ("Forget this Quest").

## Realtime

After a request is inserted, the server POSTs a public broadcast. Failures are ignored. The app still polls.

```
POST {SUPABASE_URL}/realtime/v1/api/broadcast/qp-device-{device_id}/events/new_request
apikey: <service role>
Authorization: Bearer <service role>
{ "id": "<request uuid>" }
```

The channel is public (`private` is not set). The app subscribes with the anon key and no user session:

```ts
supabase.channel('qp-device-' + deviceId, { config: { private: false } })
  .on('broadcast', { event: 'new_request' }, (payload) => { /* payload is { id } */ })
```

The payload is only the request id. The app loads the APK URL from `GET /api/remote/requests`.

## App version

Minimum for queuing an install: `1.1.0` (`REMOTE_INSTALL_MIN_APP_VERSION`). `1.0.108` and `1.0.4` are below. Comparison uses the same numeric version parts as port versions. Empty or unparseable fails closed.

The pair modal tells anyone who does not see Remote install in the app that they need 1.1.0 or newer and links to `/app`. After pairing, an old `app_version` shows "Update the QuestPorts app on your Quest to use Send to Quest" and does not queue. The USB Install button stays on the page.

## Game files

`needs_files` answers whether a wireless transfer of the player's game files would matter. It does not change the install.

- `false`: self-contained sideload (QuestCraft). The APK is enough.
- `true`: the existing drop zone still applies (Lambda1VR, `/sdcard/xash/`). After a remote install the page says to use USB for those files. It does not promise a wireless copy.

Client events send `props.needs_files` as `'true'` or `'false'`, from `portNeedsUserFiles(slug)`. The server copies the request row's boolean into `install_success` when the device reports `installed`, so a closed browser tab still records it.

## Analytics

New event names, tracked with the existing helper. Props are allowlisted. A new name needs both `ANALYTICS_EVENTS` and the check constraint in the analytics migration.

| Event | Who writes it | Props |
| --- | --- | --- |
| `remote_send_click` | Browser | `paired` `true`/`false`, `needs_files` `true`/`false`, optional `blocked` `app_outdated` |
| `remote_pair_shown` | Browser | none |
| `remote_pair_success` | Browser | none |
| `remote_pair_fail` | Browser | `reason`: `invalid_code`, `expired`, `too_many_attempts`, `rate_limited`, `unavailable`, `disabled` |
| `remote_request_created` | Browser | `needs_files` `true`/`false` |
| `remote_status` | Server, when the device changes status | `status` (`received`, `downloading`, `awaiting_confirm`, `installed`, `failed`, `cancelled`, `expired`), optional `reason`, `progress`, `seconds` |
| `remote_app_outdated` | Browser | `surface`: `pair_modal`, `paired`, or `send`. Optional `app_version`, `min_app_version` |
| `install_success` | Server, when status becomes `installed` | `method` `remote`, `needs_files` `true`/`false`, optional `seconds` |

USB `install_success` rows stay unlabeled (`method` null). Queries treat `coalesce(props->>'method', 'usb') <> 'remote'` and `path <> '/app'` as USB. Progress-only `downloading` updates do not emit another `remote_status`.

`remote_request_created` is client-only, so it is not counted twice. `install_success` with `method=remote` is server-only and requires `needs_files`. A remote success without that prop is not labeled `remote`, so the insert still satisfies the check.

## What the first contract draft did not say

These additions are backward compatible. Old clients can ignore the extra JSON fields.

1. `GET /requests` also returns `downloading` and `awaiting_confirm`, plus `status` and `progress`.
2. Claim includes `device.app_version`.
3. Browser `GET /requests/:id` includes `expires_at` and `needs_files`.
4. `POST /requests/:id/cancel` for the browser.
5. `error_reason` uses the USB `install_error` set, which includes `signature_conflict` and `busy`.
6. Site poll is 2 seconds, then 15 seconds while still queued after 60 seconds, and pauses when the tab is hidden.
7. Wrong-code lockout is per IP hash (5 failures / 60 seconds). Matching codes still use the per-code attempt counter.
8. `POST /requests` is idempotent while an active request for that browser and port exists.
9. `409 app_outdated` below app `1.1.0`. Pairing still works.
10. Realtime broadcast is public. The REST body is `{ "id": "<uuid>" }`. The app channel uses `private: false`.
11. `needs_files` is an analytics prop and a column. It is not on the device request list.
12. Flag defaults off. `?remoteInstall=1` and the preview header turn the site on. The app needs `NUXT_PUBLIC_REMOTE_INSTALL=true`.
13. Browser label comes from the User-Agent.
14. Returning an existing active request does not consume a new hourly slot.
15. `x-questports-accepting` / JSON `accepting` on device calls. Browser responses include `accepting`. Null means the app has not reported the toggle.
