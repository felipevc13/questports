import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { clientAnalyticsPayload } from '../app/lib/analytics'
import {
  INSTALL_BUTTON_CLASS,
  INSTALL_BUTTON_CLASS_WITH_SEND,
  REMOTE_INSTALL_MIN_APP_VERSION,
  REMOTE_APP_OUTDATED_TITLE,
  formatPairCode,
  gameFilesPathForSlug,
  isRemotePairCode,
  needsFilesProp,
  portNeedsUserFiles,
  remoteAppOutdatedDetail,
  remoteAppSupportsInstall,
  remoteFilesNote,
  remoteInstallFlagEnabled,
  remotePollDelayMs,
  remotePreviewFromSearch,
  remoteStatusTransition,
  remoteStatusView,
  sendToQuestLabel,
  showSendToQuestDecision
} from '../app/lib/remoteInstall'
import {
  createMemoryRemoteRepository,
  createStaticCatalog,
  dispatchRemote,
  remoteBroadcastUrl,
  type RemoteAnalyticsRow,
  type RemoteCatalogPort,
  type RemoteDeps
} from '../server/utils/remoteInstall'
import { sha256Hex } from '../server/utils/analytics'

const CATALOG_APK = 'https://questports-apk-proxy.questports.workers.dev/api/apk-proxy?url=https%3A%2F%2Fgithub.com%2Forg%2Frepo%2Freleases%2Fdownload%2Fv1%2Fgame.apk&redirect=1'

function catalogPort(slug: string, eligible: boolean): RemoteCatalogPort {
  return {
    slug,
    title: slug === 'lambda1vr' ? 'Lambda1VR' : 'QuestCraft',
    version: 'v1.0.0',
    packageId: eligible ? 'com.example.game' : '',
    apkUrl: eligible ? CATALOG_APK : '',
    coverUrl: 'https://questports-media.questports.workers.dev/covers/questcraft.jpg?v=4',
    eligible,
    needsFiles: portNeedsUserFiles(slug),
    filesPath: gameFilesPathForSlug(slug)
  }
}

function harness() {
  const analytics: RemoteAnalyticsRow[] = []
  const nudges: Array<{ deviceId: string; requestId: string }> = []
  let now = new Date('2026-10-27T12:00:00.000Z')
  const deps: RemoteDeps = {
    enabled: true,
    repo: createMemoryRemoteRepository(),
    catalog: createStaticCatalog({
      questcraft: catalogPort('questcraft', true),
      lambda1vr: catalogPort('lambda1vr', true),
      'red-dead-redemption-vr': catalogPort('red-dead-redemption-vr', false)
    }),
    now: () => now,
    hash: sha256Hex,
    newId: (() => {
      let n = 0
      return () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`
    })(),
    newSecret: (() => {
      let n = 0
      return () => `secret-${++n}-abcdefghijklmnopqrstuvwxyz`
    })(),
    newCode: () => 'K7P4QX',
    salt: 'test-salt',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/120.0.0.0 Mobile',
    clientIp: '203.0.113.10',
    nudge: async (deviceId, requestId) => {
      nudges.push({ deviceId, requestId })
    },
    recordAnalytics: async (row) => {
      analytics.push(row)
    }
  }
  return {
    deps,
    analytics,
    nudges,
    advance(ms: number) {
      now = new Date(now.getTime() + ms)
    }
  }
}

async function call(
  deps: RemoteDeps,
  method: string,
  path: string,
  body?: unknown,
  authorization?: string,
  appVersionHeader?: string
) {
  return dispatchRemote({
    method,
    path,
    body: body ?? null,
    authorization: authorization ? `Bearer ${authorization}` : null,
    appVersionHeader: appVersionHeader || null
  }, deps)
}

async function pair(deps: RemoteDeps, appVersion = '1.1.0') {
  const registered = await call(deps, 'POST', 'device/register', { model: 'Quest 3', app_version: appVersion })
  const deviceId = registered.body?.device_id
  const secret = registered.body?.device_secret
  const code = await call(deps, 'POST', 'pair/code', null, String(secret))
  const claimed = await call(deps, 'POST', 'pair/claim', { code: code.body?.code })
  return {
    registered,
    code,
    claimed,
    secret: String(secret),
    token: String(claimed.body?.browser_token),
    deviceId: String(deviceId)
  }
}

describe('Send to Quest rules', () => {
  it('keeps the USB button class and only swaps emphasis when Send is visible', () => {
    expect(INSTALL_BUTTON_CLASS).toBe(
      'flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90'
    )
    expect(INSTALL_BUTTON_CLASS_WITH_SEND).toContain('md:bg-primary')
    expect(INSTALL_BUTTON_CLASS_WITH_SEND.startsWith('order-2')).toBe(true)
    expect(remoteInstallFlagEnabled(undefined)).toBe(false)
    expect(remoteInstallFlagEnabled('true')).toBe(true)
    expect(showSendToQuestDecision({
      ready: true,
      questBrowser: false,
      inApp: false,
      eligible: true,
      flag: false,
      search: ''
    })).toBe(false)
    expect(showSendToQuestDecision({
      ready: true,
      questBrowser: false,
      inApp: false,
      eligible: true,
      flag: false,
      search: '?remoteInstall=1'
    })).toBe(true)
    expect(showSendToQuestDecision({
      ready: true,
      questBrowser: true,
      inApp: false,
      eligible: true,
      flag: true,
      search: '?remoteInstall=1'
    })).toBe(false)
    expect(showSendToQuestDecision({
      ready: true,
      questBrowser: false,
      inApp: true,
      eligible: true,
      flag: true,
      search: ''
    })).toBe(false)
    expect(showSendToQuestDecision({
      ready: true,
      questBrowser: false,
      inApp: false,
      eligible: false,
      flag: true,
      search: '?remoteInstall=1'
    })).toBe(false)
  })

  it('marks game-file ports the same way the drop zone does', () => {
    expect(portNeedsUserFiles('questcraft')).toBe(false)
    expect(needsFilesProp('questcraft')).toBe('false')
    expect(portNeedsUserFiles('lambda1vr')).toBe(true)
    expect(needsFilesProp('lambda1vr')).toBe('true')
    expect(gameFilesPathForSlug('lambda1vr')).toBe('/sdcard/xash/')
    expect(remoteFilesNote('/sdcard/xash/')).toContain('/sdcard/xash/')
    expect(remoteFilesNote('/sdcard/xash/')).toContain('cannot copy')
  })

  it('treats app versions below 1.1.0 as too old to queue', () => {
    expect(REMOTE_INSTALL_MIN_APP_VERSION).toBe('1.1.0')
    expect(remoteAppSupportsInstall('1.0.108')).toBe(false)
    expect(remoteAppSupportsInstall('1.0.4')).toBe(false)
    expect(remoteAppSupportsInstall('1.1.0')).toBe(true)
    expect(remoteAppSupportsInstall('1.2')).toBe(true)
    expect(remoteAppSupportsInstall('')).toBe(false)
    expect(remoteAppOutdatedDetail('1.0.4')).toContain('1.1.0')
    expect(remoteAppOutdatedDetail('1.0.4')).toContain('1.0.4')
    expect(remoteAppOutdatedDetail('1.0.4')).toContain('USB install')
    expect(REMOTE_APP_OUTDATED_TITLE).toBe('Update the QuestPorts app on your Quest to use Send to Quest')
    expect(sendToQuestLabel(null, false)).toBe('Send to Quest')
    expect(sendToQuestLabel('Quest 3', true)).toBe('Send to Quest 3')
    expect(isRemotePairCode('K7P4QX')).toBe(true)
    expect(isRemotePairCode('K7P0QX')).toBe(false)
    expect(formatPairCode('k7p4qx')).toBe('K7P-4QX')
    expect(remotePreviewFromSearch('?remotePreview=pair')).toBeNull()
    expect(remotePreviewFromSearch('?remoteInstall=1&remotePreview=downloading')).toBe('downloading')
    expect(remoteStatusTransition('queued', 'downloading')).toBe(true)
    expect(remoteStatusTransition('installed', 'failed')).toBe(false)
    expect(remotePollDelayMs({ status: 'queued', ageMs: 1000, hidden: false })).toBe(2000)
    expect(remotePollDelayMs({ status: 'queued', ageMs: 90_000, hidden: false })).toBe(15000)
    expect(remotePollDelayMs({ status: 'installed', ageMs: 1000, hidden: false })).toBeNull()
    const queued = remoteStatusView({
      status: 'queued',
      progress: null,
      errorReason: null,
      model: 'Quest 3',
      title: 'QuestCraft',
      version: 'v6.0.0',
      lastSeen: '2020-01-01T00:00:00.000Z',
      now: Date.parse('2026-10-27T12:00:00.000Z'),
      needsFiles: false,
      filesPath: ''
    })
    expect(queued.title).toContain('Queued')
    expect(queued.detail).toContain('24 hours')
  })

  it('stores needs_files on the remote analytics events', () => {
    expect(clientAnalyticsPayload('remote_send_click', {
      portSlug: 'lambda1vr',
      props: { paired: true, needs_files: 'true' }
    })?.props).toEqual({ paired: true, needs_files: 'true' })
    expect(clientAnalyticsPayload('remote_send_click', {
      portSlug: 'questcraft',
      props: { paired: false }
    })).toBeNull()
    expect(clientAnalyticsPayload('remote_request_created', {
      portSlug: 'lambda1vr',
      props: { needs_files: true }
    })?.props).toEqual({ needs_files: 'true' })
    expect(clientAnalyticsPayload('install_success', {
      portSlug: 'lambda1vr',
      props: { method: 'remote', needs_files: 'true' }
    })?.props).toEqual({ method: 'remote', needs_files: 'true' })
    expect(clientAnalyticsPayload('install_success', {
      portSlug: 'lambda1vr',
      props: { method: 'remote' }
    })?.props ?? null).toBeNull()
    expect(clientAnalyticsPayload('remote_app_outdated', {
      portSlug: 'questcraft',
      props: { surface: 'pair_modal', app_version: '1.0.4', min_app_version: '1.1.0' }
    })?.props).toEqual({ surface: 'pair_modal', app_version: '1.0.4', min_app_version: '1.1.0' })
  })
})

describe('Send to Quest API', () => {
  it('pairs, queues from the catalog, and ignores a client APK url', async () => {
    const { deps, nudges, analytics } = harness()
    const session = await pair(deps)
    expect(session.code.body?.code).toBe('K7P-4QX')
    expect(session.claimed.status).toBe(200)
    expect(session.claimed.body?.device).toMatchObject({ model: 'Quest 3', app_version: '1.1.0' })
    expect(JSON.stringify(session.claimed.body)).not.toContain('token_hash')
    expect(session.token.startsWith('secret-')).toBe(true)

    const created = await call(deps, 'POST', 'requests', {
      port_slug: 'questcraft',
      apk_url: 'https://evil.example/game.apk'
    }, session.token)
    expect(created.status).toBe(200)
    expect(created.body?.needs_files).toBe('false')
    expect(nudges).toHaveLength(1)
    expect(remoteBroadcastUrl('https://ccjteoxolasldhfgnoyx.supabase.co', nudges[0]!.deviceId))
      .toContain('/realtime/v1/api/broadcast/qp-device-')

    const again = await call(deps, 'POST', 'requests', { port_slug: 'questcraft' }, session.token)
    expect(again.body?.id).toBe(created.body?.id)

    const queue = await call(deps, 'GET', 'requests', null, session.secret)
    const requests = queue.body?.requests as Array<Record<string, unknown>>
    expect(requests).toHaveLength(1)
    expect(requests[0]?.apk_url).toBe(CATALOG_APK)
    expect(String(requests[0]?.apk_url)).not.toContain('evil.example')
    expect(requests[0]?.package_id).toBe('com.example.game')

    const files = await call(deps, 'POST', 'requests', { port_slug: 'lambda1vr' }, session.token)
    expect(files.body?.needs_files).toBe('true')
    expect(analytics.some(row => row.event === 'install_success')).toBe(false)

    const listed = await call(deps, 'GET', 'requests', null, session.secret)
    const lambda = (listed.body?.requests as Array<Record<string, unknown>>).find(row => row.port_slug === 'lambda1vr')
    const updated = await call(deps, 'POST', `requests/${lambda?.id}/status`, {
      status: 'installed'
    }, session.secret, '1.1.0')
    expect(updated.status).toBe(200)
    const success = analytics.find(row => row.event === 'install_success')
    expect(success?.props).toMatchObject({ method: 'remote', needs_files: 'true' })
    expect(analytics.some(row => row.event === 'remote_status' && row.props?.status === 'installed')).toBe(true)
  })

  it('refuses to queue when the paired app is older than 1.1.0', async () => {
    const { deps } = harness()
    const session = await pair(deps, '1.0.108')
    expect(session.claimed.status).toBe(200)
    const created = await call(deps, 'POST', 'requests', { port_slug: 'questcraft' }, session.token)
    expect(created.status).toBe(409)
    expect(created.body?.error).toBe('app_outdated')
    expect(created.body?.min_app_version).toBe('1.1.0')
    const queue = await call(deps, 'GET', 'requests', null, session.secret)
    expect(queue.body?.requests).toEqual([])
  })

  it('rejects a port without a one-click APK and locks a code after five bad tries', async () => {
    const { deps } = harness()
    const session = await pair(deps)
    const blocked = await call(deps, 'POST', 'requests', { port_slug: 'red-dead-redemption-vr' }, session.token)
    expect(blocked.status).toBe(403)
    expect(blocked.body?.error).toBe('not_eligible')

    deps.newCode = () => 'MNP234'
    for (let i = 0; i < 5; i += 1) {
      const failed = await call(deps, 'POST', 'pair/claim', { code: 'ZZZZZZ' })
      expect(failed.body?.error).toBe('invalid_code')
    }
    const locked = await call(deps, 'POST', 'pair/claim', { code: 'MNP234' })
    expect(locked.status).toBe(429)
    expect(locked.body?.error).toBe('too_many_attempts')
  })

  it('stays off unless the flag or the preview header enabled the handler', async () => {
    const { deps } = harness()
    deps.enabled = false
    const hidden = await call(deps, 'POST', 'device/register', { model: 'Quest 3', app_version: '1.1.0' })
    expect(hidden.status).toBe(404)
    expect(hidden.body?.error).toBe('disabled')
  })

  it('does not add Send to the USB button handler or the navbar', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const navbar = readFileSync(new URL('../app/components/Navbar.vue', import.meta.url), 'utf8')
    const send = readFileSync(new URL('../app/components/SendToQuest.vue', import.meta.url), 'utf8')
    const installStart = page.indexOf('data-testid="install-on-quest"')
    const install = page.slice(installStart, page.indexOf('</button>', installStart))
    expect(install).toContain('@click="beginInstall()"')
    expect(install).toContain('showSendToQuest ? INSTALL_VIA_USB_LABEL : INSTALL_ACTION_LABEL')
    expect(install).toContain('v-if="showSendToQuest"')
    expect(install).toContain('d="M17 21v-2"')
    expect(install).toContain('d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"')
    expect(page).toContain('<SendToQuest')
    expect(page).toContain('showSendToQuest')
    expect(send).toContain('data-testid="send-to-quest"')
    expect(send).toContain('M8.111 16.404a5.5 5.5 0 017.778 0')
    const bridge = readFileSync(new URL('../app/components/AppBridgeInstall.vue', import.meta.url), 'utf8')
    expect(bridge).toContain('{{ INSTALL_ACTION_LABEL }}')
    expect(bridge).not.toContain('INSTALL_VIA_USB_LABEL')
    expect(bridge).toContain('d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"')
    expect(navbar).not.toContain('SendToQuest')
    expect(navbar).not.toContain('send-to-quest')
    expect(navbar).not.toContain('Install via USB')
    const sql = readFileSync(new URL('../supabase/migrations/20261027050000_remote_install.sql', import.meta.url), 'utf8')
    expect(sql).toContain('enable row level security')
    expect(sql).not.toMatch(/create policy/i)
    expect(sql).toContain('needs_files boolean')
    expect(sql).toContain('revoke all on table public.remote_devices from public, anon, authenticated')
  })
})
