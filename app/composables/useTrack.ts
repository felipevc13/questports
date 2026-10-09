import { browserOptsOut, clientAnalyticsPayload, withSessionCampaignRef, type AnalyticsEventName, type AnalyticsTrackInput } from '~/lib/analytics'
import { isMockQuestEnabled } from '~/lib/mockQuest'

/**
 * Fire-and-forget usage events. sendBeacon first, then fetch keepalive.
 * No cookies and no localStorage id. Failures are ignored.
 */
export function useTrack() {
  const analyticsOn = String(useRuntimeConfig().public.analyticsEnabled) === 'true'

  const track = (event: AnalyticsEventName, input: AnalyticsTrackInput = {}) => {
    if (!import.meta.client || !analyticsOn) return
    try {
      if (browserOptsOut(navigator)) return
      if (isMockQuestEnabled()) return
      const payload = clientAnalyticsPayload(event, withSessionCampaignRef(event, {
        ...input,
        path: input.path ?? window.location.pathname,
        webusb: input.webusb ?? (typeof navigator !== 'undefined' && 'usb' in navigator)
      }, window.sessionStorage, window.location.search))
      if (!payload) return
      const body = JSON.stringify(payload)
      const url = '/api/track'
      if (typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' })
        if (navigator.sendBeacon(url, blob)) return
      }
      void fetch(url, {
        method: 'POST',
        body,
        headers: { 'content-type': 'application/json' },
        keepalive: true
      }).catch(() => {})
    } catch {
      // Analytics must never break the page.
    }
  }

  return { track }
}
