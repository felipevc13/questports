/**
 * Video Preview Timestamps configuration for QuestPorts.
 * 
 * Specify the exact gameplay highlight frames to play when hovering a card:
 * - Format: 'M:SS' (e.g. '1:05', '0:42', '2:15') or raw seconds (e.g. 65, 42, 135)
 * - Recommended duration: 6 to 10 seconds of active VR gameplay
 */

export interface PreviewConfig {
  start: string | number
  end?: string | number
}

/**
 * Converts '1:05' or 65 into numeric seconds
 */
export function parseSeconds(val: string | number | undefined | null, fallback = 15): number {
  if (val === undefined || val === null) return fallback
  if (typeof val === 'number') return val
  const str = val.toString().trim()
  const parts = str.split(':')
  if (parts.length === 2 && parts[0] && parts[1]) {
    const mins = parseInt(parts[0], 10) || 0
    const secs = parseInt(parts[1], 10) || 0
    return mins * 60 + secs
  }
  return parseInt(str, 10) || fallback
}

/**
 * Manual Timestamps Registry (by port slug or youtube video id)
 * Edit timestamps here freely (e.g., start: '1:05', end: '1:12')
 */
export const GAME_VIDEO_PREVIEWS: Record<string, PreviewConfig> = {
  // GoldenEye VR (007)
  'goldeneye-vr': { start: '1:50', end: '2:50' },
  'Nmlq5QxnVuM': { start: '1:50', end: '2:50' },
  'BYz7r7q65sk': { start: '1:50', end: '2:50' },

  // Return to Castle Wolfenstein
  'rtcwquest': { start: '0:16', end: '0:23' },
  'IWM7vi_OP6E': { start: '0:16', end: '0:23' },

  // Half-Life 1 (Lambda1VR)
  'lambda1vr': { start: '0:20', end: '0:27' },
  '-Fa1ce9x88Y': { start: '0:20', end: '0:27' },

  // Doom 3 VR
  'doom3quest': { start: '0:15', end: '0:22' },
  'y2y9C0E2kPk': { start: '0:15', end: '0:22' },

  // Super Mario Galaxy (GalaxyQuest)
  'galaxyquest': { start: '0:16', end: '0:23' },
  'super-mario-galaxy': { start: '0:16', end: '0:23' },
  'y3dgEeDW5Xw': { start: '0:16', end: '0:23' },

  // Metroid Prime (PrimedGun)
  'primedgun': { start: '3:30', end: '4:30' },
  'metroid-prime-vr': { start: '3:30', end: '4:30' },
  'd_xUXZURdzM': { start: '3:30', end: '4:30' },

  // Time Crisis VR
  'time-crisis-vr': { start: '0:14', end: '0:21' },
  '5ivdcCWly54': { start: '0:14', end: '0:21' },

  // Half-Life: Alyx (Qualyx)
  'qualyx': { start: '0:18', end: '0:25' },
  'wKyfjeuv46o': { start: '0:18', end: '0:25' },

  // ASTRO BOT (AstroQuest)
  'astroquest': { start: '0:12', end: '0:19' },
  'neSyrMRFs9c': { start: '0:12', end: '0:19' },

  // Road Rash: Jailbreak VR
  'road-rash-jailbreak-vr': { start: '0:10', end: '0:17' },
  'PGUc8b3VIu0': { start: '0:10', end: '0:17' },

  // Star Wars: Jedi Outcast (JKXR)
  'jkxr': { start: '0:25', end: '0:32' },
  'ToM-wz3v-NU': { start: '0:25', end: '0:32' },

  // Star Wars: Jedi Academy
  'jedi-academy': { start: '0:18', end: '0:25' },
  'qByCUtT6WG0': { start: '0:18', end: '0:25' },

  // Half-Life 2 VR (Source)
  'half-life-2-vr': { start: '0:14', end: '0:21' },
  'aTtOlcLPbCs': { start: '0:14', end: '0:21' },

  // Prey VR
  'prey-vr': { start: '0:30', end: '0:37' },
  'e8KZmDCdPb4': { start: '0:30', end: '0:37' },

  // QuestZDoom
  'questzdoom': { start: '0:12', end: '0:19' },
  'vMBsdsAICSY': { start: '0:12', end: '0:19' },

  // Quake 2 VR
  'quake2quest': { start: '0:10', end: '0:17' },
  'OoNCvmUxUFE': { start: '0:10', end: '0:17' },

  // Tomb Raider (OpenLara)
  'openlara': { start: '0:15', end: '0:22' },
  'd_xUXZURdzM': { start: '0:15', end: '0:22' },

  // Counter-Strike VR
  'counter-strike-vr': { start: '0:15', end: '0:22' },
  'UXMeylAkNGE': { start: '0:15', end: '0:22' },

  // Halo CE VR
  'halocequest': { start: '6:07', end: '7:00' },
  'halo-ce-quest-vr': { start: '6:07', end: '7:00' },
  'mFSmPcHQpLM': { start: '6:07', end: '7:00' }
}
