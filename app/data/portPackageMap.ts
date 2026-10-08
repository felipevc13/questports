import type { Port, PortCategory, PortWorkflowType } from '~/types/port'
export type { PortWorkflowType }

export type InstallType = 'direct_apk' | 'apk_and_assets' | 'pc_builder_required'

export interface PortFolderRequirement {
  id: string
  name: string
  folderName: string
  targetPath: string
  altPaths?: string[]
  required: boolean
  expectedFiles?: string[]
  fileExtensionPattern?: string
  description?: string
}

export interface FolderCheckResult {
  folderDef: PortFolderRequirement
  status: 'ready' | 'incomplete' | 'missing'
  detectedPath: string
  filesFound: string[]
  missingExpectedFiles: string[]
}

export interface PortPackageConfig {
  slug: string
  packageName: string
  altPackages?: string[]
  installType: InstallType
  workflowType?: PortWorkflowType
  criticalFiles: string[]
  fileGuidance?: string
  sourceStoreName?: 'Steam' | 'GOG' | 'Nintendo Wii Disc' | 'Itch.io' | 'Other'
  pcToolName?: string
  targetPath?: string
  altPaths?: string[]
  romExtensions?: string[]
  romDirectories?: string[]
  folders?: PortFolderRequirement[]
}

export const PORT_PACKAGE_CONFIGS: Record<string, PortPackageConfig> = {
  rtcwquest: {
    slug: 'rtcwquest',
    packageName: 'com.drbeef.rtcwquest',
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['main/pak0.pk3'],
    fileGuidance: 'Place official Return to Castle Wolfenstein pak files (.pk3) in RTCWQuest/main.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/RTCWQuest/',
    folders: [
      {
        id: 'rtcw_main',
        name: 'RTCW Main Assets',
        folderName: 'main',
        targetPath: '/sdcard/RTCWQuest/main/',
        required: true,
        expectedFiles: ['pak0.pk3'],
        fileExtensionPattern: '\.pk3$',
        description: 'Original Wolfenstein game asset archives'
      }
    ]
  },
  lambda1vr: {
    slug: 'lambda1vr',
    packageName: 'com.drbeef.lambda1vr',
    altPackages: ['mod.drbeef.lambda1vr', 'su.xash.oldroot', 'su.xash.engine'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['valve/halflife.wad', 'valve/pak0.pak'],
    fileGuidance: 'Copy your Steam Half-Life "valve" directory into xash/valve.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/xash/',
    folders: [
      {
        id: 'valve',
        name: 'Half-Life 1 Core (valve)',
        folderName: 'valve',
        targetPath: '/sdcard/xash/valve/',
        required: true,
        expectedFiles: ['halflife.wad'],
        description: 'Original Half-Life 1 base assets'
      },
      {
        id: 'bshift',
        name: 'Blue Shift Expansion (bshift)',
        folderName: 'bshift',
        targetPath: '/sdcard/xash/bshift/',
        required: false,
        description: 'Optional Blue Shift campaign files'
      },
      {
        id: 'gearbox',
        name: 'Opposing Force (gearbox)',
        folderName: 'gearbox',
        targetPath: '/sdcard/xash/gearbox/',
        required: false,
        description: 'Optional Opposing Force campaign files'
      }
    ]
  },
  doom3quest: {
    slug: 'doom3quest',
    packageName: 'com.drbeef.doom3quest',
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['base/pak000.pk4'],
    fileGuidance: 'Copy pak000-pak008.pk4 from your Steam Doom 3 "base" folder into Doom3Quest/base.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/Doom3Quest/',
    folders: [
      {
        id: 'd3_base',
        name: 'Doom 3 Base Assets',
        folderName: 'base',
        targetPath: '/sdcard/Doom3Quest/base/',
        required: true,
        expectedFiles: ['pak000.pk4', 'pak001.pk4'],
        fileExtensionPattern: '\.pk4$',
        description: 'Original Doom 3 game data pk4 archives'
      },
      {
        id: 'd3_d3xp',
        name: 'Resurrection of Evil (d3xp)',
        folderName: 'd3xp',
        targetPath: '/sdcard/Doom3Quest/d3xp/',
        required: false,
        description: 'Optional RoE expansion pack'
      }
    ]
  },
  questzdoom: {
    slug: 'questzdoom',
    packageName: 'com.drbeef.questzdoom',
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['wads/doom.wad'],
    fileGuidance: 'Place DOOM.WAD, DOOM2.WAD, or other IWADs in QuestZDoom/wads.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/QuestZDoom/',
    folders: [
      {
        id: 'qzdoom_wads',
        name: 'Doom IWADs & PWADs',
        folderName: 'wads',
        targetPath: '/sdcard/QuestZDoom/wads/',
        required: true,
        fileExtensionPattern: '\.wad$',
        description: 'DOOM.WAD, DOOM2.WAD, PLUTONIA.WAD or TNT.WAD'
      },
      {
        id: 'qzdoom_mods',
        name: 'Mods & TC Packs',
        folderName: 'mods',
        targetPath: '/sdcard/QuestZDoom/mods/',
        required: false,
        fileExtensionPattern: '\.(pk3|wad|zip)$',
        description: 'Custom gameplay mods like Brutal Doom'
      }
    ]
  },
  jkxr: {
    slug: 'jkxr',
    packageName: 'com.drbeef.jkxr',
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['base/assets0.pk3'],
    fileGuidance: 'Copy your Steam JK2 "base" directory into JKXR/base.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/JKXR/',
    folders: [
      {
        id: 'jk2_base',
        name: 'Jedi Outcast Assets',
        folderName: 'base',
        targetPath: '/sdcard/JKXR/base/',
        required: true,
        expectedFiles: ['assets0.pk3'],
        fileExtensionPattern: '\.pk3$',
        description: 'Original Jedi Knight II data files'
      }
    ]
  },
  quake2quest: {
    slug: 'quake2quest',
    packageName: 'com.drbeef.quake2quest',
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['baseq2/pak0.pak'],
    fileGuidance: 'Copy pak0.pak from Quake II "baseq2" into Quake2Quest/baseq2.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/Quake2Quest/',
    folders: [
      {
        id: 'q2_base',
        name: 'Quake II Base Data',
        folderName: 'baseq2',
        targetPath: '/sdcard/Quake2Quest/baseq2/',
        required: true,
        expectedFiles: ['pak0.pak'],
        fileExtensionPattern: '\.pak$',
        description: 'Quake II official pak archives'
      }
    ]
  },
  preyvr: {
    slug: 'preyvr',
    packageName: 'com.lvonasek.preyvr',
    altPackages: ['com.drbeef.preyvr'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['preybase/pak000.pk4', 'base/pak000.pk4'],
    fileGuidance: 'Copy pak000-pak004.pk4 from Prey (2006) into preyvr/preybase/ or PreyVR/base/.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/preyvr/',
    folders: [
      {
        id: 'prey_base',
        name: 'Prey 2006 Assets',
        folderName: 'preybase',
        targetPath: '/sdcard/preyvr/preybase/',
        altPaths: [
          '/sdcard/preyvr/preybase/',
          '/sdcard/PreyVR/preybase/',
          '/sdcard/PreyVR/base/',
          '/sdcard/preyvr/base/',
          '/sdcard/Android/data/com.lvonasek.preyvr/files/preybase/',
          '/sdcard/Android/data/com.drbeef.preyvr/files/base/'
        ],
        required: true,
        expectedFiles: ['pak000.pk4'],
        fileExtensionPattern: '\\.pk4$',
        description: 'Original Prey 2006 PC assets'
      }
    ]
  },
  beefraiderxr: {
    slug: 'beefraiderxr',
    packageName: 'com.drbeef.beefraiderxr',
    altPackages: ['com.teambeef.beefraiderxr'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['data/LEVEL1.PHD'],
    fileGuidance: 'Copy your original Tomb Raider 1 data files into BeefRaiderXR.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/BeefRaiderXR/',
    folders: [
      {
        id: 'tr1_data',
        name: 'Tomb Raider 1 Data',
        folderName: 'data',
        targetPath: '/sdcard/BeefRaiderXR/data/',
        required: true,
        fileExtensionPattern: '\.(phd|psx)$',
        description: 'Level and sound files from Tomb Raider 1'
      }
    ]
  },
  quakequest: {
    slug: 'quakequest',
    packageName: 'com.drbeef.quakequest',
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['id1/pak0.pak'],
    fileGuidance: 'Copy pak0.pak and pak1.pak from Quake "id1" into QuakeQuest/id1.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/QuakeQuest/',
    folders: [
      {
        id: 'q1_id1',
        name: 'Quake 1 Base Data (id1)',
        folderName: 'id1',
        targetPath: '/sdcard/QuakeQuest/id1/',
        required: true,
        expectedFiles: ['pak0.pak'],
        fileExtensionPattern: '\.pak$',
        description: 'Original Quake 1 id1 data pak archives'
      }
    ]
  },
  razexr: {
    slug: 'razexr',
    packageName: 'com.drbeef.razexr',
    altPackages: ['com.teambeef.razexr'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['duke3d.grp'],
    fileGuidance: 'Copy duke3d.grp, blood.rff, or sw.grp into RazeXR root.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/RazeXR/',
    folders: [
      {
        id: 'raze_root',
        name: 'Build Engine Game Files',
        folderName: 'RazeXR',
        targetPath: '/sdcard/RazeXR/',
        required: true,
        fileExtensionPattern: '\.(grp|rff|dat|def)$',
        description: 'duke3d.grp, blood.rff, or sw.grp'
      }
    ]
  },
  csvr: {
    slug: 'csvr',
    packageName: 'com.lvonasek.csvr',
    altPackages: ['com.teambeef.csvr'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['cstrike/cstrike.wad'],
    fileGuidance: 'Copy your Steam Counter-Strike 1.6 "cstrike" folder into xash/cstrike.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/xash/',
    folders: [
      {
        id: 'csvr_cstrike',
        name: 'Counter-Strike 1.6 Data (cstrike)',
        folderName: 'cstrike',
        targetPath: '/sdcard/xash/cstrike/',
        required: true,
        expectedFiles: ['cstrike.wad'],
        description: 'Original CS 1.6 assets from Steam'
      }
    ]
  },
  hexen2vr: {
    slug: 'hexen2vr',
    packageName: 'com.uhexen2.vhexen2',
    altPackages: ['com.alexnax.vhexen2'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['data1/pak0.pak'],
    fileGuidance: 'Copy Hexen II "data1" pak files into Hexen2VR/data1.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/Hexen2VR/',
    folders: [
      {
        id: 'hexen2_data1',
        name: 'Hexen II Base (data1)',
        folderName: 'data1',
        targetPath: '/sdcard/Hexen2VR/data1/',
        required: true,
        expectedFiles: ['pak0.pak'],
        fileExtensionPattern: '\.pak$',
        description: 'Hexen II game data archives'
      }
    ]
  },
  galaxyquest: {
    slug: 'galaxyquest',
    packageName: 'com.galaxy.quest',
    installType: 'apk_and_assets',
    workflowType: 'smart_converter',
    criticalFiles: ['sys/main.dol'],
    fileGuidance: 'Cook and extract your USA Super Mario Galaxy Wii disc via cook.py into GalaxyQuest/.',
    sourceStoreName: 'Nintendo Wii Disc',
    targetPath: '/sdcard/GalaxyQuest/',
    folders: [
      {
        id: 'gq_sys',
        name: 'Wii Executable (sys)',
        folderName: 'sys',
        targetPath: '/sdcard/GalaxyQuest/sys/',
        altPaths: [
          '/sdcard/GalaxyQuest/sys/',
          '/sdcard/Android/data/com.galaxy.quest/files/game/sys/'
        ],
        required: true,
        expectedFiles: ['main.dol'],
        description: 'Extracted Wii system boot files'
      },
      {
        id: 'gq_files',
        name: 'Converted Assets (files)',
        folderName: 'files',
        targetPath: '/sdcard/GalaxyQuest/files/',
        altPaths: [
          '/sdcard/GalaxyQuest/files/',
          '/sdcard/Android/data/com.galaxy.quest/files/game/files/'
        ],
        required: true,
        description: 'Extracted and byte-swapped Little-Endian assets'
      }
    ]
  },
  citravr: {
    slug: 'citravr',
    packageName: 'org.citra.citra_emu',
    altPackages: ['com.retro.citravr', 'org.citra.citra_vr'],
    installType: 'direct_apk',
    workflowType: 'emulator_roms',
    criticalFiles: [],
    fileGuidance: 'Self-contained Nintendo 3DS emulator. Place decrypted 3DS ROMs (.3ds, .cia, .cxi) in your CitraVR/roms directory.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/CitraVR/',
    romExtensions: ['.3ds', '.cia', '.cxi', '.app'],
    romDirectories: ['/sdcard/CitraVR/', '/sdcard/citra-emu/roms/', '/sdcard/Roms/3DS/'],
    folders: [
      {
        id: 'citra_roms',
        name: 'Nintendo 3DS ROMs',
        folderName: 'roms',
        targetPath: '/sdcard/CitraVR/roms/',
        required: false,
        fileExtensionPattern: '\.(3ds|cia|cxi|app)$',
        description: 'Decrypted Nintendo 3DS game files'
      }
    ]
  },
  'ppsspp-vr': {
    slug: 'ppsspp-vr',
    packageName: 'org.ppsspp.ppssppvr',
    altPackages: ['org.ppsspp.ppsspp'],
    installType: 'direct_apk',
    workflowType: 'emulator_roms',
    criticalFiles: [],
    fileGuidance: 'Self-contained Sony PSP emulator. Place your PSP ISO or CSO games in PSP/GAME.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/PSP/',
    romExtensions: ['.iso', '.cso', '.pbp'],
    romDirectories: ['/sdcard/PSP/GAME/'],
    folders: [
      {
        id: 'psp_games',
        name: 'PSP Game ISOs & CSOs',
        folderName: 'GAME',
        targetPath: '/sdcard/PSP/GAME/',
        required: false,
        fileExtensionPattern: '\.(iso|cso|pbp)$',
        description: 'Sony PlayStation Portable game dumps'
      }
    ]
  },
  winlatorxr: {
    slug: 'winlatorxr',
    packageName: 'com.winlator',
    altPackages: ['com.winlator.xr'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: [],
    fileGuidance: 'Install the APK, then copy Windows game folders or .exe installers into /sdcard/Download/ and launch them from WinlatorXR.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/Download/',
    folders: [
      {
        id: 'winlator_games',
        name: 'Windows Game Files',
        folderName: 'Download',
        targetPath: '/sdcard/Download/',
        required: true,
        fileExtensionPattern: '\\.(exe|msi)$',
        description: 'PC game folders or Windows installers'
      }
    ]
  },
  questcraft: {
    slug: 'questcraft',
    packageName: 'com.qcxr.qcxr',
    installType: 'direct_apk',
    workflowType: 'direct',
    criticalFiles: [],
    fileGuidance: 'Direct sideload! Sign in with your official Minecraft/Microsoft account directly on your Quest.',
    sourceStoreName: 'Other'
  },
  simpsonshitrun: {
    slug: 'simpsonshitrun',
    packageName: 'com.simpsonsHitAndRun.vr',
    altPackages: ['com.kote.sharvr', 'com.simpsonshitrun.vr'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['Simpsons.exe', 'art/frontend/scenedata/frontend.p3d'],
    fileGuidance: 'Copy your legally owned The Simpsons: Hit & Run PC installation files into SimpsonsHitRun/ on Quest storage.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/SimpsonsHitRun/',
    altPaths: ['/sdcard/SHAR/'],
    folders: [
      {
        id: 'shar_art',
        name: 'Art & Models',
        folderName: 'art',
        targetPath: '/sdcard/SimpsonsHitRun/art/',
        altPaths: ['/sdcard/SHAR/art/'],
        required: true,
        description: 'Original Hit & Run art resources'
      },
      {
        id: 'shar_sound',
        name: 'Sound & Music',
        folderName: 'sound',
        targetPath: '/sdcard/SimpsonsHitRun/sound/',
        altPaths: ['/sdcard/SHAR/sound/'],
        required: true,
        description: 'Hit & Run audio dialogues and music'
      }
    ]
  },
  'gta-sa-vr-quest': {
    slug: 'gta-sa-vr-quest',
    packageName: 'com.rockstargames.gtasa',
    altPackages: ['com.gtasa.vr'],
    installType: 'pc_builder_required',
    workflowType: 'obb_extractor',
    pcToolName: 'BUILD_AND_INSTALL.bat / .sh',
    criticalFiles: ['audio/streams/AA'],
    fileGuidance: 'Extract textures and audio from your legal Android Grand Theft Auto: San Andreas OBB/APK into Android/data/com.rockstargames.gtasa/files/.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/Android/data/com.rockstargames.gtasa/files/',
    folders: [
      {
        id: 'gtasa_texdb',
        name: 'Textures DB (texdb)',
        folderName: 'texdb',
        targetPath: '/sdcard/Android/data/com.rockstargames.gtasa/files/texdb/',
        required: true,
        description: 'gta3.img, gta_int.img, and texture archives'
      },
      {
        id: 'gtasa_audio',
        name: 'Audio Streams & SFX',
        folderName: 'audio',
        targetPath: '/sdcard/Android/data/com.rockstargames.gtasa/files/audio/',
        required: true,
        description: 'Radio stations, sound effects, and voices'
      }
    ]
  },
  'vice-city-vr-quest': {
    slug: 'vice-city-vr-quest',
    packageName: 'com.revc.miamivr',
    altPackages: ['com.rockstargames.gtavc'],
    installType: 'pc_builder_required',
    workflowType: 'obb_extractor',
    pcToolName: 'BUILD_AND_INSTALL.bat / .sh',
    criticalFiles: ['audio/streams/ambience'],
    fileGuidance: 'Extract audio and textures from your legal Android GTA Vice City OBB into Android/data/com.revc.miamivr/files/.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/Android/data/com.revc.miamivr/files/',
    folders: [
      {
        id: 'gtavc_audio',
        name: 'Vice City Audio & Radio',
        folderName: 'audio',
        targetPath: '/sdcard/Android/data/com.revc.miamivr/files/audio/',
        required: true,
        description: 'Radio stations and SFX'
      },
      {
        id: 'gtavc_data',
        name: 'Game Data (data)',
        folderName: 'data',
        targetPath: '/sdcard/Android/data/com.revc.miamivr/files/data/',
        required: true,
        description: 'Game configurations, maps, and models'
      }
    ]
  },
  questsam: {
    slug: 'questsam',
    packageName: 'com.github.maranone.questsam',
    altPackages: ['com.maranone.questsam'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['SE1_00.gro'],
    fileGuidance: 'Copy your Serious Sam Classic (First or Second Encounter) .gro files into QuestSam.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/QuestSam/',
    folders: [
      {
        id: 'sam_gro',
        name: 'Serious Sam GRO Archives',
        folderName: 'QuestSam',
        targetPath: '/sdcard/QuestSam/',
        required: true,
        expectedFiles: ['SE1_00.gro'],
        fileExtensionPattern: '\.gro$',
        description: 'Original Serious Sam game resource archives'
      }
    ]
  },
  'time-crisis-vr': {
    slug: 'time-crisis-vr',
    packageName: 'org.timecrisis.quest',
    altPackages: ['com.fabulousmachine.timecrisis'],
    installType: 'direct_apk',
    workflowType: 'smart_converter',
    criticalFiles: ['TIME_CRISIS.BIN'],
    fileGuidance: 'Place your legal copy of Time Crisis PS1/Arcade disc image or extracted BIN data into TimeCrisisVR.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/TimeCrisisVR/',
    folders: [
      {
        id: 'tc_data',
        name: 'Time Crisis Data',
        folderName: 'TimeCrisisVR',
        targetPath: '/sdcard/TimeCrisisVR/',
        required: true,
        description: 'Time Crisis game data and audio tracks'
      }
    ]
  },
  primedgun: {
    slug: 'primedgun',
    packageName: 'org.primedgun.primedgun.quest',
    altPackages: ['org.dolphinemu.dolphinvr.prime'],
    installType: 'direct_apk',
    workflowType: 'emulator_roms',
    criticalFiles: [],
    fileGuidance: 'Drop your legal Metroid Prime (GameCube ISO/GCM v1.0) into the PrimedGun directory.',
    sourceStoreName: 'Other',
    romExtensions: ['.iso', '.gcm', '.rvz'],
    romDirectories: ['/sdcard/PrimedGun/', '/sdcard/DolphinVR/GC/'],
    folders: [
      {
        id: 'prime_roms',
        name: 'Metroid Prime GameCube ISO',
        folderName: 'PrimedGun',
        targetPath: '/sdcard/PrimedGun/',
        required: false,
        fileExtensionPattern: '\.(iso|gcm|rvz)$',
        description: 'GameCube disc image (.iso, .gcm, .rvz)'
      }
    ]
  },
  astroquest: {
    slug: 'astroquest',
    packageName: 'com.astrobotquest.vrhost',
    altPackages: ['com.community.astroquest'],
    installType: 'apk_and_assets',
    workflowType: 'emulator_roms',
    criticalFiles: [],
    fileGuidance: 'Requires a dumped copy of ASTRO BOT Rescue Mission (PS4 CUSA12392). Place the unpacked folder or .pkg in the games directory.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/Android/data/com.astrobotquest.vrhost/files/',
    romExtensions: ['.pkg'],
    romDirectories: ['/sdcard/Android/data/com.astrobotquest.vrhost/files/games/'],
    folders: [
      {
        id: 'astro_games',
        name: 'ASTRO BOT PS4 Dump',
        folderName: 'games',
        targetPath: '/sdcard/Android/data/com.astrobotquest.vrhost/files/games/',
        required: true,
        description: 'Unpacked CUSA12392 dump folder or .pkg'
      }
    ]
  },
  sourcevr: {
    slug: 'sourcevr',
    packageName: 'com.sourcevrport.hl2vr',
    altPackages: ['com.nillerusr.sourcevr', 'com.valvesoftware.sourcevr', 'com.nillerusr.sourcemod'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['hl2/gameinfo.txt'],
    fileGuidance: 'Copy your Steam "Half-Life 2" (hl2 folder) or Portal assets into SourceVRPort/common.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/SourceVRPort/',
    folders: [
      {
        id: 'hl2_data',
        name: 'Half-Life 2 Data (hl2)',
        folderName: 'hl2',
        targetPath: '/sdcard/SourceVRPort/common/hl2/',
        required: true,
        expectedFiles: ['gameinfo.txt'],
        description: 'Official Half-Life 2 assets from Steam'
      }
    ]
  },
  halocequest: {
    slug: 'halocequest',
    packageName: 'com.halo.decomp.vr',
    altPackages: ['com.halo.decomp', 'com.haloce.questvr', 'com.haloce.vr', 'com.halo.decomp.quest'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['maps/ui.map', 'maps/bloodgulch.map'],
    fileGuidance: 'Requires the ORIGINAL Xbox (2001) Halo: Combat Evolved disc dumped as ISO/XISO (import it in-game) or its extracted maps in Documents/HaloCE/maps. The Steam MCC / Anniversary PC version does NOT work.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/Documents/HaloCE/',
    altPaths: ['/sdcard/Android/data/com.halo.decomp.vr/files/', '/sdcard/HaloCEQuest/'],
    folders: [
      {
        id: 'halo_maps',
        name: 'Halo CE Maps & Data',
        folderName: 'maps',
        targetPath: '/sdcard/Documents/HaloCE/maps/',
        altPaths: ['/sdcard/Android/data/com.halo.decomp.vr/files/maps/', '/sdcard/HaloCEQuest/maps/'],
        required: true,
        fileExtensionPattern: '\\.(map|iso|xiso)$',
        description: 'Halo maps (ui.map, bitmaps.map, sounds.map) or Xbox ISO'
      }
    ]
  },
  qualyx: {
    slug: 'qualyx',
    packageName: 'org.hlvr.quest',
    altPackages: ['com.community.qualyx'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['hlvr/pak01_dir.vpk', 'core/pak01_dir.vpk'],
    fileGuidance: 'Requires original Half-Life: Alyx files from Steam. Copy the "hlvr" and "core" folders from "Half-Life Alyx/game/" into "/sdcard/Qualyx/game/" on your headset.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/Qualyx/game/',
    folders: [
      {
        id: 'hlvr',
        name: 'Half-Life: Alyx Content (hlvr)',
        folderName: 'hlvr',
        targetPath: '/sdcard/Qualyx/game/hlvr/',
        required: true,
        expectedFiles: ['pak01_dir.vpk'],
        description: 'Primary game VPK archives from Steam (Half-Life Alyx/game/hlvr/)'
      },
      {
        id: 'core',
        name: 'Source 2 Core (core)',
        folderName: 'core',
        targetPath: '/sdcard/Qualyx/game/core/',
        required: true,
        expectedFiles: ['pak01_dir.vpk'],
        description: 'Engine core assets from Steam (Half-Life Alyx/game/core/)'
      }
    ]
  },
  'goldeneye-vr': {
    slug: 'goldeneye-vr',
    packageName: 'com.gevr.port',
    altPackages: ['com.mrsco.goldeneyevr'],
    installType: 'apk_and_assets',
    workflowType: 'smart_converter',
    criticalFiles: ['baserom.us.z64'],
    fileGuidance: 'Console decompilation. Requires your legal GoldenEye 007 (N64) USA ROM.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/GoldenEyeVR/',
    folders: [
      {
        id: 'ge_rom',
        name: 'GoldenEye 007 N64 ROM',
        folderName: 'GoldenEyeVR',
        targetPath: '/sdcard/GoldenEyeVR/',
        required: true,
        expectedFiles: ['baserom.us.z64'],
        fileExtensionPattern: '\\.z64$',
        description: 'USA N64 ROM (baserom.us.z64)'
      }
    ]
  },
  questcarnage: {
    slug: 'questcarnage',
    packageName: 'com.github.maranone.questcarnage',
    altPackages: ['com.maranone.carnage'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['DATA/OPTIONS.TXT'],
    fileGuidance: 'Copy your Carmageddon 1 (Steam or GOG) DATA folder into CarNage.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/CarNage/',
    folders: [
      {
        id: 'carnage_data',
        name: 'Carmageddon DATA',
        folderName: 'DATA',
        targetPath: '/sdcard/CarNage/DATA/',
        required: true,
        expectedFiles: ['OPTIONS.TXT'],
        description: 'Original Carmageddon DATA folder'
      }
    ]
  },
  'gran-turismo-2-vr': {
    slug: 'gran-turismo-2-vr',
    packageName: 'io.github.gt2pc.quest',
    altPackages: ['com.stakelogic.gt2vr'],
    installType: 'direct_apk',
    workflowType: 'emulator_roms',
    criticalFiles: [],
    fileGuidance: 'Drop your legal PlayStation 1 Gran Turismo 2 simulation or arcade disc image into GT2VR.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/GT2VR/',
    romExtensions: ['.bin', '.cue', '.iso', '.chd', '.pbp'],
    romDirectories: ['/sdcard/GT2VR/'],
    folders: [
      {
        id: 'gt2_roms',
        name: 'Gran Turismo 2 Disc Image',
        folderName: 'GT2VR',
        targetPath: '/sdcard/GT2VR/',
        required: true,
        fileExtensionPattern: '\\.(bin|cue|iso|chd|pbp)$',
        description: 'Legal PS1 Gran Turismo 2 disc dump'
      }
    ]
  },
  'gothic2-vr': {
    slug: 'gothic2-vr',
    packageName: 'com.gothic2vr.quest',
    altPackages: ['com.stakelogic.gothic2vr', 'org.opengothic.quest'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['Data/Gothic.dat'],
    fileGuidance: 'Copy your Gothic II Gold (Steam or GOG) Data and System directories into Gothic2VR.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/Gothic2VR/',
    folders: [
      {
        id: 'gothic2_data',
        name: 'Gothic II Data',
        folderName: 'Data',
        targetPath: '/sdcard/Gothic2VR/Data/',
        required: true,
        expectedFiles: ['Gothic.dat'],
        description: 'Gothic II Gold Data directory'
      }
    ]
  },
  'harry-potter-vr': {
    slug: 'harry-potter-vr',
    packageName: 'io.github.hpvr.quest',
    altPackages: ['com.stakelogic.harrypottervr', 'com.hpvr.quest'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['System/HP.u'],
    fileGuidance: "Copy your Harry Potter and the Sorcerer's Stone PC System and Maps directories into HarryPotterVR.",
    sourceStoreName: 'Other',
    targetPath: '/sdcard/HarryPotterVR/',
    folders: [
      {
        id: 'hp_system',
        name: 'System Scripts',
        folderName: 'System',
        targetPath: '/sdcard/HarryPotterVR/System/',
        required: true,
        expectedFiles: ['HP.u'],
        description: 'PC System directory with HP.u'
      }
    ]
  },
  'road-rash-jailbreak-vr': {
    slug: 'road-rash-jailbreak-vr',
    packageName: 'com.rrjb.vr',
    altPackages: ['com.stakelogic.roadrashvr', 'com.roadrashvr.quest'],
    installType: 'direct_apk',
    workflowType: 'emulator_roms',
    criticalFiles: [],
    fileGuidance: 'Drop your legal Road Rash: Jailbreak PS1 disc image into RoadRashVR.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/RoadRashVR/',
    romExtensions: ['.bin', '.cue', '.iso', '.chd', '.pbp'],
    romDirectories: ['/sdcard/RoadRashVR/'],
    folders: [
      {
        id: 'rr_roms',
        name: 'Road Rash Jailbreak Disc Image',
        folderName: 'RoadRashVR',
        targetPath: '/sdcard/RoadRashVR/',
        required: true,
        fileExtensionPattern: '\\.(bin|cue|iso|chd|pbp)$',
        description: 'Legal PS1 Road Rash: Jailbreak disc dump'
      }
    ]
  },
  'perfect-dark-vr': {
    slug: 'perfect-dark-vr',
    packageName: 'com.perfectdark.port',
    altPackages: ['com.alexletux.perfectdarkvr'],
    installType: 'apk_and_assets',
    workflowType: 'smart_converter',
    criticalFiles: ['pd.z64'],
    fileGuidance: 'Console decompilation. Requires your legal Perfect Dark (N64) USA ROM.',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/PerfectDarkVR/',
    folders: [
      {
        id: 'pd_rom',
        name: 'Perfect Dark N64 ROM',
        folderName: 'PerfectDarkVR',
        targetPath: '/sdcard/PerfectDarkVR/',
        required: true,
        expectedFiles: ['pd.z64'],
        fileExtensionPattern: '\\.z64$',
        description: 'USA N64 ROM (pd.z64)'
      }
    ]
  },
  'avp-vr': {
    slug: 'avp-vr',
    packageName: 'com.bassquake.avpvr',
    altPackages: ['com.bassquake.quest.avpvr'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['fastfile/gamedata.ff'],
    fileGuidance: 'Copy your Aliens Versus Predator Classic 2000 (Steam or GOG) files into AvPVR.',
    sourceStoreName: 'Steam',
    targetPath: '/sdcard/AvPVR/',
    folders: [
      {
        id: 'avp_fastfile',
        name: 'AvP Game Data',
        folderName: 'fastfile',
        targetPath: '/sdcard/AvPVR/fastfile/',
        required: true,
        expectedFiles: ['gamedata.ff'],
        description: 'Original AvP Classic 2000 fastfile data'
      }
    ]
  },
  'iron-lung-vr': {
    slug: 'iron-lung-vr',
    packageName: 'com.JackRandolph.IronLungVR',
    altPackages: ['com.jackaapacka.ironlungvr'],
    installType: 'direct_apk',
    workflowType: 'direct',
    criticalFiles: [],
    fileGuidance: 'Direct sideload! Standalone recreation ready to play upon install.',
    sourceStoreName: 'Other'
  },
  'ut99-vr-quest': {
    slug: 'ut99-vr-quest',
    packageName: 'com.ghwstvr.ut99quest',
    altPackages: ['com.ghwst.ut99quest'],
    installType: 'apk_and_assets',
    workflowType: 'pc_assets',
    criticalFiles: ['System/Core.u', 'System/Engine.u', 'System/Botpack.u'],
    fileGuidance: 'Copy your System, Maps, Textures, Sounds, and Music folders from your legal UT99 PC copy into /sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/ (or /sdcard/UT99Quest/).',
    sourceStoreName: 'Other',
    targetPath: '/sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/',
    altPaths: ['/sdcard/UT99Quest/'],
    folders: [
      {
        id: 'ut99_system',
        name: 'System Scripts & Engine',
        folderName: 'System',
        targetPath: '/sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/System/',
        altPaths: ['/sdcard/UT99Quest/System/'],
        required: true,
        expectedFiles: ['Core.u', 'Engine.u', 'Botpack.u'],
        description: 'Core game scripts and binary configs'
      },
      {
        id: 'ut99_maps',
        name: 'Tournament Maps',
        folderName: 'Maps',
        targetPath: '/sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/Maps/',
        altPaths: ['/sdcard/UT99Quest/Maps/'],
        required: true,
        fileExtensionPattern: '\\.unr$',
        description: 'Classic DM, CTF, DOM, and AS map files'
      },
      {
        id: 'ut99_textures',
        name: 'Textures',
        folderName: 'Textures',
        targetPath: '/sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/Textures/',
        altPaths: ['/sdcard/UT99Quest/Textures/'],
        required: true,
        fileExtensionPattern: '\\.utx$',
        description: 'Texture packages'
      },
      {
        id: 'ut99_sounds',
        name: 'Audio & SFX',
        folderName: 'Sounds',
        targetPath: '/sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/Sounds/',
        altPaths: ['/sdcard/UT99Quest/Sounds/'],
        required: true,
        fileExtensionPattern: '\\.uax$',
        description: 'Sound effects and announcer voices'
      },
      {
        id: 'ut99_music',
        name: 'Music Tracker Files',
        folderName: 'Music',
        targetPath: '/sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/Music/',
        altPaths: ['/sdcard/UT99Quest/Music/'],
        required: false,
        fileExtensionPattern: '\\.umx$',
        description: 'Original soundtrack files'
      }
    ]
  }
}

export function normalizeQuestPath(path: string | null | undefined): string {
  if (!path || path.startsWith('N/A')) return ''
  let clean = path.trim()
  if (!clean.startsWith('/')) {
    clean = '/' + clean
  }
  if (!clean.startsWith('/sdcard/')) {
    clean = '/sdcard' + clean
  }
  if (!clean.endsWith('/')) {
    clean = clean + '/'
  }
  return clean
}

export function resolveInstallType(port: any): InstallType {
  if (!port) return 'direct_apk'
  const config = PORT_PACKAGE_CONFIGS[port.slug]
  if (config) return config.installType

  const url = port.port_download_url || ''
  const isDirectApk = url.endsWith('.apk') || url.includes('github.com')
  const requiresAssets = Boolean(port.base_game_url)

  if (isDirectApk && !requiresAssets) return 'direct_apk'
  if (isDirectApk && requiresAssets) return 'apk_and_assets'
  return 'pc_builder_required'
}

export function getPortConfig(slug: string): PortPackageConfig | undefined {
  return PORT_PACKAGE_CONFIGS[slug]
}

export function matchFolderRequirement(filePath: string, folderDef: PortFolderRequirement): boolean {
  const norm = filePath.toLowerCase()
  if (folderDef.expectedFiles && folderDef.expectedFiles.length > 0) {
    return folderDef.expectedFiles.some(f => norm.endsWith(f.toLowerCase()))
  }
  if (folderDef.fileExtensionPattern) {
    try {
      const reg = new RegExp(folderDef.fileExtensionPattern, 'i')
      return reg.test(filePath)
    } catch {
      return false
    }
  }
  return true
}

export async function verifyPortFoldersOnQuest(
  slug: string,
  listRemoteDirFn: (path: string) => Promise<string[]>
): Promise<{ folders: FolderCheckResult[]; isOverallReady: boolean }> {
  const cfg = PORT_PACKAGE_CONFIGS[slug]
  if (!cfg?.folders || cfg.folders.length === 0) {
    return { folders: [], isOverallReady: false }
  }

  const results: FolderCheckResult[] = []

  for (const folderDef of cfg.folders) {
    const candidatePaths = Array.from(new Set([
      folderDef.targetPath,
      folderDef.targetPath.toLowerCase(),
      ...(folderDef.altPaths || []),
      ...(folderDef.altPaths || []).map(p => p.toLowerCase())
    ]))

    let resolvedFiles: string[] = []
    let resolvedPath = folderDef.targetPath
    let resolvedStatus: 'ready' | 'incomplete' | 'missing' = 'missing'
    let missingFiles: string[] = []

    for (const testPath of candidatePaths) {
      try {
        const files = await listRemoteDirFn(testPath)
        if (files && files.length > 0) {
          resolvedPath = testPath
          resolvedFiles = files

          if (folderDef.expectedFiles && folderDef.expectedFiles.length > 0) {
            const filesLower = files.map(f => f.toLowerCase())
            missingFiles = folderDef.expectedFiles.filter(exp => !filesLower.includes(exp.toLowerCase()))
            resolvedStatus = missingFiles.length === 0 ? 'ready' : 'incomplete'
          } else if (folderDef.fileExtensionPattern) {
            const reg = new RegExp(folderDef.fileExtensionPattern, 'i')
            const hasMatch = files.some(f => reg.test(f))
            resolvedStatus = hasMatch ? 'ready' : 'incomplete'
          } else {
            resolvedStatus = 'ready'
          }
          break
        }
      } catch {
        // Path didn't exist or error reading
      }
    }

    results.push({
      folderDef,
      status: resolvedStatus,
      detectedPath: resolvedPath,
      filesFound: resolvedFiles,
      missingExpectedFiles: resolvedStatus === 'ready' ? [] : missingFiles
    })
  }

  const isOverallReady = results.filter(r => r.folderDef.required).every(r => r.status === 'ready')
  return { folders: results, isOverallReady }
}

export interface WorkflowBadgeInfo {
  label: string
  icon: string
  color: 'emerald' | 'blue' | 'amber' | 'indigo' | 'purple'
  badgeClass: string
  description: string
}

export function getWorkflowBadgeInfo(workflow: PortWorkflowType): WorkflowBadgeInfo {
  switch (workflow) {
    case 'direct':
      return {
        label: 'Direct Sideload',
        icon: '⚡',
        color: 'emerald',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        description: 'Standalone port. Install APK and play directly without PC files.'
      }
    case 'obb_extractor':
      return {
        label: 'OBB Extractor',
        icon: '📦',
        color: 'amber',
        badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        description: 'Extracts Android OBB textures & audio directly to Quest in-browser.'
      }
    case 'smart_converter':
      return {
        label: 'Console Decomp',
        icon: '⚙️',
        color: 'amber',
        badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        description: 'Requires architecture conversion or decomp asset extraction from original console media.'
      }
    case 'emulator_roms':
      return {
        label: 'Emulator & ROMs',
        icon: '🕹️',
        color: 'indigo',
        badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        description: 'Standalone VR emulator. Manage, scan, and transfer your game ROMs.'
      }
    default:
      return {
        label: 'Steam / PC Files',
        icon: '📁',
        color: 'blue',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        description: 'Copy your original game files to the headset.'
      }
  }
}

export function portRequiresExternalFiles(cfg?: PortPackageConfig | null): boolean {
  if (!cfg) return true
  const workflow = cfg.workflowType
  if (workflow && workflow !== 'direct') return true
  if (cfg.installType !== 'direct_apk') return true
  if (cfg.criticalFiles && cfg.criticalFiles.length > 0) return true
  if (cfg.romDirectories && cfg.romDirectories.length > 0) return true
  if (cfg.romExtensions && cfg.romExtensions.length > 0) return true
  if (cfg.folders && cfg.folders.some(folder => folder.required)) return true
  return false
}

/** True only when the APK itself is enough to play — no PC dump, ROM, or data folder. */
export function isSelfContainedSideload(cfg?: PortPackageConfig | null): boolean {
  if (!cfg) return false
  return cfg.installType === 'direct_apk' && cfg.workflowType === 'direct' && !portRequiresExternalFiles(cfg)
}

export function resolveWorkflowType(target: any, category?: string): PortWorkflowType {
  if (!target) return 'pc_assets'

  const slug = target.slug || ''
  const mapped = PORT_PACKAGE_CONFIGS[slug]
  if (mapped?.workflowType) return mapped.workflowType
  if (target.workflowType) return target.workflowType
  if (target.install_workflow) return target.install_workflow

  const cat = category || target.category || ''
  if (cat === 'emulator' || slug === 'citravr' || slug === 'ppsspp-vr' || slug === 'primedgun' || slug === 'gran-turismo-2-vr' || slug === 'road-rash-jailbreak-vr' || slug === 'astroquest') {
    return 'emulator_roms'
  }
  if (slug.includes('gta') || slug.includes('vice-city')) {
    return 'obb_extractor'
  }
  if (slug === 'galaxyquest' || slug === 'goldeneye-vr' || slug === 'perfect-dark-vr' || slug === 'simpsonshitrun' || slug === 'time-crisis-vr') {
    return 'smart_converter'
  }
  if (target.installType === 'direct_apk' || slug === 'questcraft' || slug === 'iron-lung-vr') {
    return 'direct'
  }
  return 'pc_assets'
}

export function isPortInstalledOnQuest(slug: string, installedPackages: string[]): boolean {
  if (!slug || !installedPackages || installedPackages.length === 0) return false
  installedPackages = installedPackages.map(p => (p || '').trim().toLowerCase()).filter(Boolean)
  const cfg = PORT_PACKAGE_CONFIGS[slug]
  if (cfg?.packageName && installedPackages.includes(cfg.packageName.toLowerCase())) {
    return true
  }
  if (cfg?.altPackages && cfg.altPackages.some(p => installedPackages.includes(p.toLowerCase()))) {
    return true
  }
  // Check if any package contains the core root of the package name (e.g. "halo.decomp" or "rtcwquest")
  if (cfg?.packageName) {
    const pkgRoot = cfg.packageName.toLowerCase().replace(/^(com|org|net|mod|su)\./, '').replace(/\.(vr|quest|xr)$/, '')
    if (pkgRoot.length >= 4 && installedPackages.some(p => p.toLowerCase().includes(pkgRoot))) {
      return true
    }
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (cleanSlug.length < 3) return false
  return installedPackages.some(pkg => {
    const cleanPkg = pkg.toLowerCase().replace(/[^a-z0-9]/g, '')
    return cleanPkg.includes(cleanSlug) || cleanSlug.includes(cleanPkg)
  })
}

