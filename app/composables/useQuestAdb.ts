import { ref, computed } from 'vue'
import { QUEST_NO_DEVICE_HINT, isUsbChooserDismissed } from '~/lib/questConnectUx'
import { QUEST_USB_MESSAGES } from '~/lib/questUsbMessages'
import {
  activateMockDevice,
  armMockInstall,
  cancelPendingMockChoice,
  clearMockDevice,
  connectionErrorForNext,
  connectionErrorForPhase,
  isMockQuestEnabled,
  mockAdbFromDevice,
  mockApkProxyResponse,
  mockHoldAfterSuccessfulInstall,
  mockOverlay,
  mockScenarioRevision,
  readMockScenario,
  waitForMockChoice,
  writeMockSearch
} from '~/lib/mockQuest'
import { RemoteDirDeniedError } from '~/data/portPackageMap'

export interface InstallProgress {
  title: string
  step: 'idle' | 'downloading' | 'pushing' | 'installing' | 'completed' | 'error'
  percent: number
  message: string
  error?: string
}

export interface AdbFileEntry {
  name: string
  isDirectory: boolean
  size: number
  mtime: number
}

export type AdbConnectionPhase = 'idle' | 'picker' | 'authorizing' | 'connected' | 'error'

// Global singleton state so connection persists across page navigations
const isConnected = ref(false)
const isConnecting = ref(false)
const connectionPhase = ref<AdbConnectionPhase>('idle')
const connectionError = ref<string | null>(null)
const connectNotice = ref<string | null>(null)

const deviceModel = ref<string>('')
const deviceSerial = ref<string>('')
const androidVersion = ref<string>('')
const batteryLevel = ref<number | null>(null)
const isCharging = ref(false)
const storageFree = ref<string | null>(null)
const storageTotal = ref<string | null>(null)
const storagePercent = ref<number | null>(null)
const installedPackages = ref<string[]>([])

const installProgress = ref<InstallProgress>({
  title: '',
  step: 'idle',
  percent: 0,
  message: ''
})

let adbInstance: any = null
let syncInstance: any = null
let currentDevice: any = null
let activeAbortController: AbortController | null = null
let mockConnectGen = 0

export const useQuestAdb = () => {
  const isWebUsbSupported = computed(() => {
    if (!import.meta.client) return false
    void mockScenarioRevision.value
    if (isMockQuestEnabled()) {
      return readMockScenario()?.phase !== 'unsupported'
    }
    return typeof navigator !== 'undefined' && 'usb' in navigator
  })

  // Helper to execute raw shell commands through ADB
  const runShell = async (command: string): Promise<string> => {
    if (!adbInstance) throw new Error('No Quest headset connected')
    const subprocess = adbInstance.subprocess
    if (subprocess.shellProtocol) {
      const res = await subprocess.shellProtocol.spawnWaitText(command)
      return res.stdout || ''
    }
    if (subprocess.noneProtocol) {
      return await subprocess.noneProtocol.spawnWaitText(command)
    }
    throw new Error('ADB subprocess protocol not available')
  }

  // Parse battery from dumpsys
  const updateBattery = async () => {
    try {
      const text = await runShell('dumpsys battery')
      const levelMatch = text.match(/level:\s*(\d+)/i)
      if (levelMatch && levelMatch[1]) {
        batteryLevel.value = parseInt(levelMatch[1], 10)
      }
      const pluggedMatch = text.match(/(AC powered|USB powered|Wireless powered):\s*(true|1)/i)
      const statusMatch = text.match(/status:\s*(\d+)/i)
      isCharging.value = Boolean(pluggedMatch || (statusMatch && statusMatch[1] === '2'))
    } catch (e) {
      console.warn('Could not fetch battery status:', e)
    }
  }

  // Parse storage from df
  const updateStorage = async () => {
    try {
      const text = await runShell('df -h /sdcard')
      const lines = text.trim().split('\n')
      const targetLine = lines[1]
      if (lines.length >= 2 && targetLine) {
        const parts = targetLine.trim().split(/\s+/)
        if (parts.length >= 5) {
          storageTotal.value = parts[1] ?? null
          storageFree.value = parts[3] ?? null
          const pctPart = parts[4]
          const pctMatch = pctPart ? pctPart.match(/(\d+)%/) : null
          if (pctMatch && pctMatch[1]) {
            storagePercent.value = parseInt(pctMatch[1], 10)
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch storage status:', e)
    }
  }

  // List third-party installed packages
  const updatePackages = async () => {
    try {
      const text3 = await runShell('pm list packages -3')
      const list3 = text3
        .split('\n')
        .map(l => l.replace(/^package:/i, '').trim())
        .filter(Boolean)

      // Query all packages to ensure full coverage of sideloaded apps
      const textAll = await runShell('pm list packages')
      const listAll = textAll
        .split('\n')
        .map(l => l.replace(/^package:/i, '').trim())
        .filter(Boolean)

      const merged = Array.from(new Set([...list3, ...listAll]))
      installedPackages.value = merged
    } catch (e) {
      console.warn('Could not list packages:', e)
    }
  }

  // Refresh all headset diagnostics
  const refreshStats = async () => {
    if (!isConnected.value || !adbInstance) return
    await Promise.allSettled([
      updateBattery(),
      updateStorage(),
      updatePackages()
    ])
  }

  let isListenerSetup = false
  let pollTimer: any = null

  const startPolling = () => {
    if (pollTimer) clearInterval(pollTimer)
    pollTimer = setInterval(async () => {
      if (isConnected.value && adbInstance && !isConnecting.value) {
        await updatePackages()
      }
    }, 4000)
  }

  const stopPolling = () => {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  const setupUsbEventListeners = () => {
    if (!import.meta.client || isListenerSetup) return
    if (isMockQuestEnabled()) return
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null
    if (nav?.usb) {
      isListenerSetup = true
      nav.usb.addEventListener('connect', () => {
        console.log('[QuestPorts] USB device connected, attempting auto-reconnect...')
        setTimeout(() => {
          tryAutoConnect()
        }, 600)
      })
      nav.usb.addEventListener('disconnect', (event: any) => {
        if (currentDevice?.raw === event.device || isConnected.value) {
          console.log('[QuestPorts] Quest USB device detached')
          disconnect()
        }
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        if (isConnected.value && !isConnecting.value) {
          updatePackages()
        }
      })
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && isConnected.value && !isConnecting.value) {
          updatePackages()
        }
      })
    }
  }

  // Silently reconnect to previously authorized WebUSB device without opening picker
  const tryAutoConnect = async () => {
    if (isMockQuestEnabled()) {
      return applyMockScenario()
    }
    if (!import.meta.client || isConnected.value || isConnecting.value) return false
    if (!isWebUsbSupported.value) return false

    if (sessionStorage.getItem('quest_manual_disconnect') === 'true') {
      return false
    }

    try {
      const { AdbDaemonWebUsbDeviceManager } = await import('@yume-chan/adb-daemon-webusb')
      const manager = AdbDaemonWebUsbDeviceManager.BROWSER
      if (!manager) return false

      const devices = await manager.getDevices()
      const firstDevice = devices?.[0]
      if (firstDevice) {
        console.log('[QuestPorts] Previously authorized device found, auto-connecting...', firstDevice.serial)
        const success = await connect(firstDevice)
        if (!success) {
          connectionError.value = null
          connectionPhase.value = 'idle'
        }
        return success
      }
    } catch (e) {
      console.debug('[QuestPorts] Auto-connect skipped:', e)
      connectionError.value = null
      connectionPhase.value = 'idle'
    }
    return false
  }

  const cancelConnect = async () => {
    if (isMockQuestEnabled()) {
      mockConnectGen++
      cancelPendingMockChoice()
      mockOverlay.value = 'none'
    }
    if (currentDevice?.raw?.opened) {
      try {
        await currentDevice.raw.close()
      } catch {}
      currentDevice = null
    }
    isConnecting.value = false
    connectionPhase.value = 'idle'
  }

  // Connect via WebUSB (accepts optional paired device to avoid picker popup)
  const connect = async (targetDevice?: any) => {
    if (!import.meta.client) return false
    if (isMockQuestEnabled()) {
      const gen = ++mockConnectGen
      return connectMock(gen, targetDevice ? 'visor' : 'picker')
    }
    if (!isWebUsbSupported.value) {
      connectionError.value = QUEST_USB_MESSAGES.unsupported
      connectionPhase.value = 'error'
      return false
    }

    if (sessionStorage.getItem('quest_manual_disconnect')) {
      sessionStorage.removeItem('quest_manual_disconnect')
    }

    isConnecting.value = true
    connectionPhase.value = targetDevice ? 'authorizing' : 'picker'
    connectionError.value = null
    connectNotice.value = null

    try {
      const { AdbDaemonWebUsbDeviceManager } = await import('@yume-chan/adb-daemon-webusb')
      const AdbWebCredentialStore = (await import('@yume-chan/adb-credential-web')).default
      const { AdbDaemonTransport, Adb } = await import('@yume-chan/adb')

      const manager = AdbDaemonWebUsbDeviceManager.BROWSER
      if (!manager) {
        throw new Error('WebUSB manager not available in browser')
      }

      let device = targetDevice
      if (!device) {
        // Browser device picker popup
        device = await manager.requestDevice()
      }

      if (!device) {
        markChooserDismissed()
        return false
      }

      isConnecting.value = true
      connectionPhase.value = 'authorizing'
      currentDevice = device
      console.log('[QuestPorts] Device selected:', device.serial)

      console.log('[QuestPorts] Opening WebUSB connection...')
      const connection = await device.connect()
      console.log('[QuestPorts] WebUSB connection opened. Authenticating ADB (check headset for RSA prompt)...')

      const credentialStore = new AdbWebCredentialStore()

      // Add a 90s authorization timeout so the user has ample time to put on the visor
      const authPromise = AdbDaemonTransport.authenticate({
        serial: device.serial,
        connection,
        credentialStore
      })

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(QUEST_USB_MESSAGES.timeout))
        }, 90000)
      })

      const transport = await Promise.race([authPromise, timeoutPromise]) as any

      console.log('[QuestPorts] ADB Authenticated! Initializing ADB instance...')
      adbInstance = new Adb(transport)
      deviceSerial.value = device.serial

      // Retrieve device model & Android version
      let rawModel = 'Meta Quest'
      try {
        rawModel = await adbInstance.getProp('ro.product.model')
      } catch {
        rawModel = 'Meta Quest'
      }
      deviceModel.value = rawModel

      try {
        androidVersion.value = await adbInstance.getProp('ro.build.version.release')
      } catch {
        androidVersion.value = 'Android 12'
      }

      isConnected.value = true
      isConnecting.value = false
      connectionPhase.value = 'connected'
      connectNotice.value = null

      // Fetch initial diagnostics
      await refreshStats()
      startPolling()

      // Handle disconnection event
      adbInstance.disconnected.then(() => {
        disconnect()
      }).catch(() => {
        disconnect()
      })

      return true
    } catch (err: any) {
      if (currentDevice?.raw?.opened) {
        try {
          await currentDevice.raw.close()
        } catch {}
        currentDevice = null
      }

      if (isUsbChooserDismissed(err)) {
        markChooserDismissed()
        return false
      }

      console.error('Failed to connect to Quest via WebUSB:', err)
      connectionPhase.value = 'error'
      connectNotice.value = null
      
      const msg = err?.message || ''
      if (msg.toLowerCase().includes('already in use') || msg.toLowerCase().includes('already in used') || msg.toLowerCase().includes('claim') || msg.toLowerCase().includes('busy')) {
        connectionError.value = QUEST_USB_MESSAGES.usbLocked
      } else if (msg.toLowerCase().includes('cancelled') || msg.toLowerCase().includes('transferin') || msg.toLowerCase().includes('aborterror')) {
        connectionError.value = QUEST_USB_MESSAGES.cancelled
      } else {
        connectionError.value = msg || QUEST_USB_MESSAGES.generic
      }

      isConnecting.value = false
      isConnected.value = false
      return false
    }
  }

  const dismissConnectNotice = () => {
    connectNotice.value = null
  }

  const markChooserDismissed = () => {
    isConnecting.value = false
    isConnected.value = false
    connectionPhase.value = 'idle'
    connectionError.value = null
    connectNotice.value = QUEST_NO_DEVICE_HINT
  }

  const disconnect = async (manual = false) => {
    if (isMockQuestEnabled()) {
      cancelPendingMockChoice()
      clearMockDevice()
      connectionError.value = null
      if (manual) writeMockSearch({ mockPhase: 'disconnected' })
    }
    stopPolling()
    if (manual && import.meta.client) {
      sessionStorage.setItem('quest_manual_disconnect', 'true')
    }
    try {
      if (syncInstance) {
        await syncInstance.dispose().catch(() => {})
        syncInstance = null
      }
      if (adbInstance) {
        await adbInstance.close().catch(() => {})
        adbInstance = null
      }
      if (currentDevice?.raw?.opened) {
        await currentDevice.raw.close().catch(() => {})
        currentDevice = null
      }
    } catch {}

    isConnected.value = false
    isConnecting.value = false
    connectionPhase.value = 'idle'
    connectNotice.value = null
    deviceModel.value = ''
    deviceSerial.value = ''
    batteryLevel.value = null
    storageFree.value = null
    storageTotal.value = null
    storagePercent.value = null
    installedPackages.value = []
  }

  // Install an APK from a File/Blob directly into the Quest
  const installApkStream = async (stream: ReadableStream<Uint8Array>, totalBytes: number, title: string) => {
    if (!isConnected.value || !adbInstance) {
      throw new Error('Meta Quest not connected! Please connect your headset first.')
    }

    const { WrapReadableStream } = await import('@yume-chan/stream-extra')

    installProgress.value = {
      title,
      step: 'pushing',
      percent: 5,
      message: 'Uploading APK to Quest internal storage...'
    }

    const tempPath = '/data/local/tmp/questports_installer.apk'

    // Stream with byte counter to track push percentage (5% to 85%)
    let loaded = 0
    const progressTransform = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        if (activeAbortController?.signal.aborted) {
          controller.error(new Error('Installation cancelled by user'))
          return
        }
        loaded += chunk.byteLength
        if (totalBytes > 0) {
          const pct = Math.min(85, Math.round(5 + (loaded / totalBytes) * 80))
          installProgress.value.percent = pct
          const mbUploaded = (loaded / (1024 * 1024)).toFixed(1)
          const mbTotal = (totalBytes / (1024 * 1024)).toFixed(1)
          installProgress.value.message = `Transferring APK to Quest (${mbUploaded} MB / ${mbTotal} MB)...`
        } else {
          const mbUploaded = (loaded / (1024 * 1024)).toFixed(1)
          const pct = Math.min(80, Math.round(5 + (loaded / (loaded + 30 * 1024 * 1024)) * 75))
          installProgress.value.percent = pct
          installProgress.value.message = `Transferring APK to Quest (${mbUploaded} MB transferred)...`
        }
        controller.enqueue(chunk)
      }
    })

    const monitoredStream = stream.pipeThrough(progressTransform)
    const wrappedStream = new WrapReadableStream(monitoredStream as any)

    // Open ADB sync session
    const sync = await adbInstance.sync()
    try {
      await sync.write({
        filename: tempPath,
        file: wrappedStream
      })
    } finally {
      await sync.dispose().catch(() => {})
    }

    if (activeAbortController?.signal.aborted) {
      await runShell(`rm -f ${tempPath}`).catch(() => {})
      throw new Error('Installation cancelled by user')
    }

    // Step 2: Trigger native Android package manager install (pm install -r)
    installProgress.value = {
      title,
      step: 'installing',
      percent: 90,
      message: 'Installing APK package on Quest OS (pm install)...'
    }

    const resultText = await runShell(`pm install -r ${tempPath}`)

    // Clean up temporary APK
    await runShell(`rm -f ${tempPath}`).catch(() => {})

    if (activeAbortController?.signal.aborted) {
      throw new Error('Installation cancelled by user')
    }

    if (/^\s*success/im.test(resultText) && !/failure|INSTALL_FAILED/i.test(resultText)) {
      installProgress.value = {
        title,
        step: 'completed',
        percent: 100,
        message: 'Successfully installed! Launch it from Unknown Sources on your headset.'
      }
      // Refresh installed packages list
      await updatePackages()
      return true
    } else {
      const err = resultText.trim() || 'Package manager install failed'
      installProgress.value = {
        title,
        step: 'error',
        percent: 90,
        message: `Installation error: ${err}`,
        error: err
      }
      throw new Error(err)
    }
  }

  // Cancel an ongoing installation
  const cancelInstall = async () => {
    if (activeAbortController) {
      activeAbortController.abort()
      activeAbortController = null
    }
    try {
      if (isConnected.value && adbInstance) {
        await runShell('rm -f /data/local/tmp/questports_installer.apk').catch(() => {})
      }
    } catch {}
    installProgress.value = {
      title: '',
      step: 'idle',
      percent: 0,
      message: ''
    }
  }

  // Install from local File
  const installApkFile = async (file: File, title: string) => {
    activeAbortController = new AbortController()
    if (isMockQuestEnabled()) armMockInstall(activeAbortController.signal)
    try {
      await installApkStream(file.stream(), file.size, title)
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('cancelled')) {
        installProgress.value = {
          title: '',
          step: 'idle',
          percent: 0,
          message: ''
        }
        return
      }
      installProgress.value = {
        title,
        step: 'error',
        percent: 0,
        message: err?.message || 'Failed to install APK',
        error: err?.message
      }
      throw err
    } finally {
      activeAbortController = null
    }
  }

  // Install from URL (via our streaming proxy to avoid CORS)
  const installApkUrl = async (url: string, title: string) => {
    activeAbortController = new AbortController()
    try {
      installProgress.value = {
        title,
        step: 'downloading',
        percent: 2,
        message: 'Downloading latest APK from repository...'
      }

      // Use local server proxy. The mock headset never downloads a real APK.
      const proxyUrl = `/api/apk-proxy?url=${encodeURIComponent(url)}`
      const res = isMockQuestEnabled()
        ? await mockApkProxyResponse(activeAbortController.signal)
        : await fetch(proxyUrl, { signal: activeAbortController.signal })

      if (!res.ok) {
        let detail = `HTTP ${res.status}`
        try {
          const body = await res.json() as { statusMessage?: string; message?: string }
          detail = body.statusMessage || body.message || detail
        } catch {
          // Keep the status code if the proxy did not return JSON.
        }
        throw new Error(`Failed to download APK: ${detail}`)
      }

      const contentLength = res.headers.get('content-length')
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0

      if (!res.body) {
        throw new Error('Failed to read download stream')
      }

      await installApkStream(res.body, totalBytes, title)
      if (isMockQuestEnabled()) {
        await mockHoldAfterSuccessfulInstall(activeAbortController.signal)
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('cancelled')) {
        installProgress.value = {
          title: '',
          step: 'idle',
          percent: 0,
          message: ''
        }
        return
      }
      installProgress.value = {
        title,
        step: 'error',
        percent: 0,
        message: err?.message || 'Failed to download and install APK',
        error: err?.message
      }
      throw err
    } finally {
      activeAbortController = null
    }
  }

  // Check files inside a remote storage directory (combines shell and native ADB sync).
  // Permission denied is thrown so callers can tell "private" from "empty".
  const listRemoteDir = async (remotePath: string): Promise<string[]> => {
    if (!isConnected.value || !adbInstance) return []
    const cleanPath = remotePath.replace(/\/+$/, '')
    let sawDenied = false
    const denied = (output: string) => /permission denied/i.test(output)
    const missing = (output: string) => /no such file|not found|permission denied/i.test(output)

    try {
      let output = ''
      try {
        output = await runShell(`ls -1 "${cleanPath}" 2>/dev/null`)
      } catch {}
      if (denied(output)) sawDenied = true

      if (!output || missing(output)) {
        try {
          output = await runShell(`ls -1 "${cleanPath}"`)
        } catch {}
      }
      if (denied(output)) sawDenied = true

      if (output && !missing(output)) {
        const parsed = output
          .split('\n')
          .map(f => f.trim())
          .filter(f => f && !f.startsWith('ls:') && f !== '.' && f !== '..')
        if (parsed.length > 0) return parsed
      }
    } catch {}

    try {
      const sync = await adbInstance.sync()
      try {
        const entries = await sync.readdir(cleanPath)
        if (entries && entries.length > 0) {
          return entries
            .map((e: any) => e.name)
            .filter((name: string) => name && name !== '.' && name !== '..')
        }
      } finally {
        await sync.dispose().catch(() => {})
      }
    } catch (err: any) {
      const message = String(err?.message || err || '')
      if (/permission denied/i.test(message)) sawDenied = true
    }

    if (sawDenied) throw new RemoteDirDeniedError(cleanPath)
    return []
  }

  // Scan Quest storage for campaign files across multiple possible directory conventions
  const checkCampaignFilesOnQuest = async (
    campaign: { id: string; folder: string; fullPath: string }
  ): Promise<{ campaignId: string; exists: boolean; matchedPath: string; fileCount: number; files: string[] }> => {
    if (!isConnected.value || !adbInstance) {
      return { campaignId: campaign.id, exists: false, matchedPath: campaign.fullPath, fileCount: 0, files: [] }
    }

    const rawPath = campaign.fullPath.trim().replace(/\/+$/, '')
    const folder = campaign.folder.trim().toLowerCase()

    // Build candidate paths to test
    const candidates = new Set<string>()

    // 1. Exact rawPath
    candidates.add(rawPath)

    // 2. /storage/emulated/0 alternative for /sdcard
    if (rawPath.startsWith('/sdcard')) {
      candidates.add(rawPath.replace(/^\/sdcard/, '/storage/emulated/0'))
    } else if (rawPath.startsWith('/storage/emulated/0')) {
      candidates.add(rawPath.replace(/^\/storage\/emulated\/0/, '/sdcard'))
    }

    // 3. Lowercase & uppercase variants
    candidates.add(rawPath.toLowerCase())

    // 4. Case variations of folder and parent folder
    const parts = rawPath.split('/')
    if (parts.length >= 3) {
      const parentName = parts[parts.length - 2]
      const dirName = parts[parts.length - 1]
      const basePath = parts.slice(0, parts.length - 2).join('/')

      if (parentName && dirName) {
        // e.g. /sdcard/RTCWQuest/main vs /sdcard/rtcwquest/main vs /sdcard/RTCWQuest/MAIN
        candidates.add(`${basePath}/${parentName.toLowerCase()}/${dirName.toLowerCase()}`)
        candidates.add(`${basePath}/${parentName.toUpperCase()}/${dirName.toLowerCase()}`)
        candidates.add(`${basePath}/${parentName}/${dirName.toUpperCase()}`)
        candidates.add(`${basePath}/${parentName.toLowerCase()}/${dirName}`)
      }
    }

    // 5. Check if parent directory itself contains the game files or the target subfolder
    if (parts.length >= 3) {
      const parentPath = parts.slice(0, parts.length - 1).join('/')
      candidates.add(parentPath)
      candidates.add(parentPath.toLowerCase())
    }

    for (const testPath of candidates) {
      try {
        const files = await listRemoteDir(testPath)
        if (files && files.length > 0) {
          // If we tested the parent directory, check if it contains the target subfolder OR if it directly contains asset files
          if (testPath !== rawPath && testPath.toLowerCase() !== rawPath.toLowerCase()) {
            const hasTargetSubfolder = files.some(f => f.toLowerCase() === folder)
            if (hasTargetSubfolder) {
              // Target subfolder exists inside parent! Check inside it
              const subPath = `${testPath}/${folder}`
              const subFiles = await listRemoteDir(subPath)
              if (subFiles && subFiles.length > 0) {
                return {
                  campaignId: campaign.id,
                  exists: true,
                  matchedPath: `${subPath}/`,
                  fileCount: subFiles.length,
                  files: subFiles
                }
              }
            }

            // Or if files are placed directly in parent (e.g. pak files, pk3 files, wad files)
            const hasGameAssets = files.some(f => {
              const lower = f.toLowerCase()
              return lower.endsWith('.pak') || lower.endsWith('.pk3') || lower.endsWith('.wad') ||
                     lower.endsWith('.pk4') || lower.endsWith('.bsp') || lower.endsWith('.iso') ||
                     lower.endsWith('.so') || lower.endsWith('.cfg') || lower.endsWith('.3ds')
            })

            if (hasGameAssets) {
              return {
                campaignId: campaign.id,
                exists: true,
                matchedPath: `${testPath}/`,
                fileCount: files.length,
                files
              }
            }
          } else {
            // Found files directly in the target directory!
            return {
              campaignId: campaign.id,
              exists: true,
              matchedPath: `${testPath}/`,
              fileCount: files.length,
              files
            }
          }
        }
      } catch (err) {
        console.warn(`[QuestPorts] Error checking candidate path ${testPath}:`, err)
      }
    }

    return {
      campaignId: campaign.id,
      exists: false,
      matchedPath: campaign.fullPath,
      fileCount: 0,
      files: []
    }
  }

  // Detailed file & directory listing with size, type, and modified timestamp
  const listRemoteDirectoryDetails = async (remotePath: string): Promise<AdbFileEntry[]> => {
    if (!isConnected.value || !adbInstance) return []
    const cleanPath = remotePath.replace(/\/+$/, '')

    // Method 1: Try adb sync.readdir
    try {
      const sync = await adbInstance.sync()
      try {
        const entries = await sync.readdir(cleanPath)
        if (entries && entries.length > 0) {
          return entries
            .filter((e: any) => e.name !== '.' && e.name !== '..')
            .map((e: any) => ({
              name: e.name,
              isDirectory: Number(e.type) === 4,
              size: Number(e.size || 0),
              mtime: Number(e.mtime || 0) * 1000
            }))
            .sort((a: AdbFileEntry, b: AdbFileEntry) => {
              if (a.isDirectory && !b.isDirectory) return -1
              if (!a.isDirectory && b.isDirectory) return 1
              return a.name.localeCompare(b.name)
            })
        }
      } finally {
        await sync.dispose().catch(() => {})
      }
    } catch {}

    // Method 2: Shell fallback ls -la
    try {
      const output = await runShell(`ls -la "${cleanPath}" 2>/dev/null`)
      if (!output || output.toLowerCase().includes('no such file') || output.toLowerCase().includes('not found')) {
        return []
      }
      const lines = output.split('\n').filter(Boolean)
      const parsed: AdbFileEntry[] = []
      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        if (parts.length < 8) continue
        const perms = parts[0]
        if (!perms || perms.startsWith('total')) continue
        const isDir = perms.startsWith('d')
        const size = parseInt(parts[4] || '0', 10) || 0
        const name = parts.slice(parts.length > 8 ? 7 : 6).join(' ')
        if (!name || name === '.' || name === '..') continue
        parsed.push({
          name,
          isDirectory: isDir,
          size,
          mtime: Date.now()
        })
      }
      return parsed.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        return a.name.localeCompare(b.name)
      })
    } catch {
      return []
    }
  }

  // Vice City's first launch creates files/ as the app. mkdir before that
  // makes a directory the game cannot use. See overlay/docs/QUEST_PORT.md.
  const assertViceCityFilesExist = async (remotePath: string) => {
    const cleaned = remotePath.trim().replace(/\\/g, '/').replace(/\/+$/, '')
    const roots = [
      '/sdcard/Android/data/com.miamivr.quest/files',
      '/storage/emulated/0/Android/data/com.miamivr.quest/files'
    ]
    const root = roots.find(marker => cleaned === marker || cleaned.startsWith(`${marker}/`))
    if (!root) return
    const probe = await runShell(`test -d "${root}" && echo yes || echo no`)
    if (!String(probe).includes('yes')) {
      throw new Error('Launch Vice City VR once before copying game data. The port says not to create Android/data/com.miamivr.quest/files yourself — the first launch creates that folder.')
    }
  }

  // Create remote folder on Quest
  const createRemoteDir = async (remotePath: string): Promise<boolean> => {
    if (!isConnected.value || !adbInstance) return false
    await assertViceCityFilesExist(remotePath)
    try {
      await runShell(`mkdir -p "${remotePath}"`)
      return true
    } catch (err) {
      if (err instanceof Error && err.message.includes('Launch Vice City VR once')) throw err
      return false
    }
  }

  // Push arbitrary game assets/files into a specific Quest directory
  const pushFileToPath = async (file: File, remoteDirectory: string, onProgress?: (percent: number, msg: string) => void) => {
    if (!isConnected.value || !adbInstance) {
      throw new Error('Quest not connected')
    }
    if (isMockQuestEnabled()) {
      activeAbortController = new AbortController()
      armMockInstall(activeAbortController.signal)
    }

    const { WrapReadableStream } = await import('@yume-chan/stream-extra')

    // Ensure remote directory exists
    await createRemoteDir(remoteDirectory)

    // Normalize path
    const targetDir = remoteDirectory.endsWith('/') ? remoteDirectory : `${remoteDirectory}/`
    const targetFilePath = `${targetDir}${file.name}`

    let loaded = 0
    const totalBytes = file.size
    const progressTransform = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        loaded += chunk.byteLength
        if (totalBytes > 0 && onProgress) {
          const pct = Math.min(100, Math.round((loaded / totalBytes) * 100))
          const mbUploaded = (loaded / (1024 * 1024)).toFixed(1)
          const mbTotal = (totalBytes / (1024 * 1024)).toFixed(1)
          onProgress(pct, `Transferring ${file.name} (${mbUploaded} MB / ${mbTotal} MB)...`)
        }
        controller.enqueue(chunk)
      }
    })

    const stream = file.stream().pipeThrough(progressTransform)
    const wrappedStream = new WrapReadableStream(stream as any)

    const sync = await adbInstance.sync()
    try {
      await sync.write({
        filename: targetFilePath,
        file: wrappedStream
      })
    } finally {
      await sync.dispose().catch(() => {})
    }

    return true
  }

  // Launch app directly on headset
  const launchApp = async (packageName: string) => {
    if (!isConnected.value || !adbInstance) return false
    try {
      await runShell(`monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`)
      return true
    } catch {
      return false
    }
  }

  // Uninstall app package from headset
  const uninstallPackage = async (packageName: string): Promise<boolean> => {
    if (!isConnected.value || !adbInstance) {
      throw new Error('Quest not connected')
    }
    const res = await runShell(`pm uninstall ${packageName}`)
    await updatePackages()
    return res.toLowerCase().includes('success')
  }

  // Delete remote file or directory on Quest
  const deleteRemotePath = async (remotePath: string): Promise<boolean> => {
    if (!isConnected.value || !adbInstance) {
      throw new Error('Quest not connected')
    }
    const clean = remotePath.replace(/\/+$/, '')
    await runShell(`rm -rf "${clean}"`)
    return true
  }

  // Get installed version of a package
  const getPackageVersion = async (packageName: string): Promise<string | null> => {
    if (!isConnected.value || !adbInstance) return null
    try {
      const dump = await runShell(`dumpsys package ${packageName}`)
      const match = dump.match(/versionName=([^\s]+)/i)
      return match && match[1] ? match[1] : null
    } catch {
      return null
    }
  }

  const isPackageInstalled = (pkgName: string) => {
    return installedPackages.value.includes(pkgName)
  }

  const attachMockHeadset = async (publishConnectedPhase: boolean) => {
    const scenario = readMockScenario()
    if (!scenario) return false
    const device = activateMockDevice(scenario)
    device.onDisconnect = () => {
      writeMockSearch({ mockPhase: 'disconnected' })
      disconnect(false)
    }
    adbInstance = mockAdbFromDevice(device)
    currentDevice = { serial: 'MOCK-QUEST-001' }
    deviceSerial.value = 'MOCK-QUEST-001'
    deviceModel.value = 'Quest 3'
    androidVersion.value = '12'
    installedPackages.value = [...device.packages]
    mockOverlay.value = 'none'
    connectionError.value = null
    connectNotice.value = null
    isConnecting.value = false
    isConnected.value = true
    connectionPhase.value = 'connected'
    if (publishConnectedPhase && scenario.phase !== 'connected' && scenario.phase !== 'scanning') {
      writeMockSearch({ mockPhase: 'connected' })
    }
    await refreshStats()
    startPolling()
    return true
  }

  const failMockConnect = (gen: number, message: string) => {
    if (gen !== mockConnectGen) return false
    mockOverlay.value = 'none'
    connectionError.value = message
    connectNotice.value = null
    connectionPhase.value = 'error'
    isConnecting.value = false
    isConnected.value = false
    return false
  }

  const connectMock = async (gen: number, start: 'picker' | 'visor') => {
    const scenario = readMockScenario()
    if (!scenario) return false
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('quest_manual_disconnect')
    }
    if (scenario.phase === 'unsupported') {
      return failMockConnect(gen, QUEST_USB_MESSAGES.unsupported)
    }

    isConnecting.value = true
    connectionError.value = null
    connectNotice.value = null
    isConnected.value = false

    if (start === 'picker') {
      connectionPhase.value = 'picker'
      mockOverlay.value = 'usb-picker'
      const choice = await waitForMockChoice()
      if (gen !== mockConnectGen) return false
      if (choice !== 'device' || scenario.next === 'picker-cancel') {
        mockOverlay.value = 'none'
        markChooserDismissed()
        return false
      }
    }

    connectionPhase.value = 'authorizing'
    isConnecting.value = true
    const next = readMockScenario()?.next || 'ok'
    const nextError = connectionErrorForNext(next)
    if (nextError) {
      return failMockConnect(gen, nextError)
    }

    mockOverlay.value = 'visor'
    const visor = await waitForMockChoice()
    if (gen !== mockConnectGen) return false
    if (visor !== 'allow') {
      return failMockConnect(gen, QUEST_USB_MESSAGES.cancelled)
    }
    if (gen !== mockConnectGen) return false
    return attachMockHeadset(true)
  }

  const applyMockScenario = async () => {
    if (!import.meta.client || !isMockQuestEnabled()) return false
    const gen = ++mockConnectGen
    activeAbortController?.abort()
    activeAbortController = null
    await disconnect(false)
    if (gen !== mockConnectGen) return false
    const scenario = readMockScenario()
    if (!scenario || scenario.phase === 'disconnected') return false

    const presetError = connectionErrorForPhase(scenario.phase)
    if (presetError) {
      connectionError.value = presetError
      connectionPhase.value = 'error'
      isConnecting.value = false
      isConnected.value = false
      return false
    }
    if (scenario.phase === 'picker') return connectMock(gen, 'picker')
    if (scenario.phase === 'authorizing') return connectMock(gen, 'visor')
    return attachMockHeadset(false)
  }

  return {
    isWebUsbSupported,
    isConnected,
    isConnecting,
    connectionPhase,
    connectionError,
    connectNotice,
    dismissConnectNotice,
    deviceModel,
    deviceSerial,
    androidVersion,
    batteryLevel,
    isCharging,
    storageFree,
    storageTotal,
    storagePercent,
    installedPackages,
    installProgress,
    connect,
    cancelConnect,
    tryAutoConnect,
    applyMockScenario,
    setupUsbEventListeners,
    disconnect,
    refreshStats,
    updatePackages,
    installApkFile,
    installApkUrl,
    cancelInstall,
    uninstallPackage,
    deleteRemotePath,
    getPackageVersion,
    isPackageInstalled,
    listRemoteDir,
    listRemoteDirectoryDetails,
    createRemoteDir,
    pushFileToPath,
    checkCampaignFilesOnQuest,
    launchApp,
    runShell
  }
}

