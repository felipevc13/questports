<template>
  <Teleport to="body">
    <div
      v-if="modal.isOpen.value"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <!-- Backdrop with blur -->
      <div
        class="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        @click="modal.close"
      ></div>

      <!-- Main Modal Window -->
      <div
        class="relative w-full max-w-5xl max-h-[92vh] bg-card/95 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-2xl flex flex-col overflow-hidden z-10 text-foreground"
      >
        <!-- Modal Top Bar -->
        <div class="px-5 py-3.5 border-b border-border/80 flex items-center justify-between bg-muted/40 shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm sm:text-base font-bold text-foreground tracking-tight">
                  Quest Manager & Smart Sideload
                </h2>
                <span
                  v-if="adb.isConnected"
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-muted-foreground bg-muted border border-border"
                >
                  Disconnected
                </span>
              </div>
              <p class="text-xs text-muted-foreground hidden sm:block">
                WebADB: Direct browser-to-headset APK sideloading & automatic folder routing
              </p>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click="modal.close"
            class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Close"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Scrollable Modal Content -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <!-- Non-Chromium Browser Warning -->
          <div
            v-if="!adb.isWebUsbSupported"
            class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3"
          >
            <span class="text-lg">⚠️</span>
            <div>
              <div class="font-semibold text-amber-100">WebUSB is not supported on this browser</div>
              <p class="text-xs text-amber-200/80 mt-1">
                Direct WebADB headset communication requires a Chromium browser (Google Chrome, Microsoft Edge, Brave, or Opera). Please reopen this page in Chrome or Edge to connect your Quest.
              </p>
            </div>
          </div>

          <!-- STATE 1: NOT CONNECTED (Step-by-Step Onboarding) -->
          <div v-if="!adb.isConnected" class="space-y-6">
            <!-- Hero Instruction Card -->
            <div class="p-6 rounded-2xl bg-gradient-to-b from-muted/50 to-muted/20 border border-border/80 text-center space-y-4">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="max-w-lg mx-auto space-y-1.5">
                <h3 class="text-lg sm:text-xl font-bold text-foreground">
                  Connect your Meta Quest in 3 Simple Steps
                </h3>
                <p class="text-xs sm:text-sm text-muted-foreground">
                  No PC apps, no command line, no SideQuest required. Your browser talks directly to your Quest via WebUSB.
                </p>
              </div>

              <!-- 3 Steps Visual Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-left">
                <div class="p-3.5 rounded-xl bg-card border border-border/70 space-y-1.5">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">1</span>
                    <span class="text-xs font-semibold text-foreground">Plug USB Cable</span>
                  </div>
                  <p class="text-[11px] text-muted-foreground leading-relaxed">
                    Connect your powered-on Quest to this computer using any USB-C cable.
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-card border border-border/70 space-y-1.5">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">2</span>
                    <span class="text-xs font-semibold text-foreground">Allow in Headset</span>
                  </div>
                  <p class="text-[11px] text-muted-foreground leading-relaxed">
                    Put on your headset and click <strong>"Always allow USB debugging"</strong> on the prompt.
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-card border border-border/70 space-y-1.5">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">3</span>
                    <span class="text-xs font-semibold text-foreground">Click Connect Below</span>
                  </div>
                  <p class="text-[11px] text-muted-foreground leading-relaxed">
                    Click the button below and select your Quest from the Chrome popup list.
                  </p>
                </div>
              </div>

              <!-- Connect Button -->
              <div class="pt-2">
                <UiButton
                  @click="handleConnect"
                  :disabled="adb.isConnecting || !adb.isWebUsbSupported"
                  class="gap-2 px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <svg v-if="adb.isConnecting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{{ adb.isConnecting ? 'Searching for Headset...' : 'Detect & Connect Meta Quest' }}</span>
                </UiButton>
              </div>

              <!-- Error Display -->
              <div v-if="adb.connectionError" class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs max-w-md mx-auto text-left space-y-1">
                <div class="font-semibold">Connection Error</div>
                <p>{{ adb.connectionError }}</p>
                <div class="text-[11px] text-muted-foreground pt-1">
                  Tip: Make sure <strong>Developer Mode</strong> is turned ON in the Meta Quest mobile app (Devices → Headset Settings → Developer Mode).
                </div>
              </div>
            </div>
          </div>

          <!-- STATE 2: CONNECTED (Dashboard & Smart File Routing) -->
          <div v-else class="space-y-6">
            <!-- Headset Diagnostic Banner -->
            <div class="p-4 rounded-xl bg-card border border-border/80 flex flex-wrap items-center justify-between gap-4">
              <!-- Left: Model info -->
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-base font-bold text-foreground">{{ adb.deviceModel || 'Meta Quest' }}</span>
                    <UiBadge variant="outline" class="font-mono text-[10px] text-emerald-400 border-emerald-500/40">
                      {{ adb.androidVersion || 'Android 12' }}
                    </UiBadge>
                  </div>
                  <div class="text-xs text-muted-foreground font-mono">
                    Serial: {{ adb.deviceSerial }}
                  </div>
                </div>
              </div>

              <!-- Center/Right: Battery & Storage Meter -->
              <div class="flex items-center gap-6">
                <!-- Battery -->
                <div v-if="adb.batteryLevel !== null" class="space-y-1">
                  <div class="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <span>Battery</span>
                    <span v-if="adb.isCharging" class="text-emerald-400">⚡</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-20 h-2 bg-muted rounded-full overflow-hidden border border-border">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="adb.batteryLevel > 20 ? 'bg-emerald-400' : 'bg-rose-500'"
                        :style="{ width: `${adb.batteryLevel}%` }"
                      ></div>
                    </div>
                    <span class="text-xs font-mono font-semibold">{{ adb.batteryLevel }}%</span>
                  </div>
                </div>

                <!-- Storage -->
                <div v-if="adb.storageFree" class="space-y-1">
                  <div class="text-[11px] font-mono text-muted-foreground">
                    Free Storage
                  </div>
                  <div class="text-xs font-mono font-semibold text-primary">
                    {{ adb.storageFree }} / {{ adb.storageTotal }}
                  </div>
                </div>

                <!-- Disconnect Button -->
                <UiButton
                  variant="outline"
                  size="sm"
                  @click="adb.disconnect"
                  class="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30 cursor-pointer"
                >
                  Disconnect
                </UiButton>
              </div>
            </div>

            <!-- Active Installation / Transfer Progress Card -->
            <div
              v-if="adb.installProgress.step !== 'idle'"
              class="p-4 rounded-xl border space-y-2.5 transition-all"
              :class="adb.installProgress.step === 'error'
                ? 'bg-rose-500/10 border-rose-500/30'
                : adb.installProgress.step === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-cyan-500/10 border-cyan-500/30 animate-pulse'"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-foreground">
                  {{ adb.installProgress.title || 'Task in Progress' }}
                </span>
                <span class="font-mono text-xs">
                  {{ adb.installProgress.percent }}%
                </span>
              </div>
              <div class="w-full h-2 bg-muted rounded-full overflow-hidden border border-border">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="adb.installProgress.step === 'error' ? 'bg-rose-500' : 'bg-cyan-400'"
                  :style="{ width: `${adb.installProgress.percent}%` }"
                ></div>
              </div>
              <p class="text-xs text-muted-foreground">
                {{ adb.installProgress.message }}
              </p>
            </div>

            <!-- Tabs Navigation -->
            <div class="flex items-center gap-2 border-b border-border pb-2">
              <button
                @click="activeTab = 'games'"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                :class="activeTab === 'games' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'"
              >
                🎮 Smart Port Folders & Sideload
              </button>
              <button
                @click="activeTab = 'custom-apk'"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                :class="activeTab === 'custom-apk' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'"
              >
                📦 Sideload Any .APK
              </button>
              <button
                @click="activeTab = 'tools'"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                :class="activeTab === 'tools' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'"
              >
                ⚙️ Headset Tools
              </button>
            </div>

            <!-- TAB 1: Smart Port Directory & Game Assets Manager -->
            <div v-if="activeTab === 'games'" class="space-y-4">
              <!-- Search & Filter Bar -->
              <div class="flex items-center justify-between gap-3">
                <div class="relative flex-1 max-w-sm">
                  <input
                    v-model="gameSearch"
                    type="text"
                    placeholder="Filter ports (Doom, Half-Life, GTA)..."
                    class="w-full pl-8 pr-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <svg class="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div class="text-xs text-muted-foreground font-mono">
                  Showing {{ filteredPorts.length }} ports
                </div>
              </div>

              <!-- Ports Smart Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                <div
                  v-for="port in filteredPorts"
                  :key="port.slug"
                  class="p-3.5 rounded-xl bg-card border border-border/80 hover:border-cyan-500/40 transition-all space-y-3"
                >
                  <!-- Card Header: Title & Cover -->
                  <div class="flex items-center gap-3">
                    <img
                      :src="port.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=120&q=80'"
                      :alt="port.title"
                      class="w-12 h-12 rounded-lg object-cover border border-border shrink-0 bg-black"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-1.5">
                        <h4 class="text-xs font-bold text-foreground truncate">{{ port.title }}</h4>
                      </div>
                      <div class="text-[11px] text-muted-foreground truncate">
                        {{ port.developer }} • {{ port.category }}
                      </div>
                    </div>
                  </div>

                  <!-- Target Storage Path Box -->
                  <div v-if="port.internal_storage_path" class="p-2 rounded bg-muted/60 border border-border/60 space-y-1">
                    <div class="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>Target Directory:</span>
                      <button
                        @click="inspectFolder(port)"
                        class="text-primary hover:underline cursor-pointer"
                      >
                        {{ inspectedFolderSlug === port.slug ? 'Hide Files' : 'Check Folder' }}
                      </button>
                    </div>
                    <code class="block font-mono text-[10px] text-cyan-300 truncate select-all">
                      {{ port.internal_storage_path }}
                    </code>

                    <!-- Inspected Files inside Folder -->
                    <div
                      v-if="inspectedFolderSlug === port.slug"
                      class="pt-1.5 border-t border-border/40 text-[10px] font-mono space-y-1"
                    >
                      <div v-if="isLoadingFolder" class="text-muted-foreground">Reading Quest storage...</div>
                      <div v-else-if="folderFiles.length === 0" class="text-amber-400">
                        Folder is empty or not created yet.
                      </div>
                      <div v-else class="space-y-0.5 max-h-24 overflow-y-auto">
                        <div class="text-emerald-400 font-semibold mb-1">
                          ✓ Found {{ folderFiles.length }} file(s):
                        </div>
                        <div v-for="f in folderFiles" :key="f" class="text-muted-foreground truncate">
                          📄 {{ f }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Smart Action Buttons: 1-Click APK Sideload & File Drop -->
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <!-- 1-Click APK Sideload button (if APK url available) -->
                    <UiButton
                      v-if="port.port_download_url && (port.port_download_url.endsWith('.apk') || port.port_download_url.includes('releases'))"
                      size="sm"
                      @click="triggerApkInstall(port)"
                      :disabled="isTransferring"
                      class="text-[11px] py-1 h-7 font-semibold bg-cyan-600 hover:bg-cyan-500 text-white gap-1 cursor-pointer"
                    >
                      <span>🚀 Sideload APK</span>
                    </UiButton>

                    <!-- Push Game Files Button (File Picker directly to internal_storage_path) -->
                    <label
                      v-if="port.internal_storage_path"
                      class="inline-flex items-center gap-1 px-2.5 py-1 h-7 rounded-md text-[11px] font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer transition-colors"
                    >
                      <span>📂 Copy Game Files</span>
                      <input
                        type="file"
                        multiple
                        class="hidden"
                        @change="(e) => handleFileDrop(e, port.internal_storage_path!)"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: Custom APK Sideload (Any file from PC) -->
            <div v-if="activeTab === 'custom-apk'" class="space-y-4">
              <div
                class="p-8 border-2 border-dashed border-border/80 hover:border-cyan-500/50 rounded-2xl text-center space-y-3 bg-muted/20 transition-all cursor-pointer"
                @dragover.prevent
                @drop.prevent="handleCustomApkDrop"
              >
                <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div class="space-y-1">
                  <h4 class="text-sm font-bold text-foreground">
                    Drag & Drop any .APK file here
                  </h4>
                  <p class="text-xs text-muted-foreground">
                    Or select an APK from your computer to install it directly to your Quest
                  </p>
                </div>

                <div>
                  <label class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow hover:bg-primary/90">
                    <span>Browse .APK File</span>
                    <input type="file" accept=".apk" class="hidden" @change="handleCustomApkSelect" />
                  </label>
                </div>
              </div>
            </div>

            <!-- TAB 3: Headset Tools -->
            <div v-if="activeTab === 'tools'" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="p-4 rounded-xl bg-card border border-border space-y-2">
                  <div class="text-xs font-bold text-foreground">Reboot Headset</div>
                  <p class="text-[11px] text-muted-foreground">
                    Restart your Quest cleanly without taking it off.
                  </p>
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="handleReboot"
                    class="w-full text-xs cursor-pointer"
                  >
                    Reboot Quest
                  </UiButton>
                </div>

                <div class="p-4 rounded-xl bg-card border border-border space-y-2">
                  <div class="text-xs font-bold text-foreground">Installed Packages</div>
                  <p class="text-[11px] text-muted-foreground font-mono">
                    {{ adb.installedPackages.length }} sideloaded apps found
                  </p>
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="adb.refreshStats"
                    class="w-full text-xs cursor-pointer"
                  >
                    Refresh Stats
                  </UiButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuestConnectModal } from '~/composables/useQuestConnectModal'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { usePorts } from '~/composables/usePorts'
import type { Port } from '~/types/port'

const modal = useQuestConnectModal()
const adb = useQuestAdb()
const { fetchPorts } = usePorts()

const activeTab = ref<'games' | 'custom-apk' | 'tools'>('games')
const gameSearch = ref('')
const isTransferring = ref(false)

const inspectedFolderSlug = ref<string | null>(null)
const isLoadingFolder = ref(false)
const folderFiles = ref<string[]>([])

// Fetch ports dataset
const { data: portsData } = await useAsyncData('ports-modal', () => fetchPorts())
const allPorts = computed(() => portsData.value || [])

const filteredPorts = computed(() => {
  if (!gameSearch.value.trim()) return allPorts.value
  const q = gameSearch.value.toLowerCase().trim()
  return allPorts.value.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.developer.toLowerCase().includes(q) ||
    p.internal_storage_path?.toLowerCase().includes(q)
  )
})

const handleConnect = async () => {
  await adb.connect()
}

const handleReboot = async () => {
  if (confirm('Reboot your Meta Quest headset now?')) {
    await adb.runShell('reboot')
    adb.disconnect()
    modal.close()
  }
}

// Trigger automatic APK sideload
const triggerApkInstall = async (port: Port) => {
  if (!port.port_download_url) return
  isTransferring.value = true
  try {
    await adb.installApkUrl(port.port_download_url, port.title)
  } catch (e) {
    console.error('APK install failed:', e)
  } finally {
    isTransferring.value = false
  }
}

// Inspect files inside the Quest internal storage path
const inspectFolder = async (port: Port) => {
  if (!port.internal_storage_path) return
  if (inspectedFolderSlug.value === port.slug) {
    inspectedFolderSlug.value = null
    folderFiles.value = []
    return
  }

  inspectedFolderSlug.value = port.slug
  isLoadingFolder.value = true
  folderFiles.value = []

  try {
    const files = await adb.listRemoteDir(port.internal_storage_path)
    folderFiles.value = files
  } catch (err) {
    console.error('Could not list folder:', err)
  } finally {
    isLoadingFolder.value = false
  }
}

// Handle file transfer directly to the game's internal_storage_path
const handleFileDrop = async (e: Event, remotePath: string) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const files = Array.from(target.files)
  isTransferring.value = true

  try {
    for (const file of files) {
      adb.installProgress.title = `Uploading to ${remotePath}`
      adb.installProgress.step = 'pushing'
      adb.installProgress.percent = 0
      adb.installProgress.message = `Starting ${file.name}...`

      await adb.pushFileToPath(file, remotePath, (pct, msg) => {
        adb.installProgress.percent = pct
        adb.installProgress.message = msg
      })
    }

    adb.installProgress.step = 'completed'
    adb.installProgress.percent = 100
    adb.installProgress.message = `Successfully transferred ${files.length} file(s) into ${remotePath}!`

    // Refresh inspected folder if open
    if (inspectedFolderSlug.value) {
      folderFiles.value = await adb.listRemoteDir(remotePath)
    }
  } catch (err: any) {
    console.error('File transfer failed:', err)
    adb.installProgress.step = 'error'
    adb.installProgress.message = `Transfer error: ${err?.message || 'Failed'}`
  } finally {
    isTransferring.value = false
  }
}

// Custom APK sideloading from Tab 2
const handleCustomApkSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]
  isTransferring.value = true
  try {
    await adb.installApkFile(file, file.name)
  } catch (err) {
    console.error(err)
  } finally {
    isTransferring.value = false
  }
}

const handleCustomApkDrop = async (e: DragEvent) => {
  if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) return
  const file = e.dataTransfer.files[0]
  if (!file.name.endsWith('.apk')) {
    alert('Please drop an .APK file')
    return
  }
  isTransferring.value = true
  try {
    await adb.installApkFile(file, file.name)
  } catch (err) {
    console.error(err)
  } finally {
    isTransferring.value = false
  }
}
</script>
