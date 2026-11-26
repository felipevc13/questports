<template>
  <div data-testid="gt4-manual-install" class="space-y-3 text-xs">
    <p class="leading-relaxed text-muted-foreground">
      Choose a version and install its APK manually. Online and Spec II are separate apps; QuestPorts does not install either automatically.
    </p>
    <div class="space-y-2 rounded-lg border border-border/80 bg-muted/20 p-3">
      <p class="font-bold text-foreground">GT4 Online VR</p>
      <p class="leading-relaxed text-muted-foreground">Requires your own US v2.00 ISO. Copy it to <span class="break-all font-mono">/sdcard/GT4HD/</span>.</p>
      <a
        href="https://github.com/SgtBilko76/gt4-vr/releases/download/v0.3.2-beta-online/GT4-Online-VR-0.3.2-beta.apk"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="gt4-online-download"
        class="inline-flex min-h-11 items-center rounded-lg bg-primary px-3 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
        @click="onDownload('online')"
      >Download Online APK ↗</a>
    </div>
    <div class="space-y-2 rounded-lg border border-border/80 bg-muted/20 p-3">
      <p class="font-bold text-foreground">GT4 Spec II VR</p>
      <p class="leading-relaxed text-muted-foreground">Requires a Spec II 1.10 ISO made from your own US Online Public Beta disc and the Spec II patch. Copy it to <span class="break-all font-mono">/sdcard/GT4SpecII/</span>.</p>
      <a
        href="https://github.com/SgtBilko76/gt4-vr/releases/download/v0.3.2-beta-specii/GT4-SpecII-VR-0.3.2-beta.apk"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="gt4-specii-download"
        class="inline-flex min-h-11 items-center rounded-lg bg-primary px-3 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
        @click="onDownload('specii')"
      >Download Spec II APK ↗</a>
    </div>
    <p class="leading-relaxed text-muted-foreground">No game data is included. See the installation guide for setup and file access.</p>
    <a href="#install-guide" class="inline-flex min-h-11 items-center font-semibold text-primary underline">Installation guide</a>
    <a href="https://github.com/SgtBilko76/gt4-vr/releases" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center font-semibold text-primary underline">All official releases ↗</a>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTrack } from '~/composables/useTrack'

const route = useRoute()
const { track } = useTrack()

function onDownload(build: 'online' | 'specii') {
  track('manual_download_click', {
    path: route.path,
    portSlug: 'gran-turismo-4-vr',
    props: { build }
  })
}
</script>
