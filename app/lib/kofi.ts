/**
 * Ko-fi tip link. One public URL. An empty value hides every placement.
 * The page is https://ko-fi.com/questports unless NUXT_PUBLIC_KOFI_URL overrides it.
 */

export const DEFAULT_KOFI_URL = 'https://ko-fi.com/questports'

export const KOFI_SURFACES = ['install_success', 'footer'] as const

export type KofiSurface = (typeof KOFI_SURFACES)[number]

export const KOFI_SUCCESS_BEFORE =
  'QuestPorts is a free hobby project I run on my own. If it saved you some time, you can '

export const KOFI_SUCCESS_LINK = 'buy me a coffee'

export const KOFI_SUCCESS_AFTER = ' ☕'

export const KOFI_FOOTER_LABEL = 'Support on Ko-fi ☕'

/** http(s) only. Blank, relative, and other schemes render nothing. */
export function kofiHref(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  return url.toString()
}

export function isKofiSurface(value: unknown): value is KofiSurface {
  return typeof value === 'string' && (KOFI_SURFACES as readonly string[]).includes(value)
}

export interface ExternalOpenTarget {
  open?: ((url: string, target?: string, features?: string) => unknown) | null
  assign?: ((url: string) => void) | null
}

/**
 * Leave the QuestPorts Android WebView for an off-site page.
 *
 * `window.QuestPortsApp` installs APKs (`installApk`, `cancel`, `isInstalled`,
 * `getInstalledVersion`, `launch`). It does not open URLs. The Android repo
 * `felipevc13/questports-android` (bridge/AGENTS.md) was not available here,
 * so this follows that bridge and Android WebView's own rules:
 *
 * - `target="_blank"` does not load in the current WebView. The click reaches
 *   `WebChromeClient.onCreateWindow` only when multiple windows are enabled.
 *   Otherwise the WebView ignores it and the catalog stays where it is.
 * - A top-level https navigation is what `shouldOverrideUrlLoading` sees.
 *   A wrapper that sends other hosts to `Intent.ACTION_VIEW` and returns true
 *   opens the system browser and leaves this page in place.
 *
 * `window.open` is the first try (the new-window path, so this page is not
 * replaced). If the WebView returns null, the https URL is assigned so the
 * client can hand it to the system browser. If that client loads every URL
 * itself, Ko-fi replaces the page and the system Back key returns to the
 * catalog. The WebView is not left on a blank window.
 */
export function openExternalUrl(url: string, target: ExternalOpenTarget = {}): 'blank' | 'assign' | 'skip' {
  const href = kofiHref(url)
  if (!href) return 'skip'
  const open = target.open ?? (typeof window !== 'undefined' ? window.open.bind(window) : null)
  try {
    const opened = open?.(href, '_blank', 'noopener,noreferrer')
    if (opened) return 'blank'
  } catch {
    // The WebView refused the new window. Fall through.
  }
  const assign = target.assign ?? (typeof window !== 'undefined'
    ? (next: string) => window.location.assign(next)
    : null)
  if (!assign) return 'skip'
  assign(href)
  return 'assign'
}

/**
 * Records `tip_click`, then lets a normal browser follow `target="_blank"`.
 * Inside the QuestPorts app the default click is cancelled and `openExternalUrl` runs.
 */
export function handleKofiClick(input: {
  surface: KofiSurface
  href: string
  inApp: boolean
  event?: { preventDefault: () => void } | null
  track: (event: 'tip_click', body: { props: { surface: KofiSurface } }) => void
  open?: (url: string) => 'blank' | 'assign' | 'skip'
}): void {
  input.track('tip_click', { props: { surface: input.surface } })
  if (!input.inApp) return
  input.event?.preventDefault()
  const href = kofiHref(input.href)
  if (!href) return
  if (input.open) input.open(href)
  else openExternalUrl(href)
}
