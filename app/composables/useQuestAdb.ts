import { ref, computed } from 'vue'

export interface InstallProgress {
  title: string
  step: 'idle' | 'downloading' | 'pushing' | 'installing' | 'completed' | 'error'
  percent: number
  message: string
  error?: string
}

// Global singleton state so connection persists across page navigations
const isConnected = ref(false)
const isConnecting = ref(false)
const connectionError = ref<string | null>(null)

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

export const useQuestAdb = () => {
  const isWebUsbSupported = computed(() => {
    if (!import.meta.client) return false
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
      if (levelMatch) {
        batteryLevel.value = parseInt(levelMatch[1], 10)
      }
      const pluggedMatch = text.match(/(AC powered|USB powered|Wireless powered):\s*(true|1)/i)
      const statusMatch = text.match(/status:\s*(\d+)/i)
      isCharging.value = !!pluggedMatch || (statusMatch && statusMatch[1] === '2')
    } catch (e) {
      console.warn('Could not fetch battery status:', e)
    }
  }

  // Parse storage from df
  const updateStorage = async () => {
    try {
      const text = await runShell('df -h /sdcard')
      const lines = text.trim().split('\n')
      if (lines.length >= 2) {
        const parts = lines[1].trim().split(/\s+/)
        if (parts.length >= 5) {
          storageTotal.value = parts[1]
          storageFree.value = parts[3]
          const pctMatch = parts[4].match(/(\d+)%/)
          if (pctMatch) {
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
      const text = await runShell('pm list packages -3')
      const list = text
        .split('\n')
        .map(l => l.replace(/^package:/i, '').trim())
        .filter(Boolean)
      installedPackages.value = list
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

  // Connect via WebUSB
  const connect = async () => {
    if (!import.meta.client) return false
    if (!isWebUsbSupported.value) {
      connectionError.value = 'WebUSB is not supported in this browser. Please use Chrome, Edge, or Brave.'
      return false
    }

    isConnecting.value = true
    connectionError.value = null

    try {
      const { AdbDaemonWebUsbDeviceManager } = await import('@yume-chan/adb-daemon-webusb')
      const AdbWebCredentialStore = (await import('@yume-chan/adb-credential-web')).default
      const { AdbDaemonTransport, Adb } = await import('@yume-chan/adb')

      const manager = AdbDaemonWebUsbDeviceManager.BROWSER
      if (!manager) {
        throw new Error('WebUSB manager not available in browser')
      }

      // Browser device picker popup
      const device = await manager.requestDevice()
      if (!device) {
        isConnecting.value = false
        return false
      }

      const connection = await device.connect()
      const credentialStore = new AdbWebCredentialStore()

      const transport = await AdbDaemonTransport.authenticate({
        serial: device.serial,
        connection,
        credentialStore
      })

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

      // Fetch initial diagnostics
      await refreshStats()

      // Handle disconnection event
      adbInstance.disconnected.then(() => {
        disconnect()
      }).catch(() => {
        disconnect()
      })

      return true
    } catch (err: any) {
      console.error('Failed to connect to Quest via WebUSB:', err)
      connectionError.value = err?.message || 'Connection failed. Ensure headset is unlocked with Developer Mode enabled.'
      isConnecting.value = false
      isConnected.value = false
      return false
    }
  }

  const disconnect = () => {
    try {
      if (syncInstance) {
        syncInstance.dispose().catch(() => {})
        syncInstance = null
      }
      if (adbInstance) {
        adbInstance.close().catch(() => {})
        adbInstance = null
      }
    } catch {}

    isConnected.value = false
    isConnecting.value = false
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

    const { Consumable, WrapReadableStream } = await import('@yume-chan/stream-extra')

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
        loaded += chunk.byteLength
        if (totalBytes > 0) {
          const pct = Math.min(85, Math.round(5 + (loaded / totalBytes) * 80))
          installProgress.value.percent = pct
          const mbUploaded = (loaded / (1024 * 1024)).toFixed(1)
          const mbTotal = (totalBytes / (1024 * 1024)).toFixed(1)
          installProgress.value.message = `Transferring APK to Quest (${mbUploaded} MB / ${mbTotal} MB)...`
        }
        controller.enqueue(chunk)
      }
    })

    const monitoredStream = stream.pipeThrough(progressTransform)
    const consumableStream = new Consumable.ReadableStream(monitoredStream)

    // Open ADB sync session
    const sync = await adbInstance.sync()
    try {
      await sync.write({
        filename: tempPath,
        file: consumableStream
      })
    } finally {
      await sync.dispose().catch(() => {})
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

    if (resultText.toLowerCase().includes('success')) {
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

  // Install from local File
  const installApkFile = async (file: File, title: string) => {
    try {
      await installApkStream(file.stream(), file.size, title)
    } catch (err: any) {
      installProgress.value = {
        title,
        step: 'error',
        percent: 0,
        message: err?.message || 'Failed to install APK',
        error: err?.message
      }
      throw err
    }
  }

  // Install from URL (via our streaming proxy to avoid CORS)
  const installApkUrl = async (url: string, title: string) => {
    try {
      installProgress.value = {
        title,
        step: 'downloading',
        percent: 2,
        message: 'Downloading latest APK from repository...'
      }

      // Use local server proxy
      const proxyUrl = `/api/apk-proxy?url=${encodeURIComponent(url)}`
      const res = await fetch(proxyUrl)

      if (!res.ok) {
        throw new Error(`Failed to download APK: HTTP ${res.status}`)
      }

      const contentLength = res.headers.get('content-length')
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0

      if (!res.body) {
        throw new Error('Failed to read download stream')
      }

      await installApkStream(res.body, totalBytes, title)
    } catch (err: any) {
      installProgress.value = {
        title,
        step: 'error',
        percent: 0,
        message: err?.message || 'Failed to download and install APK',
        error: err?.message
      }
      throw err
    }
  }

  // Check files inside a remote storage directory
  const listRemoteDir = async (remotePath: string): Promise<string[]> => {
    if (!isConnected.value || !adbInstance) return []
    try {
      const output = await runShell(`ls -1 "${remotePath}"`)
      if (output.toLowerCase().includes('no such file')) return []
      return output
        .split('\n')
        .map(f => f.trim())
        .filter(f => f && !f.startsWith('ls:'))
    } catch {
      return []
    }
  }

  // Create remote folder on Quest
  const createRemoteDir = async (remotePath: string): Promise<boolean> => {
    if (!isConnected.value || !adbInstance) return false
    try {
      await runShell(`mkdir -p "${remotePath}"`)
      return true
    } catch {
      return false
    }
  }

  // Push arbitrary game assets/files into a specific Quest directory
  const pushFileToPath = async (file: File, remoteDirectory: string, onProgress?: (percent: number, msg: string) => void) => {
    if (!isConnected.value || !adbInstance) {
      throw new Error('Quest not connected')
    }

    const { Consumable } = await import('@yume-chan/stream-extra')

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
    const consumableStream = new Consumable.ReadableStream(stream)

    const sync = await adbInstance.sync()
    try {
      await sync.write({
        filename: targetFilePath,
        file: consumableStream
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

  const isPackageInstalled = (pkgName: string) => {
    return installedPackages.value.includes(pkgName)
  }

  return {
    isWebUsbSupported,
    isConnected,
    isConnecting,
    connectionError,
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
    disconnect,
    refreshStats,
    installApkFile,
    installApkUrl,
    isPackageInstalled,
    listRemoteDir,
    createRemoteDir,
    pushFileToPath,
    launchApp,
    runShell
  }
}
