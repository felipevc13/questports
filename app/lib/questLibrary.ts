/**
 * Library list: installed ports only, updates first.
 * Update detection uses the same rule as the port page (`apkUpdateDecision`).
 */

import { apkUpdateDecision, type InstalledReleaseRecord } from './installedRelease'

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
