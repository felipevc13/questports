export function cleanVersionText(raw: string | null | undefined): string
export function isPlaceholderVersion(raw: string | null | undefined): boolean
export function versionIsDesktopTagged(raw: string | null | undefined): boolean
export function normalizeVersionKey(raw: string | null | undefined): string
export function formatPortVersion(raw: string | null | undefined): string
export function numericVersionParts(raw: string | null | undefined): number[]
export function comparePortVersions(
  installed: string | null | undefined,
  catalog: string | null | undefined
): number
export function isHeadsetApkOutdated(
  installedVersion: string | null | undefined,
  catalogVersion: string | null | undefined
): boolean
