/** Compare catalog tags (v1.0.16) with Android versionName from dumpsys. */

export function numericVersionParts(raw: string | null | undefined): number[] {
  if (!raw) return []
  return raw
    .trim()
    .replace(/^v/i, '')
    .split(/[^0-9]+/)
    .filter(part => part.length > 0)
    .map(part => Number.parseInt(part, 10))
    .filter(n => Number.isFinite(n))
}

export function comparePortVersions(installed: string | null | undefined, catalog: string | null | undefined): number {
  const a = numericVersionParts(installed)
  const b = numericVersionParts(catalog)
  if (a.length === 0 || b.length === 0) return 0
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const left = a[i] ?? 0
    const right = b[i] ?? 0
    if (left < right) return -1
    if (left > right) return 1
  }
  return 0
}

export function isHeadsetApkOutdated(
  installedVersion: string | null | undefined,
  catalogVersion: string | null | undefined
): boolean {
  return comparePortVersions(installedVersion, catalogVersion) < 0
}
