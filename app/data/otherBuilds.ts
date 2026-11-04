/**
 * Other ports of the same game, shown on the main port's page under "Other builds".
 * One card and one page per game: an alternative never gets its own catalog card.
 * List one only when it is really different (engine, headset, stability) and still
 * downloadable. The main port stays the one the catalog installs with one click.
 */
export interface OtherBuild {
  /** Stable id for analytics (`manual_download_click` props.build). Slug-shaped. */
  id: string
  title: string
  developer: string
  developerUrl: string
  repoUrl: string
  /** Fixed GitHub release asset, not /releases/latest. */
  apkUrl: string
  version: string
  /** YYYY-MM-DD of that release. */
  releasedOn: string
  /** Android package id read from the APK. Differs from the main port, so both can be installed. */
  packageName: string
  hardware: string[]
  /** Why someone would pick this one, in one line. */
  pick: string
  /** What to know before picking it, in one line. */
  caveat: string
  steps: string[]
}

export const OTHER_BUILDS: Record<string, OtherBuild[]> = {
  'ocarina-of-time-vr': [
    {
      id: 'shipwright-vr-quest',
      title: 'Shipwright-VR for Quest',
      developer: 'ChocoTorp',
      developerUrl: 'https://github.com/ChocoTorp',
      repoUrl: 'https://github.com/ChocoTorp/Shipwright-VR',
      apkUrl: 'https://github.com/ChocoTorp/Shipwright-VR/releases/download/v1.3/Quest3-OOT-v1.3.apk',
      version: 'v1.3',
      releasedOn: '2026-09-25',
      packageName: 'com.questship.sohvr',
      hardware: ['Quest 3'],
      pick: 'The earlier Quest port of Ship of Harkinian VR, with its own controls and VR settings. Stable release, not a beta.',
      caveat: 'Quest 3 only. Not updated since September 2026.',
      steps: [
        'Install the APK with SideQuest or adb. It installs next to oot-vr; it does not replace it.',
        'Copy your own Ocarina of Time ROM into the headset\'s Download folder.',
        'Open "Quest 3: OOT" from Unknown Sources and allow access to files when asked.',
        'The first start shows loading dots for 1 to 2 minutes while it builds the game from your ROM.'
      ]
    }
  ],
  primedgun: [
    {
      id: 'primedgun-v2-native',
      title: 'PrimedGun v2 (native)',
      developer: 'Nobbie and iChris4',
      developerUrl: 'https://github.com/iChris4',
      repoUrl: 'https://github.com/iChris4/MetroidPrimePortVR',
      apkUrl: 'https://github.com/iChris4/MetroidPrimePortVR/releases/download/v2.0.0-beta.7/PrimedGun-v2.0.0-beta.7-Quest.apk',
      version: 'v2.0.0-beta.7',
      releasedOn: '2026-11-01',
      packageName: 'org.primedgun.v2',
      hardware: ['Quest 3'],
      pick: 'Metroid Prime as a native port, with no emulator: the same 6DOF arm cannon, room-scale movement and VR menu, plus a randomizer and Archipelago multiworld support. A new release almost every few days.',
      caveat: 'Beta, tested on Quest 3 only. Dolphin save states do not carry over; its launcher can transfer a memory card or settings.',
      steps: [
        'Install the APK with SideQuest or adb. It installs next to PrimedGun; it does not replace it.',
        'Copy your own Metroid Prime disc image (USA 1.00, 1.01 or 1.02; .iso, .nkit.iso, .rvz, .ciso or .wbfs) to the headset, for example in Download.',
        'Open PrimedGun from Unknown Sources, tap Select Game, choose the disc image and tap Play.',
        'To bring over progress, use Transfer PrimedGun Memory Card / Settings after choosing your game. Save normally in the game before moving.'
      ]
    }
  ]
}

export function otherBuildsFor(slug: string | null | undefined): OtherBuild[] {
  if (!slug) return []
  return OTHER_BUILDS[slug] ?? []
}
