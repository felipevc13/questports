/**
 * Can this port be set up with only the headset: no PC, no USB cable?
 * Only the catalog filter "No PC needed" uses this. The port page does not.
 *
 * `yes` means all of this holds:
 * - the APK can be installed from the Quest Browser and the Files app;
 * - nothing on a PC has to prepare, convert, patch or build anything;
 * - the player's own files are a console, arcade or disc image (ROM, ISO, arcade
 *   set) that goes in Downloads, an /sdcard folder or an in-app picker, or the
 *   game is already inside the APK.
 * `no` means a PC tool must prepare, convert or build something first.
 * Everything else is `unknown` and the filter leaves it out: games whose files
 * come from a PC install (Steam, GOG, PC discs), steps that need ADB, files
 * under Android/data, a manual APK link, and any port added after this review.
 *
 * Worked out from each port's install guide and target folder, not run on a
 * headset. Reviewed twice: the first pass looked at the target folder only and
 * marked 22 PC-install ports (Qualyx among them) as yes.
 */

const NO_PC_READY = new Set([
  'behind-enemy-lines-vr', 'bomberman-hero-vr', 'carnevil-vr', 'confidential-mission-vr',
  'crisis-zone-vr', 'ctr-turbocharged-vr', 'daytona-usa-vr', 'death-crimson-ox-vr',
  'dirt-dash-vr', 'dolphinxr', 'f-zero-x-vr', 'forsaken-vr', 'ghost-squad-evolution-vr',
  'goldeneye-vr', 'gran-turismo-3-vr', 'gunblade-ny-vr', 'halocequest', 'hotd-vr', 'hotd2-vr',
  'hotd4-special-vr', 'hotd4-vr', 'lets-go-jungle-vr', 'lupin-the-third-vr', 'majoras-mask-vr',
  'mario-party-4-partyboard', 'metal-gear-solid-vr', 'mok-vr', 'mystical-ninja-vr',
  'nfl-blitz-2000-vr', 'nfsu-vr', 'nfsu2-vr', 'ninja-assault-vr', 'ocarina-of-time-vr',
  'perfect-dark-vr', 'ppsspp-vr', 'primedgun', 'rail-chase-2-vr', 'ratchet-and-clank-vr',
  'sega-rally-vr', 'sin-and-punishment-vr', 'sm64-coop-dx-vr', 'strikers-quest-mr',
  'survivor2-code-veronica-vr', 'teraburst-vr', 'time-crisis-2-vr', 'time-crisis-vr',
  'twilight-princess-vr', 'virtua-cop-2-vr', 'virtua-cop-vr', 'wakerquest', 'wave-race-64-vr',
  'wwf-no-mercy-vr', 'xelee', 'xrkart-64'
])

const PC_REQUIRED = new Set([
  'animal-crossing-vr', 'crazy-taxi-vr', 'galaxyquest', 'gta-sa-vr-quest', 'magic-carpet-vr',
  'openxwa-vr', 'red-dead-redemption-vr', 'starfox-enhanced-vr', 'vice-city-vr-quest',
  'victory-heat-rally-vr', 'wipeout-rewrite-vr'
])

export type NoPcInstall = 'yes' | 'no' | 'unknown'

export function noPcInstall(slug: string | null | undefined): NoPcInstall {
  if (!slug) return 'unknown'
  if (PC_REQUIRED.has(slug)) return 'no'
  if (NO_PC_READY.has(slug)) return 'yes'
  return 'unknown'
}

export const NO_PC_BADGE = 'No PC needed'
