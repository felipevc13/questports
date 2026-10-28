<template>
  <div class="p-4 rounded-xl bg-card border border-border space-y-3 text-xs" data-testid="community-reports">
    <div class="flex items-center justify-between">
      <span class="font-semibold text-foreground flex items-center gap-1.5">
        <span>👥</span> Community Reports
      </span>
      <span v-if="summary.totalReviews > 0" class="text-[10px] font-mono text-muted-foreground">
        {{ summary.totalReviews }} {{ summary.totalReviews === 1 ? 'report' : 'reports' }}
      </span>
    </div>

    <!-- Summary Stats -->
    <div v-if="summary.totalReviews > 0" class="space-y-2">
      <div v-if="summary.totalReviews >= 3 && summary.worksPct !== null" class="flex items-center gap-2">
        <span class="text-sm font-bold text-green-400">
          👍 {{ summary.worksPct }}% Playable
        </span>
        <span class="text-[11px] text-muted-foreground">
          ({{ summary.worksGreatCount + summary.needsTweaksCount }} of {{ summary.totalReviews }} players)
        </span>
      </div>

      <!-- Compact Pills -->
      <div class="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
        <span
          v-if="summary.worksGreatCount > 0"
          class="inline-flex items-center gap-1 rounded border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-green-300"
        >
          <span>👍</span> {{ summary.worksGreatCount }} Works great
        </span>
        <span
          v-if="summary.needsTweaksCount > 0"
          class="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-300"
        >
          <span>🔧</span> {{ summary.needsTweaksCount }} Needs tweaks
        </span>
        <span
          v-if="summary.cantRunCount > 0"
          class="inline-flex items-center gap-1 rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-rose-300"
        >
          <span>❌</span> {{ summary.cantRunCount }} Couldn't run
        </span>
      </div>
    </div>

    <p v-else class="text-[11px] text-muted-foreground leading-relaxed">
      No community reports yet. Be the first to share how it runs on your headset.
    </p>

    <!-- User Action / Vote Box -->
    <div class="pt-2 border-t border-border/60">
      <!-- State A: Already Voted -->
      <div v-if="storedVote && !isEditingVote" class="flex items-center justify-between gap-2 text-[11px]">
        <span class="text-muted-foreground">
          Your report:
          <span class="font-medium text-foreground">
            {{ formatVerdict(storedVote.verdict) }}
          </span>
          <span v-if="storedVote.headset" class="text-muted-foreground/80">
            ({{ storedVote.headset }})
          </span>
        </span>
        <button
          type="button"
          class="cursor-pointer text-[11px] text-primary underline hover:text-primary/80"
          @click="isEditingVote = true"
        >
          Change
        </button>
      </div>

      <!-- State B: Voting Form -->
      <div v-else class="space-y-2.5">
        <p class="text-[11px] font-medium text-foreground">
          {{ isEditingVote ? 'Update your report:' : 'How did this port run for you?' }}
        </p>

        <!-- 3 Primary Buttons -->
        <div class="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            :disabled="isSubmitting"
            class="flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-colors disabled:opacity-50"
            :class="selectedVerdict === 'works_great' ? 'border-green-500 bg-green-500/20 text-green-300' : 'border-border/80 bg-muted/40 text-foreground hover:bg-muted/70'"
            @click="onSelectVerdict('works_great')"
          >
            <span>👍</span> <span class="truncate">Works great</span>
          </button>

          <button
            type="button"
            :disabled="isSubmitting"
            class="flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-colors disabled:opacity-50"
            :class="selectedVerdict === 'needs_tweaks' ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-border/80 bg-muted/40 text-foreground hover:bg-muted/70'"
            @click="onSelectVerdict('needs_tweaks')"
          >
            <span>🔧</span> <span class="truncate">Needs tweaks</span>
          </button>

          <button
            type="button"
            :disabled="isSubmitting"
            class="flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-colors disabled:opacity-50"
            :class="selectedVerdict === 'cant_run' ? 'border-rose-500 bg-rose-500/20 text-rose-300' : 'border-border/80 bg-muted/40 text-foreground hover:bg-muted/70'"
            @click="onSelectVerdict('cant_run')"
          >
            <span>❌</span> <span class="truncate">Couldn't run</span>
          </button>
        </div>

        <!-- Optional Issue Tag Chips (when not works_great) -->
        <div v-if="selectedVerdict && selectedVerdict !== 'works_great'" class="space-y-1.5 pt-1">
          <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Main issue (optional):</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="(label, tag) in ISSUE_TAG_LABELS"
              :key="tag"
              type="button"
              class="cursor-pointer rounded-full border px-2 py-0.5 text-[10px] transition-colors"
              :class="selectedIssueTag === tag ? 'border-primary bg-primary/20 text-primary font-semibold' : 'border-border/70 bg-black/30 text-muted-foreground hover:text-foreground'"
              @click="selectedIssueTag = selectedIssueTag === tag ? null : tag"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <!-- Optional Headset Selection -->
        <div v-if="selectedVerdict" class="space-y-1.5 pt-1">
          <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Headset tested on (optional):</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="h in availableHeadsets"
              :key="h.model"
              type="button"
              :disabled="!h.supported"
              class="rounded-full border px-2 py-0.5 text-[10px] transition-colors"
              :class="[
                !h.supported ? 'opacity-30 cursor-not-allowed border-transparent text-muted-foreground' :
                selectedHeadset === h.model ? 'border-primary bg-primary/20 text-primary font-semibold cursor-pointer' :
                'border-border/70 bg-black/30 text-muted-foreground hover:text-foreground cursor-pointer'
              ]"
              :title="!h.supported ? 'This port does not support ' + h.model : ''"
              @click="h.supported && (selectedHeadset = selectedHeadset === h.model ? null : h.model)"
            >
              {{ h.model }}
            </button>
          </div>
        </div>

        <!-- Action Submit / Cancel Buttons -->
        <div v-if="selectedVerdict" class="flex items-center justify-between pt-1.5">
          <button
            type="button"
            class="text-[11px] text-muted-foreground underline hover:text-foreground"
            @click="cancelEditing"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="isSubmitting"
            class="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            @click="submitReport"
          >
            {{ isSubmitting ? 'Saving…' : 'Submit Report' }}
          </button>
        </div>

        <p v-if="errorMessage" class="text-[11px] text-rose-400" role="alert">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Port } from '~/types/port'
import {
  getOrCreateDeviceId,
  getStoredUserVote,
  setStoredUserVote,
  ISSUE_TAG_LABELS,
  VERDICT_LABELS,
  type CommunityVerdict,
  type CommunityIssueTag,
  type CommunitySummary,
  type StoredUserVote
} from '~/lib/communityReviews'

const props = defineProps<{
  port?: Port | null
}>()

const summary = ref<CommunitySummary>({
  portSlug: props.port?.slug || '',
  totalReviews: 0,
  worksGreatCount: 0,
  needsTweaksCount: 0,
  cantRunCount: 0,
  appVerifiedCount: 0,
  worksPct: null,
  lastReviewAt: null,
  headsets: {}
})

const storedVote = ref<StoredUserVote | null>(null)
const isEditingVote = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const selectedVerdict = ref<CommunityVerdict | null>(null)
const selectedIssueTag = ref<CommunityIssueTag | null>(null)
const selectedHeadset = ref<string | null>(null)

const ALL_HEADSETS = ['Quest 3', 'Quest 3S', 'Quest 2', 'Quest Pro'] as const

const availableHeadsets = computed(() => {
  const supported = Array.isArray(props.port?.supported_hardware)
    ? props.port.supported_hardware
    : []
  return ALL_HEADSETS.map(model => ({
    model,
    // Quest 3 and 3S are typically supported if either is mentioned, or check exact list
    supported: supported.length === 0 || supported.includes(model)
  }))
})

function formatVerdict(verdict: CommunityVerdict): string {
  const v = VERDICT_LABELS[verdict]
  return v ? `${v.icon} ${v.label}` : verdict
}

function onSelectVerdict(v: CommunityVerdict) {
  selectedVerdict.value = v
  if (v === 'works_great') {
    selectedIssueTag.value = null
  }
}

function cancelEditing() {
  isEditingVote.value = false
  selectedVerdict.value = storedVote.value?.verdict || null
  selectedIssueTag.value = storedVote.value?.issueTag || null
  selectedHeadset.value = storedVote.value?.headset || null
  errorMessage.value = null
}

async function fetchSummary() {
  if (!props.port?.slug) return
  try {
    const res = await $fetch<CommunitySummary>(`/api/ports/${props.port.slug}/community`)
    if (res) {
      summary.value = res
    }
  } catch {
    // Graceful fallback to default 0 counts
  }
}

async function submitReport() {
  if (!selectedVerdict.value || !props.port?.slug) return
  isSubmitting.value = true
  errorMessage.value = null

  const deviceId = getOrCreateDeviceId()

  try {
    await $fetch(`/api/ports/${props.port.slug}/community`, {
      method: 'POST',
      body: {
        deviceId,
        verdict: selectedVerdict.value,
        issueTag: selectedIssueTag.value,
        headset: selectedHeadset.value,
        portVersion: props.port.latest_version || null,
        source: 'web'
      }
    })

    const newVote: StoredUserVote = {
      verdict: selectedVerdict.value,
      issueTag: selectedIssueTag.value,
      headset: selectedHeadset.value,
      portVersion: props.port.latest_version || null,
      timestamp: Date.now()
    }

    setStoredUserVote(props.port.slug, newVote)
    storedVote.value = newVote
    isEditingVote.value = false

    // Refresh summary
    await fetchSummary()
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || err?.message || 'Failed to submit report. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (props.port?.slug) {
    storedVote.value = getStoredUserVote(props.port.slug)
    if (storedVote.value) {
      selectedVerdict.value = storedVote.value.verdict
      selectedIssueTag.value = storedVote.value.issueTag || null
      selectedHeadset.value = storedVote.value.headset || null
    }
    fetchSummary()
  }
})
</script>

