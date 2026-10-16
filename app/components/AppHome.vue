<template>
  <div class="mx-auto w-full max-w-[1720px] px-4 py-4 sm:px-6 lg:px-10">
    <p v-if="!ready" class="py-8 text-sm text-muted-foreground">Loading…</p>
    <template v-else>
      <div class="mb-4 flex gap-1 rounded-lg border border-border bg-card p-1" role="tablist" aria-label="QuestPorts">
        <button
          v-for="item in tabs"
          :key="item.id"
          type="button"
          role="tab"
          class="inline-flex min-h-11 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium"
          :class="tab === item.id ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
          :aria-selected="tab === item.id"
          :data-testid="`app-tab-${item.id}`"
          @click="tab = item.id"
        >
          <span>{{ item.label }}</span>
          <span
            v-if="item.id === 'library' && libraryRows.length > 0"
            data-testid="library-count"
            class="library-count ml-1.5 bg-background text-foreground"
          ><span>{{ libraryRows.length }}</span></span>
        </button>
      </div>

      <section v-if="tab === 'library'" class="space-y-3">
        <p class="text-xs text-muted-foreground">
          {{ libraryRows.length }} installed
          <span v-if="updateCount"> · {{ updateCount }} {{ updateCount === 1 ? 'update' : 'updates' }}</span>
        </p>
        <div v-if="libraryRows.length === 0" class="rounded-lg border border-border bg-card px-4 py-8 text-center">
          <p class="text-sm text-foreground">No QuestPorts games installed yet.</p>
          <button type="button" class="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary" @click="tab = 'catalog'">
            Browse the catalog
          </button>
        </div>
        <ul v-else class="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          <li v-for="row in libraryRows" :key="row.port.id" class="px-3 py-2.5">
            <div class="flex flex-wrap items-center gap-3">
            <NuxtLink :to="`/ports/${row.port.slug}`" class="flex min-w-0 flex-1 items-center gap-3">
              <img
                :src="coverThumbUrl(row.port.cover_image_url, mediaBase)"
                :alt="row.port.title"
                width="40"
                height="24"
                class="h-6 w-10 shrink-0 rounded bg-muted object-cover"
                loading="lazy"
                decoding="async"
              />
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium text-foreground">{{ row.port.title }}</span>
                <span class="block truncate text-[11px] text-muted-foreground">
                  <template v-if="row.update">
                    {{ formatPortVersion(row.version) || row.version || 'Installed' }} → {{ formatPortVersion(row.port.latest_version) }}
                  </template>
                  <template v-else>{{ formatPortVersion(row.version) || 'Installed' }}</template>
                </span>
              </span>
            </NuxtLink>
            <button
              v-if="row.update && canUpdate(row.port)"
              type="button"
              data-testid="library-update"
              class="inline-flex min-h-11 shrink-0 items-center rounded bg-amber-500 px-3 text-xs font-semibold text-black disabled:opacity-60"
              :disabled="updatingSlug === row.port.slug"
              @click="updateGame(row)"
            >
              {{ updatingSlug === row.port.slug ? 'Updating…' : 'Update' }}
            </button>
            <button
              v-if="canUninstall"
              type="button"
              data-testid="library-uninstall"
              class="inline-flex min-h-11 shrink-0 items-center rounded border border-border px-3 text-xs font-semibold text-muted-foreground"
              @click="askUninstall(row.port.slug)"
            >
              Uninstall
            </button>
            </div>
            <div
              v-if="canUninstall && confirmSlug === row.port.slug"
              data-testid="library-uninstall-confirm"
              class="mt-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2"
            >
              <p class="text-xs text-foreground">Uninstall {{ row.port.title }} from this headset?</p>
              <p v-if="uninstallError" class="mt-1 text-[11px] text-rose-300">{{ uninstallError }}</p>
              <div class="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex min-h-11 items-center rounded border border-border px-3 text-xs font-medium text-muted-foreground"
                  :disabled="uninstallingSlug === row.port.slug"
                  @click="cancelUninstall"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-testid="library-uninstall-yes"
                  class="inline-flex min-h-11 items-center rounded bg-rose-600 px-3 text-xs font-semibold text-white disabled:opacity-60"
                  :disabled="uninstallingSlug === row.port.slug"
                  @click="confirmUninstall(row)"
                >
                  {{ uninstallingSlug === row.port.slug ? 'Uninstalling…' : 'Uninstall' }}
                </button>
              </div>
            </div>
          </li>
        </ul>
        <p v-if="updateError" class="text-xs text-rose-300">{{ updateError }}</p>
      </section>

      <section v-else-if="tab === 'catalog'" class="space-y-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="search"
            enterkeyhint="search"
            placeholder="Search games"
            aria-label="Search ports"
            class="w-full min-h-11 rounded-md border border-border bg-muted/80 py-2.5 pl-3 pr-11 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-xs text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>
        <p class="text-xs text-muted-foreground">{{ catalogPorts.length }} {{ catalogPorts.length === 1 ? 'port' : 'ports' }}</p>
        <div v-if="catalogPorts.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PortCard
            v-for="port in catalogPorts"
            :key="port.id"
            :port="port"
            :verifications="verificationRecords"
          />
        </div>
        <div v-else class="rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          No ports found.
        </div>
      </section>

      <section v-else class="space-y-4 rounded-lg border border-border bg-card p-4">
        <div>
          <h1 class="text-base font-semibold text-foreground">Settings</h1>
          <p class="mt-1 text-xs text-muted-foreground">
            QuestPorts {{ currentVersion && currentVersion !== 'mock' ? currentVersion : '' }}
          </p>
        </div>
        <button
          type="button"
          data-testid="check-for-updates"
          class="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          :disabled="checking"
          @click="checkForUpdates"
        >
          {{ checking ? 'Checking…' : 'Check for updates' }}
        </button>
        <div v-if="checked" class="space-y-2 text-sm text-foreground" data-testid="update-check-result">
          <p v-if="appCheckError" class="text-rose-300">{{ appCheckError }}</p>
          <template v-else-if="appCheck">
            <p v-if="appCheck.update">QuestPorts {{ appCheck.latest }} is available.</p>
            <p v-else>QuestPorts is up to date.</p>
            <button
              v-if="appCheck.update && appCheck.apkUrl"
              type="button"
              data-testid="update-app"
              class="inline-flex min-h-11 items-center rounded bg-amber-500 px-3 text-xs font-semibold text-black"
              @click="updateApp"
            >
              Update app
            </button>
          </template>
          <p class="text-xs text-muted-foreground">
            <template v-if="updateCount">{{ updateCount }} game {{ updateCount === 1 ? 'update' : 'updates' }} in Library.</template>
            <template v-else>No game updates.</template>
          </p>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Port } from '~/types/port'
import type { PortVerification } from '~/lib/verification'
import { coverThumbUrl } from '~/data/coverUrl'
import { PORT_PACKAGE_CONFIGS } from '~/data/portPackageMap'
import {
  APP_BRIDGE_EVENT,
  appBridgeApkUrl,
  appUpdateAvailable,
  bridgeCanUninstall,
  ensureMockAppBridge,
  requestBridgeUninstall,
  whenAppBridgeReady,
  type AppBridgeEventDetail
} from '~/lib/appBridge'
import { APP_PACKAGE_NAME, APP_RELEASES_LATEST, parseLatestAppRelease, type AppReleaseView } from '~/lib/appReleaseCheck'
import { appStartTab, firstInstalledPackage, type AppTab } from '~/lib/headsetPackages'
import { APP_RELEASE_SERIAL, forgetInstalledRelease, readInstalledRelease } from '~/lib/installedRelease'
import { formatPortVersion } from '~/lib/portVersion'
import { refusesOneClickInstall } from '~/lib/patchOnlyInstall'
import { useTrack } from '~/composables/useTrack'
import { useQuestAdb } from '~/composables/useQuestAdb'

const props = defineProps<{
  ports: Port[]
  verifications?: PortVerification[] | null
}>()

const tabs: Array<{ id: AppTab, label: string }> = [
  { id: 'library', label: 'Library' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'settings', label: 'Settings' }
]

const mediaBase = computed(() => String(useRuntimeConfig().public.mediaBase || ''))
const configuredProxyBase = String(useRuntimeConfig().public.apkProxyBase || '').replace(/\/$/, '')
const { track } = useTrack()
const route = useRoute()
const questAdb = useQuestAdb()
const verificationRecords = computed(() => props.verifications || [])

const ready = ref(false)
const tab = ref<AppTab>('catalog')
const searchQuery = ref('')
const versions = ref<Record<string, string | null>>({})
const installedBySlug = ref<Record<string, string>>({})
const updatingSlug = ref('')
const activeRequest = ref('')
const updateError = ref('')
const confirmSlug = ref('')
const uninstallingSlug = ref('')
const uninstallError = ref('')
let stopUninstallWatch = () => {}
const checking = ref(false)
const checked = ref(false)
const appCheck = ref<AppReleaseView | null>(null)
const appCheckError = ref('')
const currentVersion = ref<string | null>(null)

const libraryRows = computed(() => {
  const rows = (props.ports || []).flatMap((port) => {
    const packageName = installedBySlug.value[port.slug]
    if (!packageName) return []
    const version = versions.value[packageName] ?? null
    const record = import.meta.client
      ? readInstalledRelease(window.localStorage, APP_RELEASE_SERIAL, packageName)
      : null
    return [{
      port,
      packageName,
      version,
      update: appUpdateAvailable(version, port.latest_version, record)
    }]
  })
  return rows.sort((a, b) => {
    if (a.update !== b.update) return a.update ? -1 : 1
    return a.port.title.localeCompare(b.port.title, undefined, { sensitivity: 'base' })
  })
})

const updateCount = computed(() => libraryRows.value.filter(row => row.update).length)

const canUninstall = computed(() => ready.value && import.meta.client && bridgeCanUninstall(window.QuestPortsApp))

const catalogPorts = computed(() => {
  const list = props.ports || []
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(port =>
    port.title.toLowerCase().includes(q)
    || port.slug.toLowerCase().includes(q)
    || port.developer.toLowerCase().includes(q)
    || (port.short_description || '').toLowerCase().includes(q)
  )
})

const canUpdate = (port: Port) => {
  const cfg = PORT_PACKAGE_CONFIGS[port.slug]
  return Boolean(port.port_download_url)
    && cfg?.installType !== 'pc_builder_required'
    && !refusesOneClickInstall(port.slug, port.port_download_url)
}

const scanInstalled = () => {
  const bridge = window.QuestPortsApp
  const found: Record<string, string> = {}
  const nextVersions: Record<string, string | null> = { ...versions.value }
  if (bridge) {
    for (const port of props.ports || []) {
      const pkg = firstInstalledPackage(port.slug, name => bridge.isInstalled(name))
      if (!pkg) continue
      found[port.slug] = pkg
      try {
        nextVersions[pkg] = bridge.getInstalledVersion(pkg)
      } catch {
        nextVersions[pkg] = null
      }
    }
  }
  installedBySlug.value = found
  versions.value = nextVersions
  // Cards read this list. WebUSB never fills it inside the app: connect() bails out.
  questAdb.installedPackages.value = Object.values(found)
  return Object.keys(found).length
}

const readAppVersion = () => {
  const bridge = window.QuestPortsApp
  if (!bridge) return null
  try {
    if (typeof bridge.getVersion === 'function') {
      const value = bridge.getVersion()
      if (value) return value
    }
  } catch {
    // Fall through to the version field.
  }
  return bridge.version || null
}

const onBridgeEvent = (event: Event) => {
  const detail = (event as CustomEvent<AppBridgeEventDetail>).detail
  if (!detail || detail.requestId !== activeRequest.value) return
  if (detail.status === 'success') {
    updatingSlug.value = ''
    activeRequest.value = ''
    scanInstalled()
    return
  }
  if (detail.status === 'error' || detail.status === 'cancelled') {
    updatingSlug.value = ''
    activeRequest.value = ''
    if (detail.status === 'error') updateError.value = detail.error || 'Update failed.'
  }
}

const packageStillInstalled = (packageName: string) =>
  libraryRows.value.some(row => row.packageName === packageName)

const finishBridgeUninstall = (packageName: string) => {
  scanInstalled()
  if (packageStillInstalled(packageName)) {
    uninstallError.value = 'Confirm the uninstall on the headset.'
    stopUninstallWatch()
    const onChange = () => {
      if (document.visibilityState !== 'visible') return
      scanInstalled()
      if (packageStillInstalled(packageName)) return
      forgetInstalledRelease(window.localStorage, APP_RELEASE_SERIAL, packageName)
      uninstallError.value = ''
      confirmSlug.value = ''
      document.removeEventListener('visibilitychange', onChange)
    }
    document.addEventListener('visibilitychange', onChange)
    stopUninstallWatch = () => document.removeEventListener('visibilitychange', onChange)
    return
  }
  forgetInstalledRelease(window.localStorage, APP_RELEASE_SERIAL, packageName)
  uninstallError.value = ''
  confirmSlug.value = ''
}

const askUninstall = (slug: string) => {
  confirmSlug.value = slug
  uninstallError.value = ''
}

const cancelUninstall = () => {
  if (uninstallingSlug.value) return
  confirmSlug.value = ''
  uninstallError.value = ''
}

const confirmUninstall = async (row: { port: Port, packageName: string }) => {
  if (uninstallingSlug.value || !canUninstall.value) return
  uninstallingSlug.value = row.port.slug
  uninstallError.value = ''
  const result = await requestBridgeUninstall(window.QuestPortsApp, row.packageName)
  uninstallingSlug.value = ''
  if (result !== 'started') {
    uninstallError.value = 'Uninstall was not started.'
    return
  }
  finishBridgeUninstall(row.packageName)
}

const updateGame = (row: { port: Port, packageName: string }) => {
  const bridge = window.QuestPortsApp
  if (!bridge || updatingSlug.value) return
  if (refusesOneClickInstall(row.port.slug, row.port.port_download_url)) return
  const pkg = PORT_PACKAGE_CONFIGS[row.port.slug]?.packageName || row.packageName
  const url = appBridgeApkUrl(
    configuredProxyBase || window.location.origin,
    row.port.port_download_url,
    window.location.origin
  )
  if (!url) {
    updateError.value = 'No APK download URL for this port.'
    return
  }
  updateError.value = ''
  track('install_click', { path: `/ports/${row.port.slug}`, portSlug: row.port.slug })
  try {
    updatingSlug.value = row.port.slug
    activeRequest.value = String(bridge.installApk(url, pkg) || '')
  } catch (err) {
    updatingSlug.value = ''
    updateError.value = err instanceof Error ? err.message : 'Update failed.'
  }
}

const checkForUpdates = async () => {
  if (checking.value) return
  checking.value = true
  appCheckError.value = ''
  scanInstalled()
  currentVersion.value = readAppVersion()
  try {
    const res = await fetch(APP_RELEASES_LATEST, {
      headers: { accept: 'application/vnd.github+json' }
    })
    if (!res.ok) throw new Error(`GitHub returned ${res.status}`)
    appCheck.value = parseLatestAppRelease(await res.json(), currentVersion.value)
  } catch (err) {
    appCheck.value = null
    appCheckError.value = err instanceof Error ? err.message : 'Could not check for an app update.'
  } finally {
    checked.value = true
    checking.value = false
  }
}

const updateApp = () => {
  const bridge = window.QuestPortsApp
  const url = appCheck.value?.apkUrl
  if (!bridge || !url) return
  try {
    activeRequest.value = String(bridge.installApk(url, APP_PACKAGE_NAME) || '')
  } catch (err) {
    appCheckError.value = err instanceof Error ? err.message : 'Could not start the app update.'
  }
}

let searchTrackTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (value) => {
  if (searchTrackTimer) clearTimeout(searchTrackTimer)
  const query = value.trim()
  if (!query) return
  searchTrackTimer = setTimeout(() => {
    track('search', { path: route.path, props: { q: query, length: query.length } })
    if (catalogPorts.value.length === 0) {
      track('search_no_results', { path: route.path, props: { q: query } })
    }
  }, 600)
})

let stopBridgeWait = () => {}

onMounted(() => {
  ensureMockAppBridge(`${route.path}${window.location.search}`)
  stopBridgeWait = whenAppBridgeReady(() => {
    const count = scanInstalled()
    tab.value = appStartTab(count)
    currentVersion.value = readAppVersion()
    ready.value = true
  })
  window.addEventListener(APP_BRIDGE_EVENT, onBridgeEvent)
})

onUnmounted(() => {
  stopBridgeWait()
  stopUninstallWatch()
  if (searchTrackTimer) clearTimeout(searchTrackTimer)
  if (!import.meta.client) return
  window.removeEventListener(APP_BRIDGE_EVENT, onBridgeEvent)
})
</script>
