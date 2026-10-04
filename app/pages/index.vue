<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="relative pt-6 pb-10 text-center overflow-hidden">
      <!-- Glow ambient background -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full"></div>
      <div class="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-quest-purple/10 blur-[120px] pointer-events-none rounded-full"></div>

      <div class="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Zero PC Required • 100% Standalone Meta Quest</span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Ports, Emulators & Injections in <span class="bg-gradient-to-r from-cyan-400 via-sky-300 to-quest-purple bg-clip-text text-transparent">Native VR</span>
        </h1>

        <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The standalone VR directory to run PC and console classics natively on your Meta Quest hardware. Complete with folder mappings, file requirements, and step-by-step tutorials.
        </p>

        <!-- Search Input -->
        <div class="max-w-2xl mx-auto pt-2">
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-quest-purple rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
            <div class="relative flex items-center bg-quest-surface/90 border border-white/10 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-xl">
              <svg class="w-5 h-5 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by game name, engine, or port (e.g., Half-Life, Doom, Wolfenstein, Citra)..."
                class="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters & Catalog Section -->
    <section class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
      <!-- Filter Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/5">
        <!-- Category Filter Pills -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border"
            :class="selectedCategory === cat.id
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-glow-cyan'
              : 'bg-quest-card text-slate-300 hover:text-white hover:bg-quest-border border-white/5'"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Secondary Filters (Developer, Hardware & Status) -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Developer Filter -->
          <select
            v-model="selectedDeveloper"
            class="bg-quest-card text-xs text-slate-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Developers</option>
            <option v-for="dev in availableDevelopers" :key="dev" :value="dev">
              {{ dev }}
            </option>
          </select>

          <!-- Hardware Filter -->
          <select
            v-model="selectedHardware"
            class="bg-quest-card text-xs text-slate-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Headsets</option>
            <option value="Quest 2">Quest 2</option>
            <option value="Quest 3">Quest 3</option>
            <option value="Quest 3S">Quest 3S</option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="selectedStatus"
            class="bg-quest-card text-xs text-slate-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Statuses</option>
            <option value="released">Released</option>
            <option value="playable_beta">Playable Beta</option>
            <option value="in_development">In Development</option>
          </select>
        </div>
      </div>

      <!-- Results Count & Active Tags -->
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1">
        <div class="flex items-center gap-2">
          <span>Showing <strong>{{ filteredPorts.length }}</strong> {{ filteredPorts.length === 1 ? 'port' : 'ports' }}</span>
          
          <!-- Active Developer Badge -->
          <span 
            v-if="selectedDeveloper" 
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px]"
          >
            Dev: <strong>{{ selectedDeveloper }}</strong>
            <button @click="selectedDeveloper = ''" class="hover:text-white ml-0.5" title="Remove filter">✕</button>
          </span>
        </div>

        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="text-cyan-400 hover:text-cyan-300 underline font-medium"
        >
          Reset filters
        </button>
      </div>

      <!-- Grid of Cards -->
      <div v-if="filteredPorts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        <PortCard
          v-for="port in filteredPorts"
          :key="port.id"
          :port="port"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 px-4 rounded-3xl glass-panel border border-white/5 space-y-4">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-quest-card flex items-center justify-center text-slate-400 border border-white/10">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white">No ports found</h3>
        <p class="text-sm text-slate-400 max-w-sm mx-auto">
          Try adjusting your search query or switching the category and hardware filters above.
        </p>
        <button
          @click="resetFilters"
          class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black hover:bg-cyan-400 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Port } from '~/types/port'

const route = useRoute()
const router = useRouter()
const { fetchPorts } = usePorts()

const { data: portsData } = await useAsyncData('ports', () => fetchPorts())
const ports = computed(() => portsData.value || [])

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedStatus = ref<string>('')
const selectedHardware = ref<string>('')
const selectedDeveloper = ref<string>((route.query.dev as string) || '')

// Sync with URL query parameter (?dev=...)
watch(() => route.query.dev, (newDev) => {
  selectedDeveloper.value = (newDev as string) || ''
})

watch(selectedDeveloper, (newDev) => {
  if (newDev) {
    router.replace({ query: { ...route.query, dev: newDev } })
  } else {
    const query = { ...route.query }
    delete query.dev
    router.replace({ query })
  }
})

// Dynamically extract unique developers
const availableDevelopers = computed(() => {
  const devs = new Set<string>()
  ports.value.forEach(p => {
    if (p.developer) devs.add(p.developer)
  })
  return Array.from(devs).sort()
})

const categories = [
  { id: 'all', label: 'All' },
  { id: 'source_port', label: 'Source Ports' },
  { id: 'vr_injection', label: 'VR Injections' },
  { id: 'emulator', label: 'VR Emulators' },
  { id: 'game_mod', label: 'Game Mods' }
]

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== '' ||
    selectedCategory.value !== 'all' ||
    selectedStatus.value !== '' ||
    selectedHardware.value !== '' ||
    selectedDeveloper.value !== ''
  )
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedStatus.value = ''
  selectedHardware.value = ''
  selectedDeveloper.value = ''
  router.replace({ query: {} })
}

const filteredPorts = computed(() => {
  return ports.value.filter(port => {
    // Search query match (title, description, slug, or developer)
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const titleMatch = port.title.toLowerCase().includes(q)
      const descMatch = (port.short_description || '').toLowerCase().includes(q)
      const slugMatch = port.slug.toLowerCase().includes(q)
      const devMatch = (port.developer || '').toLowerCase().includes(q)
      if (!titleMatch && !descMatch && !slugMatch && !devMatch) return false
    }

    // Developer match
    if (selectedDeveloper.value && port.developer !== selectedDeveloper.value) {
      return false
    }

    // Category match
    if (selectedCategory.value !== 'all' && port.category !== selectedCategory.value) {
      return false
    }

    // Status match
    if (selectedStatus.value && port.status !== selectedStatus.value) {
      return false
    }

    // Hardware match
    if (selectedHardware.value && !port.supported_hardware.includes(selectedHardware.value)) {
      return false
    }

    return true
  })
})
</script>
