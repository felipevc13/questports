<template>
  <NuxtLink
    :to="`${toPrefix || '/ports'}/${port.slug}`"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    :class="isInstalledOnQuest ? 'border-emerald-500/35 hover:border-emerald-500/80 shadow-sm shadow-emerald-500/5' : 'border-border hover:border-primary/50'"
    class="group flex flex-col bg-card rounded-lg overflow-hidden transition-all block text-card-foreground"
  >
    <!-- Steam Capsule Header (460x215 aspect ratio) -->
    <div class="relative aspect-[460/215] w-full overflow-hidden bg-muted">
      <img
        :src="port.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80'"
        :alt="port.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        loading="lazy"
      />

      <!-- Dark gradient at the bottom for text contrast (hidden on video preview) -->
      <div v-if="!isPlayingPreview" class="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30 pointer-events-none"></div>

      <!-- Top dark vignette to guarantee badge contrast on white/bright covers (hidden on video preview) -->
      <div v-if="!isPlayingPreview" class="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none"></div>

      <!-- Hover Video Preview Overlay (100% clean gameplay with zero tags, controls, or overlays) -->
      <div
        v-if="isPlayingPreview && videoPreviewSource"
        class="absolute inset-0 z-10 bg-black overflow-hidden animate-in fade-in duration-300"
      >
        <!-- Native MP4 video preview (100% clean, no YouTube UI, no controls, seamless loop) -->
        <video
          :src="videoPreviewSource"
          autoplay
          muted
          loop
          playsinline
          class="w-full h-full object-cover pointer-events-none"
          @error="handleVideoError"
        />

        <!-- Transparent Shield: catches all mouse/click events so video never receives hover/click -->
        <div class="absolute inset-0 z-20 bg-transparent cursor-pointer"></div>
      </div>

      <!-- Top Badges Overlay (Cleanly hidden when video preview is playing) -->
      <div
        v-if="!isPlayingPreview"
        class="absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-1 pointer-events-none"
      >
        <div class="flex items-center gap-1.5">
          <span class="inline-flex items-center text-[10px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-black/85 text-slate-100 border border-white/20 shadow-md">
            {{ formatCategory(port.category) }}
          </span>
          <span
            v-if="isInstalledOnQuest"
            class="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/95 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-950/40"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Installed</span>
          </span>
        </div>

        <span
          :class="port.status === 'released'
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
            : 'bg-amber-950/90 text-amber-300 border-amber-500/40'"
          class="inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded border shadow-md"
        >
          <span
            :class="port.status === 'released' ? 'bg-emerald-400' : 'bg-amber-400'"
            class="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0"
          ></span>
          {{ formatStatus(port.status) }}
        </span>
      </div>

      <!-- Video trailer badge. On touch, tap opens the preview instead of following the card link. -->
      <span
        v-if="hasVideo && !isPlayingPreview"
        role="button"
        tabindex="0"
        class="absolute bottom-2 right-2 z-30 flex min-h-11 min-w-11 items-center justify-center gap-1 rounded border border-border bg-black/80 px-2 text-[10px] font-mono text-muted-foreground md:min-h-0 md:min-w-0 md:px-1.5 md:py-0.5"
        aria-label="Play preview"
        @click.stop.prevent="onPreviewTap"
        @keydown.enter.stop.prevent="onPreviewTap"
        @keydown.space.stop.prevent="onPreviewTap"
      >
        <svg class="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Preview</span>
      </span>
      <span
        v-else-if="hasVideo && isPlayingPreview"
        role="button"
        tabindex="0"
        class="absolute bottom-2 right-2 z-30 flex min-h-11 min-w-11 items-center justify-center rounded border border-border bg-black/80 px-2 text-[10px] font-mono text-white md:hidden"
        aria-label="Close preview"
        @click.stop.prevent="onPreviewTap"
      >
        Close
      </span>
    </div>

    <!-- Info Area -->
    <div class="p-3.5 flex-1 flex flex-col justify-between border-t border-border">
      <div class="space-y-2">
        <!-- Title & Developer -->
        <div>
          <h3 class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {{ port.title }}
          </h3>

          <div class="flex items-center justify-between gap-2 text-xs text-muted-foreground mt-0.5">
            <div class="flex items-center gap-1 min-w-0">
              <span class="text-muted-foreground/70">by</span>
              <span
                @click.stop.prevent="navigateToDev(port.developer)"
                class="inline-flex min-h-11 max-w-full items-center truncate font-medium transition-colors hover:text-foreground hover:underline md:min-h-0 md:inline"
                :title="`Filter ports by ${port.developer}`"
              >
                {{ port.developer }}
              </span>
            </div>

            <PortVersion
              v-if="displayVersion"
              :version="port.latest_version"
              class="max-w-[8.5rem] shrink text-[10px] text-muted-foreground"
            />
            <span v-else-if="formatRelativeTime(port.last_github_update)" class="text-[10px] font-mono text-muted-foreground shrink-0">
              {{ formatRelativeTime(port.last_github_update) }}
            </span>
          </div>
          <VerificationBadge
            :records="verifications"
            :slug="port.slug"
            :latest-version="port.latest_version"
          />
        </div>

        <!-- Description (compact 2-line preview) -->
        <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {{ port.short_description || 'Step-by-step installation guide and folder mappings for native Quest VR.' }}
        </p>

      </div>

      <!-- Hardware Badges & CTA Footer -->
      <div class="pt-2.5 mt-2.5 border-t border-border flex items-center justify-between gap-2">
        <div class="flex flex-wrap gap-1">
          <UiBadge
            v-for="hw in headsetLabels"
            :key="hw"
            variant="outline"
            class="text-[10px] font-mono py-0 px-1.5"
          >
            {{ hw }}
          </UiBadge>
        </div>

        <span
          v-if="isInstalledOnQuest"
          class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:underline"
        >
          <span>Manage Files</span>
          <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline"
        >
          <span>View Guide & Files</span>
          <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Port, PortCategory, PortStatus } from '~/types/port'
import type { PortVerification } from '~/lib/verification'
import { AVAILABLE_VIDEO_PREVIEWS, hasVideoPreview } from '~/data/videoPreviews'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { isPortInstalledOnQuest } from '~/data/portPackageMap'
import { formatPortVersion } from '~/lib/portVersion'
import { normalizeHeadsetList } from '~/lib/headsets'

const props = withDefaults(defineProps<{
  port: Port
  toPrefix?: string
  verifications?: PortVerification[] | null
}>(), {
  verifications: () => []
})

const questAdb = useQuestAdb()

const isInstalledOnQuest = computed(() => {
  if (!questAdb.isConnected.value) return false
  return isPortInstalledOnQuest(props.port.slug, questAdb.installedPackages.value)
})

const router = useRouter()
const navigateToDev = (dev: string) => {
  router.push(`/?dev=${encodeURIComponent(dev)}`)
}

const isPlayingPreview = ref(false)
let hoverTimer: ReturnType<typeof setTimeout> | null = null
const localVideoFailed = ref(false)

const hasVideo = computed(() => {
  return hasVideoPreview(props.port.slug, props.port.video_preview_url)
})

const videoPreviewSource = computed(() => {
  if (props.port.video_preview_url) return props.port.video_preview_url
  if (AVAILABLE_VIDEO_PREVIEWS.includes(props.port.slug) && !localVideoFailed.value) {
    return `/previews/${props.port.slug}.mp4`
  }
  return null
})

const handleVideoError = () => {
  localVideoFailed.value = true
  isPlayingPreview.value = false
}

const prefersHover = () => {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

const onPreviewTap = () => {
  if (!hasVideo.value) return
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  isPlayingPreview.value = !isPlayingPreview.value
}

const onMouseEnter = () => {
  if (!hasVideo.value || !prefersHover()) return
  // 350ms debounce so rapid page scrolling does not mount iframes
  hoverTimer = setTimeout(() => {
    isPlayingPreview.value = true
  }, 350)
}

const onMouseLeave = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  isPlayingPreview.value = false
}

onBeforeUnmount(() => {
  if (hoverTimer) clearTimeout(hoverTimer)
})

const formatRelativeTime = (dateStr?: string | null) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

const displayVersion = computed(() => formatPortVersion(props.port.latest_version))
const headsetLabels = computed(() => normalizeHeadsetList(props.port.supported_hardware))

const formatCategory = (cat: PortCategory) => {
  switch (cat) {
    case 'source_port': return 'Source Port'
    case 'decompilation': return 'Decomp'
    case 'engine_recreation': return 'Engine Recreation'
    case 'emulator': return 'Emulator'
    case 'wrapper': return 'Wrapper'
    case 'vr_injection': return 'VR Injection'
    case 'game_mod': return 'Game Mod'
    default: return cat
  }
}

const formatStatus = (status: PortStatus) => {
  switch (status) {
    case 'released': return 'Released'
    case 'playable_beta': return 'Beta'
    case 'in_development': return 'In Dev'
    default: return status
  }
}
</script>
