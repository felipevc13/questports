import { describe, expect, it } from 'vitest'
import {
  describeByteProgress,
  formatByteSize,
  parseDfAvailableKilobytes,
  requiredFreeBytes,
  shortageMessage,
  spaceDecision,
  SPACE_CHECK_FAILED,
  reinstallWarningCopy
} from '../app/lib/installFlow'
import {
  createMockApkResponse,
  createMockQuestDevice,
  mockDfOutput,
  parseMockFreeMb,
  parseMockScenario,
  resolveMockFreeMegabytes,
  MOCK_APK_BYTES
} from '../app/lib/mockQuest'

describe('install byte progress', () => {
  it('turns received bytes and content-length into a percent', () => {
    const view = describeByteProgress(4 * 1024 * 1024, 8 * 1024 * 1024, 'download')
    expect(view.indeterminate).toBe(false)
    expect(view.percent).toBe(50)
    expect(view.message).toContain('4.0 MB / 8.0 MB')
  })

  it('stays indeterminate when the size is unknown and reports megabytes', () => {
    const view = describeByteProgress(1.5 * 1024 * 1024, 0, 'download')
    expect(view.indeterminate).toBe(true)
    expect(view.percent).toBe(0)
    expect(view.message).toContain('1.5 MB')
    expect(view.message).toContain('size unknown')
    expect(view.message).not.toContain('%')
  })

  it('reports a file transfer the same way', () => {
    const known = describeByteProgress(1024 * 1024, 2 * 1024 * 1024, 'transfer', 'pak0.pk3')
    expect(known.message).toContain('pak0.pk3')
    expect(known.percent).toBe(50)
    const unknown = describeByteProgress(2 * 1024 * 1024, 0, 'transfer', 'pak0.pk3')
    expect(unknown.indeterminate).toBe(true)
    expect(unknown.message).toContain('2.0 MB')
  })
})

describe('free space check', () => {
  it('reads the available column from df -k and ignores human df -h', () => {
    const text = `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/fuse       100000 40000 32768  50% /storage/emulated`
    expect(parseDfAvailableKilobytes(text)).toBe(32768)
    expect(parseDfAvailableKilobytes('Filesystem Size Used Avail Use% Mounted on\n/dev/fuse 128G 40G 88G 32% /storage/emulated')).toBeNull()
  })

  it('blocks when the payload plus margin exceeds free space', () => {
    const payload = 8 * 1024 * 1024
    const free = 32 * 1024 * 1024
    expect(requiredFreeBytes(payload)).toBe(payload + 64 * 1024 * 1024)
    const decision = spaceDecision(payload, free, 'apk')
    expect(decision.action).toBe('block')
    if (decision.action !== 'block') return
    expect(decision.message).toBe(shortageMessage(payload, free, 'apk'))
    expect(decision.message).toContain('Not enough free space')
    expect(decision.message).toContain(formatByteSize(requiredFreeBytes(payload)))
    expect(decision.message).toContain(formatByteSize(free))
  })

  it('warns and allows the copy when df cannot be read', () => {
    expect(spaceDecision(8 * 1024 * 1024, null, 'apk')).toEqual({
      action: 'warn',
      message: SPACE_CHECK_FAILED
    })
  })

  it('allows a download whose size is not known yet', () => {
    expect(spaceDecision(null, 88 * 1024 * 1024 * 1024, 'apk')).toEqual({ action: 'ok' })
  })
})

describe('reinstall warning', () => {
  it('says uninstall removes Android/data and offers install -r to keep data', () => {
    const copy = reinstallWarningCopy('time-crisis-vr')
    expect(copy.lead).toContain('Android/data')
    expect(copy.lead).toContain('pm uninstall')
    expect(copy.keepData).toContain('pm install -r')
    expect(copy.shared).toBeNull()
  })

  it('mentions shared-storage saves when the catalog already documents them', () => {
    const nolf = reinstallWarningCopy('nolf-vr')
    expect(nolf.shared).toContain('/sdcard/nolf/Save/')
    const rtcw = reinstallWarningCopy('rtcwquest')
    expect(rtcw.shared).toContain('/sdcard/RTCWQuest/')
    expect(rtcw.shared).toContain('stay on the headset')
  })
})

describe('mock free space and download progress', () => {
  it('parses mockFree and keeps the default meter', () => {
    expect(parseMockFreeMb(null)).toBeNull()
    expect(parseMockFreeMb('low')).toBe(32)
    expect(parseMockFreeMb('200')).toBe(200)
    expect(parseMockScenario('?mockQuest=1&mockFree=low')?.freeMb).toBe(32)
    expect(parseMockScenario('?mockQuest=1&mockLength=missing')?.downloadLength).toBe('missing')
    expect(mockDfOutput('df -h /sdcard', 88 * 1024)).toContain('88G')
    expect(mockDfOutput('df -h /sdcard', 184)).toContain('184M')
    const low = mockDfOutput('df -k /sdcard', 32)
    expect(parseDfAvailableKilobytes(low)).toBe(32 * 1024)
  })

  it('reports low free space from the fake headset without changing the default', async () => {
    const roomy = createMockQuestDevice({
      phase: 'connected',
      next: 'ok',
      install: 'ok',
      game: 'absent',
      files: 'missing',
      uninstall: 'ok',
      chrome: false,
      speed: 'instant',
      launch: 'ok',
      transfer: 'ok'
    })
    expect(await roomy.shell('df -h /sdcard')).toContain('88G')
    expect(resolveMockFreeMegabytes({
      phase: 'connected',
      next: 'ok',
      install: 'storage',
      game: 'absent',
      files: 'missing',
      uninstall: 'ok',
      chrome: false,
      speed: 'instant',
      launch: 'ok',
      transfer: 'ok'
    })).toBe(184)

    const tight = createMockQuestDevice({
      phase: 'connected',
      next: 'ok',
      install: 'ok',
      game: 'absent',
      files: 'missing',
      uninstall: 'ok',
      chrome: false,
      speed: 'instant',
      launch: 'ok',
      transfer: 'ok',
      freeMb: 32
    })
    const df = await tight.shell('df -k /sdcard')
    const freeBytes = (parseDfAvailableKilobytes(df) || 0) * 1024
    expect(spaceDecision(MOCK_APK_BYTES, freeBytes, 'apk').action).toBe('block')
  })

  it('streams part of the APK and then waits so cancel can abort', async () => {
    const controller = new AbortController()
    const res = createMockApkResponse({
      install: 'hold-downloading',
      speed: 'instant',
      includeLength: true,
      signal: controller.signal
    })
    expect(res.headers.get('content-length')).toBe(String(MOCK_APK_BYTES))
    const reader = res.body!.getReader()
    let loaded = 0
    while (loaded < 4 * 1024 * 1024) {
      const chunk = await reader.read()
      expect(chunk.done).toBe(false)
      loaded += chunk.value?.byteLength || 0
    }
    expect(loaded).toBe(4 * 1024 * 1024)
    const pending = reader.read()
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('omits content-length when the mock length is missing', async () => {
    const controller = new AbortController()
    const res = createMockApkResponse({
      install: 'ok',
      speed: 'instant',
      includeLength: false,
      signal: controller.signal
    })
    expect(res.headers.get('content-length')).toBeNull()
    const reader = res.body!.getReader()
    const first = await reader.read()
    expect(first.done).toBe(false)
    expect(first.value!.byteLength).toBeGreaterThan(0)
    await reader.cancel()
  })
})
