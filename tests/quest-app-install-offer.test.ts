import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { QUESTPORTS_APP_PAGE } from '../app/data/questPortsApp'
import {
  canOneClickInstallQuestApp,
  QUEST_APP_INSTALL_PAGE_URL
} from '../app/lib/questAppInstallOffer'

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const EDGE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'

const FIREFOX_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'

const PHONE_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'

const TABLET_UA =
  'Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const OCULUS_UA =
  'Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.0 Chrome/122.0.6261.64 VR Safari/537.36'

describe('QuestPorts app one-click offer', () => {
  it('keeps the button for desktop Chrome and Edge with WebUSB', () => {
    expect(canOneClickInstallQuestApp({ webusb: true, questBrowser: false, userAgent: CHROME_UA })).toBe(true)
    expect(canOneClickInstallQuestApp({ webusb: true, questBrowser: false, userAgent: EDGE_UA })).toBe(true)
  })

  it('hides the button without WebUSB, in Quest Browser, and on phones and tablets', () => {
    expect(canOneClickInstallQuestApp({ webusb: false, questBrowser: false, userAgent: CHROME_UA })).toBe(false)
    expect(canOneClickInstallQuestApp({ webusb: false, questBrowser: false, userAgent: FIREFOX_UA })).toBe(false)
    expect(canOneClickInstallQuestApp({ webusb: true, questBrowser: true, userAgent: OCULUS_UA })).toBe(false)
    expect(canOneClickInstallQuestApp({ webusb: true, questBrowser: true, userAgent: CHROME_UA })).toBe(false)
    expect(canOneClickInstallQuestApp({ webusb: true, questBrowser: false, userAgent: PHONE_UA })).toBe(false)
    expect(canOneClickInstallQuestApp({ webusb: true, questBrowser: false, userAgent: TABLET_UA })).toBe(false)
  })

  it('points the fallback at the production /app page and does not start an install', () => {
    expect(QUEST_APP_INSTALL_PAGE_URL).toBe('https://questports.com/app')
    expect(QUESTPORTS_APP_PAGE.pcInstallUrl).toBe('questports.com/app')
    expect(QUESTPORTS_APP_PAGE.pcInstallMessage).toBe(
      'Open this page on a PC with Chrome or Edge to install with one click.'
    )
    const page = readFileSync(new URL('../app/pages/app.vue', import.meta.url), 'utf8')
    expect(page).toContain('copyTextToClipboard(QUEST_APP_INSTALL_PAGE_URL)')
    expect(page).toContain('data-testid="app-download-apk"')
    const guard = page.indexOf('!oneClick.value')
    const click = page.indexOf("track('install_click'")
    expect(guard).toBeGreaterThan(0)
    expect(click).toBeGreaterThan(guard)
  })
})
