import { createError, defineEventHandler, readBody } from 'h3'
import { clientIp } from '../utils/clientIp'
import { supabaseAdmin } from '../utils/supabaseAdmin'
import {
  INSTALL_DEDUPE_WINDOW_MS,
  findDuplicateInstall,
  fingerprintValue,
  installRateLimited,
  parseInstallReport,
  portRequiresGameFiles,
  simulatedReportReason,
  type CatalogVersionRow
} from '../utils/verificationIngest'

export default defineEventHandler(async (event) => {
  const admin = supabaseAdmin()
  if (!admin) {
    throw createError({ statusCode: 503, statusMessage: 'Verification recording is not configured' })
  }

  const body = await readBody(event)
  const simulated = simulatedReportReason(body)
  if (simulated) {
    throw createError({ statusCode: 400, statusMessage: simulated })
  }

  const slug = body && typeof body === 'object' && typeof (body as { slug?: unknown }).slug === 'string'
    ? (body as { slug: string }).slug.trim()
    : ''

  let catalog: CatalogVersionRow | null = null
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    const { data, error } = await admin
      .from('ports')
      .select('id, slug, latest_version')
      .eq('slug', slug)
      .maybeSingle()
    if (error) {
      console.error('[QuestPorts] Catalog lookup failed:', error.message)
      throw createError({ statusCode: 503, statusMessage: 'Verification recording failed' })
    }
    catalog = data as CatalogVersionRow | null
  }

  const parsed = parseInstallReport(body, catalog, portRequiresGameFiles(slug))
  if (!parsed.ok) {
    throw createError({ statusCode: parsed.status, statusMessage: parsed.error })
  }

  const salt = String(useRuntimeConfig().supabaseServiceRoleKey || '')
  const ipHash = fingerprintValue(clientIp(event), salt)
  const deviceKey = parsed.report.deviceSerial || `ip:${ipHash}`
  const deviceFingerprint = fingerprintValue(deviceKey, salt)

  const sinceDedupe = new Date(Date.now() - INSTALL_DEDUPE_WINDOW_MS).toISOString()
  const { data: recent, error: recentError } = await admin
    .from('port_verifications')
    .select('id, tested_version, headset_model, checked_at')
    .eq('port_slug', parsed.report.slug)
    .eq('device_fingerprint', deviceFingerprint)
    .eq('source', 'install')
    .gte('checked_at', sinceDedupe)
  if (recentError) {
    console.error('[QuestPorts] Verification dedupe lookup failed:', recentError.message)
    throw createError({ statusCode: 503, statusMessage: 'Verification recording failed' })
  }

  const duplicateId = findDuplicateInstall(recent ?? [], parsed.report.testedVersion, parsed.report.headset)
  if (duplicateId) {
    return { ok: true, id: duplicateId, deduped: true }
  }

  const sinceHour = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count, error: countError } = await admin
    .from('port_verifications')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', sinceHour)
  if (countError) {
    console.error('[QuestPorts] Verification rate lookup failed:', countError.message)
    throw createError({ statusCode: 503, statusMessage: 'Verification recording failed' })
  }
  if (installRateLimited(count ?? 0)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many verification reports' })
  }

  const { data: inserted, error: insertError } = await admin
    .from('port_verifications')
    .insert({
      port_id: catalog!.id,
      port_slug: parsed.report.slug,
      tested_version: parsed.report.testedVersion,
      headset_model: parsed.report.headset,
      source: 'install',
      checks: parsed.report.checks,
      result: parsed.report.result,
      notes: null,
      moderation_status: 'approved',
      device_fingerprint: deviceFingerprint,
      ip_hash: ipHash
    })
    .select('id')
    .single()

  if (insertError || !inserted) {
    console.error('[QuestPorts] Verification insert failed:', insertError?.message)
    throw createError({ statusCode: 503, statusMessage: 'Verification recording failed' })
  }

  return { ok: true, id: inserted.id, deduped: false }
})
