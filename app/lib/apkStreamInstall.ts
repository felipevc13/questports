import { contentLengthBytes, isApkTooLargeError } from '~/lib/apkProxyPolicy'
import {
  describeByteProgress,
  formatByteSize,
  isLowSpaceError,
  isUserCancel
} from '~/lib/installFlow'

/** Temp path `pm install` reads. Removed if the copy stops early. */
export const APK_INSTALL_TEMP_PATH = '/data/local/tmp/questports_installer.apk'

/**
 * Zips have to be inflated in the tab before install. Above this, WebUSB shows the
 * manual-download message instead of holding the archive in memory.
 */
export const ZIP_BROWSER_MAX_BYTES = 500 * 1024 * 1024

export const DOWNLOAD_STREAM_FAILED =
  'Failed to download APK. The connection dropped before the file finished. Check your network and try again.'

export const USB_STREAM_FAILED =
  'Meta Quest not connected. The USB cable dropped while the APK was copying. Plug it back in and try again.'

export type ApkStreamKind = 'download' | 'file'

export type RemoteApkPlan =
  | { action: 'stream'; totalBytes: number }
  | { action: 'buffer'; totalBytes: number; maxBytes: number }
  | { action: 'too-large'; size: number }

export interface ApkPushProgress {
  loaded: number
  percent: number
  indeterminate: boolean
  message: string
  receivedLabel: string
}

/** Missing or zero Content-Length is unknown. Streaming still proceeds. */
export function knownDownloadBytes(header: string | null | undefined): number {
  const parsed = contentLengthBytes(header ?? null)
  if (parsed == null || parsed <= 0) return 0
  return parsed
}

/** Free-space check uses Content-Length only. Unknown size is not a block. */
export function freeSpaceCheckBytes(totalBytes: number): number | null {
  return totalBytes > 0 ? totalBytes : null
}

/**
 * Plain APKs are pushed as the body arrives. Zips stay buffered so they can be
 * extracted, unless they are too big for the browser tab.
 */
export function planRemoteApkBody(input: {
  zip: boolean
  totalBytes: number
  appMode: boolean
}): RemoteApkPlan {
  const totalBytes = input.totalBytes > 0 ? input.totalBytes : 0
  if (!input.zip) return { action: 'stream', totalBytes }
  if (!input.appMode && totalBytes > ZIP_BROWSER_MAX_BYTES) {
    return { action: 'too-large', size: totalBytes }
  }
  return {
    action: 'buffer',
    totalBytes,
    maxBytes: input.appMode ? Number.POSITIVE_INFINITY : ZIP_BROWSER_MAX_BYTES
  }
}

function errorName(err: unknown): string {
  if (!err || typeof err !== 'object') return ''
  const name = (err as { name?: unknown }).name
  return typeof name === 'string' ? name : ''
}

function errorMessage(err: unknown): string {
  if (typeof err === 'string') return err
  if (!err || typeof err !== 'object') return ''
  const message = (err as { message?: unknown }).message
  return typeof message === 'string' ? message : ''
}

function isAlreadySpecific(message: string): boolean {
  if (!message) return false
  if (/^failed to download apk\b/i.test(message)) return true
  if (/^not enough free space\b/i.test(message)) return true
  if (/^this port is large\b/i.test(message)) return true
  if (/not connected/i.test(message)) return true
  if (/install_failed|package manager|installation error/i.test(message)) return true
  if (/release archive/i.test(message)) return true
  return false
}

function isUsbDisconnect(name: string, message: string): boolean {
  if (name === 'NetworkError') return true
  return /usb device disconnected|device was disconnected|device disconnected|transfer error has occurred|device offline/i.test(message)
}

function isDownloadDrop(name: string, message: string): boolean {
  if (name === 'TypeError') return true
  return /failed to fetch|networkerror|network error|load failed|econnreset|connection reset|err_internet|err_connection|socket hang up|\bterminated\b/i.test(message)
}

function withCause(message: string, cause: unknown): Error {
  const error = new Error(message)
  try {
    (error as { cause?: unknown }).cause = cause
  } catch {
    // Some hosts freeze the cause field. The message is what the card shows.
  }
  return error
}

/**
 * Mid-copy failures become the card's sentences. User cancel, low space, and
 * package-manager text stay as they are.
 */
export function friendlyApkStreamError(
  err: unknown,
  signal?: AbortSignal | null,
  kind: ApkStreamKind = 'download'
): unknown {
  if (signal?.aborted || isUserCancel(err)) {
    if (isUserCancel(err)) return err
    return new DOMException('Installation cancelled by user', 'AbortError')
  }
  if (isApkTooLargeError(err) || isLowSpaceError(err)) return err
  const name = errorName(err)
  const message = errorMessage(err)
  if (isAlreadySpecific(message)) return err
  if (isUsbDisconnect(name, message)) return withCause(USB_STREAM_FAILED, err)
  if (kind === 'download' && isDownloadDrop(name, message)) return withCause(DOWNLOAD_STREAM_FAILED, err)
  if (!message || /\n\s+at\s+/.test(message)) {
    return withCause(kind === 'download' ? DOWNLOAD_STREAM_FAILED : USB_STREAM_FAILED, err)
  }
  return err
}

/**
 * Pipe `stream` into `write` without concatenating it.
 * One chunk is in flight. Progress is that same copy, so download and push share a bar.
 * On failure or cancel, `cleanup` deletes the partial remote file.
 */
export async function pushApkStream(options: {
  stream: ReadableStream<Uint8Array>
  totalBytes: number
  signal?: AbortSignal | null
  remotePath: string
  phase?: 'download' | 'transfer'
  kind?: ApkStreamKind
  write: (file: ReadableStream<Uint8Array>) => Promise<void>
  cleanup: (remotePath: string) => Promise<void>
  onProgress: (update: ApkPushProgress) => void
}): Promise<void> {
  const signal = options.signal ?? null
  const phase = options.phase ?? 'download'
  const kind = options.kind ?? 'download'
  let loaded = 0
  const progressTransform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      if (signal?.aborted) {
        controller.error(new DOMException('Installation cancelled by user', 'AbortError'))
        return
      }
      loaded += chunk.byteLength
      const view = describeByteProgress(loaded, options.totalBytes, phase)
      options.onProgress({
        loaded,
        percent: view.percent,
        indeterminate: view.indeterminate,
        message: view.message,
        receivedLabel: formatByteSize(loaded)
      })
      controller.enqueue(chunk)
    }
  }, new CountQueuingStrategy({ highWaterMark: 1 }), new CountQueuingStrategy({ highWaterMark: 1 }))

  const monitored = options.stream.pipeThrough(progressTransform)
  const fail = async (err: unknown): Promise<never> => {
    await monitored.cancel().catch(() => {})
    await options.cleanup(options.remotePath).catch(() => {})
    throw friendlyApkStreamError(err, signal, kind)
  }

  if (signal?.aborted) {
    return fail(new DOMException('Installation cancelled by user', 'AbortError'))
  }

  const onAbort = () => {
    monitored.cancel(new DOMException('Installation cancelled by user', 'AbortError')).catch(() => {})
  }
  signal?.addEventListener('abort', onAbort, { once: true })

  try {
    await options.write(monitored)
    if (signal?.aborted) {
      throw new DOMException('Installation cancelled by user', 'AbortError')
    }
  } catch (err) {
    return fail(err)
  } finally {
    signal?.removeEventListener('abort', onAbort)
  }
}
