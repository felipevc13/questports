import type { PortVerification } from '~/lib/verification'

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

/**
 * Local fallback only. Used when Supabase is not configured, so the catalog
 * can show badge states without a database. Production reads the view.
 */
export const MOCK_VERIFICATIONS: PortVerification[] = [
  {
    id: 'local-halo-quest3',
    port_slug: 'halocequest',
    tested_version: '1.0.16',
    headset_model: 'Quest 3',
    checked_at: daysAgo(5),
    source: 'manual',
    checks: {
      apk_installed: true,
      game_files_detected: true,
      storage_path_confirmed: true
    },
    result: 'works',
    notes: 'Opening section played on a Quest 3. Game files were in /sdcard/Documents/HaloCE/.',
    moderation_status: 'approved'
  },
  {
    id: 'local-halo-quest2',
    port_slug: 'halocequest',
    tested_version: 'v1.0.16',
    headset_model: 'Quest 2',
    checked_at: daysAgo(18),
    source: 'install',
    checks: {
      apk_installed: true,
      game_files_detected: true,
      storage_path_confirmed: true
    },
    result: 'works',
    notes: null,
    moderation_status: 'approved'
  },
  {
    id: 'local-halo-questpro',
    port_slug: 'halocequest',
    tested_version: 'v1.0.16',
    headset_model: 'Quest Pro',
    checked_at: daysAgo(40),
    source: 'manual',
    checks: {
      apk_installed: true,
      game_files_detected: true,
      storage_path_confirmed: true
    },
    result: 'works_with_issues',
    notes: 'Playable on Quest Pro. The face interface needs a comfort vignette in long sessions.',
    moderation_status: 'approved'
  },
  {
    id: 'local-rtcw-quest2',
    port_slug: 'rtcwquest',
    tested_version: 'v1.4.0',
    headset_model: 'Quest 2',
    checked_at: daysAgo(12),
    source: 'manual',
    checks: {
      apk_installed: true,
      game_files_detected: true,
      storage_path_confirmed: true
    },
    result: 'works',
    notes: 'pak0.pk3 and the single-player paks were in /sdcard/RTCWQuest/main/.',
    moderation_status: 'approved'
  }
]
