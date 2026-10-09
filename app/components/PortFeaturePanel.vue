<script setup lang="ts">
import { computed } from 'vue'
import { buildPortFeatureView, type FeatureClaim } from '~/lib/portFeatures'
import type { Port } from '~/types/port'

const props = defineProps<{ port: Port }>()

const view = computed(() => buildPortFeatureView(props.port))

function valueClass(claim: FeatureClaim): string {
  if (claim.id === 'comfort_rating') {
    if (claim.value === 'Comfortable') return 'text-emerald-400'
    if (claim.value === 'Moderate') return 'text-blue-400'
    if (claim.value === 'Intense') return 'text-amber-400'
  }
  return claim.affirmed ? 'text-emerald-400' : 'text-foreground'
}
</script>

<template>
  <div
    v-if="view.hasContent"
    class="rounded-xl border border-border/80 bg-card/60 overflow-hidden shadow-sm"
  >
    <ul
      v-if="view.summary.length"
      class="p-3 m-0 list-none flex flex-wrap gap-2 text-xs"
      aria-label="Recorded VR features"
    >
      <li
        v-for="claim in view.summary"
        :key="claim.id"
        class="p-2 rounded-lg bg-muted/20 border border-border/50 min-w-[8.5rem]"
      >
        <div class="text-muted-foreground text-[11px] uppercase font-mono tracking-wider md:text-[10px]">
          {{ claim.label }}
        </div>
        <div
          class="font-semibold mt-0.5"
          :class="valueClass(claim)"
        >
          <span v-if="claim.affirmed" aria-hidden="true">✓ </span>
          <span v-if="claim.affirmed" class="sr-only">Yes, </span>
          <span>{{ claim.value }}</span>
        </div>
      </li>
    </ul>

    <div
      v-if="view.chips.length"
      class="p-3 space-y-3"
      :class="view.summary.length ? 'border-t border-border/40' : ''"
    >
      <div
        v-for="group in view.chips"
        :key="group.id"
        class="space-y-1"
      >
        <div class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold md:text-[10px]">
          {{ group.label }}
        </div>
        <ul class="m-0 p-0 list-none flex flex-wrap gap-1" :aria-label="group.label">
          <li
            v-for="chip in group.chips"
            :key="chip"
            class="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-xs font-mono md:text-[10px]"
          >
            {{ chip }}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <p
    v-else
    class="text-xs text-muted-foreground rounded-xl border border-dashed border-border/70 px-3 py-2.5"
  >
    VR feature details have not been recorded for this port.
  </p>
</template>
