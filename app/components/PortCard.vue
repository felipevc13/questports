<template>
  <NuxtLink
    :to="`${toPrefix || '/ports'}/${port.slug}`"
    @mouseenter="armPreview"
    @mouseleave="stopPreview"
    @focusin="armPreview"
    @focusout="stopPreview"
    :class="isInstalledOnQuest ? 'border-emerald-500/35 hover:border-emerald-500/80 shadow-sm shadow-emerald-500/5' : 'border-border hover:border-primary/50'"
    class="group relative z-0 isolate flex flex-col bg-card rounded-lg overflow-hidden transition-all block text-card-foreground"
  >
    <div ref="headerEl" class="relative aspect-[460/215] w-full overflow-hidden bg-muted">
      <img
        v-if="showCover"
        :src="coverSrc"
        :alt="port.title"
        width="460"
        height="215"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        loading="lazy"
        decoding="async"
      />

      <div
        v-if="isPlayingPreview && videoPreviewSource"
        class="absolute inset-0 z-10 bg-black overflow-hidden animate-in fade-in duration-300"
      >
        <video
          ref="previewVideo"
          :src="videoPreviewSource"
          muted
          loop
          playsinline
          preload="none"
          class="w-full h-full object-cover pointer-events-none"
          @error="handleVideoError"
        />
        <div class="absolute inset-0 z-20 bg-transparent cursor-pointer"></div>
      </div>

      <div
        v-if="!isPlayingPreview && (isInstalledOnQuest || showNew || inDev)"
        class="absolute top-2 left-2 right-2 z-20 flex items-start justify-between gap-1 pointer-events-none"
      >
        <span
          v-if="isInstalledOnQuest"
          class="inline-flex items-center gap-1 rounded border border-emerald-400/50 bg-emerald-950/95 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300 shadow-md shadow-emerald-950/40"
        >
          <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"></span>
          <span>Installed</span>
        </span>
        <span
          v-else-if="showNew"
          class="inline-flex items-center rounded border border-white/20 bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-md"
        >
          New
        </span>
        <span v-else></span>
        <span
          v-if="inDev"
          class="inline-flex items-center rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white/75"
        >
          In Dev
        </span>
      </div>

      <span
        v-if="hasVideo && !isPlayingPreview"
        class="pointer-events-none absolute bottom-1.5 right-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-black/55 text-white [@media(hover:hover)_and_(pointer:fine)]:inline-flex"
        aria-hidden="true"
      >
        <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-1 border-t border-border p-3">
      <h3 class="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
        {{ port.title }}
      </h3>
      <p
        v-if="cardMeta"
        class="truncate text-xs leading-5 text-muted-foreground"
        :title="cardMeta.text"
      >
        <template v-if="cardMeta.verified">
          <span class="font-medium text-green-400">✓ Verified</span><span>{{ cardMeta.suffix }}</span>
        </template>
        <template v-else>{{ cardMeta.text }}</template>
      </p>
      <p v-if="cardDescription" class="truncate text-xs leading-5 text-muted-foreground">
        {{ cardDescription }}
      </p>
      <span
        v-if="isInstalledOnQuest"
        class="inline-flex items-center gap-1 pt-0.5 text-xs font-semibold text-emerald-400 group-hover:underline"
      >
        <span>Manage Files</span>
        <svg class="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Port } from '~/types/port'
import type { PortVerification } from '~/lib/verification'
import { portVerificationSignal } from '~/lib/verification'
import { canHoverPreview, previewMp4Url, PREVIEW_HOVER_MS } from '~/data/videoPreviews'
import { versionedCoverUrl } from '~/data/coverUrl'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { isPortInstalledOnQuest } from '~/data/portPackageMap'
import { buildCatalogCardMeta, catalogCardDescription } from '~/lib/catalogCard'
import { isPortNew } from '~/lib/catalogVisit'
import { useCatalogVisit } from '~/composables/useCatalogVisit'

const props = withDefaults(defineProps<{
  port: Port
  toPrefix?: string
  verifications?: PortVerification[] | null
  /** First-screen cards include the cover in the HTML. The rest wait until they are near the viewport. */
  eager?: boolean
}>(), {
  verifications: () => [],
  eager: false
})

const questAdb = useQuestAdb()
const visit = useCatalogVisit()

const isInstalledOnQuest = computed(() => {
  if (!questAdb.isConnected.value) return false
  return isPortInstalledOnQuest(props.port.slug, questAdb.installedPackages.value)
})

const inDev = computed(() => props.port.status === 'in_development')

const showNew = computed(() => {
  if (!visit.ready.value || isInstalledOnQuest.value) return false
  return isPortNew(props.port.created_at, visit.lastVisit.value, Date.now())
})

const cardMeta = computed(() => buildCatalogCardMeta({
  verified: portVerificationSignal(props.verifications, props.port.slug, props.port.latest_version).kind === 'verified',
  installs: props.port.installs ?? 0,
  hardware: props.port.supported_hardware
}))

const cardDescription = computed(() => catalogCardDescription(props.port.short_description))

const isPlayingPreview = ref(false)
const previewVideo = ref<HTMLVideoElement | null>(null)
let hoverTimer: ReturnType<typeof setTimeout> | null = null
let coverObserver: IntersectionObserver | null = null
const localVideoFailed = ref(false)
const headerEl = ref<HTMLElement | null>(null)
const showCover = ref(props.eager)
const mediaBase = computed(() => String(useRuntimeConfig().public.mediaBase || ''))

const COVER_FALLBACK = 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80'
const coverSrc = computed(() => versionedCoverUrl(props.port.cover_image_url, mediaBase.value) || COVER_FALLBACK)

const videoPreviewSource = computed(() => {
  if (localVideoFailed.value) return null
  return previewMp4Url({
    slug: props.port.slug,
    videoPreviewUrl: props.port.video_preview_url,
    mediaBase: mediaBase.value
  })
})

const hasVideo = computed(() => Boolean(videoPreviewSource.value))

const handleVideoError = () => {
  localVideoFailed.value = true
  isPlayingPreview.value = false
}

const stopPreview = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  isPlayingPreview.value = false
}

const armPreview = () => {
  if (!hasVideo.value || !canHoverPreview()) return
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    isPlayingPreview.value = true
  }, PREVIEW_HOVER_MS)
}

watch(isPlayingPreview, async (playing) => {
  if (!playing) return
  await nextTick()
  try {
    await previewVideo.value?.play()
  } catch {
    isPlayingPreview.value = false
  }
})

onMounted(() => {
  if (showCover.value) return
  const el = headerEl.value
  if (!el || typeof IntersectionObserver === 'undefined') {
    showCover.value = true
    return
  }
  coverObserver = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) return
    showCover.value = true
    coverObserver?.disconnect()
    coverObserver = null
  }, { rootMargin: '400px 0px' })
  coverObserver.observe(el)
})

onBeforeUnmount(() => {
  if (hoverTimer) clearTimeout(hoverTimer)
  coverObserver?.disconnect()
})
</script>
