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
 * List of port slugs that have verified local MP4 preview clips available in /previews/
 */
export const AVAILABLE_VIDEO_PREVIEWS: string[] = [
  'astroquest',
  'avp-vr',
  'beefraiderxr',
  'citravr',
  'csvr',
  'doom3quest',
  'galaxyquest',
  'generals-zero-hour-xr',
  'goldeneye-vr',
  'gran-turismo-2-vr',
  'gta-sa-vr-quest',
  'halocequest',
  'harry-potter-vr',
  'hexen2vr',
  'homeworld-unbound',
  'iron-lung-vr',
  'jkxr',
  'lambda1vr',
  'majoras-mask-vr',
  'nolf-vr',
  'ocarina-of-time-vr',
  'perfect-dark-vr',
  'ppsspp-vr',
  'preyvr',
  'primedgun',
  'quake2quest',
  'quakequest',
  'qualyx',
  'questcarnage',
  'questcraft',
  'questzdoom',
  'razexr',
  'road-rash-jailbreak-vr',
  'rtcwquest',
  'sclerosis-vr',
  'sega-rally-vr',
  'simpsonshitrun',
  'sourcevr',
  'starfox-enhanced-vr',
  'time-crisis-vr',
  'twilight-princess-vr',
  'unreal-gold-vr',
  'ut99-vr-quest',
  'vice-city-vr-quest',
  'wiicompiled-vr-plus',
  'winlatorxr',
  'xrkart-64'
]

/**
 * Checks if a port has any video preview capability (local MP4 or custom video_preview_url)
 */
export function hasVideoPreview(slug: string, videoUrl?: string | null): boolean {
  if (videoUrl && videoUrl.trim()) return true
  if (AVAILABLE_VIDEO_PREVIEWS.includes(slug)) return true
  return false
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
  'lambda1vr': { start: '0:40', end: '1:40' },
  '-Fa1ce9x88Y': { start: '0:40', end: '1:40' },

  // Doom 3 VR
  'doom3quest': { start: '0:39', end: '1:39' },
  'y2y9C0E2kPk': { start: '0:39', end: '1:39' },

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
  'simpsonshitrun': { start: '13:57', end: '14:57' },
  'UQJZKjkRzyI': { start: '13:57', end: '14:57' },

  // Halo CE VR
  'halocequest': { start: '6:07', end: '7:00' },
  'mFSmPcHQpLM': { start: '6:07', end: '7:00' },

  // GTA San Andreas VR
  'gta-sa-vr-quest': { start: '4:00', end: '5:00' },
  '9NAW-5CKdFc': { start: '4:00', end: '5:00' },

  // Carmageddon VR (QuestCarNage)
  'questcarnage': { start: '12:22', end: '13:22' },
  'wdP-DzNOv5U': { start: '12:22', end: '13:22' },

  // Harry Potter VR
  'harry-potter-vr': { start: '2:14', end: '3:14' },
  'sJILoIKG9Mo': { start: '2:14', end: '3:14' },

  // Perfect Dark VR
  'perfect-dark-vr': { start: '4:14', end: '5:14' },
  'AbqMNh09U04': { start: '4:14', end: '5:14' },

  // QuestCraft (Minecraft: Java Edition)
  'questcraft': { start: '1:20', end: '2:05' },
  'PomiV1iyTp8': { start: '1:20', end: '2:05' },

  // RazeXR (Duke Nukem 3D, Blood, Shadow Warrior)
  'razexr': { start: '0:38', end: '1:38' },
  'BYz7r7q65sk': { start: '0:38', end: '1:38' },

  // Hexen II VR
  'hexen2vr': { start: '0:17', end: '1:17' },
  'wKyfjeuv46o': { start: '0:17', end: '1:17' },

  // Unreal Tournament '99 VR (UT99 Quest)
  'ut99-vr-quest': { start: '3:48', end: '4:20' },
  'DnLHVDp9o0Q': { start: '3:48', end: '4:20' },

  // Aliens Versus Predator VR (middle 1 minute of the video)
  'avp-vr': { start: '1:25', end: '2:25' },
  'IxnrIYhSEMs': { start: '1:25', end: '2:25' },

  // No One Lives ForeVR (ReLith / NOLF)
  'nolf-vr': { start: '5:00', end: '6:00' },
  '6NsGBkCp9ro': { start: '5:00', end: '6:00' },

  // Sclerosis (Amnesia: The Dark Descent VR remake)
  'sclerosis-vr': { start: '36:20', end: '37:20' },
  'UpTDQZr0TWw': { start: '36:20', end: '37:20' },

  // Port0r: Rally VR (Sega Rally Championship)
  'sega-rally-vr': { start: '0:11', end: '1:11' },
  'FqwEK0hJ_Yc': { start: '0:11', end: '1:11' },

  // Star Fox Enhanced (Quest 3 VR build)
  'starfox-enhanced-vr': { start: '2:00', end: '3:00' },
  'UAPKVEGoMvo': { start: '2:00', end: '3:00' },

  // Unreal Gold VR
  'unreal-gold-vr': { start: '6:40', end: '7:40' },
  'ClQXAt0FhUo': { start: '6:40', end: '7:40' },

  // Homeworld: Unbound
  'homeworld-unbound': { start: '4:40', end: '5:40' },
  'rhCOSpSf-NQ': { start: '4:40', end: '5:40' },

  // Quest 3: OOT (Ocarina of Time VR)
  'ocarina-of-time-vr': { start: '1:30', end: '2:30' },
  'fzhbhrotI1Q': { start: '1:30', end: '2:30' },

  // XRKart 64 (Mario Kart 64 VR)
  'xrkart-64': { start: '1:00', end: '2:00' },
  '30bVFznHI3M': { start: '1:00', end: '2:00' },

  // Wiicompiled VR PLUS (Mario Kart Wii VR)
  'wiicompiled-vr-plus': { start: '0:10', end: '1:00' },
  'DnO2lIeBW2g': { start: '0:10', end: '1:00' },

  // TPVR (Zelda: Twilight Princess VR). The source clip opens on a white frame, so the window starts 5s later.
  'twilight-princess-vr': { start: '2:22', end: '3:22' },
  '1OZPe0AD2Zs': { start: '2:22', end: '3:22' },

  // Majora's Mask VR (2Ship2Harkinian VR)
  'majoras-mask-vr': { start: '5:47', end: '6:47' },
  'ZRu6Zk5BnFY': { start: '5:47', end: '6:47' },

  // Generals: Zero Hour XR (C&C Generals Zero Hour)
  'generals-zero-hour-xr': { start: '3:58', end: '4:58' },
  'BYddTICZH9g': { start: '3:58', end: '4:58' }
}
