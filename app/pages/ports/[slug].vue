<template>
  <div v-if="port" class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
    <!-- Breadcrumb & Top Bar -->
    <div class="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/50">
      <NuxtLink to="/" class="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer font-medium">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Database</span>
      </NuxtLink>

      <div class="flex items-center gap-3">
        <a
          v-if="port.github_url"
          :href="port.github_url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>GitHub</span>
        </a>
        <span class="font-mono text-muted-foreground/80">ID: {{ port.slug }}</span>
      </div>
    </div>

    <!-- Header Section (Title & Meta) -->
    <div class="space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono uppercase bg-secondary text-secondary-foreground border border-border">
          {{ formatCategory(port.category) }}
        </span>
        <span
          :class="port.status === 'released' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border"
        >
          ● {{ formatStatus(port.status) }}
        </span>
        <span class="inline-flex items-center px-2 py-0.5 rounded border border-border text-xs font-mono text-muted-foreground">
          {{ isDirectApkOnly ? 'Zero PC Required' : 'Standalone VR' }}
        </span>
        <span v-if="port.latest_version" class="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-xs font-mono text-primary">
          {{ port.latest_version }}
        </span>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
          {{ port.title }}
        </h1>
        <div class="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground shrink-0">
          <span>Developed by</span>
          <NuxtLink
            :to="`/?dev=${encodeURIComponent(port.developer)}`"
            class="font-semibold text-foreground hover:text-primary hover:underline transition-colors"
          >
            {{ port.developer }}
          </NuxtLink>
          <a
            v-if="port.developer_url"
            :href="port.developer_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center text-xs text-primary hover:underline ml-1"
          >
            Official Page ↗
          </a>
        </div>
      </div>

      <!-- Port Short Description / Tagline -->
      <p class="text-sm text-muted-foreground max-w-4xl leading-relaxed pt-0.5">
        {{ port.short_description }}
      </p>
    </div>

    <!-- HERO SPLIT SECTION (Trailer/Media on Left, Action Hub on Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT HERO: Media Player + Feature Compatibility Matrix (7 Cols) -->
      <div class="lg:col-span-7 space-y-3">
        <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-black shadow-2xl">
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

        <!-- Enhanced VR Feature Matrix & Quick Badges with Dropdown -->
        <div class="rounded-xl border border-border/80 bg-card/60 overflow-hidden shadow-sm">
          <!-- Top Quick Badges Row (Always Visible) -->
          <div class="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-b border-border/40">
            <div class="p-2 rounded-lg bg-muted/20 border border-border/50">
              <div class="text-muted-foreground text-[10px] uppercase font-mono tracking-wider">Tracking</div>
              <div class="font-semibold flex items-center gap-1.5 text-emerald-400 mt-0.5">
                <span>✓ {{ port.has_6dof_controls ? '6DoF Roomscale' : '3DoF Seated' }}</span>
              </div>
            </div>

            <div class="p-2 rounded-lg bg-muted/20 border border-border/50">
              <div class="text-muted-foreground text-[10px] uppercase font-mono tracking-wider">VR Controls</div>
              <div class="font-semibold flex items-center gap-1.5 text-emerald-400 mt-0.5">
                <span>✓ Touch Motion 1:1</span>
              </div>
            </div>

            <div class="p-2 rounded-lg bg-muted/20 border border-border/50">
              <div class="text-muted-foreground text-[10px] uppercase font-mono tracking-wider">Left-Handed</div>
              <div class="font-semibold flex items-center gap-1.5 text-emerald-400 mt-0.5">
                <span>✓ Full Support</span>
              </div>
            </div>

            <div class="p-2 rounded-lg bg-muted/20 border border-border/50">
              <div class="text-muted-foreground text-[10px] uppercase font-mono tracking-wider">Physical Interaction</div>
              <div class="font-semibold flex items-center gap-1.5 text-emerald-400 mt-0.5">
                <span>✓ Holsters & Gestures</span>
              </div>
            </div>
          </div>

          <!-- Dropdown / Toggle Button -->
          <button
            @click="isFeaturesExpanded = !isFeaturesExpanded"
            class="w-full py-2.5 px-3.5 bg-muted/10 hover:bg-muted/30 transition-colors text-xs font-medium text-foreground flex items-center justify-between cursor-pointer border-t border-border/40"
          >
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span class="text-xs font-semibold">
                {{ isFeaturesExpanded ? 'Collapse Comfort & Ergonomics Details' : 'View All VR Features, Comfort & Ergonomics' }}
              </span>
              <span class="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                (Locomotion, Play Modes, 3D Audio, Headsets)
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-primary text-xs font-semibold">
              <span>{{ isFeaturesExpanded ? 'Hide' : 'Expand' }}</span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isFeaturesExpanded }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <!-- Expandable Detailed Tray -->
          <div v-if="isFeaturesExpanded" class="p-4 bg-muted/20 border-t border-border/60 space-y-4 animate-in fade-in duration-200">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <!-- Col 1: Controls & Accessibility -->
              <div class="space-y-2">
                <span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                  <span>🎮</span> Controls & Accessibility
                </span>
                <div class="space-y-1.5">
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium flex items-center justify-between">
                      <span>Left-Handed Support</span>
                      <span class="text-emerald-400 font-bold">✓ Full Support</span>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">Adapted weapon handling, holsters & menus</div>
                  </div>
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium flex items-center justify-between">
                      <span>Physical Interaction</span>
                      <span class="text-emerald-400 font-bold">✓ Yes</span>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">Waist holsters, two-handed grip & 1:1 physics</div>
                  </div>
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium flex items-center justify-between">
                      <span>Haptic Feedback</span>
                      <span class="text-emerald-400 font-bold">✓ Active</span>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">Haptic rumble on gun recoil and collisions</div>
                  </div>
                </div>
              </div>

              <!-- Col 2: Comfort & Locomotion -->
              <div class="space-y-2">
                <span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                  <span>🥽</span> Comfort & Locomotion
                </span>
                <div class="space-y-1.5">
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium">Locomotion Modes:</div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="loco in (port.locomotion_types || ['Smooth Locomotion', 'Snap Turn'])"
                        :key="loco"
                        class="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-mono"
                      >
                        {{ loco }}
                      </span>
                    </div>
                  </div>
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium flex items-center justify-between">
                      <span>Play Modes</span>
                      <span class="text-primary font-bold">3 Modes</span>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">Seated, Standing or Roomscale 360°</div>
                  </div>
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium flex items-center justify-between">
                      <span>Comfort Vignette (Anti-nausea)</span>
                      <span class="text-emerald-400 font-bold">✓ Adjustable</span>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">Optional peripheral blinders for turns & running</div>
                  </div>

                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium flex items-center justify-between">
                      <span>VR Comfort Rating</span>
                      <span
                        :class="comfortBadgeClass"
                        class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border"
                      >
                        {{ comfortRating }}
                      </span>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">Standard VR motion sickness rating</div>
                  </div>
                </div>
              </div>

              <!-- Col 3: Hardware & Performance -->
              <div class="space-y-2">
                <span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                  <span>⚡</span> Hardware & Audio
                </span>
                <div class="space-y-1.5">
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium">Supported Headsets:</div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="hw in (port.supported_hardware || ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'])"
                        :key="hw"
                        class="px-1.5 py-0.5 rounded border border-border text-[10px] font-mono text-foreground bg-muted/40"
                      >
                        {{ hw }}
                      </span>
                    </div>
                  </div>
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium flex items-center justify-between">
                      <span>Rendering</span>
                      <span class="text-emerald-400 font-bold">Native Stereo 3D</span>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">90Hz / 120Hz native on Snapdragon XR2</div>
                  </div>
                  <div class="p-2 rounded bg-card/80 border border-border/50">
                    <div class="text-[11px] text-foreground font-medium flex items-center justify-between">
                      <span>Spatial Audio</span>
                      <span class="text-emerald-400 font-bold">✓ Binaural 3D</span>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">Real-time 360° positional audio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT HERO: Unified Smart Action Card (5 Cols) -->
      <div class="lg:col-span-5 p-5 rounded-xl bg-card border border-border shadow-xl space-y-4">
        <!-- Headset Connection Status Pill -->
        <div class="flex items-center justify-between pb-3 border-b border-border">
          <div class="flex items-center gap-2">
            <span
              class="w-2.5 h-2.5 rounded-full"
              :class="isQuestConnected ? 'bg-emerald-400 animate-pulse' : connectChrome.showHeadsetBanner ? 'bg-amber-400 animate-pulse' : 'bg-zinc-500'"
            ></span>
            <span class="text-xs font-semibold text-foreground">
              {{ isQuestConnected ? (questDeviceModel || 'Meta Quest Connected') : connectChrome.showHeadsetBanner ? 'Authorizing Quest...' : 'No Quest Connected' }}
            </span>
          </div>
          <span v-if="isQuestConnected" class="text-xs font-mono text-muted-foreground">
            {{ questDeviceInfoText }}
          </span>
          <span v-else-if="connectChrome.showHeadsetBanner" class="text-xs text-amber-400 font-mono flex items-center gap-1.5">
            <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Waiting for visor...</span>
          </span>
          <button
            v-else-if="!connectChrome.showPickerHint"
            @click="connectQuest"
            class="text-xs text-primary hover:underline font-medium cursor-pointer"
          >
            Connect via USB →
          </button>
        </div>

        <!-- UNIFIED INSTALLATION & DATA FILES FLOW -->
        <div class="space-y-3 pt-1">
          <!-- STATE 1: QUEST DISCONNECTED / CONNECTING -->
          <div v-if="!isQuestConnected" class="p-4 rounded-lg bg-muted/20 border border-border/80 space-y-3">
            <div class="text-xs text-muted-foreground leading-relaxed">
              Connect your Meta Quest via USB cable to install the APK in 1-click and transfer game data files directly in your browser.
            </div>

            <!-- Live Authorizing Guidance Banner -->
            <div
              v-if="connectChrome.showHeadsetBanner"
              class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2.5 text-left animate-in fade-in duration-200"
            >
              <div class="font-bold flex items-center gap-2 text-amber-300">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                </span>
                <span>Action Required inside Headset!</span>
              </div>
              <p class="text-[11px] text-amber-100/90 leading-relaxed">
                Put on your <strong>Meta Quest</strong> now! An authorization prompt asking <strong>"Allow USB debugging?"</strong> is waiting inside the visor.
              </p>
              <div class="text-[11px] text-muted-foreground bg-black/40 p-2.5 rounded-lg border border-amber-500/20 space-y-1.5 font-mono">
                <div class="flex items-center gap-2 text-foreground">
                  <span class="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Put on headset so screen turns on</span>
                </div>
                <div class="flex items-center gap-2 text-foreground">
                  <span class="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Check: <strong class="text-primary">"Always allow from this computer"</strong></span>
                </div>
                <div class="flex items-center gap-2 text-foreground">
                  <span class="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Select: <strong class="text-primary">"Allow"</strong></span>
                </div>
              </div>
              <div class="flex items-center justify-between pt-1">
                <span class="text-[10px] text-muted-foreground font-mono">Connecting via WebADB...</span>
                <button
                  @click="questAdb.cancelConnect"
                  class="text-[11px] text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div
              v-else-if="questAdb.connectNotice.value"
              class="p-3.5 rounded-lg bg-muted/40 border border-border text-xs text-left animate-in fade-in duration-200"
            >
              <div class="flex items-start justify-between gap-2">
                <p class="text-[11px] text-muted-foreground leading-relaxed">{{ QUEST_NO_DEVICE_HINT }}</p>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  aria-label="Dismiss"
                  @click="questAdb.dismissConnectNotice()"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Error Banner -->
            <div
              v-else-if="questAdb.connectionError.value"
              class="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs space-y-2 text-left animate-in fade-in duration-200"
            >
              <div class="font-semibold flex items-center gap-1.5 text-destructive">
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Connection Failed</span>
              </div>
              <p class="text-[11px] text-muted-foreground leading-relaxed">
                {{ questAdb.connectionError.value }}
              </p>
              <div class="pt-1">
                <button
                  @click="connectQuest"
                  class="px-3 py-1.5 rounded bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>

            <!-- Connect Button -->
            <button
              v-if="!connectChrome.showHeadsetBanner && !connectChrome.showPickerHint"
              @click="connectQuest"
              class="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Connect Meta Quest via USB</span>
            </button>
            <button
              v-else-if="connectChrome.showPickerHint"
              disabled
              class="w-full py-2.5 px-4 rounded-lg bg-muted text-foreground font-semibold text-xs flex items-center justify-center gap-2 cursor-wait border border-border"
            >
              <span>{{ QUEST_PICKER_HINT }}</span>
            </button>
            <button
              v-else
              disabled
              class="w-full py-2.5 px-4 rounded-lg bg-primary/60 text-primary-foreground font-semibold text-xs flex items-center justify-center gap-2 cursor-wait"
            >
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Waiting for headset authorization...</span>
            </button>
          </div>

          <!-- STATE 2: QUEST CONNECTED & APK NOT INSTALLED -->
          <div v-else-if="!isApkInstalled" class="p-4 rounded-lg bg-muted/20 border border-border/80 space-y-3">
            <!-- Case A: PC Builder Required (GTA SA / Vice City) -->
            <template v-if="isPcBuilderRequired">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">1</span>
                  <span class="text-xs font-bold text-foreground">Step 1: Automated PC Builder Required</span>
                </div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">PC Script</span>
              </div>

              <div class="p-3 rounded-lg bg-card/60 border border-border/80 text-xs space-y-2.5">
                <p class="text-muted-foreground leading-relaxed text-[11px]">
                  Due to Rockstar Games copyright, the VR mod cannot be distributed as a pre-compiled APK. An automated PC installer merges the VR injector with your legally purchased Google Play APK and installs it to your Quest via USB.
                </p>
                <a
                  :href="port.port_download_url || port.github_url || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-950/30"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Open PC Builder & Instructions (GitHub)</span>
                </a>
              </div>

              <div class="pt-1 flex items-center justify-between text-[11px] font-mono">
                <button
                  @click="recheckHeadsetInstalled"
                  class="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>🔄 Check Headset</span>
                </button>
                <label class="text-muted-foreground hover:text-foreground cursor-pointer underline text-[10px]">
                  <span>Select built .apk from PC</span>
                  <input type="file" accept=".apk" class="hidden" @change="handleLocalApkSelected" />
                </label>
              </div>
            </template>

            <!-- Case B: Standard 1-Click APK Sideload -->
            <template v-else>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-primary/20 text-primary font-mono text-xs font-bold flex items-center justify-center">1</span>
                  <span class="text-xs font-bold text-foreground">Step 1: Install Port APK</span>
                </div>
                <span class="text-[11px] font-mono text-primary">WebADB Ready</span>
              </div>

              <div v-if="!isInstallingApk" class="space-y-2">
                <button
                  @click="handleApkInstall"
                  class="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Install APK on Quest (1-Click)</span>
                </button>
                <div class="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-0.5">
                  <button
                    @click="recheckHeadsetInstalled"
                    class="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    title="Check connected Quest for installed APK"
                  >
                    <span>🔄 Check Headset</span>
                  </button>
                  <label class="hover:text-foreground cursor-pointer underline">
                    <span>Select local .apk</span>
                    <input type="file" accept=".apk" class="hidden" @change="handleLocalApkSelected" />
                  </label>
                </div>
              </div>

              <!-- Installing Progress Bar -->
              <div v-else class="space-y-2 py-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-primary font-medium flex items-center gap-1.5 truncate max-w-[280px]">
                    <svg class="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span class="truncate">{{ questAdb.installProgress.value.message || 'Installing on Quest...' }}</span>
                  </span>
                  <span class="font-mono text-primary font-semibold shrink-0">{{ apkProgress }}%</span>
                </div>
                <div class="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                  <div class="bg-primary h-full transition-all duration-300" :style="{ width: apkProgress + '%' }"></div>
                </div>
              </div>

              <!-- Installation Error Message with Retry / Bypass -->
              <div v-if="apkInstallError" class="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 space-y-1.5 animate-in fade-in duration-200">
                <div class="flex items-center justify-between">
                  <span class="font-semibold">Installation Issue:</span>
                  <button @click="apkInstallError = null" class="text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
                </div>
                <p>{{ apkInstallError }}</p>
                <div class="flex items-center justify-between pt-1 font-mono text-[10px]">
                  <a :href="port.port_download_url || '#'" target="_blank" rel="noopener noreferrer" class="underline text-primary">Download APK directly ↗</a>
                </div>
              </div>
            </template>
          </div>

          <!-- STATE 3: APK INSTALLED -->
          <div v-else class="space-y-3">
            <!-- Installed Badge -->
            <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">✓</span>
                <div>
                  <div class="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                    <span>{{ isApkOutdated ? 'Update available' : 'APK Installed on Quest!' }}</span>
                    <span
                      v-if="isDetectedOnConnectedQuest"
                      class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal"
                    >
                      Detected via ADB
                    </span>
                  </div>
                  <div class="text-[11px] text-muted-foreground">
                    <template v-if="isApkOutdated">
                      Headset {{ headsetApkVersion }} → catalog {{ port.latest_version }}
                    </template>
                    <template v-else>
                      {{ headsetApkVersion ? `Installed ${headsetApkVersion}` : (isDirectApkOnly ? 'Standalone port ready to launch' : 'Ready to launch or manage game data files') }}
                    </template>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="isApkOutdated && !isInstallingApk"
                  @click="handleApkInstall"
                  class="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                >
                  Update to {{ port.latest_version }}
                </button>
                <button
                  v-else-if="!isInstallingApk"
                  @click="isApkInstalled = false"
                  class="text-[11px] font-mono text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  Reinstall
                </button>
                <button
                  @click="showUninstallPrompt = !showUninstallPrompt"
                  class="text-[11px] font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 transition-colors"
                  :title="isQuestConnected ? 'Uninstall APK directly from Meta Quest' : 'Reset installed status'"
                >
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Uninstall</span>
                </button>
              </div>
            </div>

            <div
              v-if="isInstallingApk"
              class="p-3 rounded-lg bg-muted/20 border border-border/80 space-y-2"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="text-primary font-medium flex items-center gap-1.5 truncate max-w-[280px]">
                  <svg class="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span class="truncate">{{ questAdb.installProgress.value.message || 'Updating APK on Quest...' }}</span>
                </span>
                <span class="font-mono text-primary font-semibold shrink-0">{{ apkProgress }}%</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                <div class="bg-primary h-full transition-all duration-300" :style="{ width: apkProgress + '%' }"></div>
              </div>
            </div>

            <div
              v-if="apkInstallError && isApkInstalled"
              class="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 space-y-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="font-semibold">Update Issue:</span>
                <button @click="apkInstallError = null" class="text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
              </div>
              <p>{{ apkInstallError }}</p>
            </div>

            <!-- Uninstall Confirmation Prompt -->
            <div
              v-if="showUninstallPrompt"
              class="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs space-y-2.5 animate-in fade-in duration-200"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="space-y-1">
                  <div class="font-semibold text-rose-300 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Uninstall {{ port.title }}?</span>
                  </div>
                  <p class="text-[11px] text-muted-foreground leading-relaxed">
                    <template v-if="isQuestConnected && getInstalledPackageName()">
                      This will run <code>pm uninstall {{ getInstalledPackageName() }}</code> on your connected Meta Quest to completely remove the application.
                    </template>
                    <template v-else-if="isQuestConnected">
                      Quest is connected, but package name was not detected in active packages list. This will reset the card status.
                    </template>
                    <template v-else>
                      Connect your Quest via USB to uninstall the package directly from headset storage, or click confirm to reset card status.
                    </template>
                  </p>
                  <p v-if="uninstallErrorMsg" class="text-[11px] text-rose-400 font-mono">
                    {{ uninstallErrorMsg }}
                  </p>
                </div>
              </div>
              <div class="flex items-center justify-end gap-2 pt-0.5">
                <button
                  @click="showUninstallPrompt = false"
                  :disabled="isUninstallingApp"
                  class="px-2.5 py-1 text-[11px] font-medium rounded border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  @click="executeUninstallApp"
                  :disabled="isUninstallingApp"
                  class="px-3 py-1 text-[11px] font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <svg v-if="isUninstallingApp" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ isUninstallingApp ? 'Uninstalling...' : (isQuestConnected && getInstalledPackageName() ? 'Uninstall from Quest' : 'Confirm Reset') }}</span>
                </button>
              </div>
            </div>

            <!-- Standalone Direct APK: Ready to Play immediately -->
            <div
              v-if="isDirectApkOnly"
              class="p-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300"
            >
              <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-bold text-foreground">
                  Standalone Port Ready to Play!
                </div>
                <p class="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                  This game is completely self-contained and needs no external PC assets. Open <strong class="text-foreground">Unknown Sources</strong> on your headset and launch <span class="text-emerald-400 font-semibold">{{ port.title }}</span>!
                </p>
              </div>
              <button
                v-if="currentPackageConfig && questAdb.isConnected.value"
                @click="launchAppOnQuest"
                :disabled="isAppLaunching"
                class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <svg v-if="isAppLaunching" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span v-else>🚀</span>
                <span>{{ isAppLaunching ? 'Launching...' : 'Launch on Quest' }}</span>
              </button>
            </div>

            <!-- Data Files / ROMs Box (For ports requiring assets) -->
            <div v-else class="p-4 rounded-lg bg-muted/20 border border-border/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-primary/20 text-primary font-mono text-xs font-bold flex items-center justify-center">2</span>
                  <span class="text-xs font-bold text-foreground">{{ step2Title }}</span>
                </div>

                <!-- Multi-campaign install counter / storage status -->
                <div v-if="campaignList.length > 1" class="text-[11px] font-mono text-muted-foreground flex items-center gap-2">
                  <span v-if="isScanningGameFiles" class="flex items-center gap-1.5 text-primary">
                    <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Scanning Quest...</span>
                  </span>
                  <template v-else>
                    <span>Campaigns Ready:</span>
                    <span
                      class="font-bold px-1.5 py-0.5 rounded border"
                      :class="installedCampaignsCount > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-muted/60 text-foreground border-border'"
                    >
                      {{ installedCampaignsCount }} / {{ campaignList.length }}
                    </span>
                    <button
                      @click="scanCampaignFiles"
                      class="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                      title="Scan Quest storage for files"
                    >
                      Re-scan
                    </button>
                  </template>
                </div>

                <div v-else class="flex items-center gap-2">
                  <span v-if="isScanningGameFiles" class="flex items-center gap-1 text-[11px] font-mono text-primary">
                    <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Scanning...</span>
                  </span>
                  <button
                    v-else
                    @click="scanCampaignFiles"
                    class="text-[11px] font-mono text-muted-foreground hover:text-foreground underline cursor-pointer"
                    title="Scan Quest storage for files"
                  >
                    Re-scan Quest
                  </button>
                </div>
              </div>

              <!-- CAMPAIGN / EXPANSION SELECTOR TABS -->
              <div v-if="campaignList.length > 1" class="space-y-1.5 pt-1">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-muted-foreground font-medium flex items-center gap-1">
                    <span>🎮</span> Select Campaign or Expansion:
                  </span>
                  <span class="text-[10px] text-muted-foreground/80 font-mono">
                    Installs into separate subfolders
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <button
                    v-for="campaign in campaignList"
                    :key="campaign.id"
                    @click="selectCampaign(campaign.id)"
                    class="flex flex-col text-left p-2 rounded-lg border transition-all cursor-pointer relative overflow-hidden"
                    :class="currentCampaign?.id === campaign.id
                      ? 'bg-primary/10 border-primary text-foreground shadow-sm ring-1 ring-primary/40'
                      : 'bg-muted/30 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/60'"
                  >
                    <div class="flex items-center justify-between gap-1 w-full">
                      <span class="text-xs font-bold truncate" :class="currentCampaign?.id === campaign.id ? 'text-primary' : 'text-foreground'">
                        {{ campaign.name }}
                      </span>
                      <span
                        v-if="transferredCampaigns[port.id + '-' + campaign.id] || detectedCampaigns[campaign.id]?.exists"
                        class="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px] flex items-center justify-center shrink-0"
                        title="Campaign Ready on Quest"
                      >
                        ✓
                      </span>
                      <span
                        v-else
                        class="text-[9px] px-1 py-0.2 rounded font-mono shrink-0"
                        :class="campaign.isBase ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'"
                      >
                        {{ campaign.badge }}
                      </span>
                    </div>
                    <div class="font-mono text-[10px] text-muted-foreground/80 truncate mt-0.5">
                      📁 {{ campaign.folder }}/
                    </div>
                  </button>
                </div>
              </div>

              <!-- Destination folder path -->
              <div v-if="currentCampaign" class="space-y-1.5">
                <div class="p-2 rounded bg-black/40 border border-border/70 font-mono text-xs flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5 min-w-0 truncate">
                    <svg class="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span class="text-primary truncate font-bold">{{ currentCampaign.fullPath }}</span>
                  </div>
                  <button
                    @click="copyDestinationPath(currentCampaign.fullPath)"
                    class="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer shrink-0 font-mono"
                  >
                    {{ copiedPath ? 'Copied!' : 'Copy' }}
                  </button>
                </div>

                <!-- Explicit Target Folder Banner -->
                <div class="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-muted/40 border border-border/50">
                  <div class="flex items-center gap-1.5">
                    <span class="text-muted-foreground font-medium">Target Folder:</span>
                    <span class="px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-mono text-[11px] font-bold">
                      📁 {{ currentCampaign.folder }}/
                    </span>
                  </div>
                  <span class="font-mono text-[10px] text-muted-foreground/80 truncate max-w-[200px]" :title="currentCampaign.exampleFiles">
                    {{ currentCampaign.exampleFiles }}
                  </span>
                </div>
              </div>

              <!-- Dropzone / File Upload (Real Drag-and-Drop or Click) -->
              <div
                v-if="!isCurrentCampaignTransferred"
                @dragover.prevent
                @drop="handleDrop"
                @click="triggerFileInput"
                class="border-2 border-dashed border-border hover:border-primary/60 hover:bg-primary/5 rounded-lg p-5 text-center transition-all cursor-pointer group relative"
              >
                <!-- Hidden file picker for real files -->
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  class="hidden"
                  @change="handleFileInputChange"
                />

                <div v-if="!isTransferringFiles">
                  <svg class="w-7 h-7 text-muted-foreground group-hover:text-primary mx-auto mb-1.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div class="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Drag & drop or click to choose <span class="text-primary font-bold underline decoration-primary/40 underline-offset-2">{{ currentCampaign?.folder }}</span> files
                  </div>
                  <div class="text-[11px] text-muted-foreground mt-0.5">
                    {{ currentCampaign?.instruction || 'Drop the required game folder or files directly into your Quest' }}
                  </div>
                  <div class="mt-2.5 flex items-center justify-center gap-2">
                    <span class="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border">
                      Pushes directly to {{ currentCampaign?.fullPath }}
                    </span>
                  </div>
                </div>

                <div v-else class="space-y-2 py-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-primary font-medium flex items-center gap-1.5 truncate max-w-[280px]">
                      <svg class="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span class="truncate">{{ fileTransferStatusMsg || `Copying files into /${currentCampaign?.folder}/...` }}</span>
                    </span>
                    <span class="font-mono text-primary font-semibold shrink-0">{{ fileTransferProgress }}%</span>
                  </div>
                  <div class="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border">
                    <div class="bg-primary h-full transition-all duration-200" :style="{ width: fileTransferProgress + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- TRIUMPHANT SUCCESS / READY TO PLAY CARD -->
              <div
                v-else
                class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300"
              >
                <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-bold text-foreground">
                    <span v-if="campaignList.length > 1">{{ currentCampaign?.name }} is </span>Ready to Play on Quest!
                  </div>

                  <!-- Headset verification banner -->
                  <div
                    v-if="currentDetectedCampaign?.exists"
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono mt-1.5"
                  >
                    <span>✓ Verified on Quest</span>
                    <span v-if="currentDetectedCampaign?.fileCount">({{ currentDetectedCampaign.fileCount }} files detected)</span>
                  </div>

                  <p class="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                    Put on your headset, open the App Library, select <strong class="text-foreground">Unknown Sources</strong>, and launch <span class="text-emerald-400 font-semibold">{{ port.title }}</span>.
                    <span v-if="currentCampaign && !currentCampaign.isBase" class="block text-primary font-medium mt-1">
                      In-game: Select "{{ currentCampaign.name }}" from the mod / launcher menu!
                    </span>
                  </p>
                </div>

                <!-- Detected files info pills -->
                <div v-if="currentDetectedCampaign?.files?.length" class="text-left p-2.5 rounded bg-black/40 border border-emerald-500/20 text-[11px] font-mono space-y-1">
                  <div class="flex items-center justify-between text-muted-foreground text-[10px]">
                    <span class="truncate">📁 {{ currentDetectedCampaign?.matchedPath }}</span>
                    <button
                      @click="showDetectedFilesList = !showDetectedFilesList"
                      class="text-emerald-400 underline hover:text-emerald-300 shrink-0 ml-2"
                    >
                      {{ showDetectedFilesList ? 'Hide Files' : 'Show Files' }}
                    </button>
                  </div>
                  <div v-if="showDetectedFilesList" class="flex flex-wrap gap-1 max-h-24 overflow-y-auto pt-1">
                    <span
                      v-for="file in (currentDetectedCampaign?.files || []).slice(0, 16)"
                      :key="file"
                      class="px-1.5 py-0.5 rounded bg-muted/60 text-foreground text-[10px] border border-border/50 truncate max-w-[120px]"
                    >
                      {{ file }}
                    </span>
                  </div>
                </div>

                <div class="pt-1 flex flex-wrap items-center justify-center gap-2">
                  <!-- Direct Launch Button via WebADB -->
                  <button
                    v-if="currentPackageConfig && questAdb.isConnected.value"
                    @click="launchAppOnQuest"
                    :disabled="isAppLaunching"
                    class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <svg v-if="isAppLaunching" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span v-else>🚀</span>
                    <span>{{ isAppLaunching ? 'Launching...' : 'Launch on Quest' }}</span>
                  </button>

                  <button
                    v-if="nextUntransferredCampaign"
                    @click="selectCampaign(nextUntransferredCampaign.id)"
                    class="px-3 py-1.5 rounded bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <span>Next: {{ nextUntransferredCampaign.name }}</span>
                    <span>→</span>
                  </button>

                  <button
                    @click="scanCampaignFiles"
                    class="px-2.5 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] font-mono border border-border/60 transition-colors cursor-pointer flex items-center gap-1"
                    title="Re-check files on Quest"
                  >
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Re-scan</span>
                  </button>

                  <button
                    @click="allowFileTransferOverride = true"
                    class="px-2.5 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] font-mono border border-border/60 transition-colors cursor-pointer"
                  >
                    Add / Replace Files
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Action Links (Footer of Action Card) -->
        <div class="pt-2 border-t border-border/80 flex flex-col gap-2">
          <a
            v-if="port.base_game_url"
            :href="port.base_game_url"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full flex items-center justify-between text-xs py-2 px-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-foreground"
          >
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Buy Base Game ({{ port.base_game_store || 'Store' }})</span>
            </div>
            <span class="text-muted-foreground">↗</span>
          </a>

          <a
            v-if="port.port_download_url"
            :href="port.port_download_url"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Manual APK Download ({{ port.port_download_source || 'SideQuest' }})</span>
            </div>
            <span class="text-muted-foreground">↗</span>
          </a>
        </div>
      </div>
    </div>

    <!-- LOWER SECTION: Installation Guide & Hardware Specs Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-border/70">
      <!-- LEFT LOWER: Installation Guide & Troubleshooting (8 Cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Installation Guide (Rendered Markdown) -->
        <div class="p-6 rounded-xl bg-card border border-border space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-border">
            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="text-lg font-bold text-foreground tracking-tight">Step-by-Step Installation Guide</h2>
          </div>

          <!-- Parsed markdown content -->
          <div class="guide-content" v-html="renderedGuide"></div>
        </div>

        <!-- Troubleshooting Notes -->
        <div v-if="port.troubleshooting_notes" class="p-4 rounded-xl bg-muted/30 border border-border text-xs space-y-1.5">
          <div class="flex items-center gap-2 font-semibold text-foreground">
            <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Troubleshooting & Tips</span>
          </div>
          <p class="leading-relaxed text-muted-foreground pl-6">
            {{ port.troubleshooting_notes }}
          </p>
        </div>
      </div>

      <!-- RIGHT LOWER: Requirements & Community Resources (4 Cols) -->
      <div class="lg:col-span-4 space-y-4">
        <!-- Requirements Summary Box -->
        <div class="p-5 rounded-xl bg-card border border-border space-y-4">
          <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Requirements Summary</span>
            <span class="text-[10px] text-emerald-400 font-normal">Standalone VR</span>
          </h3>

          <div class="space-y-3 text-xs">
            <!-- If single campaign: show original layout -->
            <div v-if="campaignList.length <= 1" class="space-y-3">
              <!-- Base Game Source -->
              <div class="space-y-1">
                <span class="text-[11px] text-muted-foreground block font-mono">Original Game Required:</span>
                <div class="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/60">
                  <span class="font-medium text-foreground">{{ port.base_game_store || 'PC Retail / Legal Copy' }}</span>
                  <a
                    v-if="port.base_game_url"
                    :href="port.base_game_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[10px] text-primary hover:underline font-mono"
                  >
                    Store Page ↗
                  </a>
                </div>
              </div>

              <!-- Target Data Folder -->
              <div class="space-y-1">
                <span class="text-[11px] text-muted-foreground block font-mono">Asset Directory on Quest:</span>
                <div class="p-2 rounded bg-black/40 border border-border/70 font-mono text-[11px] text-primary truncate">
                  {{ currentCampaign?.fullPath }}
                </div>
              </div>

              <!-- Compatible Files -->
              <div class="space-y-1">
                <span class="text-[11px] text-muted-foreground block font-mono">Required Files:</span>
                <div class="text-[11px] text-foreground font-mono bg-muted/30 p-2 rounded border border-border/50">
                  {{ currentCampaign?.exampleFiles }}
                </div>
              </div>
            </div>

            <!-- If multiple campaigns (Lambda1VR, SourceVR, etc.): show Campaign Matrix -->
            <div v-else class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[11px] text-muted-foreground font-mono">Campaigns & DLCs:</span>
                <span class="text-[10px] font-mono text-primary font-bold">
                  {{ installedCampaignsCount }} / {{ campaignList.length }} Ready
                </span>
              </div>

              <div class="space-y-1.5">
                <div
                  v-for="c in campaignList"
                  :key="c.id"
                  @click="selectCampaign(c.id)"
                  class="p-2 rounded border transition-colors cursor-pointer"
                  :class="currentCampaign?.id === c.id
                    ? 'bg-primary/10 border-primary/60 text-foreground'
                    : 'bg-muted/30 hover:bg-muted/50 border-border/60 text-muted-foreground'"
                >
                  <div class="flex items-center justify-between gap-1 mb-1">
                    <div class="flex items-center gap-1.5 truncate">
                      <span class="font-bold text-xs" :class="currentCampaign?.id === c.id ? 'text-primary' : 'text-foreground'">
                        {{ c.name }}
                      </span>
                      <span
                        v-if="transferredCampaigns[port.id + '-' + c.id]"
                        class="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-medium"
                      >
                        Ready
                      </span>
                      <span
                        v-else
                        class="text-[9px] px-1 rounded bg-muted/80 text-muted-foreground font-mono"
                      >
                        {{ c.badge }}
                      </span>
                    </div>
                    <a
                      v-if="c.storeUrl"
                      :href="c.storeUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      @click.stop
                      class="text-[10px] text-primary hover:underline font-mono shrink-0"
                      title="View on Store"
                    >
                      {{ c.storeName }} ↗
                    </a>
                  </div>
                  <div class="font-mono text-[10px] text-muted-foreground/90 truncate">
                    📁 {{ c.fullPath }}
                  </div>
                </div>
              </div>

              <!-- Active Campaign Details -->
              <div class="space-y-1 pt-1 border-t border-border/60">
                <span class="text-[11px] text-muted-foreground block font-mono">Required for {{ currentCampaign?.name }}:</span>
                <div class="text-[11px] text-foreground font-mono bg-muted/30 p-2 rounded border border-border/50">
                  {{ currentCampaign?.exampleFiles }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Community & Creator Support Box -->
        <div class="p-4 rounded-xl bg-card border border-border space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-foreground flex items-center gap-1.5">
              <span>💬</span> Need Help or Mods?
            </span>
            <span class="text-[10px] font-mono text-muted-foreground">Community</span>
          </div>
          <p class="text-[11px] text-muted-foreground leading-relaxed">
            Join the developer community for installation troubleshooting, high-resolution HD mod packs, and multiplayer sessions.
          </p>
          <div class="pt-1 flex flex-col gap-1.5 font-mono text-[11px]">
            <a
              v-if="port.developer_url"
              :href="port.developer_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/60 border border-border/60 text-foreground transition-colors"
            >
              <span>Support {{ port.developer }}</span>
              <span class="text-muted-foreground">↗</span>
            </a>
            <a
              v-if="port.github_url"
              :href="port.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/60 border border-border/60 text-foreground transition-colors"
            >
              <span>GitHub Repository & Issues</span>
              <span class="text-muted-foreground">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="max-w-md mx-auto py-24 text-center space-y-3">
    <div class="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
    <p class="text-muted-foreground text-xs font-mono">Loading port details...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import type { PortCategory, PortStatus } from '~/types/port'
import { getPortCampaigns, type PortCampaign } from '~/data/expansions'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { QUEST_NO_DEVICE_HINT, QUEST_PICKER_HINT, questConnectChrome } from '~/lib/questConnectUx'
import { isPortInstalledOnQuest, isSelfContainedSideload, PORT_PACKAGE_CONFIGS } from '~/data/portPackageMap'
import { isHeadsetApkOutdated } from '~/lib/portVersion'
import { absoluteCoverUrl } from '~/data/coverUrl'

const route = useRoute()
const slug = route.params.slug as string
const { fetchPortBySlug } = usePorts()
const questAdb = useQuestAdb()
const connectChrome = computed(() => questConnectChrome(questAdb.connectionPhase.value, questAdb.isConnected.value))

const { data: port } = await useAsyncData(`port-${slug}`, () => fetchPortBySlug(slug))

useSeoMeta({
  title: () => port.value ? `${port.value.title} — QuestPorts` : 'QuestPorts',
  description: () => port.value?.short_description || 'Standalone VR Port details, guide, and files.',
  ogTitle: () => port.value ? `${port.value.title} (Meta Quest Standalone VR)` : 'QuestPorts',
  ogDescription: () => port.value?.short_description || 'Standalone VR Port details, guide, and files.',
  ogImage: () => absoluteCoverUrl(port.value?.cover_image_url),
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => port.value ? `${port.value.title} (Meta Quest Standalone VR)` : 'QuestPorts',
  twitterDescription: () => port.value?.short_description || 'Standalone VR Port details, guide, and files.',
  twitterImage: () => absoluteCoverUrl(port.value?.cover_image_url),
})

// Expandable Features Tray State
const isFeaturesExpanded = ref(false)

// VR Comfort Rating Calculation
const comfortRating = computed(() => {
  if (!port.value) return 'Moderate'
  if (port.value.locomotion_types?.includes('Teleport') || port.value.category === 'emulator') return 'Comfortable'
  if (port.value.slug === 'preyvr' || port.value.slug === 'halocequest') return 'Intense'
  return 'Moderate'
})

const comfortBadgeClass = computed(() => {
  switch (comfortRating.value) {
    case 'Comfortable':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    case 'Moderate':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    case 'Intense':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
})

// Quest connection state (tied to global questAdb singleton so Navbar & Card are 100% in sync)
const isQuestConnected = computed(() => questAdb.isConnected.value)
const questDeviceModel = computed(() => questAdb.deviceModel.value || 'Meta Quest Connected')
const questDeviceInfoText = computed(() => {
  const parts: string[] = []
  if (questAdb.batteryLevel.value !== null) {
    parts.push(`⚡ ${questAdb.batteryLevel.value}%`)
  }
  if (questAdb.storageFree.value) {
    parts.push(`${questAdb.storageFree.value} free`)
  }
  return parts.join(' • ')
})

const connectQuest = async () => {
  if (questAdb.isWebUsbSupported.value) {
    await questAdb.connect()
  }
}

// Installation and Campaigns State
const isDetectedOnConnectedQuest = computed(() => {
  if (!questAdb.isConnected.value || !slug) return false
  return isPortInstalledOnQuest(slug, questAdb.installedPackages.value)
})

const getPersistedInstalled = (): boolean => {
  if (import.meta.client && slug) {
    try {
      return localStorage.getItem(`questports_installed_${slug}`) === 'true'
    } catch {
      return false
    }
  }
  return false
}

const isApkInstalled = ref(false)
const isInstallingApk = ref(false)
const apkProgress = ref(0)
const apkInstallError = ref<string | null>(null)

// Restore persisted state on mount
onMounted(() => {
  if (getPersistedInstalled()) {
    isApkInstalled.value = true
  }
})

// Persist installed state to localStorage
watch(isApkInstalled, (val) => {
  if (import.meta.client && slug) {
    try {
      if (val) {
        localStorage.setItem(`questports_installed_${slug}`, 'true')
      } else {
        localStorage.removeItem(`questports_installed_${slug}`)
      }
    } catch {}
  }
})

// Real-time bidirectional sync between connected headset and card state:
watch(
  [() => questAdb.isConnected.value, isDetectedOnConnectedQuest],
  ([connected, detected]) => {
    if (connected) {
      // When Quest is actively connected via USB, the headset is the single source of truth:
      // If the user uninstalls the app directly in the visor, it unmarks immediately on the page!
      isApkInstalled.value = detected
      if (!detected && import.meta.client && slug) {
        localStorage.removeItem(`questports_installed_${slug}`)
      }
    } else {
      // When disconnected from USB, use persisted offline state
      if (getPersistedInstalled()) {
        isApkInstalled.value = true
      }
    }
  },
  { immediate: true }
)

watch(() => questAdb.installProgress.value.percent, (pct) => {
  if (isInstallingApk.value && pct > 0) {
    apkProgress.value = pct
  }
})

const selectedCampaignId = ref<string | null>(null)
const transferredCampaigns = ref<Record<string, boolean>>({})
const isScanningGameFiles = ref(false)
const detectedCampaigns = ref<Record<string, { exists: boolean; matchedPath: string; fileCount: number; files: string[] }>>({})
const allowFileTransferOverride = ref(false)
const showDetectedFilesList = ref(false)

const isTransferringFiles = ref(false)
const fileTransferProgress = ref(0)
const fileTransferStatusMsg = ref('')
const copiedPath = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const campaignList = computed<PortCampaign[]>(() => {
  if (!port.value) return []
  return getPortCampaigns(port.value)
})

const currentCampaign = computed<PortCampaign | null>(() => {
  const list = campaignList.value
  if (!list.length) return null
  if (selectedCampaignId.value) {
    const found = list.find(c => c.id === selectedCampaignId.value)
    if (found) return found
  }
  return list[0] ?? null
})

const currentDetectedCampaign = computed(() => {
  const id = currentCampaign.value?.id
  return id ? detectedCampaigns.value[id] : undefined
})

const selectCampaign = (campaignId: string) => {
  selectedCampaignId.value = campaignId
  isTransferringFiles.value = false
  fileTransferProgress.value = 0
  allowFileTransferOverride.value = false
  showDetectedFilesList.value = false
}

// Automatically scan Quest storage for all campaigns of this port
const scanCampaignFiles = async () => {
  if (!questAdb.isConnected.value || !port.value) return
  isScanningGameFiles.value = true

  try {
    for (const campaign of campaignList.value) {
      const res = await questAdb.checkCampaignFilesOnQuest(campaign)
      detectedCampaigns.value[campaign.id] = res
      if (res.exists) {
        const targetKey = `${port.value.id}-${campaign.id}`
        transferredCampaigns.value[targetKey] = true
      }
    }
  } catch (err) {
    console.warn('[QuestPorts] Failed scanning campaign files on Quest:', err)
  } finally {
    isScanningGameFiles.value = false
  }
}

// Trigger storage scan when Quest connects or port changes
watch(
  [() => questAdb.isConnected.value, () => port.value?.id],
  ([connected, portId]) => {
    if (connected && portId) {
      scanCampaignFiles()
    }
  },
  { immediate: true }
)

const isCurrentCampaignTransferred = computed(() => {
  if (isDirectApkOnly.value && isApkInstalled.value) return true
  const currentPort = port.value
  const activeCampaign = currentCampaign.value
  if (!currentPort || !activeCampaign) return false
  if (allowFileTransferOverride.value) return false
  if (detectedCampaigns.value[activeCampaign.id]?.exists) return true
  // When the headset is connected, only files actually found on disk count as ready.
  if (questAdb.isConnected.value) return false
  const targetKey = `${currentPort.id}-${activeCampaign.id}`
  return !!transferredCampaigns.value[targetKey]
})

const installedCampaignsCount = computed(() => {
  const currentPort = port.value
  if (!currentPort) return 0
  return campaignList.value.filter(c => {
    const targetKey = `${currentPort.id}-${c.id}`
    return !!transferredCampaigns.value[targetKey] || !!detectedCampaigns.value[c.id]?.exists
  }).length
})

const nextUntransferredCampaign = computed(() => {
  const currentPort = port.value
  if (!currentPort || campaignList.value.length <= 1) return null
  return campaignList.value.find(c => {
    const targetKey = `${currentPort.id}-${c.id}`
    return !transferredCampaigns.value[targetKey] && !detectedCampaigns.value[c.id]?.exists
  }) || null
})

// Current port package config (for launching app on Quest)
const currentPackageConfig = computed(() => {
  if (!port.value?.slug) return null
  return PORT_PACKAGE_CONFIGS[port.value.slug] || null
})

const isPcBuilderRequired = computed(() => {
  return currentPackageConfig.value?.installType === 'pc_builder_required'
})

const isDirectApkOnly = computed(() => isSelfContainedSideload(currentPackageConfig.value))

const step2Title = computed(() => {
  if (currentPackageConfig.value?.workflowType === 'emulator_roms') {
    return 'Step 2: ROMs & ISOs Library'
  }
  if (currentPackageConfig.value?.workflowType === 'obb_extractor') {
    return 'Step 2: Audio & Mod Assets'
  }
  if (currentPackageConfig.value?.workflowType === 'smart_converter') {
    return 'Step 2: Converted Console Assets'
  }
  return 'Step 2: Game Data Files'
})

const handleLocalApkSelected = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!questAdb.isConnected.value) {
    return
  }

  isInstallingApk.value = true
  apkProgress.value = 10
  try {
    await questAdb.installApkFile(file, port.value?.title || 'Game Port')
    isApkInstalled.value = true
    scanCampaignFiles()
  } catch (err: any) {
    console.error('Failed to install APK:', err)
  } finally {
    isInstallingApk.value = false
  }
}

const recheckHeadsetInstalled = async () => {
  if (questAdb.isConnected.value) {
    await questAdb.refreshStats()
    isApkInstalled.value = isDetectedOnConnectedQuest.value
    if (isDetectedOnConnectedQuest.value) {
      scanCampaignFiles()
    } else if (import.meta.client && slug) {
      localStorage.removeItem(`questports_installed_${slug}`)
    }
  }
}

const isAppLaunching = ref(false)
const launchAppOnQuest = async () => {
  const pkg = currentPackageConfig.value?.packageName
  if (!pkg || !questAdb.isConnected.value) return
  isAppLaunching.value = true
  try {
    await questAdb.launchApp(pkg)
  } finally {
    setTimeout(() => {
      isAppLaunching.value = false
    }, 1500)
  }
}

// Uninstall App from Quest logic
const showUninstallPrompt = ref(false)
const isUninstallingApp = ref(false)
const uninstallErrorMsg = ref<string | null>(null)

const getInstalledPackageName = (): string | null => {
  if (!port.value?.slug) return null
  const cfg = PORT_PACKAGE_CONFIGS[port.value.slug]
  const installed = questAdb.installedPackages.value
  const findInstalled = (name: string) => installed.find(p => p.trim().toLowerCase() === name.toLowerCase())
  if (cfg?.packageName) {
    const found = findInstalled(cfg.packageName)
    if (found) return found.trim()
  }
  if (cfg?.altPackages) {
    for (const alt of cfg.altPackages) {
      const found = findInstalled(alt)
      if (found) return found.trim()
    }
  }
  const cleanSlug = port.value.slug.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (cleanSlug.length >= 3) {
    const matched = installed.find(pkg => {
      const cleanPkg = pkg.toLowerCase().replace(/[^a-z0-9]/g, '')
      return cleanPkg.includes(cleanSlug) || cleanSlug.includes(cleanPkg)
    })
    if (matched) return matched
  }
  return cfg?.packageName || null
}

const headsetApkVersion = ref<string | null>(null)
const isApkOutdated = computed(() => {
  return isHeadsetApkOutdated(headsetApkVersion.value, port.value?.latest_version)
})

const refreshHeadsetApkVersion = async () => {
  headsetApkVersion.value = null
  if (!questAdb.isConnected.value || !isDetectedOnConnectedQuest.value) return
  const pkg = getInstalledPackageName()
  if (!pkg) return
  headsetApkVersion.value = await questAdb.getPackageVersion(pkg)
}

watch(
  [() => questAdb.isConnected.value, isDetectedOnConnectedQuest, () => port.value?.slug],
  () => {
    refreshHeadsetApkVersion()
  },
  { immediate: true }
)

const executeUninstallApp = async () => {
  uninstallErrorMsg.value = null
  const pkg = getInstalledPackageName()

  if (questAdb.isConnected.value && pkg) {
    isUninstallingApp.value = true
    try {
      const ok = await questAdb.uninstallPackage(pkg)
      if (ok) {
        isApkInstalled.value = false
        showUninstallPrompt.value = false
        if (port.value) {
          for (const c of campaignList.value) {
            delete transferredCampaigns.value[`${port.value.id}-${c.id}`]
          }
        }
      } else {
        uninstallErrorMsg.value = `Headset could not remove package "${pkg}". You can also uninstall it from Quest Library (Unknown Sources).`
      }
    } catch (err: any) {
      console.error('Uninstall error:', err)
      uninstallErrorMsg.value = err?.message || 'Error executing uninstall command on headset.'
    } finally {
      isUninstallingApp.value = false
    }
  } else {
    // Reset local card state if not ADB-connected or package not specified
    isApkInstalled.value = false
    showUninstallPrompt.value = false
    if (port.value) {
      for (const c of campaignList.value) {
        delete transferredCampaigns.value[`${port.value.id}-${c.id}`]
      }
    }
  }
}

// 1-Click APK Install Handler
const handleApkInstall = async () => {
  if (isInstallingApk.value || !port.value) return
  apkInstallError.value = null

  const downloadUrl = port.value.port_download_url
  if (!downloadUrl) {
    apkInstallError.value = 'No APK download URL configured for this port.'
    return
  }

  // Never simulate: the headset must be connected via ADB to actually install.
  if (!questAdb.isConnected.value) {
    if (questAdb.isWebUsbSupported.value) {
      await questAdb.connect()
    }
    if (!questAdb.isConnected.value) {
      apkInstallError.value = 'Quest not connected. Plug in your headset via USB, accept "Allow USB debugging" inside the visor, then try again.'
      return
    }
  }

  isInstallingApk.value = true
  apkProgress.value = 5
  try {
    await questAdb.installApkUrl(downloadUrl, port.value.title)
    // installApkUrl returns silently on user cancel; trust only the headset package list
    await questAdb.updatePackages()
    if (questAdb.installProgress.value.step === 'completed') {
      isApkInstalled.value = true
      await questAdb.updatePackages()
      await refreshHeadsetApkVersion()
      await scanCampaignFiles()
    }
  } catch (err: any) {
    console.error('Failed to install APK via WebADB:', err)
    apkInstallError.value = err?.message || 'Failed to install APK on headset.'
  } finally {
    isInstallingApk.value = false
  }
}

// File drop & real push handling
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileInputChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    await uploadRealFiles(Array.from(target.files))
  }
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  if (!currentCampaign.value || !questAdb.isConnected.value) return
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    await uploadRealFiles(Array.from(files))
  }
}

const uploadRealFiles = async (files: File[]) => {
  if (!currentCampaign.value || !questAdb.isConnected.value || files.length === 0) return
  isTransferringFiles.value = true
  fileTransferProgress.value = 0
  fileTransferStatusMsg.value = `Preparing ${files.length} file(s)...`

  try {
    const targetDir = currentCampaign.value.fullPath
    for (let i = 0; i < files.length; i++) {
      const file = files[i]!
      const currentPct = Math.round((i / files.length) * 100)
      fileTransferProgress.value = currentPct
      fileTransferStatusMsg.value = `Transferring ${file.name} (${i + 1}/${files.length})...`
      await questAdb.pushFileToPath(file, targetDir, (pct, msg) => {
        const overall = Math.min(99, Math.round(((i + (pct / 100)) / files.length) * 100))
        fileTransferProgress.value = overall
        fileTransferStatusMsg.value = msg
      })
    }
    fileTransferProgress.value = 100
    fileTransferStatusMsg.value = 'Files transferred successfully!'
    if (port.value) {
      const targetKey = `${port.value.id}-${currentCampaign.value.id}`
      transferredCampaigns.value[targetKey] = true
    }
    allowFileTransferOverride.value = false
    await scanCampaignFiles()
  } catch (err: any) {
    console.error('File push failed:', err)
    fileTransferStatusMsg.value = `Error: ${err?.message || 'Failed to push files'}`
  } finally {
    setTimeout(() => {
      isTransferringFiles.value = false
    }, 800)
  }
}

const copyDestinationPath = (text: string) => {
  if (import.meta.client) {
    navigator.clipboard.writeText(text)
    copiedPath.value = true
    setTimeout(() => {
      copiedPath.value = false
    }, 2000)
  }
}

const renderedGuide = computed(() => {
  if (!port.value || !port.value.installation_guide) {
    return '<p class="text-muted-foreground">No installation tutorial registered for this port yet.</p>'
  }
  return marked.parse(port.value.installation_guide)
})

const formatCategory = (cat: PortCategory) => {
  switch (cat) {
    case 'source_port': return 'Source Port'
    case 'decompilation': return 'Decompilation'
    case 'engine_recreation': return 'Engine Recreation'
    case 'emulator': return 'Emulator'
    case 'wrapper': return 'Wrapper / Compatibility Layer'
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
