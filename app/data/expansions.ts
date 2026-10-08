import type { Port } from '~/types/port'

export interface PortCampaign {
  id: string
  name: string
  badge: string
  isBase: boolean
  folder: string
  fullPath: string
  steamPath?: string
  exampleFiles: string
  instruction: string
  storeUrl?: string | null
  storeName?: string | null
}

export const PORT_EXPANSIONS: Record<string, PortCampaign[]> = {
  lambda1vr: [
    {
      id: 'hl1',
      name: 'Half-Life (Base)',
      badge: 'Base Campaign',
      isBase: true,
      folder: 'valve',
      fullPath: '/sdcard/xash/valve/',
      steamPath: 'Half-Life/valve/',
      exampleFiles: 'pak0.pak, valve folder contents',
      instruction: 'Drop the "valve" folder from Half-Life 1',
      storeUrl: 'https://store.steampowered.com/app/70/HalfLife/',
      storeName: 'Steam ($9.99)'
    },
    {
      id: 'opfor',
      name: 'Opposing Force',
      badge: 'Expansion (DLC)',
      isBase: false,
      folder: 'gearbox',
      fullPath: '/sdcard/xash/gearbox/',
      steamPath: 'Half-Life/gearbox/',
      exampleFiles: 'opfor.pak, gearbox folder contents',
      instruction: 'Drop the "gearbox" folder from Opposing Force',
      storeUrl: 'https://store.steampowered.com/app/50/HalfLife_Opposing_Force/',
      storeName: 'Steam ($4.99)'
    },
    {
      id: 'bshift',
      name: 'Blue Shift',
      badge: 'Expansion (DLC)',
      isBase: false,
      folder: 'bshift',
      fullPath: '/sdcard/xash/bshift/',
      steamPath: 'Half-Life/bshift/',
      exampleFiles: 'bshift.pak, bshift folder contents',
      instruction: 'Drop the "bshift" folder from Blue Shift',
      storeUrl: 'https://store.steampowered.com/app/130/HalfLife_Blue_Shift/',
      storeName: 'Steam ($4.99)'
    }
  ],
  sourcevr: [
    {
      id: 'hl2',
      name: 'Half-Life 2',
      badge: 'Base Campaign',
      isBase: true,
      folder: 'hl2',
      fullPath: '/sdcard/SourceVRPort/common/hl2/',
      steamPath: 'Half-Life 2/hl2/',
      exampleFiles: 'hl2 and platform folders',
      instruction: 'Drop the "hl2" and "platform" folders',
      storeUrl: 'https://store.steampowered.com/app/220/HalfLife_2/',
      storeName: 'Steam'
    },
    {
      id: 'ep1',
      name: 'Episode One',
      badge: 'Expansion',
      isBase: false,
      folder: 'episodic',
      fullPath: '/sdcard/SourceVRPort/common/episodic/',
      steamPath: 'Half-Life 2 Episode One/episodic/',
      exampleFiles: 'episodic folder contents',
      instruction: 'Drop the "episodic" folder from Episode One',
      storeUrl: 'https://store.steampowered.com/app/380/HalfLife_2_Episode_One/',
      storeName: 'Steam'
    },
    {
      id: 'ep2',
      name: 'Episode Two',
      badge: 'Expansion',
      isBase: false,
      folder: 'ep2',
      fullPath: '/sdcard/SourceVRPort/common/ep2/',
      steamPath: 'Half-Life 2 Episode Two/ep2/',
      exampleFiles: 'ep2 folder contents',
      instruction: 'Drop the "ep2" folder from Episode Two',
      storeUrl: 'https://store.steampowered.com/app/420/HalfLife_2_Episode_Two/',
      storeName: 'Steam'
    },
    {
      id: 'portal',
      name: 'Portal',
      badge: 'Spin-off',
      isBase: false,
      folder: 'portal',
      fullPath: '/sdcard/SourceVRPort/common/portal/',
      steamPath: 'Portal/portal/',
      exampleFiles: 'portal folder contents',
      instruction: 'Drop the "portal" folder from Portal 1',
      storeUrl: 'https://store.steampowered.com/app/400/Portal/',
      storeName: 'Steam'
    }
  ],
  doom3quest: [
    {
      id: 'base',
      name: 'Doom 3',
      badge: 'Base Campaign',
      isBase: true,
      folder: 'base',
      fullPath: '/sdcard/Doom3Quest/base/',
      steamPath: 'DOOM 3/base/',
      exampleFiles: 'pak000.pk4 through pak008.pk4',
      instruction: 'Drop the "base" folder or .pk4 files',
      storeUrl: 'https://store.steampowered.com/app/9050/DOOM_3/',
      storeName: 'Steam'
    },
    {
      id: 'd3xp',
      name: 'Resurrection of Evil',
      badge: 'Expansion (DLC)',
      isBase: false,
      folder: 'd3xp',
      fullPath: '/sdcard/Doom3Quest/d3xp/',
      steamPath: 'DOOM 3/d3xp/',
      exampleFiles: 'pak000.pk4 from d3xp folder',
      instruction: 'Drop the "d3xp" folder from Resurrection of Evil',
      storeUrl: 'https://store.steampowered.com/app/9050/DOOM_3/',
      storeName: 'Steam'
    }
  ],
  quake2quest: [
    {
      id: 'baseq2',
      name: 'Quake II',
      badge: 'Base Game',
      isBase: true,
      folder: 'baseq2',
      fullPath: '/sdcard/Quake2Quest/baseq2/',
      steamPath: 'Quake II/baseq2/',
      exampleFiles: 'pak0.pak, baseq2 game data',
      instruction: 'Drop the "baseq2" folder or pak0.pak',
      storeUrl: 'https://store.steampowered.com/app/2320/Quake_II/',
      storeName: 'Steam'
    },
    {
      id: 'xatrix',
      name: 'The Reckoning',
      badge: 'Mission Pack 1',
      isBase: false,
      folder: 'xatrix',
      fullPath: '/sdcard/Quake2Quest/xatrix/',
      steamPath: 'Quake II/xatrix/',
      exampleFiles: 'pak0.pak from xatrix folder',
      instruction: 'Drop the "xatrix" folder from Mission Pack 1',
      storeUrl: 'https://store.steampowered.com/app/2320/Quake_II/',
      storeName: 'Steam'
    },
    {
      id: 'rogue',
      name: 'Ground Zero',
      badge: 'Mission Pack 2',
      isBase: false,
      folder: 'rogue',
      fullPath: '/sdcard/Quake2Quest/rogue/',
      steamPath: 'Quake II/rogue/',
      exampleFiles: 'pak0.pak from rogue folder',
      instruction: 'Drop the "rogue" folder from Mission Pack 2',
      storeUrl: 'https://store.steampowered.com/app/2320/Quake_II/',
      storeName: 'Steam'
    }
  ],
  razexr: [
    {
      id: 'duke3d',
      name: 'Duke Nukem 3D',
      badge: 'Build Engine',
      isBase: true,
      folder: 'duke3d',
      fullPath: '/sdcard/RazeXR/duke3d/',
      steamPath: 'duke3d/',
      exampleFiles: 'duke3d.grp',
      instruction: 'Drop the "duke3d" folder or duke3d.grp',
      storeUrl: 'https://store.steampowered.com/app/434050/Duke_Nukem_3D_20th_Anniversary_World_Tour/',
      storeName: 'Steam'
    },
    {
      id: 'blood',
      name: 'Blood',
      badge: 'Build Engine',
      isBase: false,
      folder: 'blood',
      fullPath: '/sdcard/RazeXR/blood/',
      steamPath: 'blood/',
      exampleFiles: 'blood.rff and audio files',
      instruction: 'Drop the "blood" folder with blood.rff',
      storeUrl: 'https://store.steampowered.com/app/1010750/Blood_Fresh_Supply/',
      storeName: 'Steam'
    },
    {
      id: 'sw',
      name: 'Shadow Warrior',
      badge: 'Build Engine',
      isBase: false,
      folder: 'sw',
      fullPath: '/sdcard/RazeXR/sw/',
      steamPath: 'sw/',
      exampleFiles: 'sw.grp',
      instruction: 'Drop the "sw" folder or sw.grp',
      storeUrl: 'https://store.steampowered.com/app/225160/Shadow_Warrior_Classic_Redux/',
      storeName: 'Steam'
    }
  ],
  qualyx: [
    {
      id: 'hlvr_campaign',
      name: 'Half-Life: Alyx Campaign',
      badge: 'Main Campaign',
      isBase: true,
      folder: 'game',
      fullPath: '/sdcard/Qualyx/game/',
      steamPath: 'Half-Life Alyx/game/',
      exampleFiles: 'hlvr/pak01_dir.vpk, core/pak01_dir.vpk',
      instruction: 'Copy the "hlvr" and "core" folders from your PC Steam "Half-Life Alyx/game/" into "/sdcard/Qualyx/game/"',
      storeUrl: 'https://store.steampowered.com/app/546560/HalfLife_Alyx/',
      storeName: 'Steam'
    }
  ]
}

export function getDefaultFolderInfo(port: Port): {
  folder: string
  fullPath: string
  exampleFiles: string
  instruction: string
} {
  const slug = port.slug
  const map: Record<string, { folder: string; fullPath: string; exampleFiles: string; instruction: string }> = {
    rtcwquest: {
      folder: 'main',
      fullPath: '/sdcard/RTCWQuest/main/',
      exampleFiles: 'pak0.pk3, sp_pak1.pk3, sp_pak2.pk3...',
      instruction: 'Drop the "main" folder or its .pk3 files'
    },
    questzdoom: {
      folder: 'wads',
      fullPath: '/sdcard/QuestZDoom/wads/',
      exampleFiles: 'DOOM.WAD, DOOM2.WAD, mods...',
      instruction: 'Drop your commercial .wad files here'
    },
    jkxr: {
      folder: 'base',
      fullPath: '/sdcard/JKXR/base/',
      exampleFiles: 'assets0.pk3, assets1.pk3, assets2.pk3...',
      instruction: 'Drop the "base" folder or .pk3 assets'
    },
    quakequest: {
      folder: 'id1',
      fullPath: '/sdcard/QuakeQuest/id1/',
      exampleFiles: 'pak0.pak, pak1.pak',
      instruction: 'Drop the "id1" folder with pak files'
    },
    csvr: {
      folder: 'cstrike',
      fullPath: '/sdcard/xash/cstrike/',
      exampleFiles: 'cstrike folder contents',
      instruction: 'Drop the "cstrike" folder or game files'
    },
    hexen2vr: {
      folder: 'data1',
      fullPath: '/sdcard/Hexen2VR/data1/',
      exampleFiles: 'pak0.pak, pak1.pak',
      instruction: 'Drop the "data1" folder with pak files'
    },
    preyvr: {
      folder: 'preybase',
      fullPath: '/sdcard/preyvr/preybase/',
      exampleFiles: 'pak000.pk4 through pak004.pk4',
      instruction: 'Drop the "preybase" folder or .pk4 files'
    },
    beefraiderxr: {
      folder: 'BeefRaiderXR',
      fullPath: '/sdcard/BeefRaiderXR/',
      exampleFiles: 'GAME.GOG / TOMB.DAT, audio tracks',
      instruction: 'Drop Tomb Raider 1 PC data files here'
    },
    halocequest: {
      folder: 'HaloCEQuest',
      fullPath: '/sdcard/HaloCEQuest/',
      exampleFiles: 'Halo CE Xbox ISO or extracted maps',
      instruction: 'Drop your Halo CE Xbox ISO or data files'
    },
    citravr: {
      folder: 'roms',
      fullPath: '/sdcard/CitraVR/roms/',
      exampleFiles: '.3ds or decrypted .cia ROMs',
      instruction: 'Drop Nintendo 3DS ROM files here'
    },
    'ppsspp-vr': {
      folder: 'GAME',
      fullPath: '/sdcard/PSP/GAME/',
      exampleFiles: '.iso or .cso dump files',
      instruction: 'Drop PSP ISO/CSO backup dumps here'
    },
    primedgun: {
      folder: 'PrimedGun',
      fullPath: '/sdcard/PrimedGun/',
      exampleFiles: 'Metroid Prime (USA) (Rev 0).iso',
      instruction: 'Drop Metroid Prime GameCube ISO backup'
    },
    astroquest: {
      folder: 'games',
      fullPath: '/sdcard/Android/data/com.astrobotquest.vrhost/files/games/',
      exampleFiles: 'ASTRO BOT CUSA12392 folder or .pkg',
      instruction: 'Drop PS4 game dump folder or .pkg'
    },
    simpsonshitrun: {
      folder: 'SimpsonsHitRun',
      fullPath: '/sdcard/SimpsonsHitRun/',
      exampleFiles: 'Original PC game files',
      instruction: 'Drop the complete SimpsonsHitRun PC folder'
    },
    qualyx: {
      folder: 'game',
      fullPath: '/sdcard/Qualyx/game/',
      exampleFiles: 'hlvr/pak01_dir.vpk, core/pak01_dir.vpk',
      instruction: 'Drop the "hlvr" and "core" folders from PC Half-Life Alyx/game/'
    },
    winlatorxr: {
      folder: 'Download',
      fullPath: '/sdcard/Download/',
      exampleFiles: '.exe, .msi, or Windows game folders',
      instruction: 'Drop Windows game folders or installers here'
    },
    'gran-turismo-2-vr': {
      folder: 'GT2VR',
      fullPath: '/sdcard/GT2VR/',
      exampleFiles: '.bin / .cue / .iso / .chd',
      instruction: 'Drop your Gran Turismo 2 PS1 disc dump'
    },
    'road-rash-jailbreak-vr': {
      folder: 'RoadRashVR',
      fullPath: '/sdcard/RoadRashVR/',
      exampleFiles: '.bin / .cue / .iso / .chd',
      instruction: 'Drop your Road Rash: Jailbreak PS1 disc dump'
    },
    'goldeneye-vr': {
      folder: 'GoldenEyeVR',
      fullPath: '/sdcard/GoldenEyeVR/',
      exampleFiles: 'baserom.us.z64',
      instruction: 'Drop the GoldenEye 007 USA N64 ROM'
    },
    'perfect-dark-vr': {
      folder: 'PerfectDarkVR',
      fullPath: '/sdcard/PerfectDarkVR/',
      exampleFiles: 'pd.z64',
      instruction: 'Drop the Perfect Dark USA N64 ROM'
    }
  }

  const mapped = map[slug]
  if (mapped) return mapped

  const rawPath = port.internal_storage_path || '/sdcard/'
  const segments = rawPath.replace(/^\/sdcard\/|\/$/g, '').split('/').filter(Boolean)
  const folder = (segments.length ? segments[segments.length - 1] : '') || 'data'
  return {
    folder,
    fullPath: rawPath,
    exampleFiles: 'Base game assets',
    instruction: `Drop the "${folder}" folder or game files here`
  }
}

export function getPortCampaigns(port: Port): PortCampaign[] {
  const expansions = PORT_EXPANSIONS[port.slug]
  if (expansions) {
    return expansions
  }

  const defaultInfo = getDefaultFolderInfo(port)
  return [
    {
      id: 'base',
      name: 'Base Game',
      badge: 'Main',
      isBase: true,
      folder: defaultInfo.folder,
      fullPath: defaultInfo.fullPath,
      exampleFiles: defaultInfo.exampleFiles,
      instruction: defaultInfo.instruction,
      storeUrl: port.base_game_url,
      storeName: port.base_game_store || 'Store'
    }
  ]
}
