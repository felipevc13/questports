<template>
  <div class="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/5 hover:border-cyan-500/40 transition-all duration-300">
    <!-- Card Cover Banner -->
    <div class="relative aspect-video w-full overflow-hidden bg-slate-900">
      <img
        :src="port.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80'"
        :alt="port.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />
      
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-quest-card via-quest-card/40 to-transparent"></div>

      <!-- Category & Status Badges -->
      <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
        <span 
          class="px-2.5 py-1 text-xs font-semibold rounded-lg shadow-md border backdrop-blur-md"
          :class="categoryBadgeStyle(port.category)"
        >
          {{ formatCategory(port.category) }}
        </span>

        <span 
          class="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-md border backdrop-blur-md"
          :class="statusBadgeStyle(port.status)"
        >
          {{ formatStatus(port.status) }}
        </span>
      </div>

      <!-- 6DoF Indicator Pill -->
      <div v-if="port.has_6dof_controls" class="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-white/10">
        <svg class="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
        <span>6DoF Touch</span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <!-- Title -->
        <h3 class="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
          {{ port.title }}
        </h3>

        <!-- Developer Credit -->
        <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <span>by</span>
          <NuxtLink
            :to="`/?dev=${encodeURIComponent(port.developer)}`"
            @click.stop
            class="font-semibold text-cyan-300 hover:text-white hover:underline transition-colors"
            :title="`Filter ports by ${port.developer}`"
          >
            {{ port.developer }}
          </NuxtLink>
        </div>

        <!-- Description -->
        <p class="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {{ port.short_description || 'Complete installation guide and required original game files for standalone VR.' }}
        </p>

        <!-- Hardware Tags -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          <span
            v-for="hw in port.supported_hardware"
            :key="hw"
            class="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10"
          >
            {{ hw }}
          </span>
        </div>
      </div>

      <!-- Footer & Action -->
      <div class="pt-4 border-t border-white/5">
        <!-- Detail / Guide Link -->
        <NuxtLink
          :to="`/ports/${port.slug}`"
          class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase bg-quest-border hover:bg-cyan-500 hover:text-black text-white transition-all duration-200 border border-white/10 hover:border-transparent group-hover:shadow-glow-cyan"
        >
          <span>View Guide & Specs</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Port, PortCategory, PortStatus } from '~/types/port'

defineProps<{
  port: Port
}>()

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
