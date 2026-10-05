<template>
  <NuxtLink
    :to="`/ports/${port.slug}`"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    class="group flex flex-col bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors block text-card-foreground"
  >
    <!-- Steam Capsule Header (460x215 aspect ratio) -->
    <div class="relative aspect-[460/215] w-full overflow-hidden bg-muted">
      <img
        :src="port.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80'"
        :alt="port.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        loading="lazy"
      />

      <!-- Dark gradient at the bottom for text contrast -->
      <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30 pointer-events-none"></div>

      <!-- Top dark vignette to guarantee badge contrast on white/bright covers -->
      <div class="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none"></div>

      <!-- Hover Video Preview Overlay (Autoplays selected VR gameplay frames on hover) -->
      <div
        v-if="isPlayingPreview"
        class="absolute inset-0 z-10 bg-black overflow-hidden animate-in fade-in duration-300"
      >
        <!-- Native MP4/WebM video if provided -->
        <video
          v-if="port.video_preview_url"
          :src="port.video_preview_url"
          autoplay
          muted
          loop
          playsinline
          class="w-full h-full object-cover pointer-events-none"
        />

        <!-- YouTube Embed Snippet with cropped borders -->
        <iframe
          v-else-if="previewEmbedUrl"
          :src="previewEmbedUrl"
          class="w-full h-full object-cover pointer-events-none scale-[1.35] -translate-y-1 select-none"
          frameborder="0"
          allow="autoplay; encrypted-media"
          tabindex="-1"
        />

        <!-- Transparent Shield: catches all mouse/click events so YouTube iframe never receives hover/click or displays pause icons -->
        <div class="absolute inset-0 z-10 bg-transparent cursor-pointer"></div>
      </div>

      <!-- Preview Indicator Badge -->
      <div
        v-if="isPlayingPreview"
        class="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/90 text-[10px] font-mono text-emerald-400 border border-emerald-500/40 shadow-md pointer-events-none animate-in fade-in duration-200"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-semibold uppercase tracking-wider text-[9px]">VR Preview</span>
      </div>

      <!-- Top Badges Overlay -->
      <div class="absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-1 pointer-events-none">
        <span class="inline-flex items-center text-[10px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-black/85 text-slate-100 border border-white/20 shadow-md">
          {{ formatCategory(port.category) }}
        </span>

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

      <!-- Video trailer badge if available (hidden when preview is active) -->
      <div
        v-if="port.youtube_video_id && !isPlayingPreview"
        class="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-muted-foreground border border-border"
      >
        <svg class="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Preview</span>
      </div>
    </div>

    <!-- Info Area -->
    <div class="p-3.5 flex-1 flex flex-col justify-between border-t border-border">
      <div class="space-y-2">
        <!-- Title & Developer -->
        <div>
          <h3 class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {{ port.title }}
          </h3>

          <div class="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
            <div class="flex items-center gap-1 min-w-0">
              <span class="text-muted-foreground/70">by</span>
              <span
                @click.stop.prevent="navigateToDev(port.developer)"
                class="font-medium hover:text-foreground hover:underline transition-colors cursor-pointer truncate"
                :title="`Filter ports by ${port.developer}`"
              >
                {{ port.developer }}
              </span>
            </div>

            <!-- Version / Update Tag -->
            <span v-if="port.latest_version" class="text-[10px] font-mono text-muted-foreground shrink-0">
              v{{ formatVersion(port.latest_version) }}
            </span>
            <span v-else-if="formatRelativeTime(port.last_github_update)" class="text-[10px] font-mono text-muted-foreground shrink-0">
              {{ formatRelativeTime(port.last_github_update) }}
            </span>
          </div>
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
            v-for="hw in port.supported_hardware"
            :key="hw"
            variant="outline"
            class="text-[10px] font-mono py-0 px-1.5"
          >
            {{ hw }}
          </UiBadge>
        </div>

        <span class="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
          <span>View</span>
          <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Port, PortCategory, PortStatus } from '~/types/port'

const props = defineProps<{
  port: Port
}>()

const router = useRouter()
const navigateToDev = (dev: string) => {
  router.push(`/?dev=${encodeURIComponent(dev)}`)
}

// Curated gameplay timestamps (start & end in seconds) where active VR gameplay begins
const CURATED_TIMESTAMPS: Record<string, { start: number; end: number }> = {
  'IWM7vi_OP6E': { start: 16, end: 23 }, // RTCWQuest
  '-Fa1ce9x88Y': { start: 20, end: 27 }, // Lambda1VR
  'y2y9C0E2kPk': { start: 15, end: 22 }, // Doom3Quest
  'vMBsdsAICSY': { start: 12, end: 19 }, // QuestZDoom
  'OoNCvmUxUFE': { start: 10, end: 17 }, // Quake2Quest
  'ToM-wz3v-NU': { start: 25, end: 32 }, // Jedi Outcast (JKXR)
  'qByCUtT6WG0': { start: 18, end: 25 }, // Jedi Academy
  'e8KZmDCdPb4': { start: 30, end: 37 }, // Prey VR
  'aTtOlcLPbCs': { start: 14, end: 21 }, // Half-Life 2 VR
  'BYz7r7q65sk': { start: 12, end: 19 }, // GoldenEye VR
  'PomiV1iyTp8': { start: 22, end: 29 }, // PrimedGun (Metroid Prime)
  '5ivdcCWly54': { start: 14, end: 21 }, // Time Crisis VR
  'wKyfjeuv46o': { start: 18, end: 25 }, // Qualyx (Half-Life Alyx)
  'y3dgEeDW5Xw': { start: 16, end: 23 }, // GalaxyQuest (Mario Galaxy)
  'neSyrMRFs9c': { start: 12, end: 19 }, // AstroQuest
  'PGUc8b3VIu0': { start: 10, end: 17 }, // Road Rash
  'd_xUXZURdzM': { start: 15, end: 22 }, // Tomb Raider
  '1FXer9AHf68': { start: 18, end: 25 }, // Wind Waker
  'QzgDw8xEpeM': { start: 12, end: 19 }, // Superhot VR
  'UXMeylAkNGE': { start: 15, end: 22 }, // Counter-Strike VR
  'mFSmPcHQpLM': { start: 14, end: 21 }, // Quake 3 Arena
  'UnYhCfbw_bc': { start: 15, end: 22 }, // Duke Nukem 3D
  'JHW-FMm_c7c': { start: 15, end: 22 }, // Wrath: Aeon of Ruin
  'Nmlq5QxnVuM': { start: 20, end: 27 }, // Star Wars Squadrons
  '9OsjifuYZVg': { start: 15, end: 22 }  // Halo CE VR
}

const isPlayingPreview = ref(false)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

const previewEmbedUrl = computed(() => {
  if (!props.port.youtube_video_id) return ''
  const curated = CURATED_TIMESTAMPS[props.port.youtube_video_id]
  const start = props.port.video_preview_start ?? curated?.start ?? 15
  const end = props.port.video_preview_end ?? curated?.end ?? (start + 7)
  return `https://www.youtube-nocookie.com/embed/${props.port.youtube_video_id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${props.port.youtube_video_id}&start=${start}&end=${end}&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&autohide=1`
})

const onMouseEnter = () => {
  if (!props.port.youtube_video_id && !props.port.video_preview_url) return
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

const formatVersion = (ver?: string | null) => {
  if (!ver) return ''
  let v = ver.trim().replace(/^winlatorxr[_-]/i, '')
  if (v.length > 10) {
    v = v.slice(0, 9) + '…'
  }
  return v
}

const formatCategory = (cat: PortCategory) => {
  switch (cat) {
    case 'source_port': return 'Source Port'
    case 'vr_injection': return 'VR Injection'
    case 'emulator': return 'Emulator'
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
