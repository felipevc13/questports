import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  INSTALL_STEP_SURFACES,
  clientAnalyticsPayload
} from '../app/lib/analytics'
import { claimConnectOrigin, connectOrigin } from '../app/lib/connectOrigin'
import {
  NAVBAR_AUTHORIZING_LABEL,
  NAVBAR_AUTHORIZING_LABEL_SHORT,
  NAVBAR_CONNECT_LABEL,
  NAVBAR_CONNECT_LABEL_SHORT,
  NAVBAR_GUIDANCE_LABEL_SHORT,
  NAVBAR_PICKER_LABEL_SHORT,
  navbarConnectBusy,
  navbarConnectFailureSteps,
  navbarConnectLabels,
  navbarConnectPanelMode,
  navbarUsbOffer
} from '../app/lib/navbarConnect'
import { QUEST_PICKER_HINT } from '../app/lib/questConnectUx'
import { AUTHORIZE_STILL_WAITING_STEPS } from '../app/lib/questConnectUx'
import { CONNECT_FAILURE_STEPS } from '../app/lib/questInstallUx'
import { createConnectStepSession } from '../app/lib/questConnectSession'
import { QUEST_USB_MESSAGES } from '../app/lib/questUsbMessages'
import { decideAnalyticsRequest } from '../server/utils/analytics'

const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function decideStep(body: Record<string, unknown>) {
  return decideAnalyticsRequest({
    enabled: true,
    body,
    ip: '203.0.113.40',
    userAgent: CHROME_UA,
    analyticsSalt: 'pepper',
    serviceRoleKey: 'service-role-key',
    now: new Date('2026-10-13T12:00:00.000Z')
  })
}

describe('navbar connect offer', () => {
  it('offers a real connect control only when WebUSB can run', () => {
    expect(navbarUsbOffer({
      inApp: false,
      questBrowser: false,
      webUsbSupported: true,
      previewUnsupported: false
    })).toBe('connect')
    expect(navbarUsbOffer({
      inApp: true,
      questBrowser: false,
      webUsbSupported: true,
      previewUnsupported: false
    })).toBe('hidden')
    expect(navbarUsbOffer({
      inApp: false,
      questBrowser: true,
      webUsbSupported: true,
      previewUnsupported: false
    })).toBe('quest-browser')
    expect(navbarUsbOffer({
      inApp: false,
      questBrowser: false,
      webUsbSupported: false,
      previewUnsupported: false
    })).toBe('unsupported')
    expect(navbarUsbOffer({
      inApp: false,
      questBrowser: false,
      webUsbSupported: true,
      previewUnsupported: true
    })).toBe('unsupported')
  })

  it('labels the idle control Connect Quest and Connect on a narrow screen', () => {
    expect(navbarConnectLabels('connect')).toEqual({
      full: NAVBAR_CONNECT_LABEL,
      short: NAVBAR_CONNECT_LABEL_SHORT
    })
    expect(NAVBAR_CONNECT_LABEL).toBe('Connect Quest')
    expect(NAVBAR_CONNECT_LABEL_SHORT).toBe('Connect')
    expect(navbarConnectLabels('picker')).toEqual({
      full: QUEST_PICKER_HINT,
      short: NAVBAR_PICKER_LABEL_SHORT
    })
    expect(navbarConnectLabels('authorizing')).toEqual({
      full: NAVBAR_AUTHORIZING_LABEL,
      short: NAVBAR_AUTHORIZING_LABEL_SHORT
    })
    expect(navbarConnectLabels('connected').full).toBe('Connect Quest')
    expect(navbarConnectBusy('picker')).toBe(true)
    expect(navbarConnectBusy('authorizing')).toBe(true)
    expect(navbarConnectBusy('connect')).toBe(false)
    expect(NAVBAR_GUIDANCE_LABEL_SHORT).toBe('Browser')
  })
})

describe('navbar connect panel', () => {
  const base = {
    origin: 'navbar' as const,
    connected: false,
    panelRequested: true,
    picker: false,
    authorizing: false,
    notice: null,
    error: null,
    usbLockedMessage: QUEST_USB_MESSAGES.usbLocked
  }

  it('stays closed for an install-started connect', () => {
    expect(navbarConnectPanelMode({
      ...base,
      origin: 'install',
      picker: true
    })).toBeNull()
    expect(navbarConnectPanelMode({
      ...base,
      origin: null,
      error: 'nope'
    })).toBeNull()
    expect(navbarConnectPanelMode({
      ...base,
      connected: true,
      error: 'nope'
    })).toBeNull()
  })

  it('uses the install card order: authorize, picker, dismissed chooser, locked, other', () => {
    expect(navbarConnectPanelMode({ ...base, authorizing: true, picker: true })).toBe('authorizing')
    expect(navbarConnectPanelMode({ ...base, picker: true })).toBe('picker')
    expect(navbarConnectPanelMode({ ...base, notice: 'closed' })).toBe('chooser')
    expect(navbarConnectPanelMode({
      ...base,
      notice: 'closed',
      error: QUEST_USB_MESSAGES.usbLocked
    })).toBe('chooser')
    expect(navbarConnectPanelMode({
      ...base,
      error: QUEST_USB_MESSAGES.usbLocked
    })).toBe('locked')
    expect(navbarConnectPanelMode({
      ...base,
      error: QUEST_USB_MESSAGES.timeout
    })).toBe('failed')
    expect(navbarConnectPanelMode({ ...base })).toBeNull()
    expect(navbarConnectFailureSteps(true)).toEqual([...AUTHORIZE_STILL_WAITING_STEPS])
    expect(navbarConnectFailureSteps(false)).toEqual([...CONNECT_FAILURE_STEPS])
  })
})

describe('navbar connect analytics', () => {
  it('records install_step connect events with surface navbar and no port slug', () => {
    expect(INSTALL_STEP_SURFACES).toEqual(['navbar', 'install'])
    const payload = clientAnalyticsPayload('install_step', {
      path: '/',
      props: { step: 'connect', status: 'start', surface: 'navbar' }
    })
    expect(payload?.portSlug).toBeNull()
    expect(payload?.props).toEqual({ step: 'connect', status: 'start', surface: 'navbar' })

    const stored = decideStep({
      event: 'install_step',
      path: '/',
      props: { step: 'authorize', status: 'fail', surface: 'navbar', ref: 'hn', email: 'drop' }
    })
    expect(stored.record).toBe(true)
    expect(stored.row?.port_slug).toBeNull()
    expect(stored.row?.path).toBe('/')
    expect(stored.row?.props).toEqual({
      step: 'authorize',
      status: 'fail',
      surface: 'navbar',
      ref: 'hn'
    })

    expect(clientAnalyticsPayload('install_step', {
      path: '/ports/rtcwquest',
      props: { step: 'connect', status: 'ok', surface: 'navbar' }
    })?.props).toEqual({ step: 'connect', status: 'ok', surface: 'navbar' })
    expect(clientAnalyticsPayload('install_step', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      props: { step: 'connect', status: 'ok', surface: 'install' }
    })?.props).toEqual({ step: 'connect', status: 'ok', surface: 'install' })

    expect(clientAnalyticsPayload('install_step', {
      path: '/',
      props: { step: 'connect', status: 'start' }
    })).toBeNull()
    expect(clientAnalyticsPayload('install_step', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      props: { step: 'connect', status: 'start', surface: 'card' }
    })?.props).toEqual({ step: 'connect', status: 'start' })
    expect(clientAnalyticsPayload('install_step', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      props: { step: 'copy_game_files', status: 'ok', ref: 'hn' }
    })?.props).toEqual({ step: 'copy_game_files', status: 'ok', ref: 'hn' })
  })

  it('keeps the install_step surface check idempotent and optional', () => {
    const sql = readFileSync(
      new URL('../supabase/migrations/20261013120000_analytics_install_step_surface.sql', import.meta.url),
      'utf8'
    )
    expect(sql).toContain('drop constraint if exists analytics_events_install_step_check')
    expect(sql).toContain("props->>'surface' is null")
    expect(sql).toContain("props->>'surface' in ('navbar', 'install')")
    expect(sql).toContain("'connect'")
    expect(sql).toContain("'authorize'")
    expect(sql).toContain("'download_apk'")
    expect(sql).toContain("'install_apk'")
    expect(sql).toContain("'copy_game_files'")
    expect(sql).not.toContain('tip_click')
  })
})

describe('connect step session', () => {
  it('matches the install connect sequence and does not repeat steps', () => {
    const connected = createConnectStepSession()
    const events = [
      ...connected.start(),
      ...connected.onPhase('picker'),
      ...connected.onPhase('authorizing'),
      ...connected.onPhase('authorizing'),
      ...connected.finish(true)
    ]
    expect(events).toEqual([
      { step: 'connect', status: 'start' },
      { step: 'connect', status: 'ok' },
      { step: 'authorize', status: 'start' },
      { step: 'authorize', status: 'ok' }
    ])

    const cancelled = createConnectStepSession()
    expect([
      ...cancelled.start(),
      ...cancelled.onPhase('picker'),
      ...cancelled.finish(false)
    ]).toEqual([
      { step: 'connect', status: 'start' },
      { step: 'connect', status: 'fail' }
    ])

    const denied = createConnectStepSession()
    expect([
      ...denied.start(),
      ...denied.onPhase('authorizing'),
      ...denied.finish(false)
    ]).toEqual([
      { step: 'connect', status: 'start' },
      { step: 'connect', status: 'ok' },
      { step: 'authorize', status: 'start' },
      { step: 'authorize', status: 'fail' }
    ])
  })
})

describe('navbar and install wiring', () => {
  const navbar = readFileSync(new URL('../app/components/Navbar.vue', import.meta.url), 'utf8')
  const panel = readFileSync(new URL('../app/components/NavbarConnectPanel.vue', import.meta.url), 'utf8')
  const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')

  it('makes the disconnected header a connect button and leaves install on the port page', () => {
    expect(navbar).toContain('data-testid="connect-quest"')
    expect(navbar).toContain('type="button"')
    expect(navbar).toContain('{{ connectLabels.short }}')
    expect(navbar).toContain('{{ connectLabels.full }}')
    expect(navbar).toContain('class="truncate md:hidden"')
    expect(navbar).toContain('class="hidden truncate md:inline"')
    expect(navbar).toContain('await questAdb.connect()')
    expect(navbar).toContain("claimConnectOrigin('navbar')")
    expect(navbar).toContain("surface: 'navbar'")
    expect(navbar).toContain("track('install_step'")
    expect(navbar).toContain('session.start()')
    expect(navbar).toContain('session.onPhase(phase)')
    expect(navbar).toContain('suppressOutsideClose')
    expect(navbar).toContain('<UnsupportedBrowserNotice />')
    expect(navbar).toContain('data-testid="navbar-unsupported-browser"')
    expect(navbar).toContain('data-testid="navbar-quest-browser"')
    expect(navbar).toContain('<ClientOnly v-if="!inApp">')
    expect(navbar).not.toContain('No Quest connected')
    expect(navbar).not.toContain('installApkUrl')
    expect(navbar).not.toContain('beginInstall')
    expect(navbar).not.toContain("trackInstall('install_click')")
    expect(panel).toContain('QUEST_PICKER_HINT')
    expect(panel).toContain('AUTHORIZE_PROMPT_LEAD')
    expect(panel).toContain('data-testid="navbar-authorize-cancel"')
    expect(panel).toContain('data-testid="navbar-chooser-retry"')
    expect(panel).toContain('data-testid="navbar-connect-retry"')
    expect(panel).toContain('data-testid="navbar-usb-locked-retry"')

    const install = page.slice(page.indexOf('const handleApkInstall'))
    const claimAt = install.indexOf("claimConnectOrigin('install')")
    const connectAt = install.indexOf('await questAdb.connect()')
    expect(claimAt).toBeGreaterThan(0)
    expect(connectAt).toBeGreaterThan(claimAt)
    expect(page).toContain('props: { step, status }')
    expect(page).not.toContain("surface: 'navbar'")
    expect(page).toContain("trackInstall('install_click')")

    connectOrigin.value = 'navbar'
    claimConnectOrigin('install')
    expect(connectOrigin.value).toBe('install')
    connectOrigin.value = null
  })
})
