import { describe, expect, it } from 'vitest'
import {
  CHOOSER_DISMISSED_MESSAGE,
  CHOOSER_DISMISSED_STEPS,
  CHOOSER_DISMISSED_TITLE,
  CONNECT_FAILURE_STEPS,
  INSTALL_ACTION_LABEL,
  USB_PREP_STEPS,
  WEBUSB_UNSUPPORTED_NOTICE,
  forgetQuestConnection,
  hasRememberedQuestConnection,
  isWebUsbAvailable,
  primaryInstallBlocked,
  progressBarA11y,
  rememberQuestConnection,
  shouldShowUsbPrep
} from '../app/lib/questInstallUx'

function memoryStorage() {
  const data = new Map<string, string>()
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
    removeItem: (key: string) => {
      data.delete(key)
    }
  }
}

describe('webusb support', () => {
  it('requires a secure context and navigator.usb', () => {
    expect(isWebUsbAvailable({ usb: {} }, true)).toBe(true)
    expect(isWebUsbAvailable({}, true)).toBe(false)
    expect(isWebUsbAvailable({ usb: {} }, false)).toBe(false)
    expect(isWebUsbAvailable(null, true)).toBe(false)
    expect(isWebUsbAvailable({ usb: {} }, true, { forceUnsupported: true })).toBe(false)
  })
})

describe('usb setup steps', () => {
  it('shows the explainer until a headset has connected, then only when asked', () => {
    const storage = memoryStorage()
    expect(hasRememberedQuestConnection(storage)).toBe(false)
    expect(shouldShowUsbPrep(false, false)).toBe(true)
    rememberQuestConnection(storage)
    expect(hasRememberedQuestConnection(storage)).toBe(true)
    expect(shouldShowUsbPrep(true, false)).toBe(false)
    expect(shouldShowUsbPrep(true, true)).toBe(true)
    forgetQuestConnection(storage)
    expect(hasRememberedQuestConnection(storage)).toBe(false)
  })

  it('describes the cable, developer mode, and the visor prompt before Continue', () => {
    expect(USB_PREP_STEPS).toEqual([
      'Plug the Quest in with a USB cable.',
      'Enable Developer Mode.',
      'Put the headset on and accept "Allow USB debugging" when asked.'
    ])
    expect(INSTALL_ACTION_LABEL).toBe('Install on Quest')
  })
})

describe('chooser dismissal copy', () => {
  it('uses a calm checklist instead of an error', () => {
    expect(CHOOSER_DISMISSED_TITLE).toBe("Don't see your Quest in the list?")
    expect(CHOOSER_DISMISSED_MESSAGE).toBe(CHOOSER_DISMISSED_TITLE)
    expect(CHOOSER_DISMISSED_STEPS).toEqual([
      'Use a data cable (not charge-only).',
      'Headset on and unlocked.',
      'Accept the "Allow USB debugging" prompt inside the headset (tick Always allow).',
      'Developer Mode enabled.',
      'Try another USB port.'
    ])
    const copy = [CHOOSER_DISMISSED_TITLE, ...CHOOSER_DISMISSED_STEPS].join(' ').toLowerCase()
    expect(copy).not.toMatch(/fail|error|unable|denied/)
    expect(CONNECT_FAILURE_STEPS).toEqual([
      'Use a data cable (not charge-only).',
      'Developer Mode enabled.',
      'Headset on and unlocked.'
    ])
    for (const step of CONNECT_FAILURE_STEPS) {
      expect(CHOOSER_DISMISSED_STEPS).toContain(step)
    }
    expect(primaryInstallBlocked({
      showPrep: false,
      picker: false,
      authorizing: false,
      dismissed: true,
      connectionError: false,
      installing: false,
      supported: true
    })).toBe(true)
  })

  it('hides the install button while the explainer, chooser, or authorization is on screen', () => {
    const base = {
      showPrep: false,
      picker: false,
      authorizing: false,
      dismissed: false,
      connectionError: false,
      installing: false,
      supported: true
    }
    expect(primaryInstallBlocked(base)).toBe(false)
    expect(primaryInstallBlocked({ ...base, showPrep: true })).toBe(true)
    expect(primaryInstallBlocked({ ...base, picker: true })).toBe(true)
    expect(primaryInstallBlocked({ ...base, authorizing: true })).toBe(true)
    expect(primaryInstallBlocked({ ...base, supported: false })).toBe(true)
    expect(primaryInstallBlocked({ ...base, tooLarge: true })).toBe(true)
  })
})

describe('unsupported browser notice', () => {
  it('names Chrome or Edge and leaves room for the manual path', () => {
    expect(WEBUSB_UNSUPPORTED_NOTICE).toBe('Use Chrome or Edge')
  })
})

describe('install progress accessibility', () => {
  it('exposes a determinate progress bar and live status text', () => {
    const view = progressBarA11y(42.2, false, 'Downloading APK 3.0 MB / 8.0 MB')
    expect(view.role).toBe('progressbar')
    expect(view.ariaValuemin).toBe(0)
    expect(view.ariaValuemax).toBe(100)
    expect(view.ariaValuenow).toBe(42)
    expect(view.ariaValuetext).toBe('42%')
    expect(view.ariaLive).toBe('polite')
  })

  it('omits the current value while the bar is indeterminate', () => {
    const view = progressBarA11y(0, true, 'Downloading APK 1.5 MB (size unknown)')
    expect(view.ariaValuenow).toBeUndefined()
    expect(view.ariaValuemin).toBe(0)
    expect(view.ariaValuemax).toBe(100)
    expect(view.ariaValuetext).toContain('size unknown')
  })
})
