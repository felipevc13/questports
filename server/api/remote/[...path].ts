import { defineEventHandler, getRequestHeader, getRequestURL, readBody, setResponseStatus } from 'h3'
import { APK_PROXY_WORKER_BASE } from '~/lib/apkProxyPolicy'
import { REMOTE_PREVIEW_HEADER, remoteInstallFlagEnabled } from '~/lib/remoteInstall'
import { clientIp } from '../../utils/clientIp'
import { supabaseAdmin } from '../../utils/supabaseAdmin'
import {
  createCatalogResolver,
  createSupabaseRemoteRepository,
  dispatchRemote,
  newRemoteId,
  randomRemoteCode,
  randomRemoteSecret,
  recordRemoteAnalytics,
  remoteSalt,
  sendRemoteBroadcast
} from '../../utils/remoteInstall'
import { sha256Hex } from '../../utils/analytics'

/**
 * /api/remote/* for the QuestPorts headset app and the Send to Quest button.
 * The service role is the only database caller. Anon has no policies on these tables.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const preview = getRequestHeader(event, REMOTE_PREVIEW_HEADER) === '1'
  const enabled = remoteInstallFlagEnabled(config.public.remoteInstall) || preview
  const admin = supabaseAdmin()
  const supabaseUrl = String(config.public.supabaseUrl || process.env.SUPABASE_URL || '')
  const serviceRoleKey = String(config.supabaseServiceRoleKey || '')
  const configuredProxy = String(config.public.apkProxyBase ?? '')
  const requestOrigin = getRequestURL(event).origin
  const apkProxyBase = configuredProxy.trim() ? configuredProxy : (requestOrigin || APK_PROXY_WORKER_BASE)
  const mediaBase = String(config.public.mediaBase || '')
  const method = event.method || 'GET'
  const url = getRequestURL(event)
  const path = url.pathname.replace(/^\/api\/remote\/?/, '')
  const body = method === 'GET' || method === 'DELETE' || method === 'HEAD'
    ? null
    : await readBody(event).catch(() => null)
  const result = await dispatchRemote({
    method,
    path,
    body,
    authorization: getRequestHeader(event, 'authorization') || null,
    appVersionHeader: getRequestHeader(event, 'x-questports-app-version') || null,
    acceptingHeader: getRequestHeader(event, 'x-questports-accepting') || null
  }, {
    enabled,
    repo: admin ? createSupabaseRemoteRepository(admin) : null,
    catalog: createCatalogResolver(admin, apkProxyBase, mediaBase),
    now: () => new Date(),
    hash: sha256Hex,
    newId: newRemoteId,
    newSecret: randomRemoteSecret,
    newCode: randomRemoteCode,
    salt: remoteSalt(String(config.analyticsSalt || ''), serviceRoleKey),
    userAgent: getRequestHeader(event, 'user-agent') || '',
    clientIp: clientIp(event),
    nudge: (deviceId, requestId) => sendRemoteBroadcast({
      supabaseUrl,
      serviceRoleKey,
      deviceId,
      requestId
    }),
    recordAnalytics: row => recordRemoteAnalytics(admin, row)
  })
  setResponseStatus(event, result.status)
  return result.body
})
