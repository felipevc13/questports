<template>
  <DialogRoot :open="modal.isOpen.value" @update:open="(val) => { if (!val) modal.close() }">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      
      <DialogContent
        class="fixed left-1/2 top-1/2 z-[51] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 border border-border/80 bg-[#0c101c] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl flex flex-col max-h-[90vh] overflow-hidden text-foreground"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-muted/20 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-semibold text-foreground tracking-tight">
                  Quest Device Manager
                </h2>
                <span
                  v-if="adb.isConnected"
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground bg-muted/50 border border-border/60"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"></span>
                  Not Connected
                </span>
              </div>
              <p class="text-xs text-muted-foreground">
                WebADB: Direct browser-to-headset sideloading & automatic folder routing
              </p>
            </div>
          </div>

          <DialogClose
            class="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </DialogClose>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- WebUSB Browser Compatibility Alert -->
          <div
            v-if="!adb.isWebUsbSupported"
            class="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-3"
          >
            <svg class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div class="space-y-1">
              <div class="font-semibold text-amber-100">Chromium Browser Required</div>
              <p class="text-amber-200/80 leading-relaxed">
                Direct WebUSB communication requires a Chromium-based browser (Google Chrome, Microsoft Edge, Brave, or Opera). Safari and Firefox do not support WebUSB.
              </p>
            </div>
          </div>

          <!-- STATE 1: NOT CONNECTED (Onboarding) -->
          <div v-if="!adb.isConnected" class="space-y-6 py-2">
            <div class="text-center max-w-lg mx-auto space-y-2">
              <h3 class="text-lg font-semibold text-foreground">
                Connect your Meta Quest via USB
              </h3>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Directly install APKs and automatically route game files to the correct internal storage directories without installing any desktop software.
              </p>
            </div>

            <!-- 3 Setup Steps -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="p-4 rounded-lg bg-card border border-border/70 space-y-2">
                <div class="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold">
                  1
                </div>
                <div class="text-xs font-semibold text-foreground">Plug USB Cable</div>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  Connect your powered-on Meta Quest to this computer with any USB-C cable.
                </p>
              </div>

              <div class="p-4 rounded-lg bg-card border border-border/70 space-y-2">
                <div class="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold">
                  2
                </div>
                <div class="text-xs font-semibold text-foreground">Allow USB Debugging</div>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  Put on the headset and check <strong>"Always allow from this computer"</strong>.
                </p>
              </div>

              <div class="p-4 rounded-lg bg-card border border-border/70 space-y-2">
                <div class="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold">
                  3
                </div>
                <div class="text-xs font-semibold text-foreground">Click Pair Below</div>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  Select your Quest from the browser popup dialog and you're ready to go.
                </p>
              </div>
            </div>

            <!-- Pair CTA Button -->
            <div class="text-center pt-2">
              <UiButton
                size="lg"
                @click="adb.connect"
                :disabled="adb.isConnecting || !adb.isWebUsbSupported"
                class="gap-2 px-8 text-xs font-semibold"
              >
                <svg v-if="adb.isConnecting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ adb.isConnecting ? 'Waiting for Headset Permission...' : 'Detect & Pair Meta Quest' }}</span>
              </UiButton>
            </div>

            <!-- Error message if any -->
            <div v-if="adb.connectionError" class="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs max-w-md mx-auto space-y-1">
              <div class="font-semibold">Connection Failed</div>
              <p class="text-muted-foreground">{{ adb.connectionError }}</p>
              <div class="text-[11px] text-muted-foreground pt-1 border-t border-destructive/10">
                Ensure <strong>Developer Mode</strong> is turned ON in the Meta Quest mobile app under Headset Settings.
              </div>
            </div>
          </div>

          <!-- STATE 2: CONNECTED (Dashboard & Smart Router) -->
          <div v-else class="space-y-6">
            <!-- Device Specs Bar -->
            <div class="p-4 rounded-lg bg-card border border-border/80 flex flex-wrap items-center justify-between gap-4">
              <!-- Left: Model & Serial -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-foreground">{{ adb.deviceModel || 'Meta Quest' }}</span>
                    <UiBadge variant="outline" class="font-mono text-[10px] text-emerald-400 border-emerald-500/30">
                      {{ adb.androidVersion || 'Android' }}
                    </UiBadge>
                  </div>
                  <div class="text-xs text-muted-foreground font-mono">
                    Serial: {{ adb.deviceSerial || 'Connected' }}
                  </div>
                </div>
              </div>

              <!-- Right: Battery, Storage, Actions -->
              <div class="flex items-center gap-5">
                <!-- Battery Level -->
                <div v-if="adb.batteryLevel !== null" class="space-y-1">
                  <div class="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <span>Battery</span>
                    <span v-if="adb.isCharging" class="text-emerald-400 text-xs">⚡</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-muted rounded-full overflow-hidden border border-border">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="adb.batteryLevel > 20 ? 'bg-emerald-400' : 'bg-rose-500'"
                        :style="{ width: `${adb.batteryLevel}%` }"
                      ></div>
                    </div>
                    <span class="text-xs font-mono font-medium">{{ adb.batteryLevel }}%</span>
                  </div>
                </div>

                <!-- Storage Info -->
                <div v-if="adb.storageFree" class="space-y-1">
                  <div class="text-[11px] font-mono text-muted-foreground">
                    Available Storage
                  </div>
                  <div class="text-xs font-mono font-medium text-foreground">
                    {{ adb.storageFree }} / {{ adb.storageTotal }}
                  </div>
                </div>

                <!-- Disconnect -->
                <UiButton
                  variant="outline"
                  size="sm"
                  @click="adb.disconnect"
                  class="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
                >
                  Disconnect
                </UiButton>
              </div>
            </div>

            <!-- Active Task Progress Bar (Only visible when active!) -->
            <div
              v-if="adb.installProgress.step !== 'idle'"
              class="p-4 rounded-lg border space-y-2"
              :class="adb.installProgress.step === 'error'
                ? 'bg-destructive/10 border-destructive/20'
                : adb.installProgress.step === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-primary/10 border-primary/20'"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-foreground">
                  {{ adb.installProgress.title }}
                </span>
                <span class="font-mono text-xs font-medium">
                  {{ adb.installProgress.percent }}%
                </span>
              </div>
              <div class="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-border">
                <div
                  class="h-full rounded-full transition-all duration-200"
                  :class="adb.installProgress.step === 'error' ? 'bg-rose-500' : 'bg-primary'"
                  :style="{ width: `${adb.installProgress.percent}%` }"
                ></div>
              </div>
              <p class="text-xs text-muted-foreground">
                {{ adb.installProgress.message }}
              </p>
            </div>

            <!-- Navigation Segmented Control -->
            <div class="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/60 max-w-md">
              <button
                @click="activeTab = 'games'"
                class="flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all cursor-pointer text-center"
                :class="activeTab === 'games' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'"
              >
                Port Folders & Sideload
              </button>
              <button
                @click="activeTab = 'custom-apk'"
                class="flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all cursor-pointer text-center"
                :class="activeTab === 'custom-apk' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'"
              >
                Install Custom APK
              </button>
              <button
                @click="activeTab = 'tools'"
                class="flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all cursor-pointer text-center"
                :class="activeTab === 'tools' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'"
              >
                Device Tools
              </button>
            </div>

            <!-- TAB 1: Port Folders & Sideload -->
            <div v-if="activeTab === 'games'" class="space-y-4">
              <!-- Search filter -->
              <div class="flex items-center justify-between gap-3">
                <div class="relative flex-1 max-w-xs">
                  <input
                    v-model="gameSearch"
                    type="text"
                    placeholder="Search game or folder path..."
                    class="w-full pl-8 pr-3 py-1.5 bg-muted/60 border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <svg class="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span class="text-xs text-muted-foreground font-mono">
                  {{ filteredPorts.length }} ports indexed
                </span>
              </div>

              <!-- Ports Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[48vh] overflow-y-auto pr-1">
                <div
                  v-for="port in filteredPorts"
                  :key="port.slug"
                  class="p-3.5 rounded-lg bg-card border border-border/70 hover:border-border transition-all space-y-2.5"
                >
                  <!-- Card Header -->
                  <div class="flex items-center gap-3">
                    <img
                      :src="port.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=120&q=80'"
                      :alt="port.title"
                      class="w-11 h-11 rounded-md object-cover border border-border shrink-0 bg-muted"
                    />
                    <div class="min-w-0 flex-1">
                      <h4 class="text-xs font-semibold text-foreground truncate">{{ port.title }}</h4>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[11px] text-muted-foreground truncate">{{ port.developer }}</span>
                        <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border">
                          {{ formatCategoryShort(port.category) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Smart Target Storage Path -->
                  <div v-if="port.internal_storage_path" class="p-2 rounded bg-muted/40 border border-border/50 space-y-1">
                    <div class="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>Destination Path:</span>
                      <button
                        @click="inspectFolder(port)"
                        class="text-primary hover:underline cursor-pointer"
                      >
                        {{ inspectedFolderSlug === port.slug ? 'Hide Contents' : 'Inspect Folder' }}
                      </button>
                    </div>
                    <code class="block font-mono text-[10px] text-primary truncate select-all">
                      {{ port.internal_storage_path }}
                    </code>

                    <!-- Files inside remote folder -->
                    <div
                      v-if="inspectedFolderSlug === port.slug"
                      class="pt-1.5 border-t border-border/40 text-[10px] font-mono space-y-1"
                    >
                      <div v-if="isLoadingFolder" class="text-muted-foreground">Reading Quest directory...</div>
                      <div v-else-if="folderFiles.length === 0" class="text-amber-400">
                        Folder is empty or not created yet.
                      </div>
                      <div v-else class="space-y-0.5 max-h-24 overflow-y-auto">
                        <div class="text-emerald-400 font-semibold mb-0.5">
                          ✓ Found {{ folderFiles.length }} file(s):
                        </div>
                        <div v-for="f in folderFiles" :key="f" class="text-muted-foreground truncate">
                          📄 {{ f }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2 pt-1">
                    <!-- Sideload APK -->
                    <UiButton
                      v-if="port.port_download_url && (port.port_download_url.endsWith('.apk') || port.port_download_url.includes('releases'))"
                      size="sm"
                      @click="triggerApkInstall(port)"
                      :disabled="isTransferring"
                      class="text-xs h-7 py-0 px-2.5 font-semibold gap-1"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Sideload APK</span>
                    </UiButton>

                    <!-- Auto-route Game Files Drop/Picker -->
                    <label
                      v-if="port.internal_storage_path"
                      class="inline-flex items-center gap-1 px-2.5 h-7 rounded-md text-xs font-medium bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer transition-colors"
                      title="Directly transfers files to this game's exact storage folder"
                    >
                      <svg class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span>Copy Game Files</span>
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

            <!-- TAB 2: Custom APK Sideload -->
            <div v-if="activeTab === 'custom-apk'" class="space-y-4">
              <div
                class="p-10 border-2 border-dashed border-border/80 hover:border-primary/50 rounded-xl text-center space-y-3 bg-muted/20 transition-all cursor-pointer"
                @dragover.prevent
                @drop.prevent="handleCustomApkDrop"
              >
                <div class="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div class="space-y-1">
                  <h4 class="text-sm font-semibold text-foreground">
                    Drag & Drop any .APK file here
                  </h4>
                  <p class="text-xs text-muted-foreground">
                    Sideload any standalone VR game package from your computer to your Quest
                  </p>
                </div>

                <div class="pt-2">
                  <label class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow hover:bg-primary/90">
                    <span>Select .APK from PC</span>
                    <input type="file" accept=".apk" class="hidden" @change="handleCustomApkSelect" />
                  </label>
                </div>
              </div>
            </div>

            <!-- TAB 3: Device Tools -->
            <div v-if="activeTab === 'tools'" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                <div class="p-4 rounded-lg bg-card border border-border space-y-2">
                  <div class="text-xs font-semibold text-foreground">Reboot Headset</div>
                  <p class="text-[11px] text-muted-foreground">
                    Cleanly reboot your Quest OS via ADB.
                  </p>
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="handleReboot"
                    class="text-xs"
                  >
                    Reboot Quest
                  </UiButton>
                </div>

                <div class="p-4 rounded-lg bg-card border border-border space-y-2">
                  <div class="text-xs font-semibold text-foreground">Installed Packages</div>
                  <p class="text-[11px] text-muted-foreground font-mono">
                    {{ adb.installedPackages.length }} sideloaded app(s) registered
                  </p>
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="adb.refreshStats"
                    class="text-xs"
                  >
                    Refresh Device Stats
                  </UiButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose
} from 'radix-vue'
import { useQuestConnectModal } from '~/composables/useQuestConnectModal'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { usePorts } from '~/composables/usePorts'
import type { Port, PortCategory } from '~/types/port'

const modal = useQuestConnectModal()
const adb = useQuestAdb()
const { fetchPorts } = usePorts()

const activeTab = ref<'games' | 'custom-apk' | 'tools'>('games')
const gameSearch = ref('')
const isTransferring = ref(false)

const inspectedFolderSlug = ref<string | null>(null)
const isLoadingFolder = ref(false)
const folderFiles = ref<string[]>([])

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

const formatCategoryShort = (cat: PortCategory) => {
  switch (cat) {
    case 'source_port': return 'Source Port'
    case 'decompilation': return 'Decomp'
    case 'engine_recreation': return 'Engine'
    case 'emulator': return 'Emulator'
    case 'wrapper': return 'Wrapper'
    case 'vr_injection': return 'VR Mod'
    default: return cat
  }
}

const handleReboot = async () => {
  if (confirm('Reboot your Meta Quest headset now?')) {
    await adb.runShell('reboot')
    adb.disconnect()
    modal.close()
  }
}

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
