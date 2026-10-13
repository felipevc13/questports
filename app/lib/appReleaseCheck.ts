/**
 * On-demand read of the public QuestPorts app release.
 * The headset app still checks GitHub on its own schedule. This does not replace that.
 */

import { comparePortVersions } from './versionFormat'

export const APP_PACKAGE_NAME = 'app.questports'
export const APP_RELEASES_LATEST = 'https://api.github.com/repos/felipevc13/questports-app/releases/latest'

export interface AppReleaseView {
  latest: string | null
  apkUrl: string | null
  update: boolean
}

export function appSelfUpdateAvailable(
  current: string | null | undefined,
  latest: string | null | undefined
): boolean {
  const installed = String(current || '').trim()
  const remote = String(latest || '').trim()
  if (!installed || !remote || installed === 'mock') return false
  return comparePortVersions(installed, remote) < 0
}

export function parseLatestAppRelease(body: unknown, current: string | null | undefined): AppReleaseView {
  const record = body && typeof body === 'object' ? body as Record<string, unknown> : {}
  const tag = typeof record.tag_name === 'string' ? record.tag_name.trim() : ''
  const latest = tag || null
  let apkUrl: string | null = null
  const assets = Array.isArray(record.assets) ? record.assets : []
  for (const asset of assets) {
    if (!asset || typeof asset !== 'object') continue
    const row = asset as Record<string, unknown>
    const name = typeof row.name === 'string' ? row.name : ''
    const url = typeof row.browser_download_url === 'string' ? row.browser_download_url : ''
    if (name === 'QuestPorts.apk' && url.startsWith('https://')) apkUrl = url
  }
  return {
    latest,
    apkUrl,
    update: appSelfUpdateAvailable(current, latest)
  }
}
