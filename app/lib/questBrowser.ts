import { browserFamilyFromUserAgent } from '~/lib/analytics'

/**
 * In-headset Meta Quest Browser. That browser exposes WebUSB, but a headset
 * cannot install onto itself, so the USB picker is empty.
 * OculusBrowser matches the analytics browser family. Quest and Oculus device
 * tokens cover headset UAs that omit the product name.
 */

export const QUEST_BROWSER_NOTICE_TITLE = "You're on your Quest's browser."

export const QUEST_BROWSER_NOTICE_BODY =
  'To install, open this page on a PC or Android phone (Chrome or Edge) and connect your Quest with a USB cable.'

export const QUEST_BROWSER_NOTICE = `${QUEST_BROWSER_NOTICE_TITLE} ${QUEST_BROWSER_NOTICE_BODY}`

export function questBrowserCopyLabel(copied: boolean): string {
  return copied ? 'Copied' : 'Copy link'
}

/** `?questBrowser=1`, same strict flag as `?noWebUsb=1`. */
export function hasQuestBrowserFlag(value: string | null | undefined): boolean {
  if (!value) return false
  const hashless = value.split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  return new URLSearchParams(query).get('questBrowser') === '1'
}

export function isQuestBrowserUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent || !userAgent.trim()) return false
  if (browserFamilyFromUserAgent(userAgent) === 'Oculus') return true
  if (/\bquest\b/i.test(userAgent)) return true
  if (/\boculus\b/i.test(userAgent)) return true
  return false
}

export function isQuestBrowserSession(input: {
  userAgent?: string | null
  search?: string | null
}): boolean {
  return hasQuestBrowserFlag(input.search) || isQuestBrowserUserAgent(input.userAgent)
}

/** Client-only guard. Safe to call during SSR, where it stays false. */
export function isQuestBrowserClient(): boolean {
  if (typeof window === 'undefined') return false
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  return isQuestBrowserSession({
    userAgent,
    search: `${window.location.pathname}${window.location.search}`
  })
}

export async function copyTextToClipboard(
  text: string,
  nav?: { clipboard?: { writeText(value: string): Promise<void> } | null } | null
): Promise<boolean> {
  const clipboard = nav ? nav.clipboard : (typeof navigator !== 'undefined' ? navigator.clipboard : null)
  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(text)
      return true
    } catch {
      // Fall through when the page injected no clipboard of its own.
      if (nav) return false
    }
  } else if (nav) {
    return false
  }

  if (typeof document === 'undefined') return false
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}
