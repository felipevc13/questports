/**
 * Which Android package ids count as "this port is installed".
 * The Quest app bridge answers one package name at a time (`getPackageInfo`).
 * Catalog rows often have an alternate id that is the build actually on the headset.
 */

import { PORT_PACKAGE_CONFIGS } from '~/data/portPackageMap'

export function packageCandidates(slug: string, fallback?: string | null): string[] {
  const cfg = PORT_PACKAGE_CONFIGS[slug]
  const raw = [cfg?.packageName, ...(cfg?.altPackages || []), fallback || '']
  const seen = new Set<string>()
  const names: string[] = []
  for (const name of raw) {
    const trimmed = String(name || '').trim()
    const key = trimmed.toLowerCase()
    if (!trimmed || seen.has(key)) continue
    seen.add(key)
    names.push(trimmed)
  }
  return names
}

/** First candidate the bridge reports as installed. A throw is "not this id". */
export function firstInstalledPackage(
  slug: string,
  isInstalled: (packageName: string) => boolean,
  fallback?: string | null
): string | null {
  for (const name of packageCandidates(slug, fallback)) {
    try {
      if (isInstalled(name)) return name
    } catch {
      // NameNotFoundException from the bridge, or a bridge that cannot answer.
    }
  }
  return null
}

export type AppTab = 'library' | 'catalog' | 'settings'

/** At least one indexed port on the headset opens Library. Otherwise Catalog. */
export function appStartTab(installedCount: number): AppTab {
  return installedCount > 0 ? 'library' : 'catalog'
}
