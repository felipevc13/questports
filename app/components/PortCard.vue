<template>
  <NuxtLink
    :to="`/ports/${port.slug}`"
    class="group flex flex-col bg-slate-900/90 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 block"
  >
    <!-- Steam Capsule Header (Exact 460x215 aspect ratio) -->
    <div class="relative aspect-[460/215] w-full overflow-hidden bg-slate-950">
      <img
        :src="port.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80'"
        :alt="port.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />
      
      <!-- Subtle bottom gradient overlay for readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none"></div>

      <!-- Top Badges Overlay -->
      <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
        <span 
          class="px-2 py-0.5 text-[11px] font-bold rounded-md shadow-md border backdrop-blur-md"
          :class="categoryBadgeStyle(port.category)"
        >
          {{ formatCategory(port.category) }}
        </span>

        <span 
          class="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-md border backdrop-blur-md"
          :class="statusBadgeStyle(port.status)"
        >
          {{ formatStatus(port.status) }}
        </span>
      </div>

      <!-- 6DoF Indicator Pill on cover -->
      <div v-if="port.has_6dof_controls" class="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/15 pointer-events-none">
        <svg class="w-3 h-3 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
        <span>6DoF Touch</span>
      </div>
    </div>

    <!-- Steam-like Info Area -->
    <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-slate-900/60 border-t border-white/5">
      <div>
        <!-- Title -->
        <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
          {{ port.title }}
        </h3>

        <!-- Developer Credit & Update Pill -->
        <div class="flex items-center justify-between text-xs text-slate-400 mb-2 gap-2">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="shrink-0 text-slate-500">by</span>
            <span
              @click.stop.prevent="navigateToDev(port.developer)"
              class="font-semibold text-cyan-300 hover:text-white hover:underline transition-colors cursor-pointer truncate"
              :title="`Filter ports by ${port.developer}`"
            >
              {{ port.developer }}
            </span>
          </div>

          <!-- Update / Version Badge -->
          <div
            v-if="port.latest_version || port.last_github_update"
            class="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded shadow-sm shrink-0 whitespace-nowrap"
            :title="`Version ${port.latest_version || 'Updated'}${port.last_github_update ? ' • ' + formatRelativeTime(port.last_github_update) : ''}`"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span class="font-bold">{{ formatVersion(port.latest_version) || 'Updated' }}</span>
            <span v-if="formatRelativeTime(port.last_github_update)" class="text-slate-400 hidden xl:inline">• {{ formatRelativeTime(port.last_github_update) }}</span>
          </div>
        </div>

        <!-- Description (compact 2-line preview) -->
        <p class="text-xs text-slate-300/80 line-clamp-2 leading-relaxed mb-3">
          {{ port.short_description || 'Complete installation guide and required original game files for standalone VR.' }}
        </p>
      </div>

      <!-- Hardware Tags & CTA Footer -->
      <div class="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
        <!-- Hardware Pills -->
        <div class="flex flex-wrap gap-1">
          <span
            v-for="hw in port.supported_hardware"
            :key="hw"
            class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10"
          >
            {{ hw }}
          </span>
        </div>

        <!-- Steam-like Action Pill -->
        <span class="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors shrink-0">
          <span>Guide</span>
          <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  let v = ver.trim()
  // Strip redundant repo name prefixes like winlatorxr_, ppsspp-, etc.
  v = v.replace(/^winlatorxr[_-]/i, '')
  if (v.length > 10) {
    v = v.slice(0, 9) + '…'
  }
  return v
}

const formatCategory = (cat: PortCategory) => {
  switch (cat) {
    case 'source_port': return 'Source Port'
    case 'vr_injection': return 'VR Injection'
    case 'emulator': return 'VR Emulator'
    case 'game_mod': return 'Game Mod'
    default: return cat
  }
}

const formatStatus = (status: PortStatus) => {
  switch (status) {
    case 'released': return 'Released'
    case 'playable_beta': return 'Playable Beta'
    case 'in_development': return 'In Dev (WIP)'
    default: return status
  }
}

const categoryBadgeStyle = (cat: PortCategory) => {
  switch (cat) {
    case 'source_port':
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    case 'vr_injection':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    case 'emulator':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    case 'game_mod':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/40'
  }
}

const statusBadgeStyle = (status: PortStatus) => {
  switch (status) {
    case 'released':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    case 'playable_beta':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    case 'in_development':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
  }
}
</script>
