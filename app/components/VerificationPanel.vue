<template>
  <section class="space-y-3 border-t border-border/80 pt-3" aria-labelledby="port-verification-heading">
    <div class="flex items-center justify-between gap-2">
      <h2 id="port-verification-heading" class="text-xs font-bold text-foreground">
        Verification
      </h2>
      <span class="font-mono text-[10px] text-muted-foreground">Headset checks</span>
    </div>

    <p class="text-[11px] leading-relaxed text-muted-foreground">
      {{ summary }}
    </p>

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
                {{ formatVerificationVersion(row.record.tested_version) }}
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
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  buildVerificationBadge,
  describeChecks,
  formatVerificationAge,
  formatVerificationVersion,
  headsetVerificationRows,
  latestVerification,
  resultLabel,
  sourceLabel,
  type PortVerification,
  type VerificationResult
} from '~/lib/verification'

const props = defineProps<{
  records?: PortVerification[] | null
  slug: string
  latestVersion?: string | null
}>()

const latest = computed(() => latestVerification(props.records, props.slug))
const badge = computed(() => buildVerificationBadge(latest.value, props.latestVersion))
const rows = computed(() => headsetVerificationRows(props.records, props.slug))
const checkedRows = computed(() => rows.value.filter(row => row.record))

const summary = computed(() => {
  const catalog = formatVerificationVersion(props.latestVersion) || 'the current catalog version'
  if (!latest.value) {
    return `No headset check is on record for this port. Catalog version ${catalog} has not been tested.`
  }
  const tested = formatVerificationVersion(latest.value.tested_version)
  if (badge.value?.state === 'current') {
    const tone = latest.value.result === 'works_with_issues' ? 'with issues' : 'and matches'
    return `Latest check is ${tested} on ${latest.value.headset_model} (${formatVerificationAge(latest.value.checked_at)}), ${tone} catalog version ${catalog}.`
  }
  if (badge.value?.state === 'stale') {
    return `Verified on ${tested}. Catalog version ${catalog} has not been tested.`
  }
  return `Latest check of ${tested} on ${latest.value.headset_model} is ${resultLabel(latest.value.result).toLowerCase()}. It is not shown as verified.`
})

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
