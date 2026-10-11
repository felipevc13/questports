import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ApkTooLargeError, tooLargeInstallMessage } from '../app/lib/apkProxyPolicy'
import {
  APK_INSTALL_TEMP_PATH,
  DOWNLOAD_STREAM_FAILED,
  USB_STREAM_FAILED,
  ZIP_BROWSER_MAX_BYTES,
  freeSpaceCheckBytes,
  friendlyApkStreamError,
  knownDownloadBytes,
  planRemoteApkBody,
  pushApkStream,
  type ApkPushProgress
} from '../app/lib/apkStreamInstall'
import {
  createInstallStepLedger,
  installErrorReason,
  installStepEventsForProgress
} from '../app/lib/analytics'
import { readStreamWithProgress, StreamByteLimitError } from '../app/lib/installFlow'
import { createMockApkResponse, createMockQuestDevice } from '../app/lib/mockQuest'

const MOCK_HEADSET = {
  phase: 'connected',
  next: 'ok',
  game: 'absent',
  files: 'missing',
  uninstall: 'ok',
  chrome: false,
  speed: 'instant',
  launch: 'ok',
  transfer: 'ok',
  freeMb: 8192
} as const

const AGE_OF_JOY_BYTES = 1_363_838_334

interface MockAdb {
  filename: string | null
  chunks: Uint8Array[]
  removed: string | null
  write: (file: ReadableStream<Uint8Array>) => Promise<void>
  rm: (path: string) => Promise<void>
}

function mockAdb(options?: {
  failAfterBytes?: number
  fail?: () => Error
}): MockAdb {
  const adb: MockAdb = {
    filename: null,
    chunks: [],
    removed: null,
    async write(file) {
      adb.filename = APK_INSTALL_TEMP_PATH
      const reader = file.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          if (!value) continue
          adb.chunks.push(value)
          const total = adb.chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
          if (options?.failAfterBytes != null && total >= options.failAfterBytes) {
            throw options.fail?.() ?? new Error('USB device disconnected')
          }
        }
      } finally {
        try {
          reader.releaseLock()
        } catch {
          // Cancel already released the reader.
        }
      }
    },
    async rm(path) {
      adb.removed = path
    }
  }
  return adb
}

function chunkStream(parts: Uint8Array[], error?: Error): ReadableStream<Uint8Array> {
  let index = 0
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index >= parts.length) {
        if (error) controller.error(error)
        else controller.close()
        return
      }
      const next = parts[index]
      index += 1
      if (next) controller.enqueue(next)
    }
  }, new CountQueuingStrategy({ highWaterMark: 1 }))
}

async function push(options: {
  stream: ReadableStream<Uint8Array>
  totalBytes: number
  signal?: AbortSignal | null
  adb?: MockAdb
  failAfterBytes?: number
  fail?: () => Error
}): Promise<{ adb: MockAdb; progress: ApkPushProgress[] }> {
  const adb = options.adb ?? mockAdb({
    failAfterBytes: options.failAfterBytes,
    fail: options.fail
  })
  const progress: ApkPushProgress[] = []
  await pushApkStream({
    stream: options.stream,
    totalBytes: options.totalBytes,
    signal: options.signal,
    remotePath: APK_INSTALL_TEMP_PATH,
    phase: 'download',
    kind: 'download',
    write: (file) => adb.write(file),
    cleanup: (path) => adb.rm(path),
    onProgress: (update) => {
      progress.push(update)
    }
  })
  return { adb, progress }
}

describe('apk stream install', () => {
  it('pushes each chunk as it arrives and does not keep the whole file', async () => {
    let produced = 0
    let releaseRest: () => void = () => {}
    const rest = new Promise<void>((resolve) => {
      releaseRest = resolve
    })
    const first = new Uint8Array([1, 2, 3, 4])
    const second = new Uint8Array([5, 6, 7, 8])
    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        produced += 1
        if (produced === 1) {
          controller.enqueue(first)
          await rest
          return
        }
        controller.enqueue(second)
        controller.close()
      }
    }, new CountQueuingStrategy({ highWaterMark: 1 }))

    const adb = mockAdb()
    let sawFirstBeforeRest = false
    const pending = pushApkStream({
      stream,
      totalBytes: 8,
      remotePath: APK_INSTALL_TEMP_PATH,
      phase: 'download',
      kind: 'download',
      write: async (file) => {
        const reader = file.getReader()
        const chunk = await reader.read()
        sawFirstBeforeRest = produced === 1 && chunk.value?.byteLength === 4
        releaseRest()
        const next = await reader.read()
        expect(next.value).toEqual(second)
        const done = await reader.read()
        expect(done.done).toBe(true)
        reader.releaseLock()
        adb.chunks.push(chunk.value!, next.value!)
      },
      cleanup: (path) => adb.rm(path),
      onProgress: () => {}
    })

    await pending
    expect(sawFirstBeforeRest).toBe(true)
    expect(produced).toBe(2)
    expect(adb.chunks.map(chunk => chunk[0])).toEqual([1, 5])
    expect(adb.removed).toBeNull()
  })

  it('reports one bar through a successful copy', async () => {
    const parts = [new Uint8Array(1024 * 1024), new Uint8Array(1024 * 1024)]
    const { adb, progress } = await push({
      stream: chunkStream(parts),
      totalBytes: 2 * 1024 * 1024
    })
    expect(adb.chunks).toHaveLength(2)
    expect(adb.chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)).toBe(2 * 1024 * 1024)
    expect(adb.removed).toBeNull()
    expect(progress.map(item => item.percent)).toEqual([50, 100])
    expect(progress.every(item => item.indeterminate === false)).toBe(true)
    expect(progress[1]?.message).toContain('2.0 MB / 2.0 MB')
    expect(progress[1]?.receivedLabel).toBe('2.0 MB')
  })

  it('tracks bytes when content-length is missing', async () => {
    expect(knownDownloadBytes(null)).toBe(0)
    expect(knownDownloadBytes('')).toBe(0)
    expect(freeSpaceCheckBytes(0)).toBeNull()
    expect(freeSpaceCheckBytes(AGE_OF_JOY_BYTES)).toBe(AGE_OF_JOY_BYTES)

    const parts = [new Uint8Array(1024 * 1024), new Uint8Array(512 * 1024)]
    const { adb, progress } = await push({
      stream: chunkStream(parts),
      totalBytes: knownDownloadBytes(null)
    })
    expect(adb.removed).toBeNull()
    expect(adb.chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)).toBe(parts[0]!.byteLength + parts[1]!.byteLength)
    expect(progress.every(item => item.indeterminate)).toBe(true)
    expect(progress.every(item => item.percent === 0)).toBe(true)
    expect(progress[0]?.message).toContain('1.0 MB')
    expect(progress[0]?.message).toContain('size unknown')
    expect(progress[1]?.receivedLabel).toBe('1.5 MB')
    expect(progress[1]?.message).toContain('1.5 MB')
  })

  it('turns a mid-stream network drop into the download message and deletes the partial file', async () => {
    const adb = mockAdb()
    const stream = chunkStream(
      [new Uint8Array(64 * 1024), new Uint8Array(64 * 1024)],
      new TypeError('Failed to fetch')
    )
    await expect(push({
      stream,
      totalBytes: 192 * 1024,
      adb
    })).rejects.toThrow(DOWNLOAD_STREAM_FAILED)

    expect(adb.removed).toBe(APK_INSTALL_TEMP_PATH)
    expect(adb.chunks.length).toBeGreaterThan(0)
    expect(installErrorReason(new Error(DOWNLOAD_STREAM_FAILED))).toBe('download_fail')
    const raw = new TypeError('Failed to fetch')
    const friendly = friendlyApkStreamError(raw, null, 'download') as Error
    expect(friendly).not.toBe(raw)
    expect(friendly.message).toBe(DOWNLOAD_STREAM_FAILED)
    expect(friendly.message).not.toContain('Failed to fetch')
  })

  it('turns a USB disconnect into the cable message and deletes the partial file', async () => {
    const adb = mockAdb({
      failAfterBytes: 32,
      fail: () => new Error('USB device disconnected')
    })
    await expect(push({
      stream: chunkStream([new Uint8Array(64), new Uint8Array(64)]),
      totalBytes: 128,
      adb
    })).rejects.toThrow(USB_STREAM_FAILED)

    expect(adb.removed).toBe(APK_INSTALL_TEMP_PATH)
    expect(adb.chunks.length).toBeGreaterThan(0)
    const usb = friendlyApkStreamError(
      new DOMException('A transfer error has occurred.', 'NetworkError'),
      null,
      'download'
    ) as Error
    expect(usb.message).toBe(USB_STREAM_FAILED)
    expect(usb.message).not.toContain('transfer error')
    expect(installErrorReason(usb)).toBe('adb_fail')
    expect(friendlyApkStreamError(new Error('Failure [INSTALL_FAILED_INVALID_APK]'), null, 'download'))
      .toMatchObject({ message: 'Failure [INSTALL_FAILED_INVALID_APK]' })
    const http = new Error('Failed to download APK: HTTP 404')
    expect(friendlyApkStreamError(http, null, 'download')).toBe(http)
  })

  it('cancels the copy, deletes the partial file, and stays a user cancel', async () => {
    const controller = new AbortController()
    const adb = mockAdb()
    let releaseNext: (() => void) | null = null
    const stream = new ReadableStream<Uint8Array>({
      async pull(controllerStream) {
        controllerStream.enqueue(new Uint8Array(1024))
        await new Promise<void>((resolve) => {
          releaseNext = resolve
        })
      }
    }, new CountQueuingStrategy({ highWaterMark: 1 }))
    const outcome = pushApkStream({
      stream,
      totalBytes: 8 * 1024,
      signal: controller.signal,
      remotePath: APK_INSTALL_TEMP_PATH,
      phase: 'download',
      kind: 'download',
      write: async (file) => {
        const reader = file.getReader()
        await reader.read()
        controller.abort()
        releaseNext?.()
        await reader.read()
      },
      cleanup: (path) => adb.rm(path),
      onProgress: () => {}
    })
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('cancel hung')), 1000)
    })
    await expect(Promise.race([outcome, timeout])).rejects.toMatchObject({ name: 'AbortError' })
    expect(adb.removed).toBe(APK_INSTALL_TEMP_PATH)
    const aborted = new AbortController()
    aborted.abort()
    const mapped = friendlyApkStreamError(new TypeError('Failed to fetch'), aborted.signal, 'download') as DOMException
    expect(mapped.name).toBe('AbortError')
    expect(installErrorReason(mapped)).toBe('user_cancelled')
  })

  it('streams a plain apk of any size and refuses a large zip outside the app', () => {
    expect(planRemoteApkBody({
      zip: false,
      totalBytes: AGE_OF_JOY_BYTES,
      appMode: false
    })).toEqual({ action: 'stream', totalBytes: AGE_OF_JOY_BYTES })
    expect(planRemoteApkBody({
      zip: false,
      totalBytes: 0,
      appMode: false
    })).toEqual({ action: 'stream', totalBytes: 0 })

    const zipBytes = ZIP_BROWSER_MAX_BYTES + 1
    expect(planRemoteApkBody({ zip: true, totalBytes: zipBytes, appMode: false })).toEqual({
      action: 'too-large',
      size: zipBytes
    })
    expect(tooLargeInstallMessage(zipBytes)).toContain('Download it with the direct link')
    expect(new ApkTooLargeError(zipBytes, 'https://github.com/example/game.zip').message).toBe(tooLargeInstallMessage(zipBytes))

    const smallZip = planRemoteApkBody({
      zip: true,
      totalBytes: ZIP_BROWSER_MAX_BYTES,
      appMode: false
    })
    expect(smallZip).toEqual({
      action: 'buffer',
      totalBytes: ZIP_BROWSER_MAX_BYTES,
      maxBytes: ZIP_BROWSER_MAX_BYTES
    })

    const inApp = planRemoteApkBody({
      zip: true,
      totalBytes: zipBytes,
      appMode: true
    })
    expect(inApp.action).toBe('buffer')
    if (inApp.action === 'buffer') expect(inApp.maxBytes).toBe(Number.POSITIVE_INFINITY)
  })

  it('stops buffering a zip once it passes the cap', async () => {
    let pulls = 0
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1
        if (pulls > 8) {
          controller.close()
          return
        }
        controller.enqueue(new Uint8Array(100))
      }
    })
    const signal = new AbortController().signal
    await expect(readStreamWithProgress(stream, signal, () => {}, 250)).rejects.toBeInstanceOf(StreamByteLimitError)
    expect(pulls).toBe(3)
  })

  it('keeps download_apk and install_apk when the stream bar stays on downloading', () => {
    const ledger = createInstallStepLedger()
    const seen: string[] = []
    const apply = (previous: 'idle' | 'downloading' | 'installing' | 'completed' | 'error', next: typeof previous) => {
      for (const event of installStepEventsForProgress(previous, next)) {
        const accepted = event.status === 'start'
          ? ledger.start(event.step)
          : ledger.finish(event.step, event.status)
        if (accepted) seen.push(`${event.step}:${event.status}`)
      }
    }
    apply('idle', 'downloading')
    apply('downloading', 'installing')
    apply('installing', 'completed')
    expect(seen).toEqual([
      'download_apk:start',
      'download_apk:ok',
      'install_apk:start',
      'install_apk:ok'
    ])

    const failed = createInstallStepLedger()
    expect(failed.start('download_apk')).toBe(true)
    const errors = installStepEventsForProgress('downloading', 'error')
    expect(errors).toEqual([
      { step: 'install_apk', status: 'fail' },
      { step: 'download_apk', status: 'fail' }
    ])
    expect(failed.finish('install_apk', 'fail')).toBe(false)
    expect(failed.finish('download_apk', 'fail')).toBe(true)
  })

  it('streams a mock headset body, including a missing length and a USB drop', async () => {
    const { WrapReadableStream } = await import('@yume-chan/stream-extra')
    const controller = new AbortController()
    const res = createMockApkResponse({
      install: 'ok',
      speed: 'instant',
      includeLength: false,
      signal: controller.signal
    })
    expect(res.headers.get('content-length')).toBeNull()
    const device = createMockQuestDevice({ ...MOCK_HEADSET, install: 'ok' })
    let pulls = 0
    const counting = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, streamController) {
        pulls += 1
        streamController.enqueue(chunk)
      }
    })
    const body = res.body!.pipeThrough(counting)
    let removed = false
    const progress: ApkPushProgress[] = []
    await pushApkStream({
      stream: body,
      totalBytes: knownDownloadBytes(res.headers.get('content-length')),
      signal: controller.signal,
      remotePath: APK_INSTALL_TEMP_PATH,
      phase: 'download',
      kind: 'download',
      write: async (file) => {
        const wrapped = new WrapReadableStream(file as ReadableStream<Uint8Array>)
        await device.writeFile(APK_INSTALL_TEMP_PATH, wrapped)
      },
      cleanup: async () => {
        removed = true
      },
      onProgress: (update) => {
        progress.push(update)
      }
    })
    expect(removed).toBe(false)
    expect(pulls).toBeGreaterThan(1)
    expect(progress.at(-1)?.indeterminate).toBe(true)
    expect(progress.at(-1)?.message).toContain('size unknown')

    const dropped = createMockQuestDevice({ ...MOCK_HEADSET, install: 'disconnect' })
    let cleaned = false
    const chunks = Array.from({ length: 6 }, () => new Uint8Array(1024))
    await expect(pushApkStream({
      stream: chunkStream(chunks),
      totalBytes: chunks.length * 1024,
      remotePath: APK_INSTALL_TEMP_PATH,
      phase: 'download',
      kind: 'download',
      write: async (file) => {
        const wrapped = new WrapReadableStream(file as ReadableStream<Uint8Array>)
        await dropped.writeFile(APK_INSTALL_TEMP_PATH, wrapped)
      },
      cleanup: async (path) => {
        cleaned = path === APK_INSTALL_TEMP_PATH
      },
      onProgress: () => {}
    })).rejects.toThrow(USB_STREAM_FAILED)
    expect(cleaned).toBe(true)
  })

  it('wires plain apk bodies into the stream and leaves zip extraction buffered', () => {
    const adb = readFileSync(new URL('../app/composables/useQuestAdb.ts', import.meta.url), 'utf8')
    const fn = adb.slice(adb.indexOf('const installApkUrl'), adb.indexOf('const listRemoteDir'))
    expect(fn).toContain("res.headers.get('content-length')")
    expect(fn).toContain('responseLooksLikeZip(res.headers)')
    expect(fn).toContain('isAppBridgeClient()')
    expect(fn).toContain('freeSpaceCheckBytes')
    const streamAt = fn.indexOf('installApkStream(res.body')
    const bufferAt = fn.indexOf('readStreamWithProgress')
    expect(streamAt).toBeGreaterThan(fn.indexOf('responseLooksLikeZip'))
    expect(bufferAt).toBeGreaterThan(streamAt)
    expect(fn).not.toContain('arrayBuffer')
    expect(fn).toContain('new ApkTooLargeError')
  })
})
