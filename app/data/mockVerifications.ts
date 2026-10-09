import type { PortInstallCount, PortVerification } from '~/lib/verification'

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
      storage_path_confirmed: true,
      data_copied_by_site: true
    },
    result: 'works',
    notes: null,
    moderation_status: 'approved'
  },
  {
    id: 'local-galaxy-quest2',
    port_slug: 'galaxyquest',
    tested_version: 'v0.1.8',
    headset_model: 'Quest 2',
    checked_at: daysAgo(1),
    source: 'install',
    checks: {
      apk_installed: true,
      game_files_detected: false,
      storage_path_confirmed: false
    },
    result: 'works_with_issues',
    notes: null,
    moderation_status: 'approved'
  },
  {
    id: 'local-time-crisis-quest2',
    port_slug: 'time-crisis-vr',
    tested_version: '0.8.4',
    headset_model: 'Quest 2',
    checked_at: daysAgo(1),
    source: 'install',
    checks: { apk_installed: true },
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

/**
 * Local fallback for public.port_install_counts. Used only when Supabase is
 * not configured. Counts are distinct devices, not headset rows.
 */
export const MOCK_INSTALL_COUNTS: PortInstallCount[] = [
  { port_slug: 'halocequest', installs: 12, last_install_at: daysAgo(2) },
  { port_slug: 'galaxyquest', installs: 1, last_install_at: daysAgo(1) },
  { port_slug: 'time-crisis-vr', installs: 1200, last_install_at: daysAgo(1) }
]
