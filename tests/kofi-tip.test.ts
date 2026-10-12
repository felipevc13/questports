import { readFileSync } from 'node:fs'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { TIP_CLICK_SURFACES, clientAnalyticsPayload } from '../app/lib/analytics'
import {
  DEFAULT_KOFI_URL,
  KOFI_FOOTER_LABEL,
  KOFI_SUCCESS_BEFORE,
  KOFI_SUCCESS_LINK,
  KOFI_SURFACES,
  handleKofiClick,
  kofiHref,
  openExternalUrl
} from '../app/lib/kofi'
import { KofiTipView } from '../app/lib/kofiTipView'
import { decideAnalyticsRequest } from '../server/utils/analytics'

const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function decideTip(surface: string) {
  return decideAnalyticsRequest({
    enabled: true,
    body: {
      event: 'tip_click',
      path: surface === 'install_success' ? '/ports/iron-lung-vr' : '/',
      props: { surface }
    },
    ip: '203.0.113.50',
    userAgent: CHROME_UA,
    analyticsSalt: 'pepper',
    serviceRoleKey: 'service-role-key',
    now: new Date('2026-10-11T18:00:00.000Z')
  })
}

async function renderTip(href: string, surface: 'install_success' | 'footer') {
  return renderToString(createSSRApp({
    render: () => h(KofiTipView, { href, surface })
  }))
}

describe('Ko-fi tip', () => {
  it('renders the success line and hides it when the URL is empty', async () => {
    expect(KOFI_SURFACES).toEqual([...TIP_CLICK_SURFACES])
    expect(kofiHref(DEFAULT_KOFI_URL)).toBe('https://ko-fi.com/questports')
    expect(kofiHref('')).toBeNull()
    expect(kofiHref('   ')).toBeNull()
    expect(kofiHref('javascript:alert(1)')).toBeNull()

    const success = await renderTip(DEFAULT_KOFI_URL, 'install_success')
    expect(success).toContain('data-testid="kofi-install-success"')
    expect(success).toContain(KOFI_SUCCESS_BEFORE.trim())
    expect(success).toContain(`>${KOFI_SUCCESS_LINK}<`)
    expect(success).toContain('☕')
    expect(success).toContain('href="https://ko-fi.com/questports"')
    expect(success).toContain('target="_blank"')
    expect(success).toContain('rel="noopener noreferrer"')
    expect(success).not.toContain(KOFI_FOOTER_LABEL)

    const hidden = await renderTip('', 'install_success')
    expect(hidden).not.toContain('ko-fi')
    expect(hidden).not.toContain(KOFI_SUCCESS_LINK)
    expect(await renderTip('   ', 'footer')).not.toContain('Ko-fi')

    const footer = await renderTip('https://ko-fi.com/questports', 'footer')
    expect(footer).toContain('data-testid="kofi-footer"')
    expect(footer).toContain(KOFI_FOOTER_LABEL)
    expect(footer).toContain('target="_blank"')
    expect(footer).toContain('rel="noopener noreferrer"')
    expect(footer).toContain('min-h-11')
  })

  it('fires tip_click for the success line and the footer, and drops any other surface', () => {
    const clicks: Array<{ event: string; props: { surface: string } }> = []
    const track = (event: 'tip_click', body: { props: { surface: 'install_success' | 'footer' } }) => {
      clicks.push({ event, props: body.props })
    }
    let prevented = 0
    handleKofiClick({
      surface: 'install_success',
      href: DEFAULT_KOFI_URL,
      inApp: false,
      event: { preventDefault: () => { prevented += 1 } },
      track
    })
    handleKofiClick({
      surface: 'footer',
      href: DEFAULT_KOFI_URL,
      inApp: false,
      track
    })
    expect(clicks).toEqual([
      { event: 'tip_click', props: { surface: 'install_success' } },
      { event: 'tip_click', props: { surface: 'footer' } }
    ])
    expect(prevented).toBe(0)
    expect(clientAnalyticsPayload('tip_click', { path: '/', props: clicks[1].props })?.props)
      .toEqual({ surface: 'footer' })
    expect(decideTip('install_success').record).toBe(true)
    expect(decideTip('install_success').row?.props).toEqual({ surface: 'install_success' })
    expect(decideTip('footer').row?.event).toBe('tip_click')
    expect(decideTip('card').record).toBe(false)
    expect(decideAnalyticsRequest({
      enabled: true,
      body: { event: 'tip_click', path: '/' },
      ip: '203.0.113.50',
      userAgent: CHROME_UA,
      analyticsSalt: 'pepper',
      serviceRoleKey: 'service-role-key'
    }).reason).toBe('invalid')
  })

  it('opens Ko-fi outside the WebView without leaving a blank page', () => {
    const opened: Array<{ url: string; target?: string; features?: string }> = []
    const assigned: string[] = []
    const popup = { opener: { page: true } }
    expect(openExternalUrl(DEFAULT_KOFI_URL, {
      open: (url, target, features) => {
        opened.push({ url, target, features })
        return popup
      },
      assign: (url) => assigned.push(url)
    })).toBe('blank')
    expect(opened).toEqual([{ url: 'https://ko-fi.com/questports', target: '_blank', features: undefined }])
    expect(popup.opener).toBeNull()
    expect(assigned).toEqual([])

    expect(openExternalUrl(DEFAULT_KOFI_URL, {
      open: () => null,
      assign: (url) => assigned.push(url)
    })).toBe('assign')
    expect(assigned).toEqual(['https://ko-fi.com/questports'])

    assigned.length = 0
    expect(openExternalUrl(DEFAULT_KOFI_URL, {
      open: () => { throw new Error('no window') },
      assign: (url) => assigned.push(url)
    })).toBe('assign')
    expect(assigned).toEqual(['https://ko-fi.com/questports'])
    expect(openExternalUrl('')).toBe('skip')

    let prevented = false
    const inAppOpens: string[] = []
    handleKofiClick({
      surface: 'footer',
      href: DEFAULT_KOFI_URL,
      inApp: true,
      event: { preventDefault: () => { prevented = true } },
      track: () => {},
      open: (url) => {
        inAppOpens.push(url)
        return 'assign'
      }
    })
    expect(prevented).toBe(true)
    expect(inAppOpens).toEqual(['https://ko-fi.com/questports'])
  })

  it('places the line on install success and the footer, and not on catalog cards', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const installedAt = page.indexOf('APK Installed on Quest!')
    const notInstalled = page.slice(page.indexOf('APK not installed yet'), installedAt)
    expect(installedAt).toBeGreaterThan(0)
    expect(notInstalled).not.toContain('KofiTip')
    expect(page.indexOf('<KofiTip surface="install_success" />')).toBeGreaterThan(installedAt)
    expect(page.match(/<KofiTip /g)).toHaveLength(1)

    const app = readFileSync(new URL('../app/components/AppBridgeInstall.vue', import.meta.url), 'utf8')
    const installedBlock = app.slice(app.indexOf('data-testid="app-install-installed"'), app.indexOf('data-testid="game-files-need-pc"'))
    expect(installedBlock).toContain('<KofiTip surface="install_success" />')
    expect(app.indexOf('<KofiTip surface="install_success" />')).toBeGreaterThan(app.indexOf('>Installed<'))

    const footer = readFileSync(new URL('../app/components/Footer.vue', import.meta.url), 'utf8')
    expect(footer).toContain('<KofiTip surface="footer" />')

    const card = readFileSync(new URL('../app/components/PortCard.vue', import.meta.url), 'utf8')
    const index = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')
    expect(card).not.toContain('KofiTip')
    expect(card).not.toContain('ko-fi')
    expect(index).not.toContain('KofiTip')

    const tip = readFileSync(new URL('../app/components/KofiTip.vue', import.meta.url), 'utf8')
    expect(tip).toContain('handleKofiClick')
    expect(tip).toContain('useTrack')
    expect(tip).toContain('isAppBridgeClient')
    expect(tip).toContain('public.kofiUrl')
    expect(tip).not.toContain("fetch('/api/track'")

    const config = readFileSync(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
    expect(config).toContain('NUXT_PUBLIC_KOFI_URL ?? DEFAULT_KOFI_URL')
  })
})
