/**
 * Can this port be set up with only the headset: no PC, no USB cable?
 *
 * `yes` means the APK and the player's own files can both be handled from the
 * Quest Browser and the Files app (the files go to a folder under /sdcard or are
 * picked inside the app). Worked out from each port's install guide and target
 * folder. Nobody has run these on a headset yet.
 * `no` means a PC tool must prepare, convert or build something first.
 * A port in neither list is `unknown`: files under Android/data (which the Quest
 * file manager may not write), a manual APK link, or a port added after this
 * review. The page says nothing about it rather than promise too much.
 */

const NO_PC_READY = new Set([
  '18-wheeler-vr', 'age-of-joy', 'arx-libertatis-vr', 'beefraiderxr', 'behind-enemy-lines-vr',
  'bomberman-hero-vr', 'carnevil-vr', 'citravr', 'confidential-mission-vr', 'crisis-zone-vr',
  'csvr', 'ctr-turbocharged-vr', 'daytona-usa-vr', 'death-crimson-ox-vr', 'dirt-dash-vr',
  'dolphinxr', 'doom3quest', 'f-zero-x-vr', 'generals-zero-hour-xr',
  'ghost-squad-evolution-vr', 'gran-turismo-3-vr', 'gunblade-ny-vr', 'halocequest', 'hotd-vr',
  'hotd2-vr', 'hotd4-vr', 'jkxr', 'lambda1vr', 'lupin-the-third-vr', 'majoras-mask-vr',
  'mario-party-4-partyboard', 'metal-gear-solid-vr', 'mok-vr', 'mystical-ninja-vr', 'nfsu-vr',
  'nfsu2-vr', 'ninja-assault-vr', 'nolf-vr', 'ocarina-of-time-vr', 'opencmr2-vr', 'openmw-vr',
  'opentie-vr', 'ppsspp-vr', 'preyvr', 'primedgun', 'quake2quest', 'quake3quest', 'quakequest',
  'qualyx', 'questzdoom', 'rail-chase-2-vr', 'razexr', 'rtcwquest', 'sega-rally-vr',
  'simpsonshitrun', 'sin-and-punishment-vr', 'sm64-coop-dx-vr', 'smash-remix-vr', 'sourcevr',
  'strikers-quest-mr', 'survivor2-code-veronica-vr', 'teraburst-vr', 'time-crisis-2-vr',
  'time-crisis-vr', 'twilight-princess-vr', 'virtua-cop-2-vr', 'virtua-cop-vr', 'wakerquest',
  'wave-race-64-vr', 'winlatorxr', 'wwf-no-mercy-vr', 'xelee', 'xrkart-64'
])

const PC_REQUIRED = new Set([
  'animal-crossing-vr', 'crazy-taxi-vr', 'galaxyquest', 'goldeneye-vr', 'gta-sa-vr-quest',
  'magic-carpet-vr', 'openxwa-vr', 'perfect-dark-vr', 'red-dead-redemption-vr',
  'starfox-enhanced-vr', 'vice-city-vr-quest', 'victory-heat-rally-vr', 'wipeout-rewrite-vr'
])

export type NoPcInstall = 'yes' | 'no' | 'unknown'

export function noPcInstall(slug: string | null | undefined): NoPcInstall {
  if (!slug) return 'unknown'
  if (PC_REQUIRED.has(slug)) return 'no'
  if (NO_PC_READY.has(slug)) return 'yes'
  return 'unknown'
}

export const NO_PC_BADGE = 'No PC needed'
export const PC_REQUIRED_BADGE = 'PC needed'

export const NO_PC_TITLE = 'No PC needed. Do it all on your Quest.'

/** A GitHub releases page: the link lands on a list of files, not on the APK itself. */
export function isReleasePageUrl(url: string | null | undefined): boolean {
  const value = String(url || '').split('?')[0].toLowerCase()
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/releases/.test(value) && !/\.(apk|zip)$/.test(value)
}

export function noPcSteps(input: {
  needsFiles: boolean
  folders?: string[]
  releasePage?: boolean
}): string[] {
  const steps = [
    input.releasePage
      ? 'Open the download link, tap the .apk file under Assets, then open Files > Downloads > ⋮ > Open with > Package Installer and tap Install.'
      : 'Download the APK with the Quest Browser, then open Files > Downloads > ⋮ > Open with > Package Installer and tap Install.'
  ]
  if (input.needsFiles) {
    const folders = input.folders || []
    steps.push('Download your own game files the same way. We do not host them.')
    steps.push(folders.length === 1
      ? `Move them to ${folders[0]} with the Files app.`
      : folders.length > 1
        ? 'Move them to the folders named in the install guide below, with the Files app.'
        : 'Open the game and pick the files when it asks, or leave them in Downloads.')
  }
  steps.push('Open the game from Library > Unknown Sources.')
  return steps
}

export const PC_REQUIRED_NOTE = 'This port needs a PC to prepare the game before it can run on your Quest.'

/**
 * Folders worth naming: under /sdcard, not Downloads and not Android/data (the
 * Quest file manager may not write there). Repeats are dropped.
 */
export function noPcFolders(fullPaths: Array<string | null | undefined>): string[] {
  const found: string[] = []
  for (const raw of fullPaths) {
    const path = String(raw || '').trim()
    if (!/^\/sdcard\/[A-Za-z0-9._\/-]+$/.test(path)) continue
    if (/^\/sdcard\/(Download|Android)/i.test(path)) continue
    if (!found.includes(path)) found.push(path)
  }
  return found
}
