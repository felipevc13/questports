import { describe, expect, it } from 'vitest'
import {
  QUEST_NO_DEVICE_HINT,
  QUEST_PICKER_HINT,
  isUsbChooserDismissed,
  questConnectChrome
} from '../app/lib/questConnectUx'

describe('quest connect chrome', () => {
  it('keeps the headset banner off while the browser chooser is open', () => {
    const chrome = questConnectChrome('picker', false)
    expect(chrome.showHeadsetBanner).toBe(false)
    expect(chrome.showPickerHint).toBe(true)
    expect(chrome.status).toBe('disconnected')
    expect(chrome.navbar).toBe('picker')
    expect(QUEST_PICKER_HINT).toContain('browser window')
  })

  it('shows the headset banner only after a device is picked', () => {
    const chrome = questConnectChrome('authorizing', false)
    expect(chrome.showHeadsetBanner).toBe(true)
    expect(chrome.showPickerHint).toBe(false)
    expect(chrome.status).toBe('authorizing')
    expect(chrome.navbar).toBe('authorizing')
  })

  it('returns to a disconnected chrome when the chooser is cancelled', () => {
    const chrome = questConnectChrome('idle', false)
    expect(chrome.showHeadsetBanner).toBe(false)
    expect(chrome.showPickerHint).toBe(false)
    expect(chrome.status).toBe('disconnected')
    expect(chrome.navbar).toBe('connect')
  })

  it('does not show connect prompts once the headset is connected', () => {
    expect(questConnectChrome('connected', true).navbar).toBe('connected')
    expect(questConnectChrome('idle', true).showHeadsetBanner).toBe(false)
  })
})

describe('usb chooser dismissal', () => {
  it('treats NotFoundError and an empty selection as no headset', () => {
    expect(isUsbChooserDismissed({ name: 'NotFoundError', message: 'No device selected.' })).toBe(true)
    expect(isUsbChooserDismissed(new DOMException('No device selected.', 'NotFoundError'))).toBe(true)
    expect(isUsbChooserDismissed({ message: 'Failed to execute requestDevice: No device selected.' })).toBe(true)
  })

  it('leaves real connection failures on the error path', () => {
    expect(isUsbChooserDismissed({ name: 'NetworkError', message: 'The transfer was cancelled.' })).toBe(false)
    expect(isUsbChooserDismissed({ message: 'The Quest USB interface is locked' })).toBe(false)
    expect(isUsbChooserDismissed(null)).toBe(false)
    expect(QUEST_NO_DEVICE_HINT).toBe(
      'No Quest found. Check the USB cable and that Developer Mode is enabled.'
    )
  })
})
