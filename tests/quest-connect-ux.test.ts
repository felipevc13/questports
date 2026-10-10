import { describe, expect, it } from 'vitest'
import {
  AUTHORIZE_PROMPT_LEAD,
  AUTHORIZE_STILL_WAITING_STEPS,
  AUTHORIZE_STILL_WAITING_TITLE,
  AUTHORIZE_WAIT_HINT_MS,
  QUEST_NO_DEVICE_HINT,
  QUEST_PICKER_HINT,
  authorizeWaitHintVisible,
  isAuthorizeConnectionError,
  isUsbChooserDismissed,
  mockAuthorizeWaitFromSearch,
  mockUsbErrorFromSearch,
  questConnectChrome
} from '../app/lib/questConnectUx'
import { QUEST_USB_MESSAGES } from '../app/lib/questUsbMessages'

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
    expect(QUEST_NO_DEVICE_HINT).toBe("Don't see your Quest in the list?")
  })
})

describe('authorize wait hint', () => {
  it('names the Allow prompt and waits about 20 seconds before the extra hint', () => {
    expect(AUTHORIZE_PROMPT_LEAD).toBe(
      'Put on your headset and tap Allow (tick Always allow from this computer).'
    )
    expect(AUTHORIZE_STILL_WAITING_TITLE).toBe('Still waiting?')
    expect(AUTHORIZE_STILL_WAITING_STEPS).toEqual([
      'Keep the headset awake.',
      'The prompt may be hidden behind another window.',
      'Unplug the cable and plug it back in.'
    ])
    expect(AUTHORIZE_WAIT_HINT_MS).toBe(20_000)
    expect(authorizeWaitHintVisible(19_999)).toBe(false)
    expect(authorizeWaitHintVisible(20_000)).toBe(true)
    expect(mockAuthorizeWaitFromSearch('?mockAuthorizeWait=1')).toBe(true)
    expect(mockAuthorizeWaitFromSearch('/ports/iron-lung-vr?mockQuest=1&mockAuthorizeWait=1#guide')).toBe(true)
    expect(mockAuthorizeWaitFromSearch('?mockAuthorizeWait=0')).toBe(false)
    expect(mockAuthorizeWaitFromSearch(null)).toBe(false)
  })

  it('keeps cable failures off the RSA prompt checklist', () => {
    expect(isAuthorizeConnectionError(QUEST_USB_MESSAGES.timeout)).toBe(true)
    expect(isAuthorizeConnectionError(QUEST_USB_MESSAGES.cancelled)).toBe(true)
    expect(isAuthorizeConnectionError(QUEST_USB_MESSAGES.unauthorized)).toBe(true)
    expect(isAuthorizeConnectionError('device unauthorized')).toBe(true)
    expect(isAuthorizeConnectionError(QUEST_USB_MESSAGES.generic)).toBe(false)
    expect(isAuthorizeConnectionError(QUEST_USB_MESSAGES.usbLocked)).toBe(false)
    expect(isAuthorizeConnectionError(null)).toBe(false)
  })
})

describe('mock usb error query', () => {
  it('accepts locked and cancelled only', () => {
    expect(mockUsbErrorFromSearch('?mockUsbError=locked')).toBe('locked')
    expect(mockUsbErrorFromSearch('/ports/rtcwquest?mockUsbError=cancelled')).toBe('cancelled')
    expect(mockUsbErrorFromSearch('?x=1&mockUsbError=locked#guide')).toBe('locked')
    expect(mockUsbErrorFromSearch('?mockUsbError=timeout')).toBeNull()
    expect(mockUsbErrorFromSearch('?mockUsbError=')).toBeNull()
    expect(mockUsbErrorFromSearch('?mockUa=ios')).toBeNull()
    expect(mockUsbErrorFromSearch(null)).toBeNull()
  })
})
