<template>
  <div
    v-if="visible"
    class="fixed left-4 top-20 z-[80] w-[380px] rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl"
    role="dialog"
    aria-label="Browser USB device chooser"
  >
    <div class="border-b border-zinc-700 px-4 py-3">
      <div class="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Browser window</div>
      <div class="mt-1 text-sm font-semibold">questports wants to connect to a USB device</div>
      <p class="mt-1 text-[11px] leading-relaxed text-zinc-400">Select your Quest in this chooser. No headset has been picked yet.</p>
    </div>
    <div class="px-4 py-3">
      <div class="rounded-lg border border-sky-500/50 bg-sky-500/10 px-3 py-2 text-sm">
        <span class="block font-medium">Meta Quest</span>
        <span class="block font-mono text-[10px] text-zinc-400">USB</span>
      </div>
    </div>
    <div class="flex justify-end gap-2 border-t border-zinc-700 px-4 py-3 text-[11px] text-zinc-500">
      Cancel · Connect
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { parseConnectPreview } from '~/lib/questConnectUx'

const visible = ref(false)

onMounted(() => {
  visible.value = parseConnectPreview(window.location.search) === 'picker'
})
</script>
