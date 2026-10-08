<template>
  <div class="space-y-8">
    <!-- Hero Section: Clean, Direct, High Signal -->
    <section class="pt-8 pb-6 border-b border-border bg-card/30">
      <div class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-3 max-w-3xl">
            <div class="flex items-center gap-2">
              <UiBadge variant="outline" class="font-mono text-xs">
                Meta Quest 2 • 3 • 3S • Pro
              </UiBadge>
              <UiBadge variant="success" class="text-xs">
                Zero PC Required
              </UiBadge>
            </div>

            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Standalone VR Ports & Emulators
            </h1>

            <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Open-source directory of classic PC and console games running natively on Meta Quest hardware. Verified storage paths, APK links, and step-by-step installation guides.
            </p>
          </div>

          <!-- Quick Stats Counter -->
          <div class="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 text-xs font-mono">
            <div>
              <div class="text-2xl font-bold text-foreground">{{ ports.length }}</div>
              <div class="text-muted-foreground">Indexed Ports</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-emerald-400">100%</div>
              <div class="text-muted-foreground">Free & Open</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-primary">6DoF</div>
              <div class="text-muted-foreground">Motion VR</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Catalog Section -->
    <section class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 space-y-5">
      <!-- Search & Filters Toolbar -->
      <div class="p-3.5 rounded-lg border border-border bg-card space-y-3">
        <!-- Row 1: Search & Category Filter Pills -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="relative flex-1 max-w-md">
            <svg class="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by game, engine, or developer..."
              class="w-full pl-9 pr-8 py-1.5 bg-muted/80 border border-border rounded-md text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <!-- Category Buttons -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              class="px-3 py-1.5 rounded-md text-xs transition-colors border select-none cursor-pointer"
              :class="selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground border-primary font-bold shadow'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted border-border font-medium'"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- Row 2: Secondary Dropdowns & View Mode Toggle -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/60">
          <div class="flex flex-wrap items-center gap-2">
            <!-- Sort Filter -->
            <div class="relative inline-flex items-center">
              <select
                v-model="sortBy"
                class="appearance-none bg-muted/80 text-xs text-foreground border border-border rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
              >
                <option value="recent">⚡ Recently Updated</option>
                <option value="az">A–Z (Alphabetical)</option>
                <option value="featured">Featured First</option>
              </select>
              <svg class="w-3 h-3 text-muted-foreground absolute right-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Developer Filter -->
            <div class="relative inline-flex items-center">
              <select
                v-model="selectedDeveloper"
                class="appearance-none bg-muted/80 text-xs text-foreground border border-border rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
              >
                <option value="">All Developers</option>
                <option v-for="dev in availableDevelopers" :key="dev" :value="dev">
                  {{ dev }}
                </option>
              </select>
              <svg class="w-3 h-3 text-muted-foreground absolute right-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Hardware Filter -->
            <div class="relative inline-flex items-center">
              <select
                v-model="selectedHardware"
                class="appearance-none bg-muted/80 text-xs text-foreground border border-border rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
              >
                <option value="">All Headsets</option>
                <option value="Quest 2">Quest 2</option>
                <option value="Quest 3">Quest 3</option>
                <option value="Quest 3S">Quest 3S</option>
              </select>
              <svg class="w-3 h-3 text-muted-foreground absolute right-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Status Filter -->
            <div class="relative inline-flex items-center">
              <select
                v-model="selectedStatus"
                class="appearance-none bg-muted/80 text-xs text-foreground border border-border rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
              >
                <option value="">All Statuses</option>
                <option value="released">Released</option>
                <option value="playable_beta">Playable Beta</option>
                <option value="in_development">In Development</option>
              </select>
              <svg class="w-3 h-3 text-muted-foreground absolute right-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <button
              v-if="hasActiveFilters"
              @click="resetFilters"
              class="text-xs text-primary hover:underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          </div>

          <!-- View Mode Toggle: Grid vs Dense Table -->
          <div class="flex items-center gap-1 bg-muted/80 border border-border rounded-md p-0.5">
            <button
              @click="viewMode = 'grid'"
              class="p-1 rounded text-xs transition-colors cursor-pointer"
              :class="viewMode === 'grid' ? 'bg-secondary text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'"
              title="Grid View"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'table'"
              class="p-1 rounded text-xs transition-colors cursor-pointer"
              :class="viewMode === 'table' ? 'bg-secondary text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'"
              title="Dense Table View"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Quest Connected Library Banner & Quick Filter -->
      <div
        v-if="questAdb.isConnected.value"
        class="p-3 sm:p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200"
      >
        <div class="flex items-center gap-2.5">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"></div>
          <div>
            <div class="font-semibold text-foreground flex items-center gap-2">
              <span>{{ questAdb.deviceModel.value || 'Meta Quest' }} Library</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Connected
              </span>
            </div>
            <div class="text-[11px] text-muted-foreground mt-0.5">
              <strong class="text-emerald-400 font-medium">{{ installedPortsCount }}</strong> of {{ ports.length }} indexed ports installed on your headset
            </div>
          </div>
        </div>

        <!-- Quest Filter Segmented Control -->
        <div class="flex items-center gap-1 bg-card/90 border border-border rounded-md p-1 self-start sm:self-auto">
          <button
            @click="questFilter = 'all'"
            class="px-2.5 py-1 rounded text-xs transition-colors cursor-pointer select-none"
            :class="questFilter === 'all' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          >
            All ({{ ports.length }})
          </button>
          <button
            @click="questFilter = 'installed'"
            class="px-2.5 py-1 rounded text-xs transition-colors cursor-pointer select-none flex items-center gap-1.5"
            :class="questFilter === 'installed' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          >
            <span>Installed on Quest</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="questFilter === 'installed' ? 'bg-emerald-700 text-white' : 'bg-emerald-500/20 text-emerald-400'">
              {{ installedPortsCount }}
            </span>
          </button>
          <button
            @click="questFilter = 'not_installed'"
            class="px-2.5 py-1 rounded text-xs transition-colors cursor-pointer select-none"
            :class="questFilter === 'not_installed' ? 'bg-secondary text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          >
            Not Installed ({{ ports.length - installedPortsCount }})
          </button>
        </div>
      </div>

      <!-- Results Count & Active Tags -->
      <div class="flex items-center justify-between text-xs text-muted-foreground px-0.5">
        <div>
          Showing <strong>{{ filteredPorts.length }}</strong> {{ filteredPorts.length === 1 ? 'port' : 'ports' }}
          <span v-if="selectedDeveloper" class="ml-2 font-mono">
            filtered by <strong>{{ selectedDeveloper }}</strong>
          </span>
          <span v-if="questAdb.isConnected.value && questFilter !== 'all'" class="ml-2 font-mono text-emerald-400">
            ({{ questFilter === 'installed' ? 'Installed only' : 'Not installed only' }})
          </span>
        </div>
      </div>

      <!-- View 1: Grid of Cards -->
      <div v-if="viewMode === 'grid' && filteredPorts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <PortCard
          v-for="port in filteredPorts"
          :key="port.id"
          :port="port"
        />
      </div>

      <!-- View 2: High-Density Table (SteamDB / ProtonDB style) -->
      <div v-else-if="viewMode === 'table' && filteredPorts.length > 0" class="border border-border rounded-lg overflow-hidden bg-card">
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead class="bg-muted/60 text-muted-foreground border-b border-border font-medium">
              <tr>
                <th class="py-2.5 px-3 text-left">Game / Port</th>
                <th class="py-2.5 px-3 text-left">Category</th>
                <th class="py-2.5 px-3 text-left">Developer</th>
                <th class="py-2.5 px-3 text-center">6DoF</th>
                <th class="py-2.5 px-3 text-center">Controls</th>
                <th class="py-2.5 px-3 text-left">Hardware</th>
                <th class="py-2.5 px-3 text-left">Status</th>
                <th class="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="port in filteredPorts"
                :key="port.id"
                @click="navigateToPort(port.slug)"
                class="hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <!-- Title & Cover thumbnail -->
                <td class="py-2 px-3 font-medium text-foreground">
                  <div class="flex items-center gap-2.5">
                    <img
                      :src="port.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=120&q=80'"
                      :alt="port.title"
                      class="w-10 h-6 object-cover rounded shrink-0 bg-muted"
                      loading="lazy"
                    />
                    <span class="font-semibold hover:text-primary transition-colors flex items-center gap-1.5">
                      {{ port.title }}
                      <span
                        v-if="isPortInstalled(port.slug)"
                        class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-normal"
                      >
                        Installed ✓
                      </span>
                    </span>
                  </div>
                </td>

                <!-- Category -->
                <td class="py-2 px-3 text-muted-foreground whitespace-nowrap">
                  <UiBadge variant="secondary" class="text-[10px] font-mono">
                    {{ formatCategory(port.category) }}
                  </UiBadge>
                </td>

                <!-- Developer -->
                <td class="py-2 px-3 text-muted-foreground whitespace-nowrap">
                  {{ port.developer }}
                </td>

                <!-- 6DoF -->
                <td class="py-2 px-3 text-center font-mono">
                  <span :class="port.has_6dof_controls ? 'text-emerald-400 font-bold' : 'text-muted-foreground/40'">
                    {{ port.has_6dof_controls ? '✓ Yes' : '3DoF' }}
                  </span>
                </td>

                <!-- Controls -->
                <td class="py-2 px-3 text-center font-mono text-[11px]">
                  <span :class="port.has_6dof_controls ? 'text-emerald-400' : 'text-muted-foreground'">
                    {{ port.has_6dof_controls ? 'Touch' : 'Gamepad' }}
                  </span>
                </td>

                <!-- Hardware -->
                <td class="py-2 px-3 text-muted-foreground whitespace-nowrap">
                  <span class="font-mono text-[10px]">
                    {{ (port.supported_hardware || []).join(', ') }}
                  </span>
                </td>

                <!-- Status -->
                <td class="py-2 px-3 whitespace-nowrap">
                  <UiBadge :variant="port.status === 'released' ? 'success' : 'secondary'" class="text-[10px] font-mono">
                    {{ formatStatus(port.status) }}
                  </UiBadge>
                </td>

                <!-- Action Link -->
                <td class="py-2 px-3 text-right whitespace-nowrap">
                  <NuxtLink
                    :to="`/ports/${port.slug}`"
                    class="text-xs font-semibold hover:underline"
                    :class="isPortInstalled(port.slug) ? 'text-emerald-400' : 'text-primary'"
                  >
                    {{ isPortInstalled(port.slug) ? 'Manage Files →' : 'Guide →' }}
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 px-4 rounded-lg border border-border bg-card space-y-3">
        <h3 class="text-base font-semibold text-foreground">No ports found</h3>
        <p class="text-xs text-muted-foreground max-w-sm mx-auto">
          Try adjusting your search query or switching the category and hardware filters above.
        </p>
        <div class="flex items-center justify-center gap-2 pt-1">
          <UiButton
            variant="outline"
            size="sm"
            @click="resetFilters"
          >
            Clear Filters
          </UiButton>
          <UiButton
            size="sm"
            @click="suggestModal.open(searchQuery)"
          >
            Suggest {{ searchQuery ? `"${searchQuery}"` : 'a Game' }}
          </UiButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Port, PortCategory, PortStatus } from '~/types/port'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { isPortInstalledOnQuest } from '~/data/portPackageMap'

const route = useRoute()
const router = useRouter()
const { fetchPorts } = usePorts()
const suggestModal = useSuggestModal()
const questAdb = useQuestAdb()

const { data: portsData } = await useAsyncData('ports', () => fetchPorts())
const ports = computed(() => portsData.value || [])

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedStatus = ref<string>('')
const selectedHardware = ref<string>('')
const selectedDeveloper = ref<string>((route.query.dev as string) || '')
const questFilter = ref<'all' | 'installed' | 'not_installed'>('all')
const sortBy = ref<'recent' | 'az' | 'featured'>('recent')
const viewMode = ref<'grid' | 'table'>('grid')

const isPortInstalled = (slug: string) => {
  if (!questAdb.isConnected.value) return false
  return isPortInstalledOnQuest(slug, questAdb.installedPackages.value)
}

const installedPortsCount = computed(() => {
  if (!questAdb.isConnected.value) return 0
  return ports.value.filter(p => isPortInstalledOnQuest(p.slug, questAdb.installedPackages.value)).length
})

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
  { id: 'decompilation', label: 'Decomps' },
  { id: 'engine_recreation', label: 'Engine Recreations' },
  { id: 'emulator', label: 'Emulators' },
  { id: 'wrapper', label: 'Wrappers' },
  { id: 'vr_injection', label: 'VR Mods' }
]

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== '' ||
    selectedCategory.value !== 'all' ||
    selectedStatus.value !== '' ||
    selectedHardware.value !== '' ||
    selectedDeveloper.value !== '' ||
    questFilter.value !== 'all' ||
    sortBy.value !== 'recent'
  )
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedStatus.value = ''
  selectedHardware.value = ''
  selectedDeveloper.value = ''
  questFilter.value = 'all'
  sortBy.value = 'recent'
}

const navigateToPort = (slug: string) => {
  router.push(`/ports/${slug}`)
}

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

const filteredPorts = computed(() => {
  let list = [...ports.value]

  // Quest Library Filter (when headset is connected)
  if (questAdb.isConnected.value && questFilter.value !== 'all') {
    if (questFilter.value === 'installed') {
      list = list.filter(p => isPortInstalledOnQuest(p.slug, questAdb.installedPackages.value))
    } else if (questFilter.value === 'not_installed') {
      list = list.filter(p => !isPortInstalledOnQuest(p.slug, questAdb.installedPackages.value))
    }
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.developer.toLowerCase().includes(q) ||
      p.short_description?.toLowerCase().includes(q)
    )
  }

  if (selectedCategory.value !== 'all') {
    list = list.filter(p => p.category === selectedCategory.value)
  }

  if (selectedStatus.value) {
    list = list.filter(p => p.status === selectedStatus.value)
  }

  if (selectedHardware.value) {
    list = list.filter(p => p.supported_hardware?.includes(selectedHardware.value))
  }

  if (selectedDeveloper.value) {
    list = list.filter(p => p.developer.toLowerCase() === selectedDeveloper.value.toLowerCase())
  }

  if (sortBy.value === 'recent') {
    list.sort((a, b) => {
      const dateA = a.last_github_update ? new Date(a.last_github_update).getTime() : 0
      const dateB = b.last_github_update ? new Date(b.last_github_update).getTime() : 0
      return dateB - dateA
    })
  } else if (sortBy.value === 'az') {
    list.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'featured') {
    // Keep seed order
  }

  return list
})
</script>
