<template>
  <div v-if="port" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center justify-between text-xs text-muted-foreground">
      <NuxtLink to="/" class="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Database</span>
      </NuxtLink>

      <div class="flex items-center gap-3">
        <UiButton
          v-if="port.github_url"
          as="a"
          :href="port.github_url"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="sm"
          class="gap-1.5"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>Repository</span>
        </UiButton>
        <span class="font-mono text-muted-foreground/80">ID: {{ port.slug }}</span>
      </div>
    </div>

    <!-- Header Section -->
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <UiBadge variant="secondary" class="text-xs font-mono uppercase">
          {{ formatCategory(port.category) }}
        </UiBadge>
        <UiBadge :variant="port.status === 'released' ? 'success' : 'secondary'" class="text-xs font-mono">
          {{ formatStatus(port.status) }}
        </UiBadge>
        <UiBadge variant="outline" class="text-xs font-mono">
          Zero PC Required
        </UiBadge>
      </div>

      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
        {{ port.title }}
      </h1>

      <div class="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <span>Developed by</span>
        <NuxtLink
          :to="`/?dev=${encodeURIComponent(port.developer)}`"
          class="font-semibold text-foreground hover:text-primary hover:underline transition-colors"
          :title="`See all ports by ${port.developer}`"
        >
          {{ port.developer }}
        </NuxtLink>

        <a
          v-if="port.developer_url"
          :href="port.developer_url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-xs text-muted-foreground hover:text-foreground underline ml-2"
        >
          Official Page ↗
        </a>
      </div>

      <p class="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
        {{ port.short_description }}
      </p>
    </div>

    <!-- Standardized Feature Checklist (PCGamingWiki / ProtonDB style) -->
    <div class="p-4 rounded-lg border border-border bg-card">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 font-mono">
        Feature & Compatibility Matrix
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="p-2.5 rounded border border-border/70 bg-muted/30">
          <div class="text-muted-foreground text-[11px] mb-0.5">Head Tracking</div>
          <div class="font-semibold flex items-center gap-1.5" :class="port.has_6dof_controls ? 'text-emerald-400' : 'text-muted-foreground'">
            <span>{{ port.has_6dof_controls ? '✓ Full 6DoF' : '3DoF Only' }}</span>
          </div>
        </div>

        <div class="p-2.5 rounded border border-border/70 bg-muted/30">
          <div class="text-muted-foreground text-[11px] mb-0.5">Input Method</div>
          <div class="font-semibold flex items-center gap-1.5" :class="port.has_6dof_controls ? 'text-emerald-400' : 'text-muted-foreground'">
            <span>{{ port.has_6dof_controls ? '✓ Touch Motion Controls' : 'Gamepad Required' }}</span>
          </div>
        </div>

        <div class="p-2.5 rounded border border-border/70 bg-muted/30">
          <div class="text-muted-foreground text-[11px] mb-0.5">Rendering Mode</div>
          <div class="font-semibold text-emerald-400 flex items-center gap-1.5">
            <span>✓ Stereoscopic 3D</span>
          </div>
        </div>

        <div class="p-2.5 rounded border border-border/70 bg-muted/30">
          <div class="text-muted-foreground text-[11px] mb-0.5">Hardware Execution</div>
          <div class="font-semibold text-emerald-400 flex items-center gap-1.5">
            <span>✓ 100% Native Quest</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Showcase: YouTube Player or Cover Image -->
    <div class="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-black">
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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Specs & Guide -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Storage Path Box -->
        <div v-if="port.internal_storage_path" class="p-4 rounded-lg bg-card border border-border space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h3 class="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">Internal Storage Directory</h3>
            </div>
            <CopyButton :text="port.internal_storage_path" label="Copy Path" />
          </div>

          <div class="bg-muted p-2.5 rounded border border-border font-mono text-xs text-primary overflow-x-auto">
            <code>{{ port.internal_storage_path }}</code>
          </div>
          <p class="text-xs text-muted-foreground">
            Connect your Quest via USB (or SideQuest) and place your original game files directly into this directory.
          </p>
        </div>

        <!-- Installation Guide (Rendered Markdown) -->
        <div class="p-5 sm:p-6 rounded-lg bg-card border border-border space-y-4 overflow-hidden">
          <div class="flex items-center gap-2 pb-3 border-b border-border">
            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="text-lg font-semibold text-foreground tracking-tight">Installation Guide</h2>
          </div>

          <!-- Parsed markdown content -->
          <div class="guide-content" v-html="renderedGuide"></div>
        </div>

        <!-- Troubleshooting Notes -->
        <div v-if="port.troubleshooting_notes" class="p-4 rounded-lg bg-muted/40 border border-border text-foreground text-xs space-y-1.5">
          <div class="flex items-center gap-1.5 font-semibold text-foreground">
            <span>Troubleshooting & Notes</span>
          </div>
          <p class="leading-relaxed text-muted-foreground">
            {{ port.troubleshooting_notes }}
          </p>
        </div>
      </div>

      <!-- Right Column: Direct Links & Technical Specs -->
      <div class="space-y-4">
        <!-- Direct Actions Card -->
        <div class="p-4 rounded-lg bg-card border border-border space-y-3">
          <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Downloads & Links</h3>

          <!-- Download Port / APK -->
          <UiButton
            v-if="port.port_download_url"
            as="a"
            :href="port.port_download_url"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full gap-2 font-semibold text-xs h-auto min-h-9 py-2 px-3 whitespace-normal text-center leading-snug"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span class="break-words line-clamp-2">Download Port ({{ port.port_download_source || 'APK' }})</span>
          </UiButton>

          <!-- In Development Notice -->
          <div
            v-else
            class="w-full p-3 rounded-md bg-muted/60 border border-border text-muted-foreground text-xs space-y-1 text-center"
          >
            <div class="font-semibold text-foreground flex items-center justify-center gap-1.5">
              <span>In Active Development</span>
            </div>
            <p class="text-[11px] leading-relaxed">
              No public release APK available yet. Check the repository or video showcase above for progress.
            </p>
          </div>

          <!-- Base Game Store Link -->
          <UiButton
            v-if="port.base_game_url"
            as="a"
            :href="port.base_game_url"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            class="w-full gap-2 justify-between text-xs h-auto min-h-9 py-2 px-3 whitespace-normal text-left"
            :title="`Base Game: ${port.base_game_store}`"
          >
            <div class="flex items-center gap-1.5 min-w-0 flex-1">
              <svg class="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span class="break-words line-clamp-2 leading-tight">
                {{ port.base_game_store?.toLowerCase().includes('rom') ? port.base_game_store : `Base Game: ${port.base_game_store || 'Store'}` }}
              </span>
            </div>
            <svg class="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </UiButton>

          <!-- Project GitHub Repository Link -->
          <UiButton
            v-if="port.github_url"
            as="a"
            :href="port.github_url"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            class="w-full gap-2 justify-between text-xs h-auto min-h-9 py-2 px-3"
          >
            <div class="flex items-center gap-1.5 min-w-0">
              <svg class="w-3.5 h-3.5 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span class="truncate">GitHub Project</span>
            </div>
            <svg class="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </UiButton>
        </div>

        <!-- Technical Specifications -->
        <div class="p-4 rounded-lg bg-card border border-border space-y-3">
          <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Hardware & Engine</h3>

          <!-- Supported Headsets -->
          <div class="space-y-1.5">
            <span class="text-[11px] text-muted-foreground block font-mono">Supported Headsets:</span>
            <div class="flex flex-wrap gap-1">
              <UiBadge
                v-for="hw in port.supported_hardware"
                :key="hw"
                variant="outline"
                class="font-mono text-xs py-0.5"
              >
                {{ hw }}
              </UiBadge>
            </div>
          </div>

          <!-- Locomotion Types -->
          <div v-if="port.locomotion_types?.length" class="space-y-1.5 pt-2 border-t border-border">
            <span class="text-[11px] text-muted-foreground block font-mono">Locomotion:</span>
            <div class="flex flex-wrap gap-1">
              <UiBadge
                v-for="loco in port.locomotion_types"
                :key="loco"
                variant="secondary"
                class="text-xs py-0.5 font-mono"
              >
                {{ loco }}
              </UiBadge>
            </div>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import type { PortCategory, PortStatus } from '~/types/port'

const route = useRoute()
const slug = route.params.slug as string
const { fetchPortBySlug } = usePorts()
const questModal = useQuestConnectModal()

const { data: port } = await useAsyncData(`port-${slug}`, () => fetchPortBySlug(slug))

useSeoMeta({
  title: () => port.value ? `${port.value.title} — QuestPorts` : 'QuestPorts',
  description: () => port.value?.short_description || 'Standalone VR Port details, guide, and files.',
  ogTitle: () => port.value ? `${port.value.title} (Meta Quest Standalone VR)` : 'QuestPorts',
  ogDescription: () => port.value?.short_description || 'Standalone VR Port details, guide, and files.',
  ogImage: () => port.value?.cover_image_url || 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/questports-og.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => port.value ? `${port.value.title} (Meta Quest Standalone VR)` : 'QuestPorts',
  twitterDescription: () => port.value?.short_description || 'Standalone VR Port details, guide, and files.',
  twitterImage: () => port.value?.cover_image_url || 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/questports-og.png',
})

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
