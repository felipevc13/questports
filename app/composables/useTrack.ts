import { isAppBridgeClient } from '~/lib/appBridge'
import { browserOptsOut, clientAnalyticsPayload, deliverAnalyticsPayload, withAppAnalyticsProp, withSessionCampaignRef, type AnalyticsEventName, type AnalyticsTrackInput } from '~/lib/analytics'
import { isMockQuestEnabled } from '~/lib/mockQuest'

/**
 * Fire-and-forget usage events. Visible events use sendBeacon, then fetch keepalive.
 * install_success always uses fetch: sendBeacon was accepting that event and never flushing it.
 * No cookies and no localStorage id. Failures are ignored.
 */
export function useTrack() {
  const analyticsOn = String(useRuntimeConfig().public.analyticsEnabled) === 'true'

  const track = (event: AnalyticsEventName, input: AnalyticsTrackInput = {}) => {
    if (!import.meta.client || !analyticsOn) return
    try {
      if (browserOptsOut(navigator)) return
      if (isMockQuestEnabled()) return
      const payload = clientAnalyticsPayload(event, withSessionCampaignRef(event, withAppAnalyticsProp({
        ...input,
        path: input.path ?? window.location.pathname,
        webusb: input.webusb ?? (typeof navigator !== 'undefined' && 'usb' in navigator)
      }, isAppBridgeClient()), window.sessionStorage, window.location.search))
      if (!payload) return
      const body = JSON.stringify(payload)
      const sendBeacon = typeof navigator.sendBeacon === 'function'
        ? (url: string, data: Blob) => navigator.sendBeacon(url, data)
        : undefined
      return deliverAnalyticsPayload({
        event,
        body,
        visibility: document.visibilityState,
        sendBeacon,
        fetchImpl: (url, init) => fetch(url, init).catch(() => {})
      }).then(() => {})
    } catch {
      // Analytics must never break the page.
    }
  }

  return { track }
}
