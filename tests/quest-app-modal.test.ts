import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { clientAnalyticsPayload } from '../app/lib/analytics'
import { isQuestBrowserSession } from '../app/lib/questBrowser'
import {
  QUESTPORTS_APP_PACKAGE,
  QUEST_APP_MODAL_BODY,
  QUEST_APP_MODAL_HREF,
  QUEST_APP_MODAL_INSTALL,
  QUEST_APP_MODAL_LEARN_MORE,
  QUEST_APP_MODAL_NOT_NOW,
  QUEST_APP_MODAL_STORAGE_KEY,
  QUEST_APP_MODAL_TITLE,
  isDesktopAppPrompt,
  isQuestPortsAppInstalled,
  readQuestAppModalDismissed,
  shouldShowQuestAppInstallModal,
  writeQuestAppModalDismissed
} from '../app/lib/questAppModal'

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const PHONE_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'

const OCULUS_UA =
  'Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.0 Chrome/122.0.6261.64 VR Safari/537.36'

const ready = {
  installSucceeded: true,
  desktop: true,
  inApp: false,
  dismissed: false,
  appInstalled: false
}

describe('QuestPorts app install modal', () => {
  it('opens after a desktop game install, not when the headset merely connects', () => {
    expect(shouldShowQuestAppInstallModal(ready)).toBe(true)
    expect(shouldShowQuestAppInstallModal({ ...ready, installSucceeded: false })).toBe(false)
    expect(shouldShowQuestAppInstallModal({ ...ready, desktop: false })).toBe(false)
    expect(shouldShowQuestAppInstallModal({ ...ready, inApp: true })).toBe(false)
    expect(shouldShowQuestAppInstallModal({ ...ready, dismissed: true })).toBe(false)
    expect(shouldShowQuestAppInstallModal({ ...ready, appInstalled: true })).toBe(false)
  })

  it('treats a PC browser as desktop and skips phones and Quest Browser', () => {
    expect(isDesktopAppPrompt({ questBrowser: false, userAgent: CHROME_UA })).toBe(true)
    expect(isDesktopAppPrompt({ questBrowser: false, userAgent: PHONE_UA })).toBe(false)
    expect(isDesktopAppPrompt({
      questBrowser: isQuestBrowserSession({ userAgent: OCULUS_UA, search: '' }),
      userAgent: OCULUS_UA
    })).toBe(false)
    expect(isDesktopAppPrompt({ questBrowser: true, userAgent: CHROME_UA })).toBe(false)
  })

  it('sees app.questports in the ADB package list', () => {
    expect(QUESTPORTS_APP_PACKAGE).toBe('app.questports')
    expect(isQuestPortsAppInstalled(['com.oculus.vrshell', 'app.questports'])).toBe(true)
    expect(isQuestPortsAppInstalled(['package:app.questports'])).toBe(true)
    expect(isQuestPortsAppInstalled(['APP.QUESTPORTS'])).toBe(true)
    expect(isQuestPortsAppInstalled(['com.oculus.vrshell'])).toBe(false)
    expect(isQuestPortsAppInstalled([])).toBe(false)
    expect(isQuestPortsAppInstalled(null)).toBe(false)
  })

  it('remembers dismiss and a finished install in one localStorage key', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value)
      }
    }
    expect(readQuestAppModalDismissed(storage)).toBe(false)
    writeQuestAppModalDismissed(storage)
    expect(storage.getItem(QUEST_APP_MODAL_STORAGE_KEY)).toBe('1')
    expect(shouldShowQuestAppInstallModal({
      ...ready,
      dismissed: readQuestAppModalDismissed(storage)
    })).toBe(false)
  })

  it('uses the banner events with a modal surface and the exact copy', () => {
    expect(QUEST_APP_MODAL_TITLE).toBe('Get QuestPorts on your headset')
    expect(QUEST_APP_MODAL_BODY).toBe('Browse and install ports right from VR. You only need to install it once.')
    expect(QUEST_APP_MODAL_NOT_NOW).toBe('Not now')
    expect(QUEST_APP_MODAL_INSTALL).toBe('Install app')
    expect(QUEST_APP_MODAL_LEARN_MORE).toBe('Learn more')
    expect(QUEST_APP_MODAL_HREF).toBe('/app?from=modal')
    expect(clientAnalyticsPayload('modal_shown', {
      path: '/ports/rtcwquest'
    })?.event).toBe('modal_shown')
    expect(clientAnalyticsPayload('modal_click', {
      path: '/ports/rtcwquest'
    })?.event).toBe('modal_click')
    expect(clientAnalyticsPayload('modal_dismiss', {
      path: '/ports/rtcwquest'
    })?.event).toBe('modal_dismiss')
    expect(clientAnalyticsPayload('install_click', {
      path: '/app',
      props: { via: 'modal' }
    })?.props).toEqual({ via: 'modal' })
  })

  it('arms the modal only after a successful game install on the port page', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const modal = readFileSync(new URL('../app/components/QuestAppInstallModal.vue', import.meta.url), 'utf8')
    const successAt = page.indexOf("questAppModalAfterInstall.value = true")
    const recordAt = page.indexOf('await recordInstallVerification()')
    const connectAt = page.indexOf('await questAdb.connect()')
    expect(connectAt).toBeGreaterThan(0)
    expect(successAt).toBeGreaterThan(recordAt)
    expect(successAt).toBeGreaterThan(connectAt)
    expect(page.slice(connectAt, recordAt)).not.toContain('questAppModalAfterInstall.value = true')
    expect(page).toContain('<QuestAppInstallModal :install-succeeded="questAppModalAfterInstall" />')
    expect(modal).toContain("track('modal_shown'")
    expect(modal).toContain("track('modal_click'")
    expect(modal).toContain("track('modal_dismiss'")
    expect(modal).toContain("via: 'modal'")
    expect(modal).toContain('writeQuestPortsAppInstalled')
    expect(modal).toContain('installApkUrl(QUESTPORTS_APP_RELEASE_URL')
    expect(modal).toContain('QUESTPORTS_APP_INSTALL_PATH')
    expect(modal).not.toContain('questAdb.connect(')
    expect(modal).toContain('data-testid="quest-app-modal-learn-more"')
  })
})
