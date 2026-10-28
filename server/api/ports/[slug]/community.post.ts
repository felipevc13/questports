import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { supabaseAdmin } from '../../../utils/supabaseAdmin'

const VALID_VERDICTS = ['works_great', 'needs_tweaks', 'cant_run'] as const
const VALID_ISSUE_TAGS = ['wont_launch', 'missing_files', 'controls_broken', 'low_fps', 'motion_sickness'] as const
const VALID_HEADSETS = ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'] as const
const VALID_SOURCES = ['app_launch', 'app_browse', 'web'] as const

function isValidUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val)
}

export default defineEventHandler(async (event) => {
  const admin = supabaseAdmin()
  if (!admin) {
    throw createError({ statusCode: 503, statusMessage: 'Community reports are not configured' })
  }

  const slug = getRouterParam(event, 'slug')?.trim().toLowerCase()
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid port slug' })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Request body is required' })
  }

  const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim().toLowerCase() : ''
  if (!isValidUuid(deviceId)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid deviceId (UUID) is required' })
  }

  const verdict = typeof body.verdict === 'string' ? body.verdict.trim() : ''
  if (!VALID_VERDICTS.includes(verdict as (typeof VALID_VERDICTS)[number])) {
    throw createError({ statusCode: 400, statusMessage: `Verdict must be one of: ${VALID_VERDICTS.join(', ')}` })
  }

  const issueTag = typeof body.issueTag === 'string' && body.issueTag.trim()
    ? body.issueTag.trim()
    : null

  if (issueTag) {
    if (verdict === 'works_great') {
      throw createError({ statusCode: 400, statusMessage: 'Issue tag cannot be provided when verdict is works_great' })
    }
    if (!VALID_ISSUE_TAGS.includes(issueTag as (typeof VALID_ISSUE_TAGS)[number])) {
      throw createError({ statusCode: 400, statusMessage: `Issue tag must be one of: ${VALID_ISSUE_TAGS.join(', ')}` })
    }
  }

  let headset = typeof body.headset === 'string' && body.headset.trim()
    ? body.headset.trim()
    : null

  if (headset && !VALID_HEADSETS.includes(headset as (typeof VALID_HEADSETS)[number])) {
    throw createError({ statusCode: 400, statusMessage: `Headset must be one of: ${VALID_HEADSETS.join(', ')}` })
  }

  const source = typeof body.source === 'string' && VALID_SOURCES.includes(body.source.trim() as (typeof VALID_SOURCES)[number])
    ? body.source.trim()
    : 'web'

  // Look up port in catalog to verify it exists and check hardware compatibility
  const { data: portRow, error: portError } = await admin
    .from('ports')
    .select('slug, supported_hardware, latest_version')
    .eq('slug', slug)
    .maybeSingle()

  if (portError || !portRow) {
    throw createError({ statusCode: 404, statusMessage: 'Port not found in catalog' })
  }

  // If port is Quest 3/3S only and does not support Quest 2, reject Quest 2 reports
  if (headset === 'Quest 2' && Array.isArray(portRow.supported_hardware) && !portRow.supported_hardware.includes('Quest 2')) {
    throw createError({ statusCode: 400, statusMessage: 'This port does not support Quest 2' })
  }

  const portVersion = typeof body.portVersion === 'string' && body.portVersion.trim()
    ? body.portVersion.trim()
    : (portRow.latest_version || null)

  const { error: upsertError } = await admin
    .from('port_community_reviews')
    .upsert({
      port_slug: slug,
      device_id: deviceId,
      verdict,
      issue_tag: issueTag,
      headset,
      port_version: portVersion,
      source,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'port_slug,device_id'
    })

  if (upsertError) {
    console.error('[QuestPorts Community] Error upserting review:', upsertError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to record review' })
  }

  return {
    ok: true,
    portSlug: slug,
    verdict,
    issueTag,
    headset,
    portVersion
  }
})
