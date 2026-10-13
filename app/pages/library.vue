<template>
  <div class="space-y-6">
    <section class="mx-auto w-full max-w-[1720px] space-y-4 px-4 py-4 sm:px-6 lg:px-10">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div class="space-y-2">
          <CatalogLibraryTabs current="library" />
          <h1 class="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Library</h1>
          <p v-if="questAdb.isConnected.value" class="text-xs text-muted-foreground">
            {{ entries.length }} installed
            <span v-if="updateCount"> · {{ updateCount }} {{ updateCount === 1 ? 'update' : 'updates' }}</span>
          </p>
        </div>
      </div>

      <div
        v-if="!questAdb.isConnected.value"
        class="rounded-lg border border-border bg-card px-4 py-8 text-center"
      >
        <p class="text-sm text-foreground">Connect your Quest to see installed games.</p>
        <p class="mt-1 text-xs text-muted-foreground">Use Connect Quest in the header.</p>
      </div>

      <div
        v-else-if="entries.length === 0"
        class="rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground"
      >
        No indexed ports are installed on this headset.
      </div>

      <ul v-else class="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        <li
          v-for="entry in entries"
          :key="entry.port.id"
          class="flex items-center gap-3 px-3 py-2.5"
        >
          <NuxtLink :to="`/ports/${entry.port.slug}`" class="flex min-w-0 flex-1 items-center gap-3">
            <img
              :src="coverThumbUrl(entry.port.cover_image_url, mediaBase)"
              :alt="entry.port.title"
              width="40"
              height="24"
              class="h-6 w-10 shrink-0 rounded bg-muted object-cover"
              loading="lazy"
              decoding="async"
            />
            <span class="min-w-0">
              <span class="block truncate text-sm font-medium text-foreground">{{ entry.port.title }}</span>
              <span class="block truncate text-[11px] text-muted-foreground">
                <template v-if="entry.update">
                  {{ formatPortVersion(entry.installedVersion) || entry.installedVersion }} → {{ formatPortVersion(entry.port.latest_version) }}
                </template>
                <template v-else-if="entry.installedVersion">
                  {{ formatPortVersion(entry.installedVersion) || entry.installedVersion }}
                </template>
                <template v-else>Installed</template>
              </span>
            </span>
          </NuxtLink>
          <button
            v-if="entry.update && entry.port.port_download_url"
            type="button"
            class="inline-flex min-h-11 shrink-0 items-center rounded bg-amber-500 px-3 text-xs font-semibold text-black hover:bg-amber-400 disabled:opacity-60 md:min-h-8"
            :disabled="updatingSlug === entry.port.slug"
            @click="updatePort(entry)"
          >
            {{ updatingSlug === entry.port.slug ? 'Updating…' : 'Update' }}
          </button>
        </li>
      </ul>
      <p v-if="updateError" class="text-xs text-rose-300">{{ updateError }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Port } from '~/types/port'
import { coverThumbUrl } from '~/data/coverUrl'
import { installedPackageOnQuest } from '~/data/portPackageMap'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { useTrack } from '~/composables/useTrack'
import { readInstalledRelease } from '~/lib/installedRelease'
import { formatPortVersion } from '~/lib/portVersion'
import { libraryUpdateAvailable, orderLibraryEntries, type LibraryEntry } from '~/lib/questLibrary'

const mediaBase = computed(() => String(useRuntimeConfig().public.mediaBase || ''))
const { track } = useTrack()
const { fetchPorts } = usePorts()
const questAdb = useQuestAdb()

const { data: portsData } = await useAsyncData('ports', () => fetchPorts())
const ports = computed(() => portsData.value || [])

const versions = ref<Record<string, string | null>>({})
const versionsReady = ref<Record<string, boolean>>({})
const updatingSlug = ref('')
const updateError = ref('')

const installed = computed(() => {
  if (!questAdb.isConnected.value) return [] as Array<{ port: Port, packageName: string }>
  const rows: Array<{ port: Port, packageName: string }> = []
  for (const port of ports.value) {
    const packageName = installedPackageOnQuest(port.slug, questAdb.installedPackages.value)
    if (packageName) rows.push({ port, packageName })
  }
  return rows
})

const entries = computed(() => {
  const rows: LibraryEntry<Port>[] = installed.value.map(({ port, packageName }) => {
    const installedVersion = versions.value[packageName] ?? null
    const ready = versionsReady.value[packageName] === true
    const record = import.meta.client
      ? readInstalledRelease(window.localStorage, questAdb.deviceSerial.value, packageName)
      : null
    return {
      port,
      packageName,
      installedVersion,
      update: ready && libraryUpdateAvailable({
        installedVersion,
        catalogVersion: port.latest_version,
        record
      })
    }
  })
  return orderLibraryEntries(rows, port => port.title)
})

const updateCount = computed(() => entries.value.filter(entry => entry.update).length)

const loadVersions = async () => {
  if (!questAdb.isConnected.value) return
  const pending = installed.value.filter(row => versionsReady.value[row.packageName] !== true)
  await Promise.all(pending.map(async (row) => {
    const version = await questAdb.getPackageVersion(row.packageName)
    versions.value = { ...versions.value, [row.packageName]: version }
    versionsReady.value = { ...versionsReady.value, [row.packageName]: true }
  }))
}

watch(installed, () => {
  void loadVersions()
}, { immediate: true })

const updatePort = async (entry: LibraryEntry<Port>) => {
  const url = entry.port.port_download_url
  if (!url || updatingSlug.value) return
  updatingSlug.value = entry.port.slug
  updateError.value = ''
  track('install_click', { path: `/ports/${entry.port.slug}`, portSlug: entry.port.slug })
  try {
    const ok = await questAdb.installApkUrl(url, entry.port.title)
    if (!ok) {
      updateError.value = questAdb.installProgress.value.message || 'Update failed.'
      return
    }
    versionsReady.value = { ...versionsReady.value, [entry.packageName]: false }
    await questAdb.updatePackages()
    await loadVersions()
  } catch (err) {
    updateError.value = err instanceof Error ? err.message : 'Update failed.'
  } finally {
    updatingSlug.value = ''
  }
}

useSeoMeta({
  title: 'Library — QuestPorts',
  robots: 'noindex'
})
</script>
