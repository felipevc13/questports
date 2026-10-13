/**
 * Library list: installed ports only, updates first.
 * Update detection uses the same rule as the port page (`apkUpdateDecision`).
 */

import { installedPackageOnQuest } from '~/data/portPackageMap'
import { apkUpdateDecision, type InstalledReleaseRecord } from './installedRelease'

/** Indexed catalog rows whose package (or an alt id) is on the headset. */
export function countIndexedInstalled(slugs: readonly string[], packages: readonly string[]): number {
  let count = 0
  for (const slug of slugs) {
    if (installedPackageOnQuest(slug, packages as string[])) count += 1
  }
  return count
}

export interface LibraryEntry<T> {
  port: T
  packageName: string
  installedVersion: string | null
  update: boolean
}

export function libraryUpdateAvailable(input: {
  installedVersion: string | null
  catalogVersion: string | null | undefined
  record?: InstalledReleaseRecord | null
}): boolean {
  return apkUpdateDecision({
    installedVersionName: input.installedVersion,
    catalogVersion: input.catalogVersion,
    record: input.record
  }).outdated
}

/** Updates first, then A–Z by title. */
export function orderLibraryEntries<T>(entries: LibraryEntry<T>[], titleOf: (port: T) => string): LibraryEntry<T>[] {
  return [...entries].sort((a, b) => {
    if (a.update !== b.update) return a.update ? -1 : 1
    return titleOf(a.port).localeCompare(titleOf(b.port), undefined, { sensitivity: 'base' })
  })
}
