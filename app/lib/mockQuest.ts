import { ref } from 'vue'
import { INITIAL_PORTS } from '~/data/mockPorts'
import { getPortCampaigns } from '~/data/expansions'
import { PORT_PACKAGE_CONFIGS } from '~/data/portPackageMap'
import { QUEST_USB_MESSAGES } from '~/lib/questUsbMessages'

/**
 * Test-only Quest headset. Inactive unless the page URL contains mockQuest
 * (and the value is not 0 / false / off / no). Normal visitors never hit this.
 */

export type MockPhase =
  | 'disconnected'
  | 'unsupported'
  | 'picker'
  | 'authorizing'
  | 'connected'
  | 'scanning'
  | 'unauthorized'
  | 'usb-locked'
  | 'cancelled'
  | 'timeout'
  | 'generic'

export type MockNext =
  | 'ok'
  | 'unauthorized'
  | 'usb-locked'
  | 'cancelled'
  | 'timeout'
  | 'generic'
  | 'picker-cancel'

export type MockInstall =
  | 'ok'
  | 'download-failed'
  | 'storage'
  | 'disconnect'
  | 'unauthorized'
  | 'pm-failed'
  | 'hold-downloading'
  | 'hold-pushing'
  | 'hold-installing'
  | 'hold-success'

export interface MockQuestScenario {
  phase: MockPhase
  next: MockNext
  install: MockInstall
  game: 'absent' | 'installed' | 'outdated'
  files: 'missing' | 'present'
  uninstall: 'ok' | 'fail'
  chrome: boolean
  speed: 'normal' | 'instant'
  launch: 'ok' | 'slow'
  transfer: 'ok' | 'hold'
}

export const MOCK_PHASES: MockPhase[] = [
  'disconnected',
  'unsupported',
  'picker',
  'authorizing',
  'connected',
  'scanning',
  'unauthorized',
  'usb-locked',
  'cancelled',
  'timeout',
  'generic'
]

export const MOCK_INSTALLS: MockInstall[] = [
  'ok',
  'download-failed',
  'storage',
  'disconnect',
  'unauthorized',
  'pm-failed',
  'hold-downloading',
  'hold-pushing',
  'hold-installing',
  'hold-success'
]

const PHASE_SET = new Set<string>(MOCK_PHASES)
const NEXT_SET = new Set<string>(['ok', 'unauthorized', 'usb-locked', 'cancelled', 'timeout', 'generic', 'picker-cancel'])
const INSTALL_SET = new Set<string>(MOCK_INSTALLS)

const DISABLED = new Set(['0', 'false', 'off', 'no'])

export const mockScenarioRevision = ref(0)
export const mockOverlay = ref<'none' | 'usb-picker' | 'visor'>('none')

const SYSTEM_PACKAGES = ['com.oculus.vrshell', 'com.oculus.systemdriver', 'com.oculus.os.vrsystemui']

export function parseMockScenario(search: string): MockQuestScenario | null {
  const raw = search.startsWith('?') ? search.slice(1) : search
  const params = new URLSearchParams(raw)
  if (!params.has('mockQuest')) return null
  const flag = (params.get('mockQuest') || '1').trim().toLowerCase()
  if (DISABLED.has(flag)) return null

  const phaseParam = params.get('mockPhase') || (PHASE_SET.has(flag) ? flag : 'disconnected')
  const phase = (PHASE_SET.has(phaseParam) ? phaseParam : 'disconnected') as MockPhase
  const nextParam = params.get('mockNext') || 'ok'
  const next = (NEXT_SET.has(nextParam) ? nextParam : 'ok') as MockNext
  const installParam = params.get('mockInstall') || 'ok'
  const install = (INSTALL_SET.has(installParam) ? installParam : 'ok') as MockInstall
  const gameParam = params.get('mockGame') || 'absent'
  const game = gameParam === 'installed' || gameParam === 'outdated' ? gameParam : 'absent'
  const files = params.get('mockFiles') === 'present' ? 'present' : 'missing'
  const uninstall = params.get('mockUninstall') === 'fail' ? 'fail' : 'ok'
  const chrome = params.get('mockChrome') !== '0'
  const speed = params.get('mockSpeed') === 'instant' ? 'instant' : 'normal'
  const launch = params.get('mockLaunch') === 'slow' ? 'slow' : 'ok'
  const transfer = params.get('mockTransfer') === 'hold' ? 'hold' : 'ok'

  return { phase, next, install, game, files, uninstall, chrome, speed, launch, transfer }
}

export function isMockQuestEnabled(search?: string): boolean {
  if (search === undefined) {
    if (typeof window === 'undefined') return false
    void mockScenarioRevision.value
    search = window.location.search
  }
  return parseMockScenario(search) !== null
}

export function readMockScenario(): MockQuestScenario | null {
  if (typeof window === 'undefined') return null
  void mockScenarioRevision.value
  return parseMockScenario(window.location.search)
}

export function writeMockSearch(partial: Record<string, string | null>, hashMode: 'replace' | 'push' = 'replace') {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (!params.has('mockQuest')) params.set('mockQuest', '1')
  for (const [key, value] of Object.entries(partial)) {
    if (value == null || value === '') params.delete(key)
    else params.set(key, value)
  }
  const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  if (hashMode === 'push') window.history.pushState(window.history.state, '', next)
  else window.history.replaceState(window.history.state, '', next)
  mockScenarioRevision.value++
}

export function connectionErrorForPhase(phase: MockPhase): string | null {
  switch (phase) {
    case 'unsupported':
      return QUEST_USB_MESSAGES.unsupported
    case 'unauthorized':
      return QUEST_USB_MESSAGES.unauthorized
    case 'usb-locked':
      return QUEST_USB_MESSAGES.usbLocked
    case 'cancelled':
      return QUEST_USB_MESSAGES.cancelled
    case 'timeout':
      return QUEST_USB_MESSAGES.timeout
    case 'generic':
      return QUEST_USB_MESSAGES.generic
    default:
      return null
  }
}

export function connectionErrorForNext(next: MockNext): string | null {
  if (next === 'ok' || next === 'picker-cancel') return null
  return connectionErrorForPhase(next)
}

function joinPath(dir: string, name: string): string {
  const base = dir.replace(/\/+$/, '')
  const child = name.replace(/^\/+/, '')
  return `${base}/${child}`
}

function fileNameFromExample(example: string, folder: string): string {
  const tokens = example.split(/[,/]|\s+/).map(t => t.trim()).filter(Boolean)
  const withDot = tokens.find(t => /\.[a-z0-9]{2,4}$/i.test(t.replace(/[).]+$/, '')))
  if (withDot) return withDot.replace(/[).]+$/, '')
  return `${folder || 'asset'}.bin`
}

function sampleForPattern(pattern: string, folderName: string): string {
  const source = pattern
  const group = source.match(/\\.\(?([a-z0-9|]+)\)?/i)
  const ext = group?.[1]?.split('|')[0] || 'bin'
  const stem = (folderName || 'file').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'file'
  return `${stem}.${ext}`
}

/** Absolute headset paths the UI scan treats as "files present" for every catalog game. */
export function collectPresentSeedPaths(): string[] {
  const paths: string[] = []
  for (const port of INITIAL_PORTS) {
    for (const campaign of getPortCampaigns(port)) {
      if (!campaign.fullPath.startsWith('/sdcard/')) continue
      paths.push(joinPath(campaign.fullPath, fileNameFromExample(campaign.exampleFiles, campaign.folder)))
    }
    const cfg = PORT_PACKAGE_CONFIGS[port.slug]
    if (!cfg) continue
    if (cfg.targetPath) {
      for (const rel of cfg.criticalFiles || []) {
        if (rel) paths.push(joinPath(cfg.targetPath, rel))
      }
    }
    for (const folder of cfg.folders || []) {
      if (folder.expectedFiles?.length) {
        for (const name of folder.expectedFiles) paths.push(joinPath(folder.targetPath, name))
      } else if (folder.fileExtensionPattern) {
        paths.push(joinPath(folder.targetPath, sampleForPattern(folder.fileExtensionPattern, folder.folderName)))
      }
    }
  }
  return Array.from(new Set(paths))
}

interface FsDir {
  dirs: Map<string, FsDir>
  files: Map<string, number>
}

function emptyDir(): FsDir {
  return { dirs: new Map(), files: new Map() }
}

export class MockQuestFilesystem {
  private root = emptyDir()

  addFile(absPath: string, size = 4096) {
    const parts = absPath.split('/').filter(Boolean)
    if (parts.length === 0) return
    let node = this.root
    for (let i = 0; i < parts.length - 1; i++) {
      const seg = parts[i]!
      let next = node.dirs.get(seg)
      if (!next) {
        next = emptyDir()
        node.dirs.set(seg, next)
      }
      node = next
    }
    const file = parts[parts.length - 1]!
    node.files.set(file, size)
  }

  private walk(absPath: string): FsDir | null {
    const parts = absPath.split('/').filter(Boolean)
    let node = this.root
    for (const seg of parts) {
      const next = node.dirs.get(seg)
      if (!next) return null
      node = next
    }
    return node
  }

  list(absPath: string): string[] | null {
    const node = this.walk(absPath)
    if (!node) return null
    return [...node.dirs.keys(), ...node.files.keys()].sort((a, b) => a.localeCompare(b))
  }

  listDetails(absPath: string): { name: string; type: number; size: number; mtime: number }[] | null {
    const node = this.walk(absPath)
    if (!node) return null
    const mtime = Math.floor(Date.now() / 1000)
    const dirs = [...node.dirs.keys()].sort().map(name => ({ name, type: 4, size: 0, mtime }))
    const files = [...node.files.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, size]) => ({
      name,
      type: 8,
      size,
      mtime
    }))
    return [...dirs, ...files]
  }

  mkdir(absPath: string) {
    const parts = absPath.split('/').filter(Boolean)
    let node = this.root
    for (const seg of parts) {
      let next = node.dirs.get(seg)
      if (!next) {
        next = emptyDir()
        node.dirs.set(seg, next)
      }
      node = next
    }
  }

  remove(absPath: string) {
    const parts = absPath.split('/').filter(Boolean)
    if (parts.length === 0) return
    let node = this.root
    for (let i = 0; i < parts.length - 1; i++) {
      const next = node.dirs.get(parts[i]!)
      if (!next) return
      node = next
    }
    const leaf = parts[parts.length - 1]!
    node.dirs.delete(leaf)
    node.files.delete(leaf)
  }
}

export interface MockPackageState {
  packages: string[]
  versions: Record<string, string>
}

export function buildPackageState(game: MockQuestScenario['game']): MockPackageState {
  const packages = [...SYSTEM_PACKAGES]
  const versions: Record<string, string> = {}
  if (game === 'absent') return { packages, versions }
  for (const port of INITIAL_PORTS) {
    const cfg = PORT_PACKAGE_CONFIGS[port.slug]
    if (!cfg?.packageName) continue
    packages.push(cfg.packageName)
    versions[cfg.packageName] = game === 'outdated' ? '0.0.1' : (port.latest_version || '1.0.0')
  }
  return { packages, versions }
}

type Choice = 'device' | 'cancel' | 'allow' | 'deny'

let pendingChoice: ((choice: Choice) => void) | null = null

export function waitForMockChoice(): Promise<Choice> {
  return new Promise(resolve => {
    pendingChoice = resolve
  })
}

export function resolveMockChoice(choice: Choice) {
  const pending = pendingChoice
  pendingChoice = null
  pending?.(choice)
}

export function cancelPendingMockChoice() {
  resolveMockChoice('cancel')
}

let installSignal: AbortSignal | null = null
let sessionAbort: AbortController | null = null

export function armMockInstall(signal: AbortSignal | null) {
  installSignal = signal
}

/** Aborts in-flight simulated storage reads (the scanning hold) and starts a new session. */
export function rotateMockSession(): AbortSignal {
  sessionAbort?.abort()
  sessionAbort = new AbortController()
  return sessionAbort.signal
}

export function abortMockSession() {
  sessionAbort?.abort()
  sessionAbort = null
}

function abortedError(): DOMException {
  return new DOMException('Installation cancelled by user', 'AbortError')
}

export function hangUntilAbort(signal: AbortSignal | null): Promise<never> {
  return new Promise((_, reject) => {
    if (!signal) {
      reject(abortedError())
      return
    }
    if (signal.aborted) {
      reject(abortedError())
      return
    }
    const onAbort = () => reject(abortedError())
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

function delay(ms: number, signal: AbortSignal | null): Promise<void> {
  if (ms <= 0) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(timer)
      reject(abortedError())
    }
    if (signal?.aborted) {
      onAbort()
      return
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

async function drainStream(file: any, maxChunks: number): Promise<number> {
  let chunks = 0
  let bytes = 0
  let finished = false
  if (!file || typeof file.getReader !== 'function') return 0
  const reader = file.getReader()
  try {
    while (chunks < maxChunks) {
      const { done, value } = await reader.read()
      if (done) {
        finished = true
        break
      }
      bytes += value?.byteLength || 0
      chunks++
    }
  } finally {
    // Leave the reader locked when pausing mid-transfer so the upload progress holds.
    if (finished) {
      try {
        reader.releaseLock()
      } catch {
        // Already released.
      }
    }
  }
  return bytes
}

const APK_TEMP = '/data/local/tmp/questports_installer.apk'

export interface MockQuestDevice {
  fs: MockQuestFilesystem
  packages: string[]
  versions: Record<string, string>
  /** Set by the composable when the USB cable is pulled. */
  onDisconnect: (() => void) | null
  shell: (command: string) => Promise<string>
  getProp: (key: string) => Promise<string>
  writeFile: (filename: string, file: any) => Promise<void>
  readdir: (path: string) => Promise<{ name: string; type: number; size: number; mtime: number }[]>
}

let activeDevice: MockQuestDevice | null = null

export function getActiveMockDevice(): MockQuestDevice | null {
  return activeDevice
}

export function createMockQuestDevice(scenario: MockQuestScenario): MockQuestDevice {
  const fs = new MockQuestFilesystem()
  if (scenario.files === 'present') {
    for (const path of collectPresentSeedPaths()) fs.addFile(path, 1024 * 64)
  }
  const seeded = buildPackageState(scenario.game)
  const packages = seeded.packages
  const versions = seeded.versions
  let lsHangsLeft = scenario.phase === 'scanning' ? 1 : 0

  const device: MockQuestDevice = {
    fs,
    packages,
    versions,
    onDisconnect: null,
    async getProp(key: string) {
      if (key === 'ro.product.model') return 'Quest 3'
      if (key === 'ro.build.version.release') return '12'
      return ''
    },
    async shell(command: string) {
      const scenarioNow = readMockScenario()
      const speed = scenarioNow?.speed || scenario.speed
      const cmd = command.trim()

      if (cmd.startsWith('dumpsys battery')) {
        return [
          'Current Battery Service state:',
          '  AC powered: false',
          '  USB powered: true',
          '  Wireless powered: false',
          '  status: 2',
          '  level: 78',
          ''
        ].join('\n')
      }

      if (cmd.startsWith('df')) {
        const full = (scenarioNow?.install || scenario.install) === 'storage'
        if (full) {
          return 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/fuse       128G  127G  184M  99% /storage/emulated\n'
        }
        return 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/fuse       128G   40G   88G  32% /storage/emulated\n'
      }

      if (cmd.startsWith('pm list packages')) {
        const list = cmd.includes('-3')
          ? packages.filter(p => !SYSTEM_PACKAGES.includes(p))
          : packages
        return list.map(p => `package:${p}`).join('\n') + (list.length ? '\n' : '')
      }

      if (cmd.startsWith('dumpsys package')) {
        const pkg = cmd.replace(/^dumpsys package\s+/, '').trim()
        const version = versions[pkg]
        if (!version) return ''
        return `Package [${pkg}]\n    versionName=${version}\n`
      }

      if (cmd.startsWith('pm install')) {
        const install = scenarioNow?.install || scenario.install
        const signal = installSignal
        if (install === 'hold-installing') {
          await hangUntilAbort(signal)
        }
        await delay(speed === 'instant' ? 0 : 700, signal)
        if (install === 'storage') return 'Failure [INSTALL_FAILED_INSUFFICIENT_STORAGE]\n'
        if (install === 'unauthorized') return 'error: device unauthorized.\n'
        if (install === 'pm-failed') return 'Failure [INSTALL_FAILED_INVALID_APK]\n'
        if (install === 'disconnect') {
          device.onDisconnect?.()
          throw new Error('USB device disconnected')
        }
        const slug = currentSlug()
        const cfg = slug ? PORT_PACKAGE_CONFIGS[slug] : undefined
        const port = slug ? INITIAL_PORTS.find(p => p.slug === slug) : undefined
        if (cfg?.packageName) {
          if (!packages.includes(cfg.packageName)) packages.push(cfg.packageName)
          versions[cfg.packageName] = port?.latest_version || '1.0.0'
        }
        return 'Success\n'
      }

      if (cmd.startsWith('pm uninstall')) {
        const pkg = cmd.replace(/^pm uninstall\s+/, '').trim()
        if ((scenarioNow?.uninstall || scenario.uninstall) === 'fail') {
          return 'Failure [DELETE_FAILED_INTERNAL_ERROR]\n'
        }
        const idx = packages.indexOf(pkg)
        if (idx >= 0) packages.splice(idx, 1)
        delete versions[pkg]
        return 'Success\n'
      }

      if (cmd.startsWith('monkey')) {
        if ((scenarioNow?.launch || scenario.launch) === 'slow') {
          await delay(1200, installSignal)
        }
        return 'Events injected: 1\n'
      }

      if (cmd.startsWith('mkdir')) {
        const target = extractQuoted(cmd) || cmd.split(/\s+/).pop() || ''
        if (target) fs.mkdir(target)
        return ''
      }

      if (cmd.startsWith('rm ')) {
        const target = extractQuoted(cmd) || ''
        if (target) fs.remove(target)
        return ''
      }

      if (cmd.startsWith('ls')) {
        if (lsHangsLeft > 0) {
          lsHangsLeft--
          await hangUntilAbort(sessionAbort?.signal ?? null)
        }
        const target = extractQuoted(cmd)
        if (!target) return 'ls: No such file or directory\n'
        const names = fs.list(target)
        if (!names) return `ls: ${target}: No such file or directory\n`
        if (cmd.includes('-la') || cmd.includes('-l')) {
          const details = fs.listDetails(target) || []
          return details.map(e => {
            const perms = e.type === 4 ? 'drwxrwxr-x' : '-rw-rw-r--'
            return `${perms} 1 shell shell ${e.size} Jan 1 00:00 ${e.name}`
          }).join('\n')
        }
        return names.join('\n') + (names.length ? '\n' : '')
      }

      return ''
    },
    async writeFile(filename: string, file: any) {
      const scenarioNow = readMockScenario()
      const install = scenarioNow?.install || scenario.install
      const transfer = scenarioNow?.transfer || scenario.transfer
      const isApk = filename === APK_TEMP || filename.endsWith('questports_installer.apk')
      const signal = installSignal

      if (isApk && install === 'hold-pushing') {
        await drainStream(file, 3)
        await hangUntilAbort(signal)
        return
      }
      if (isApk && install === 'disconnect') {
        await drainStream(file, 3)
        device.onDisconnect?.()
        throw new Error('USB device disconnected')
      }
      if (!isApk && transfer === 'hold') {
        await drainStream(file, 2)
        await hangUntilAbort(signal)
        return
      }

      const bytes = await drainStream(file, Number.POSITIVE_INFINITY)
      if (!isApk) fs.addFile(filename, bytes || 4096)
    },
    async readdir(path: string) {
      return fs.listDetails(path) || []
    }
  }

  return device
}

function extractQuoted(command: string): string | null {
  const match = command.match(/"([^"]+)"/)
  return match?.[1] ?? null
}

function currentSlug(): string | null {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/\/ports\/([^/?#]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function activateMockDevice(scenario: MockQuestScenario): MockQuestDevice {
  rotateMockSession()
  activeDevice = createMockQuestDevice(scenario)
  return activeDevice
}

export function clearMockDevice() {
  abortMockSession()
  activeDevice = null
  mockOverlay.value = 'none'
}

export async function mockApkProxyResponse(signal: AbortSignal): Promise<Response> {
  armMockInstall(signal)
  const scenario = readMockScenario()
  const install = scenario?.install || 'ok'
  const speed = scenario?.speed || 'normal'
  if (install === 'hold-downloading') {
    await hangUntilAbort(signal)
  }
  if (install === 'download-failed') {
    await delay(speed === 'instant' ? 0 : 250, signal)
    return new Response(JSON.stringify({ statusMessage: 'The release asset could not be downloaded (HTTP 502)' }), {
      status: 502,
      headers: { 'content-type': 'application/json' }
    })
  }
  await delay(speed === 'instant' ? 0 : 600, signal)
  const total = 8 * 1024 * 1024
  const chunkSize = 256 * 1024
  let sent = 0
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (signal.aborted) {
        controller.error(abortedError())
        return
      }
      if (sent >= total) {
        controller.close()
        return
      }
      const n = Math.min(chunkSize, total - sent)
      controller.enqueue(new Uint8Array(n))
      sent += n
      if (speed !== 'instant') await delay(40, signal)
    }
  })
  return new Response(stream, {
    status: 200,
    headers: { 'content-length': String(total) }
  })
}

export async function mockHoldAfterSuccessfulInstall(signal: AbortSignal) {
  const scenario = readMockScenario()
  if (scenario?.install === 'hold-success') {
    await hangUntilAbort(signal)
  }
}

export function mockAdbFromDevice(device: MockQuestDevice) {
  return {
    subprocess: {
      shellProtocol: {
        spawnWaitText: async (command: string) => {
          const stdout = await device.shell(command)
          return { stdout, stderr: '', exitCode: 0 }
        }
      }
    },
    getProp: (key: string) => device.getProp(key),
    sync: async () => ({
      write: async (opts: { filename: string; file: any }) => device.writeFile(opts.filename, opts.file),
      readdir: (path: string) => device.readdir(path),
      dispose: async () => {}
    }),
    disconnected: new Promise(() => {}),
    close: async () => {}
  }
}
