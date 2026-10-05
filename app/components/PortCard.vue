<template>
  <NuxtLink
    :to="`/ports/${port.slug}`"
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

      <!-- Top Badges Overlay -->
      <div class="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
        <UiBadge variant="secondary" class="text-[10px] uppercase font-mono tracking-wider backdrop-blur-sm">
          {{ formatCategory(port.category) }}
        </UiBadge>

        <UiBadge :variant="port.status === 'released' ? 'success' : 'secondary'" class="text-[10px] font-mono backdrop-blur-sm">
          {{ formatStatus(port.status) }}
        </UiBadge>
      </div>

      <!-- Video trailer badge if available -->
      <div v-if="port.youtube_video_id" class="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-muted-foreground border border-border">
        <svg class="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Video</span>
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

        <!-- Standardized Feature Checklist (Requested by Discord Community) -->
        <div class="grid grid-cols-2 gap-1 py-1.5 px-2 rounded bg-muted/40 border border-border/60 text-[11px] font-mono">
          <!-- 6DoF Status -->
          <div class="flex items-center gap-1.5">
            <span :class="port.has_6dof_controls ? 'text-emerald-400' : 'text-muted-foreground/50'">
              {{ port.has_6dof_controls ? '✓' : '✗' }}
            </span>
            <span :class="port.has_6dof_controls ? 'text-foreground' : 'text-muted-foreground/60'">
              6DoF Head
            </span>
          </div>

          <!-- Motion Controls Status -->
          <div class="flex items-center gap-1.5">
            <span :class="port.has_6dof_controls ? 'text-emerald-400' : 'text-muted-foreground/50'">
              {{ port.has_6dof_controls ? '✓' : '✗' }}
            </span>
            <span :class="port.has_6dof_controls ? 'text-foreground' : 'text-muted-foreground/60'">
              {{ port.has_6dof_controls ? 'Touch Controls' : 'Gamepad' }}
            </span>
          </div>

          <!-- Stereo 3D Status -->
          <div class="flex items-center gap-1.5">
            <span class="text-emerald-400">✓</span>
            <span class="text-foreground">Stereo 3D</span>
          </div>

          <!-- Native Standalone -->
          <div class="flex items-center gap-1.5">
            <span class="text-emerald-400">✓</span>
            <span class="text-foreground">Zero PC</span>
          </div>
        </div>
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

defineProps<{
  port: Port
}>()

const router = useRouter()
const navigateToDev = (dev: string) => {
  router.push(`/?dev=${encodeURIComponent(dev)}`)
}

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
