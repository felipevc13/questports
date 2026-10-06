/**
 * Video Preview Timestamps configuration for QuestPorts.
 * 
 * Specify the exact gameplay highlight frames to play when hovering a card:
 * - Format: 'M:SS' (e.g. '1:05', '0:42', '2:15') or raw seconds (e.g. 65, 42, 135)
 * - The video will loop smoothly across the chosen start and end frames.
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
 * Manual Timestamps Registry (indexed by port slug or youtube video id)
 * Edit timestamps here freely (e.g., start: '1:05', end: '1:12')
 */
export const GAME_VIDEO_PREVIEWS: Record<string, PreviewConfig> = {
  // GoldenEye VR (007)
  'goldeneye-vr': { start: '1:50', end: '2:50' },
  'Nmlq5QxnVuM': { start: '1:50', end: '2:50' },

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
  'galaxyquest': { start: '0:20', end: '1:54' },
  'UnYhCfbw_bc': { start: '0:20', end: '1:54' },

  // Metroid Prime (PrimedGun)
  'primedgun': { start: '3:30', end: '4:30' },
  'd_xUXZURdzM': { start: '3:30', end: '4:30' },

  // Time Crisis VR
  'time-crisis-vr': { start: '7:30', end: '8:30' },
  'PGUc8b3VIu0': { start: '7:30', end: '8:30' },

  // Half-Life: Alyx (Qualyx)
  'qualyx': { start: '3:40', end: '4:40' },
  'JHW-FMm_c7c': { start: '3:40', end: '4:40' },

  // ASTRO BOT (AstroQuest)
  'astroquest': { start: '4:14', end: '5:14' },
  '1FXer9AHf68': { start: '4:14', end: '5:14' },

  // Road Rash: Jailbreak VR
  'road-rash-jailbreak-vr': { start: '0:10', end: '0:17' },
  'f01aGgd6Uzs': { start: '0:10', end: '0:17' },

  // Star Wars: Jedi Outcast (JKXR)
  'jkxr': { start: '0:25', end: '0:32' },
  'ToM-wz3v-NU': { start: '0:25', end: '0:32' },

  // Quake 1 VR (QuakeQuest)
  'quakequest': { start: '0:18', end: '0:58' },
  'A42X55BKF6Q': { start: '0:18', end: '0:58' },

  // Quake 2 VR
  'quake2quest': { start: '0:50', end: '1:50' },
  'qByCUtT6WG0': { start: '0:50', end: '1:50' },

  // Tomb Raider (Beef Raider XR)
  'beefraiderxr': { start: '0:15', end: '0:22' },
  'aTtOlcLPbCs': { start: '0:15', end: '0:22' },

  // Prey VR
  'preyvr': { start: '0:30', end: '0:37' },
  'e8KZmDCdPb4': { start: '0:30', end: '0:37' },

  // QuestZDoom
  'questzdoom': { start: '0:12', end: '0:19' },
  'OoNCvmUxUFE': { start: '0:12', end: '0:19' },

  // Counter-Strike VR (CSVR)
  'csvr': { start: '0:15', end: '0:22' },
  '5ivdcCWly54': { start: '0:15', end: '0:22' },

  // The Simpsons: Hit & Run VR
  'simpsonshitrun': { start: '0:15', end: '0:22' },
  'UXMeylAkNGE': { start: '0:15', end: '0:22' },

  // Halo CE VR
  'halocequest': { start: '6:07', end: '7:00' },
  'mFSmPcHQpLM': { start: '6:07', end: '7:00' },

  // GTA San Andreas VR
  'gta-sa-vr-quest': { start: '4:00', end: '5:00' },
  '9NAW-5CKdFc': { start: '4:00', end: '5:00' }
}
