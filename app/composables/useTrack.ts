import { isAppBridgeClient } from '~/lib/appBridge'
import { browserOptsOut, clientAnalyticsPayload, createAnalyticsBatcher, deliverAnalyticsBatch, deliverAnalyticsPayload, withAppAnalyticsProp, withSessionCampaignRef, withSessionLanding, type AnalyticsEventName, type AnalyticsTrackInput } from '~/lib/analytics'
import { isMockQuestEnabled } from '~/lib/mockQuest'

/**
 * Fire-and-forget usage events.
 * install_success is sent immediately with fetch: sendBeacon was accepting that event and never flushing it.
 * Other events stay in one queue and leave as a single sendBeacon when the tab is hidden or the page is discarded.
 * A full queue flushes early so a long visit is not dropped. Client navigations share the queue.
 * No cookies and no localStorage id. Failures are ignored.
 */
let batcher: ReturnType<typeof createAnalyticsBatcher> | null = null

function analyticsBatcher() {
  if (!batcher) {
    batcher = createAnalyticsBatcher({
      send: (body) => {
        const sendBeacon = typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function'
          ? (url: string, data: Blob) => navigator.sendBeacon(url, data)
          : undefined
        deliverAnalyticsBatch({
          body,
          sendBeacon,
          fetchImpl: (url, init) => {
            fetch(url, { ...init, keepalive: true }).catch(() => {})
          }
        })
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
      const payload = clientAnalyticsPayload(event, withSessionLanding(
        event,
        withSessionCampaignRef(event, withAppAnalyticsProp({
          ...input,
          path: input.path ?? window.location.pathname,
          webusb: input.webusb ?? (typeof navigator !== 'undefined' && 'usb' in navigator)
        }, isAppBridgeClient()), window.sessionStorage, window.location.search),
        window.sessionStorage,
        {
          referrer: document.referrer,
          search: window.location.search,
          requestHost: window.location.host
        }
      ))
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
          fetchImpl: (url, init) => fetch(url, { ...init, keepalive: true }).catch(() => {})
        }).then(() => {})
      }
      analyticsBatcher().enqueue(payload)
    } catch {
      // Analytics must never break the page.
    }
  }

  return { track }
}
