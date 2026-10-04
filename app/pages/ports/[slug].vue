<template>
  <div v-if="port" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center justify-between text-xs text-slate-400">
      <NuxtLink to="/" class="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Database</span>
      </NuxtLink>

      <span class="font-mono text-slate-500">ID: {{ port.slug }}</span>
    </div>

    <!-- Header Section -->
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-3">
        <span 
          class="px-3 py-1 text-xs font-semibold rounded-lg border backdrop-blur-md"
          :class="categoryBadgeStyle(port.category)"
        >
          {{ formatCategory(port.category) }}
        </span>
        <span 
          class="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md border"
          :class="statusBadgeStyle(port.status)"
        >
          {{ formatStatus(port.status) }}
        </span>
        <span class="text-xs text-slate-400 font-mono">100% Standalone VR</span>
      </div>

      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
        {{ port.title }}
      </h1>

      <!-- Developer Info & Link -->
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-300">
        <span class="text-slate-400">Developed by:</span>
        <NuxtLink
          :to="`/?dev=${encodeURIComponent(port.developer)}`"
          class="font-bold text-cyan-300 hover:text-white hover:underline flex items-center gap-1.5"
          :title="`See all ports by ${port.developer}`"
        >
          <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>{{ port.developer }}</span>
        </NuxtLink>

        <a
          v-if="port.developer_url"
          :href="port.developer_url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors ml-2"
        >
          <span>Official Page / Support</span>
          <svg class="w-3.5 h-3.5 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <p class="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
        {{ port.short_description }}
      </p>
    </div>

    <!-- Media Showcase: YouTube Player or Cover Image -->
    <div class="relative w-full aspect-video rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl bg-black">
      <iframe
        v-if="port.youtube_video_id"
        :src="`https://www.youtube-nocookie.com/embed/${port.youtube_video_id}?autoplay=0&rel=0`"
        title="Gameplay / Devlog Video"
        class="w-full h-full"
        frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <img
        v-else
        :src="port.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1200&q=80'"
        :alt="port.title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Main Specs Grid & Action Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Specs & Guide -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Storage Path Box (Crucial Feature) -->
        <div v-if="port.internal_storage_path" class="p-5 rounded-2xl bg-gradient-to-r from-quest-card to-quest-surface border border-cyan-500/30 shadow-lg space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h3 class="text-sm font-bold text-white tracking-wide uppercase">Internal Storage Directory</h3>
            </div>
            <CopyButton :text="port.internal_storage_path" label="Copy Path" />
          </div>

          <div class="bg-black/60 p-3 rounded-xl border border-white/10 flex items-center justify-between font-mono text-sm text-cyan-300 overflow-x-auto">
            <code>{{ port.internal_storage_path }}</code>
          </div>
          <p class="text-xs text-slate-400">
            Connect your Quest via USB (or SideQuest file explorer) and place your original game files directly into this directory.
          </p>
        </div>

        <!-- Installation Guide (Rendered Markdown) -->
        <div class="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
          <div class="flex items-center gap-2 pb-4 border-b border-white/10">
            <svg class="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="text-xl font-bold text-white tracking-tight">Installation Guide</h2>
          </div>

          <!-- Parsed markdown content -->
          <div class="guide-content" v-html="renderedGuide"></div>
        </div>

        <!-- Troubleshooting Notes -->
        <div v-if="port.troubleshooting_notes" class="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm space-y-2">
          <div class="flex items-center gap-2 font-bold text-amber-400">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Troubleshooting & Tips</span>
          </div>
          <p class="text-xs leading-relaxed text-amber-200/90 pl-7">
            {{ port.troubleshooting_notes }}
          </p>
        </div>
      </div>

      <!-- Right Column: Specs Card & Download Buttons -->
      <div class="space-y-6">
        <!-- Direct Actions Card -->
        <div class="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 class="text-sm font-bold text-white tracking-wide uppercase">Direct Links</h3>

          <!-- Download Port / APK -->
          <a
            :href="port.port_download_url"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black shadow-glow-cyan transition-all"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Port ({{ port.port_download_source || 'APK' }})</span>
          </a>

          <!-- Base Game Store Link -->
          <a
            v-if="port.base_game_url"
            :href="port.base_game_url"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-semibold bg-quest-card hover:bg-quest-hover border border-white/10 text-slate-200 transition-colors"
          >
            <span>Base Game on {{ port.base_game_store || 'Store' }}</span>
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- Hardware & Feature Specs -->
        <div class="p-6 rounded-3xl glass-panel border border-white/10 space-y-5">
          <h3 class="text-sm font-bold text-white tracking-wide uppercase">Technical Specifications</h3>

          <!-- Supported Headsets -->
          <div>
            <span class="text-xs text-slate-400 block mb-2 font-mono">Supported Headsets:</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="hw in port.supported_hardware"
                :key="hw"
                class="px-2.5 py-1 text-xs font-mono rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
              >
                {{ hw }}
              </span>
            </div>
          </div>

          <!-- Locomotion Types -->
          <div>
            <span class="text-xs text-slate-400 block mb-2 font-mono">Locomotion:</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="loco in port.locomotion_types"
                :key="loco"
                class="px-2.5 py-1 text-xs font-mono rounded-lg bg-quest-card text-slate-300 border border-white/5"
              >
                {{ loco }}
              </span>
            </div>
          </div>

          <!-- Tracking & Controls -->
          <div class="pt-2 border-t border-white/5 space-y-2 text-xs">
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-400">Touch 6DoF Controllers:</span>
              <span class="text-emerald-400 font-semibold flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Native
              </span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-400">Requires PC to Play:</span>
              <span class="text-cyan-400 font-semibold">No (100% Standalone)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading / Not Found State -->
  <div v-else class="max-w-md mx-auto py-24 text-center space-y-4">
    <div class="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto"></div>
    <p class="text-slate-400 text-sm">Loading port details...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import type { Port, PortCategory, PortStatus } from '~/types/port'

const route = useRoute()
const slug = route.params.slug as string
const { fetchPortBySlug } = usePorts()

const { data: port } = await useAsyncData(`port-${slug}`, () => fetchPortBySlug(slug))

const renderedGuide = computed(() => {
  if (!port.value || !port.value.installation_guide) {
    return '<p class="text-slate-400">No installation tutorial registered for this port yet.</p>'
  }
  return marked.parse(port.value.installation_guide)
})

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
