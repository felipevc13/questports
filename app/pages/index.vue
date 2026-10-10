<template>
  <div class="space-y-8">
    <!-- Hero Section: Clean, Direct, High Signal -->
    <section class="border-b border-border bg-card/30 pb-3 pt-4 md:pb-6 md:pt-8">
      <div class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div class="space-y-2 max-w-3xl md:space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <UiBadge variant="outline" class="max-w-full whitespace-normal font-mono text-xs">
                {{ headsetSummary }}
              </UiBadge>
              <UiBadge variant="success" class="text-xs">
                Zero PC Required
              </UiBadge>
            </div>

            <h1 class="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
              Standalone VR Ports & Emulators
            </h1>

            <p class="text-sm leading-relaxed text-muted-foreground line-clamp-2 md:line-clamp-none md:text-base">
              Open-source directory of classic PC and console games running natively on Meta Quest hardware. Storage paths, APK links, and step-by-step installation guides. A port is marked Verified only when a headset check of that version is on record.
            </p>
          </div>

          <!-- Quick Stats Counter -->
          <div class="flex items-center gap-4 border-t border-border pt-3 text-xs font-mono md:gap-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div>
              <div class="text-xl font-bold text-foreground md:text-2xl">{{ ports.length }}</div>
              <div class="text-muted-foreground">Indexed Ports</div>
            </div>
            <div>
              <div class="text-xl font-bold text-emerald-400 md:text-2xl">100%</div>
              <div class="text-muted-foreground">Free & Open</div>
            </div>
            <div>
              <div class="text-xl font-bold text-primary md:text-2xl">6DoF</div>
              <div class="text-muted-foreground">Motion VR</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Catalog Section -->
    <section class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 space-y-5 max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <!-- Search & Filters Toolbar -->
      <div class="max-md:sticky max-md:top-14 max-md:z-40 max-md:-mx-4 max-md:border-x-0 max-md:bg-background/95 max-md:px-4 max-md:py-2 max-md:backdrop-blur space-y-3 rounded-lg border border-border bg-card p-3.5 md:static">
        <!-- Row 1: Search & Category Filter Pills -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="flex w-full min-w-0 flex-1 items-center gap-2 md:max-w-md">
            <div class="relative min-w-0 flex-1">
            <svg class="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              enterkeyhint="search"
              placeholder="Search by game, engine, or developer..."
              aria-label="Search ports"
              class="w-full min-h-11 rounded-md border border-border bg-muted/80 py-2.5 pl-9 pr-11 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring md:min-h-0 md:py-1.5 md:pr-8 md:text-sm"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-xs text-muted-foreground hover:text-foreground md:right-1 md:h-8 md:w-8"
              aria-label="Clear search"
            >
              ✕
            </button>
            </div>
            <button
              type="button"
              class="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md border border-border bg-muted/80 px-3 text-sm font-medium text-foreground md:hidden"
              @click="filtersOpen = true"
            >
              <span>Filters</span>
              <span v-if="sheetFilterCount" class="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">{{ sheetFilterCount }}</span>
            </button>
          </div>

          <!-- Category Buttons -->
          <div class="hidden md:flex md:flex-wrap items-center gap-1.5">
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

        <!-- Row 2: Secondary Dropdowns & View Mode Toggle (desktop) -->
        <div class="hidden md:flex md:flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/60">
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
                data-testid="headset-filter"
                aria-label="Headset"
                class="appearance-none bg-muted/80 text-xs text-foreground border border-border rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
              >
                <option value="">All Headsets</option>
                <option v-for="headset in headsetOptions" :key="headset" :value="headset">
                  {{ headset }}
                </option>
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

          <!-- View Mode Toggle: Grid vs Dense Table. Hidden below md so the wide table cannot widen the page. -->
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
        <div class="flex max-w-full flex-wrap items-center gap-1 self-start rounded-md border border-border bg-card/90 p-1 sm:self-auto">
          <button
            @click="questFilter = 'all'"
            class="min-h-11 rounded px-2.5 py-1 text-xs transition-colors cursor-pointer select-none md:min-h-0"
            :class="questFilter === 'all' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          >
            All ({{ ports.length }})
          </button>
          <button
            @click="questFilter = 'installed'"
            class="flex min-h-11 items-center gap-1.5 rounded px-2.5 py-1 text-xs transition-colors cursor-pointer select-none md:min-h-0"
            :class="questFilter === 'installed' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          >
            <span class="md:hidden">On Quest</span>
            <span class="hidden md:inline">Installed on Quest</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="questFilter === 'installed' ? 'bg-emerald-700 text-white' : 'bg-emerald-500/20 text-emerald-400'">
              {{ installedPortsCount }}
            </span>
          </button>
          <button
            @click="questFilter = 'not_installed'"
            class="min-h-11 rounded px-2.5 py-1 text-xs transition-colors cursor-pointer select-none md:min-h-0"
            :class="questFilter === 'not_installed' ? 'bg-secondary text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          >
            <span class="md:hidden">Not on Quest ({{ ports.length - installedPortsCount }})</span>
            <span class="hidden md:inline">Not Installed ({{ ports.length - installedPortsCount }})</span>
          </button>
        </div>
      </div>

      <!-- Results Count & Active Tags -->
      <div ref="resultsAnchor" class="flex scroll-mt-36 items-center justify-between gap-2 text-xs text-muted-foreground px-0.5">
        <div class="min-w-0">
          Showing <strong>{{ filteredPorts.length }}</strong> {{ filteredPorts.length === 1 ? 'port' : 'ports' }}
          <span v-if="selectedDeveloper" class="ml-2 font-mono">
            filtered by <strong>{{ selectedDeveloper }}</strong>
          </span>
          <span v-if="questAdb.isConnected.value && questFilter !== 'all'" class="ml-2 font-mono text-emerald-400">
            ({{ questFilter === 'installed' ? 'Installed only' : 'Not installed only' }})
          </span>
        </div>
        <div class="relative inline-flex shrink-0 items-center md:hidden">
          <select
            v-model="sortBy"
            aria-label="Sort"
            class="h-11 appearance-none rounded-md border border-border bg-muted/80 pl-2.5 pr-7 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="recent">Recent</option>
            <option value="az">A–Z</option>
            <option value="featured">Featured</option>
          </select>
          <svg class="pointer-events-none absolute right-2 h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- View 1: Grid of Cards. On phones, table mode still renders cards so the page cannot grow sideways. -->
      <div
        v-if="filteredPorts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        :class="viewMode === 'table' ? 'md:hidden' : ''"
      >
        <PortCard
          v-for="(port, index) in filteredPorts"
          :key="port.id"
          :port="port"
          :eager="index < 4"
          :verifications="verificationRecords"
          :class="index >= mobileVisible ? 'max-md:hidden' : ''"
        />
      </div>

      <div v-if="filteredPorts.length > mobileVisible" class="md:hidden">
        <button
          type="button"
          class="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-card text-sm font-semibold text-foreground"
          @click="loadMore"
        >
          Load more
        </button>
      </div>

      <!-- View 2: High-Density Table (SteamDB / ProtonDB style) -->
      <div v-if="viewMode === 'table' && filteredPorts.length > 0" class="hidden border border-border rounded-lg overflow-hidden bg-card md:block min-w-0 max-w-full">
        <div class="overflow-x-auto max-w-full min-w-0 [contain:inline-size]">
          <table class="w-full text-xs">
            <thead class="bg-muted/60 text-muted-foreground border-b border-border font-medium">
              <tr>
                <th class="py-2.5 px-3 text-left">Game / Port</th>
                <th class="py-2.5 px-3 text-left">Category</th>
                <th class="py-2.5 px-3 text-left">Developer</th>
                <th class="py-2.5 px-3 text-left">Version</th>
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
                      :src="coverThumbUrl(port.cover_image_url, mediaBase)"
                      :alt="port.title"
                      width="40"
                      height="24"
                      class="w-10 h-6 object-cover rounded shrink-0 bg-muted"
                      loading="lazy"
                      decoding="async"
                      @error="useFullCover"
                    />
                    <span class="font-semibold hover:text-primary transition-colors flex flex-wrap items-center gap-1.5">
                      {{ port.title }}
                      <span
                        v-if="isPortInstalled(port.slug)"
                        class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-normal"
                      >
                        Installed ✓
                      </span>
                      <VerificationBadge
                        class="!ml-0"
                        variant="inline"
                        :records="verificationRecords"
                        :slug="port.slug"
                        :latest-version="port.latest_version"
                        :install-count="port.installs ?? 0"
                      />
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

                <!-- Version -->
                <td class="py-2 px-3 whitespace-nowrap">
                  <PortVersion
                    v-if="formatPortVersion(port.latest_version)"
                    :version="port.latest_version"
                    class="max-w-[14rem] text-[11px] text-muted-foreground"
                  />
                  <span v-else class="text-muted-foreground/40">—</span>
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
                    {{ normalizeHeadsetList(port.supported_hardware).join(', ') }}
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
      <div v-if="filteredPorts.length === 0" class="text-center py-16 px-4 rounded-lg border border-border bg-card space-y-3">
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

      <button
        v-if="showBackToTop"
        type="button"
        class="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-40 inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-lg md:hidden"
        @click="scrollToTop"
      >
        Back to top
      </button>

      <div v-if="filtersOpen" class="fixed inset-0 z-[60] md:hidden">
        <button type="button" class="absolute inset-0 bg-black/70" aria-label="Close filters" @click="filtersOpen = false"></button>
        <div class="absolute inset-x-0 bottom-0 max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-t-xl border border-border bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl">
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2 class="text-base font-semibold text-foreground">Filters</h2>
            <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground" aria-label="Close filters" @click="filtersOpen = false">✕</button>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="`sheet-${cat.id}`"
              type="button"
              class="min-h-11 rounded-md border px-3 text-sm"
              :class="selectedCategory === cat.id
                ? 'border-primary bg-primary font-bold text-primary-foreground'
                : 'border-border bg-muted/40 text-muted-foreground'"
              @click="selectedCategory = cat.id"
            >
              {{ cat.label }}
            </button>
          </div>

          <div class="mt-4 space-y-3">
            <label class="block space-y-1 text-sm text-foreground">
              <span>Developer</span>
              <select v-model="selectedDeveloper" class="w-full rounded-md border border-border bg-muted/80 px-3 text-base">
                <option value="">All Developers</option>
                <option v-for="dev in availableDevelopers" :key="`m-${dev}`" :value="dev">{{ dev }}</option>
              </select>
            </label>
            <label class="block space-y-1 text-sm text-foreground">
              <span>Headset</span>
              <select v-model="selectedHardware" aria-label="Headset" class="w-full rounded-md border border-border bg-muted/80 px-3 text-base">
                <option value="">All Headsets</option>
                <option v-for="headset in headsetOptions" :key="`m-${headset}`" :value="headset">{{ headset }}</option>
              </select>
            </label>
            <label class="block space-y-1 text-sm text-foreground">
              <span>Status</span>
              <select v-model="selectedStatus" class="w-full rounded-md border border-border bg-muted/80 px-3 text-base">
                <option value="">All Statuses</option>
                <option value="released">Released</option>
                <option value="playable_beta">Playable Beta</option>
                <option value="in_development">In Development</option>
              </select>
            </label>
          </div>

          <div class="mt-4 flex flex-col gap-2">
            <button
              v-if="sheetFilterCount"
              type="button"
              class="min-h-11 rounded-md text-sm font-medium text-primary"
              @click="resetSheetFilters"
            >
              Reset filters
            </button>
            <button
              type="button"
              class="min-h-11 rounded-md bg-primary text-sm font-semibold text-primary-foreground"
              @click="filtersOpen = false"
            >
              Show {{ filteredPorts.length }} {{ filteredPorts.length === 1 ? 'port' : 'ports' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Port, PortCategory, PortStatus } from '~/types/port'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { isPortInstalledOnQuest } from '~/data/portPackageMap'
import { formatPortVersion } from '~/lib/portVersion'
import { headsetFilterOptions, normalizeHeadsetList, portSupportsHeadset } from '~/lib/headsets'
import { coverThumbUrl } from '~/data/coverUrl'
import { useTrack } from '~/composables/useTrack'

const mediaBase = computed(() => String(useRuntimeConfig().public.mediaBase || ''))
const route = useRoute()
const router = useRouter()
const { track } = useTrack()
const { fetchPorts } = usePorts()
const suggestModal = useSuggestModal()
const questAdb = useQuestAdb()

const { data: portsData } = await useAsyncData('ports', () => fetchPorts())
const ports = computed(() => portsData.value || [])

const { data: verificationData } = await useAsyncData('port-verifications', () => fetchVerificationRecords())
const verificationRecords = computed(() => verificationData.value || [])

const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCategory = ref<string>('all')
const selectedStatus = ref<string>('')
const selectedHardware = ref<string>('')
const selectedDeveloper = ref<string>((route.query.dev as string) || '')
const questFilter = ref<'all' | 'installed' | 'not_installed'>('all')
const sortBy = ref<'recent' | 'az' | 'featured'>('recent')
const viewMode = ref<'grid' | 'table'>('grid')
const filtersOpen = ref(false)
const mobileVisible = ref(12)
const MOBILE_PAGE = 12
const resultsAnchor = ref<HTMLElement | null>(null)
const showBackToTop = ref(false)

const sheetFilterCount = computed(() => {
  let count = 0
  if (selectedCategory.value !== 'all') count += 1
  if (selectedStatus.value) count += 1
  if (selectedHardware.value) count += 1
  if (selectedDeveloper.value) count += 1
  return count
})

const loadMore = () => {
  mobileVisible.value += MOBILE_PAGE
}

const resetSheetFilters = () => {
  selectedCategory.value = 'all'
  selectedStatus.value = ''
  selectedHardware.value = ''
  selectedDeveloper.value = ''
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const onScroll = () => {
  showBackToTop.value = window.scrollY > 700
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') filtersOpen.value = false
}

const useFullCover = (event: Event) => {
  const img = event.target as HTMLImageElement | null
  if (!img || img.dataset.full === '1') return
  const card = img.closest('tr')
  const title = img.alt
  const match = ports.value.find(port => port.title === title)
  img.dataset.full = '1'
  img.src = match?.cover_image_url || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=120&q=70'
  void card
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
let searchTrackTimer: ReturnType<typeof setTimeout> | undefined

const trackFilter = (filter: string, value: string) => {
  if (!value || value === 'all' || value === 'recent') return
  track('filter_used', { path: route.path, props: { filter, value } })
}

onUnmounted(() => {
  if (searchTrackTimer) clearTimeout(searchTrackTimer)
  if (!import.meta.client) return
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})

watch([searchQuery, selectedCategory, selectedStatus, selectedHardware, selectedDeveloper, sortBy, questFilter], () => {
  mobileVisible.value = MOBILE_PAGE
})

watch(searchQuery, async (value) => {
  if (!import.meta.client || !value.trim()) return
  if (window.matchMedia('(min-width: 768px)').matches) return
  await nextTick()
  resultsAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

watch(selectedCategory, (value) => trackFilter('category', value))
watch(selectedStatus, (value) => trackFilter('status', value))
watch(selectedHardware, (value) => trackFilter('hardware', value))
watch(selectedDeveloper, (value) => trackFilter('developer', value))
watch(questFilter, (value) => trackFilter('quest', value))
watch(sortBy, (value) => trackFilter('sort', value))

watch(searchQuery, (value) => {
  if (searchTrackTimer) clearTimeout(searchTrackTimer)
  const query = value.trim()
  if (!query) return
  searchTrackTimer = setTimeout(() => {
    track('search', { path: route.path, props: { q: query, length: query.length } })
    if (filteredPorts.value.length === 0) {
      track('search_no_results', { path: route.path, props: { q: query } })
    }
  }, 600)
})

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

watch(() => route.query.q, (q) => {
  searchQuery.value = typeof q === 'string' ? q : ''
})

const headsetOptions = computed(() => headsetFilterOptions(ports.value.map(port => port.supported_hardware)))
const headsetSummary = computed(() => headsetOptions.value.join(' • ') || 'Quest headsets')

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
    list = list.filter(p => portSupportsHeadset(p.supported_hardware, selectedHardware.value))
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
