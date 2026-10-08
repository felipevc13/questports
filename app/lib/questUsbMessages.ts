/** User-facing WebUSB / ADB connection copy. The mock headset reuses these strings. */

export const QUEST_USB_MESSAGES = {
  unsupported: 'WebUSB is not supported in this browser. Please use Chrome, Edge, or Brave.',
  usbLocked:
    'The Quest USB interface is locked by another program (Android File Transfer, SideQuest, Meta Developer Hub, or native ADB). Unplug and replug the USB cable, close background VR apps, then click connect.',
  cancelled:
    'Connection was cancelled by the headset. Put on your Meta Quest so the display stays awake, then click connect and accept the "Allow USB debugging" prompt inside the visor.',
  timeout:
    'Headset authorization timed out. Put on your Meta Quest so the screen stays awake, then click Connect and accept the "Allow USB debugging" prompt inside the visor.',
  generic: 'Connection failed. Ensure headset is unlocked with Developer Mode enabled.',
  unauthorized: 'device unauthorized. Please check the confirmation dialog on your device.'
} as const

export type QuestUsbMessageKey = keyof typeof QUEST_USB_MESSAGES
