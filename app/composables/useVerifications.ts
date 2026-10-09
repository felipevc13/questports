import { MOCK_VERIFICATIONS } from '~/data/mockVerifications'
import type { PortVerification, VerificationChecks } from '~/lib/verification'

const PUBLIC_COLUMNS = 'id, port_id, port_slug, tested_version, headset_model, checked_at, source, checks, result, notes, moderation_status'

function asChecks(value: unknown): VerificationChecks {
  let parsed = value
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      return {}
    }
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
  const source = parsed as Record<string, unknown>
  const checks: VerificationChecks = {}
  for (const key of ['apk_installed', 'game_files_detected', 'storage_path_confirmed', 'data_copied_by_site'] as const) {
    if (typeof source[key] === 'boolean') checks[key] = source[key]
  }
  return checks
}

function normalizeRow(row: PortVerification): PortVerification {
  return {
    ...row,
    checks: asChecks(row.checks)
  }
}

/** Approved checks. Falls back to local sample rows only when Supabase is not configured. */
export async function fetchVerificationRecords(): Promise<PortVerification[]> {
  const { client, isConfigured } = useSupabase()
  if (!isConfigured || !client) {
    return MOCK_VERIFICATIONS.filter(row => row.moderation_status === 'approved').map(normalizeRow)
  }

  try {
    const { data, error } = await client
      .from('port_verification_summaries')
      .select(PUBLIC_COLUMNS)

    if (error || !data) {
      console.warn('[QuestPorts] Verification records unavailable:', error?.message)
      return []
    }
    return (data as PortVerification[]).map(normalizeRow)
  } catch (err) {
    console.warn('[QuestPorts] Verification records unavailable:', err)
    return []
  }
}
