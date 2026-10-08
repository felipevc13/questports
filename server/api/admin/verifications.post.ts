import { createError, defineEventHandler, getRequestHeader, readBody } from 'h3'
import { clientIp } from '../../utils/clientIp'
import { supabaseAdmin } from '../../utils/supabaseAdmin'
import {
  adminSecretMatches,
  fingerprintValue,
  parseManualVerification,
  type CatalogVersionRow
} from '../../utils/verificationIngest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const expected = String(config.verificationAdminSecret || '')
  if (!expected) {
    throw createError({ statusCode: 503, statusMessage: 'Manual verification is not configured' })
  }

  const provided = getRequestHeader(event, 'x-questports-admin-secret')
  if (!adminSecretMatches(provided, expected)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const admin = supabaseAdmin()
  if (!admin) {
    throw createError({ statusCode: 503, statusMessage: 'Verification recording is not configured' })
  }

  const body = await readBody(event)
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

  const parsed = parseManualVerification(body, catalog)
  if (!parsed.ok) {
    throw createError({ statusCode: parsed.status, statusMessage: parsed.error })
  }

  const salt = String(config.supabaseServiceRoleKey || '')
  const ipHash = salt ? fingerprintValue(clientIp(event), salt) : null

  const row: Record<string, unknown> = {
    port_id: catalog!.id,
    port_slug: parsed.report.slug,
    tested_version: parsed.report.testedVersion,
    headset_model: parsed.report.headset,
    source: 'manual',
    checks: parsed.report.checks,
    result: parsed.report.result,
    notes: parsed.report.notes,
    moderation_status: 'approved',
    ip_hash: ipHash
  }
  if (parsed.report.checkedAt) row.checked_at = parsed.report.checkedAt

  const { data: inserted, error: insertError } = await admin
    .from('port_verifications')
    .insert(row)
    .select('id')
    .single()

  if (insertError || !inserted) {
    console.error('[QuestPorts] Manual verification insert failed:', insertError?.message)
    throw createError({ statusCode: 503, statusMessage: 'Verification recording failed' })
  }

  return { ok: true, id: inserted.id }
})
