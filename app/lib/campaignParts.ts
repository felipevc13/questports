/**
 * Installed parts on a port that has a base game plus expansions.
 *
 * The catalog and Library decide "this port is installed" from the Android
 * package id: the app bridge (`isInstalled` / `getInstalledVersion`, including
 * alt ids) or the WebUSB package list. That signal is the base game. Expansion
 * data is a folder on the headset, not a second package, so a DLC counts only
 * when its files were found or copied.
 */

export interface CampaignPart {
  id: string
  isBase: boolean
}

export interface CampaignPartSignals {
  /** Primary or alt package id is on the headset. */
  packageInstalled: boolean
  /** This part's data folder was found, copied, or confirmed. */
  filesReady: boolean
}

/** `installed` is the APK. `ready` means the data folder is on the headset. */
export type CampaignPartState = 'ready' | 'installed' | 'missing'

export function campaignPartState(part: CampaignPart, signals: CampaignPartSignals): CampaignPartState {
  if (signals.filesReady) return 'ready'
  if (part.isBase && signals.packageInstalled) return 'installed'
  return 'missing'
}

export function campaignPartCounts(state: CampaignPartState): boolean {
  return state === 'ready' || state === 'installed'
}

export function countInstalledParts(
  parts: readonly CampaignPart[],
  signalsFor: (part: CampaignPart) => CampaignPartSignals
): number {
  let count = 0
  for (const part of parts) {
    if (campaignPartCounts(campaignPartState(part, signalsFor(part)))) count += 1
  }
  return count
}
