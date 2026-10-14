import { isPortInstalledOnQuest } from '~/data/portPackageMap'

export interface ApkInstalledInput {
  /** WebUSB session is up. The Android app does not set this. */
  connected: boolean
  slug: string | null | undefined
  /** Package ids from the connected Quest, or an empty list when it is not. */
  installedPackages: readonly string[]
  /**
   * QuestPortsApp reported this port's package or an alt id.
   * A flag saved in the browser is not this.
   */
  bridgeInstalled: boolean
}

/**
 * The port page may say the APK is on the Quest only when a live headset says so.
 *
 * WebUSB counts when the Quest is connected and `pm list packages` contains this
 * port's package or an alt id (the same match the catalog uses). The Android app
 * counts when the QuestPortsApp bridge already reported the package. A previous
 * visit remembered in localStorage is not a headset, and a package list left
 * over while disconnected is not one either.
 */
export function apkInstalledOnHeadset(input: ApkInstalledInput): boolean {
  if (input.bridgeInstalled) return true
  if (!input.connected || !input.slug) return false
  return isPortInstalledOnQuest(input.slug, [...input.installedPackages])
}
