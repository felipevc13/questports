/** User-facing WebUSB / ADB connection copy. The mock headset reuses these strings. */

export const USB_LOCKED_TITLE = 'Your Quest is being used by another app'

export const USB_LOCKED_BODY =
  'Another app on this computer has the USB connection. Close SideQuest, Meta Quest Link or Horizon Link, Android Studio, or any ADB tool.'

export const USB_LOCKED_PLATFORM =
  'On Windows or Mac, you may need to stop the adb process, for example'

export const USB_LOCKED_COMMAND = 'adb kill-server'

export const USB_LOCKED_AFTER =
  'Then unplug the cable, plug it back in, and click Try again.'

export const QUEST_USB_MESSAGES = {
  unsupported: 'WebUSB is not supported in this browser. Please use Chrome, Edge, or Brave.',
  usbLocked: `${USB_LOCKED_TITLE} on this computer. ${USB_LOCKED_BODY} ${USB_LOCKED_PLATFORM} ${USB_LOCKED_COMMAND}. ${USB_LOCKED_AFTER}`,
  cancelled:
    'Connection was cancelled by the headset. Put on your Meta Quest so the display stays awake, then click connect and accept the "Allow USB debugging" prompt inside the visor.',
  timeout:
    'Headset authorization timed out. Put on your Meta Quest so the screen stays awake, then click Connect and accept the "Allow USB debugging" prompt inside the visor.',
  generic: 'Connection failed. Ensure headset is unlocked with Developer Mode enabled.',
  unauthorized: 'device unauthorized. Please check the confirmation dialog on your device.'
} as const

export type QuestUsbMessageKey = keyof typeof QUEST_USB_MESSAGES

/** Maps a failed device claim onto the locked, cancelled, or generic message. */
export function connectionMessageForUsbError(err: unknown): string {
  const message = err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: unknown }).message || '')
    : (typeof err === 'string' ? err : '')
  const text = message.toLowerCase()
  if (
    text.includes('already in use')
    || text.includes('already in used')
    || text.includes('claim')
    || text.includes('busy')
  ) {
    return QUEST_USB_MESSAGES.usbLocked
  }
  if (text.includes('cancelled') || text.includes('transferin') || text.includes('aborterror')) {
    return QUEST_USB_MESSAGES.cancelled
  }
  return message || QUEST_USB_MESSAGES.generic
}
