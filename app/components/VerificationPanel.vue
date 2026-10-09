<template>
  <section class="border-t border-border/80 pt-3" aria-labelledby="port-verification-heading">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 space-y-1">
        <h2 id="port-verification-heading" class="text-xs font-bold text-foreground">
          Verification
        </h2>
        <p class="text-[11px] font-medium leading-snug" :class="summaryClass">
          {{ summary.text }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
        :aria-expanded="expanded"
        aria-controls="port-verification-details"
        @click="expanded = !expanded"
      >
        <span>{{ expanded ? 'Hide details' : 'See details' }}</span>
        <svg
          class="h-3.5 w-3.5 transition-transform duration-200"
          :class="{ 'rotate-180': expanded }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <div
      v-show="expanded"
      id="port-verification-details"
      role="region"
      aria-labelledby="port-verification-heading"
      class="mt-3 space-y-3"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-[11px]">
          <caption class="sr-only">
            Headset verification status for this port, including Quest Pro and headsets that have not been tested.
          </caption>
          <thead class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" class="py-1 pr-2 font-medium">Headset</th>
              <th scope="col" class="py-1 pr-2 font-medium">Status</th>
              <th scope="col" class="py-1 pr-2 font-medium">When</th>
              <th scope="col" class="py-1 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.headset" class="border-t border-border/60 align-top">
              <th scope="row" class="py-1.5 pr-2 font-mono font-medium text-foreground">
                {{ row.headset }}
              </th>
              <td class="py-1.5 pr-2">
                <span :class="statusClass(row.record?.result)">
                  {{ row.record ? resultLabel(row.record.result) : 'Not tested' }}
                </span>
              </td>
              <td class="py-1.5 pr-2 font-mono text-muted-foreground">
                <template v-if="row.record">
                  <span :title="formatVerificationVersion(row.record.tested_version) || undefined">{{ formatVerificationVersion(row.record.tested_version) || '—' }}</span>
                  · {{ formatVerificationAge(row.record.checked_at) }}
                </template>
                <template v-else>—</template>
              </td>
              <td class="py-1.5 text-muted-foreground">
                {{ row.record ? sourceLabel(row.record.source) : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="checkedRows.length" class="space-y-2">
        <h3 class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">What was checked</h3>
        <div
          v-for="row in checkedRows"
          :key="`${row.headset}-checks`"
          class="rounded border border-border/70 bg-muted/20 p-2"
        >
          <div class="font-medium text-foreground">{{ row.headset }}</div>
          <p class="mt-0.5 text-muted-foreground">
            {{ checkText(row.record) }}
          </p>
          <p v-if="row.record?.notes" class="mt-1 text-foreground/90">
            <span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Notes. </span>
            {{ row.record.notes }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  describeChecks,
  formatVerificationAge,
  formatVerificationVersion,
  headsetVerificationRows,
  resultLabel,
  sourceLabel,
  verificationSummaryLine,
  type PortVerification,
  type VerificationResult,
  type VerificationSummaryTone
} from '~/lib/verification'

const props = defineProps<{
  records?: PortVerification[] | null
  slug: string
  latestVersion?: string | null
  connectedHeadset?: string | null
}>()

const expanded = ref(false)
const rows = computed(() => headsetVerificationRows(props.records, props.slug))
const checkedRows = computed(() => rows.value.filter(row => row.record))
const summary = computed(() => verificationSummaryLine(
  props.records,
  props.slug,
  props.latestVersion,
  props.connectedHeadset
))

const summaryClass = computed(() => toneClass(summary.value.tone))

const toneClass = (tone: VerificationSummaryTone) => {
  switch (tone) {
    case 'verified': return 'text-emerald-300'
    case 'issues': return 'text-amber-200'
    case 'stale': return 'text-amber-200'
    case 'failed': return 'text-rose-300'
    default: return 'text-muted-foreground'
  }
}

const checkText = (record: PortVerification | null) => {
  if (!record) return ''
  const lines = describeChecks(record.checks)
  return lines.length ? lines.join(' · ') : 'No individual checks were recorded.'
}

const statusClass = (result?: VerificationResult) => {
  if (result === 'works') return 'font-medium text-emerald-300'
  if (result === 'works_with_issues') return 'font-medium text-amber-200'
  if (result === 'doesnt_work') return 'font-medium text-rose-300'
  return 'text-muted-foreground'
}
</script>
