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
  ]
}

export function otherBuildsFor(slug: string | null | undefined): OtherBuild[] {
  if (!slug) return []
  return OTHER_BUILDS[slug] ?? []
}
