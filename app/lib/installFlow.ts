import { PORT_PACKAGE_CONFIGS } from '~/data/portPackageMap'

/** Spare room beyond the payload so `pm install` and the copy are not tight against a full disk. */
export const SPACE_MARGIN_BYTES = 64 * 1024 * 1024

export const SPACE_CHECK_FAILED =
  'Could not read free space on the Quest (df /sdcard failed). Continuing anyway. The copy can still fail if the headset is full.'

export type SpaceKind = 'apk' | 'files'

export type SpaceDecision =
  | { action: 'ok' }
  | { action: 'warn'; message: string }
  | { action: 'block'; message: string }

export interface ByteProgress {
  percent: number
  indeterminate: boolean
  message: string
}

export function formatByteSize(bytes: number): string {
  const safe = Number.isFinite(bytes) && bytes > 0 ? bytes : 0
  const mb = safe / (1024 * 1024)
  if (mb >= 1024) {
    const gb = mb / 1024
    return `${gb >= 10 ? gb.toFixed(0) : gb.toFixed(1)} GB`
  }
  if (mb >= 10) return `${mb.toFixed(0)} MB`
  return `${mb.toFixed(1)} MB`
}

export function marginFor(payloadBytes: number): number {
  const payload = Math.max(0, payloadBytes)
  return Math.max(SPACE_MARGIN_BYTES, Math.round(payload * 0.1))
}

export function requiredFreeBytes(payloadBytes: number): number {
  return Math.max(0, payloadBytes) + marginFor(payloadBytes)
}

export function describeByteProgress(
  loaded: number,
  total: number,
  phase: 'download' | 'transfer',
  name?: string
): ByteProgress {
  const received = formatByteSize(loaded)
  const what = name || 'APK'
  if (total > 0) {
    const percent = Math.min(100, Math.round((loaded / total) * 100))
    const totalLabel = formatByteSize(total)
    const message = phase === 'download'
      ? `Downloading APK (${received} / ${totalLabel})...`
      : `Transferring ${what} (${received} / ${totalLabel})...`
    return { percent, indeterminate: false, message }
  }
  const message = phase === 'download'
    ? `Downloading APK (${received} received, size unknown)...`
    : `Transferring ${what} (${received} sent, size unknown)...`
  return { percent: 0, indeterminate: true, message }
}

/**
 * `df -k` Available column, in 1K blocks.
 * Human `df -h` values such as `88G` are ignored so they are not treated as byte counts.
 */
export function parseDfAvailableKilobytes(text: string): number | null {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean)
  for (const line of lines) {
    if (/^filesystem/i.test(line)) continue
    const parts = line.split(/\s+/)
    const available = parts[3]
    if (available && /^\d+$/.test(available)) {
      const value = Number(available)
      if (Number.isFinite(value)) return value
    }
  }
  return null
}

export function shortageMessage(payloadBytes: number, freeBytes: number, kind: SpaceKind): string {
  const needed = requiredFreeBytes(payloadBytes)
  const spare = needed - Math.max(0, payloadBytes)
  const subject = kind === 'apk' ? 'The APK needs' : 'These files need'
  return `Not enough free space on the Quest. ${subject} about ${formatByteSize(needed)} (${formatByteSize(payloadBytes)} plus ${formatByteSize(spare)} of spare space). About ${formatByteSize(freeBytes)} is free on /sdcard.`
}

export function spaceDecision(
  payloadBytes: number | null,
  freeBytes: number | null,
  kind: SpaceKind
): SpaceDecision {
  if (freeBytes == null) return { action: 'warn', message: SPACE_CHECK_FAILED }
  if (payloadBytes == null) return { action: 'ok' }
  if (freeBytes < requiredFreeBytes(payloadBytes)) {
    return { action: 'block', message: shortageMessage(payloadBytes, freeBytes, kind) }
  }
  return { action: 'ok' }
}

export function isUserCancel(err: unknown): boolean {
  const error = err as { name?: string; message?: string } | null
  if (!error) return false
  if (error.name === 'AbortError') return true
  return /cancelled by user/i.test(error.message || '')
}

export function isLowSpaceError(err: unknown): boolean {
  const message = (err as { message?: string } | null)?.message || ''
  return message.startsWith('Not enough free space')
}

export async function readStreamWithProgress(
  stream: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  onLoaded: (loaded: number) => void
): Promise<Uint8Array> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let loaded = 0
  try {
    while (true) {
      if (signal.aborted) {
        throw new DOMException('Installation cancelled by user', 'AbortError')
      }
      const { done, value } = await reader.read()
      if (done) break
      if (!value || value.byteLength === 0) continue
      chunks.push(value)
      loaded += value.byteLength
      onLoaded(loaded)
    }
  } catch (err) {
    await reader.cancel().catch(() => {})
    throw err
  }
  const out = new Uint8Array(loaded)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}

export function bytesToStream(bytes: Uint8Array, chunkSize = 256 * 1024): ReadableStream<Uint8Array> {
  let offset = 0
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (offset >= bytes.byteLength) {
        controller.close()
        return
      }
      const next = Math.min(bytes.byteLength, offset + chunkSize)
      controller.enqueue(bytes.subarray(offset, next))
      offset = next
    }
  })
}

const SHARED_SAVE_NOTES: Record<string, string> = {
  'nolf-vr': 'This port keeps saves next to the game files in /sdcard/nolf/Save/ (and autoexec.cfg in /sdcard/nolf/). Those shared-storage saves stay. Saves under Android/data/net.relith.nolf/ are removed with the app.'
}

function isSharedStoragePath(path: string): boolean {
  const normalized = path.replace(/\\/g, '/')
  if (!normalized.startsWith('/sdcard/')) return false
  if (normalized.includes('/Android/data/')) return false
  if (normalized.includes('/Android/obb/')) return false
  return true
}

function sharedStoragePaths(slug: string): string[] {
  const cfg = PORT_PACKAGE_CONFIGS[slug]
  if (!cfg) return []
  const paths = [cfg.targetPath, ...(cfg.altPaths || [])].filter((path): path is string => Boolean(path))
  const shared = paths.filter(isSharedStoragePath)
  return [...new Set(shared)]
}

export interface ReinstallWarning {
  lead: string
  shared: string | null
  keepData: string
}

export function reinstallWarningCopy(slug: string | undefined): ReinstallWarning {
  const lead = 'Reinstall uninstalls the current package, then installs it again. pm uninstall deletes that app’s private data, including files in Android/data for the package. Saves stored there are removed.'
  const keepData = 'Install over it keeps app data. That runs pm install -r and does not uninstall first. Use it when you only want a newer build.'
  if (!slug) return { lead, shared: null, keepData }
  const noted = SHARED_SAVE_NOTES[slug]
  if (noted) return { lead, shared: noted, keepData }
  const shared = sharedStoragePaths(slug)
  if (shared.length === 0) return { lead, shared: null, keepData }
  const shown = shared.slice(0, 2).join(' and ')
  return {
    lead,
    shared: `Game files already in shared storage stay on the headset (${shown}). pm uninstall does not delete those folders.`,
    keepData
  }
}
