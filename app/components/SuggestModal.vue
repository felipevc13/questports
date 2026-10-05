<template>
  <UiDialog :open="isOpen" @update:open="(val) => { if (!val) closeModal() }">
    <!-- Success Screen -->
    <div v-if="submitted" class="text-center py-4 space-y-4">
      <div class="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-foreground">Suggestion Received</h3>
        <p class="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto mt-1">
          Thank you for contributing. We will verify the standalone Meta Quest compatibility, extract media, and index it into the database.
        </p>
      </div>
      <UiButton @click="resetAndClose" class="w-full">
        Done
      </UiButton>
    </div>

    <!-- Submission Form -->
    <div v-else class="space-y-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <UiBadge variant="secondary" class="text-[10px] font-mono uppercase">
            Community Submit
          </UiBadge>
        </div>
        <h2 class="text-lg font-semibold text-foreground tracking-tight">
          Suggest a Standalone Port
        </h2>
        <p class="text-xs text-muted-foreground">
          Know of a native Meta Quest source port, emulator, or 6DoF injection? Add it to the queue.
        </p>
      </div>

      <form @submit.prevent="submitSuggestion" class="space-y-3">
        <!-- Game Title -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-foreground">
            Game / Port Title <span class="text-destructive">*</span>
          </label>
          <UiInput
            v-model="form.title"
            required
            placeholder="e.g. Return to Castle Wolfenstein, Quake 3 Arena..."
          />
        </div>

        <!-- URL / Repository -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-foreground">
            GitHub, SideQuest, or Download URL <span class="text-destructive">*</span>
          </label>
          <UiInput
            v-model="form.url"
            type="url"
            required
            placeholder="https://github.com/... or https://sidequestvr.com/app/..."
          />
        </div>

        <!-- Video / Trailer (Optional) -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-foreground">
            Gameplay / Trailer URL <span class="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <UiInput
            v-model="form.video_url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <!-- Notes / Compatibility Details -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-foreground">
            Compatibility Notes <span class="text-muted-foreground font-normal">(6DoF, controls, engine)</span>
          </label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="e.g. Full 6DoF motion controls, runs on Quest 2/3, requires PC assets..."
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          ></textarea>
        </div>

        <!-- Submitter Credit (Optional) -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-foreground">
            Your Handle <span class="text-muted-foreground font-normal">(For catalog contributor credit)</span>
          </label>
          <UiInput
            v-model="form.submitted_by"
            placeholder="@yourhandle or Anonymous"
          />
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive-foreground text-xs">
          {{ errorMessage }}
        </div>

        <!-- Actions -->
        <div class="pt-2 flex items-center justify-end gap-2">
          <UiButton
            type="button"
            variant="ghost"
            size="sm"
            @click="closeModal"
          >
            Cancel
          </UiButton>
          <UiButton
            type="submit"
            size="sm"
            :disabled="loading"
          >
            <span v-if="loading" class="w-3 h-3 mr-1.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
            <span>{{ loading ? 'Submitting...' : 'Submit Suggestion' }}</span>
          </UiButton>
        </div>
      </form>
    </div>
  </UiDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  initialTitle?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = ref({
  title: '',
  url: '',
  video_url: '',
  notes: '',
  submitted_by: ''
})

const loading = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

const { client, isConfigured } = useSupabase()

watch(() => props.initialTitle, (val) => {
  if (val && !form.value.title) {
    form.value.title = val
  }
})

const closeModal = () => {
  emit('close')
}

const resetAndClose = () => {
  form.value = {
    title: '',
    url: '',
    video_url: '',
    notes: '',
    submitted_by: ''
  }
  submitted.value = false
  errorMessage.value = ''
  emit('close')
}

const submitSuggestion = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!client || !isConfigured) {
      throw new Error('Supabase client not initialized')
    }

    const { error } = await client
      .from('port_suggestions')
      .insert({
        title: form.value.title.trim(),
        url: form.value.url.trim(),
        video_url: form.value.video_url ? form.value.video_url.trim() : null,
        notes: form.value.notes ? form.value.notes.trim() : null,
        submitted_by: form.value.submitted_by ? form.value.submitted_by.trim() : null,
        status: 'pending'
      })

    if (error) {
      console.error('Submission error:', error)
      throw new Error(error.message || 'Could not send suggestion')
    }

    submitted.value = true
  } catch (err: any) {
    errorMessage.value = err.message || 'An error occurred while saving your suggestion. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
