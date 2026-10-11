<template>
  <KofiTipView :href="href" :surface="surface" @activate="onActivate" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrack } from '~/composables/useTrack'
import { isAppBridgeClient } from '~/lib/appBridge'
import { handleKofiClick, type KofiSurface } from '~/lib/kofi'
import { KofiTipView } from '~/lib/kofiTipView'

const props = defineProps<{
  surface: KofiSurface
}>()

const href = computed(() => String(useRuntimeConfig().public.kofiUrl ?? ''))
const { track } = useTrack()

function onActivate(event: MouseEvent) {
  handleKofiClick({
    surface: props.surface,
    href: href.value,
    inApp: isAppBridgeClient(),
    event,
    track
  })
}
</script>
