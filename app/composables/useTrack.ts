import { isAppBridgeClient } from '~/lib/appBridge'
import { browserOptsOut, clientAnalyticsPayload, createAnalyticsBatcher, deliverAnalyticsPayload, withAppAnalyticsProp, withSessionCampaignRef, type AnalyticsEventName, type AnalyticsTrackInput } from '~/lib/analytics'
import { isMockQuestEnabled } from '~/lib/mockQuest'

/**
 * Fire-and-forget usage events.
 * install_success is sent immediately with fetch: sendBeacon was accepting that event and never flushing it.
 * Other events queue and flush at most every 5 seconds, and on visibilitychange/pagehide, with keepalive fetch.
 * No cookies and no localStorage id. Failures are ignored.
 */
let batcher: ReturnType<typeof createAnalyticsBatcher> | null = null

function analyticsBatcher() {
  if (!batcher) {
    batcher = createAnalyticsBatcher({
      send: (body) => {
        fetch('/api/track', {
          method: 'POST',
          body,
          headers: { 'content-type': 'application/json' },
          keepalive: true
        }).catch(() => {})
      }
    })
    if (import.meta.client) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') batcher?.flush()
      })
      window.addEventListener('pagehide', () => batcher?.flush())
    }
  }
  return batcher
}

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
      if (event === 'install_success') {
        analyticsBatcher().flush()
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
      }
      analyticsBatcher().enqueue(payload)
    } catch {
      // Analytics must never break the page.
    }
  }

  return { track }
}
