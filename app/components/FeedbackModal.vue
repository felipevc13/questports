<template>
  <UiDialog :open="isOpen" @update:open="(val) => { if (!val) closeModal() }">
    <div v-if="submitted" class="text-center py-4 space-y-4">
      <div class="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-foreground">Thanks — we got it</h3>
        <p class="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto mt-1">
          {{ kind === 'bug' ? 'We’ll look into the bug and fix it when we can.' : 'We’ll review the idea and keep it in the queue.' }}
        </p>
      </div>
      <UiButton @click="resetAndClose" class="w-full">
        Done
      </UiButton>
    </div>

    <div v-else class="space-y-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <UiBadge variant="secondary" class="text-[10px] font-mono uppercase">
            Product Feedback
          </UiBadge>
        </div>
        <h2 class="text-lg font-semibold text-foreground tracking-tight">
          Feature or bug
        </h2>
        <p class="text-xs text-muted-foreground">
          Tell us what to build next, or what broke while you were using QuestPorts.
        </p>
      </div>

      <form @submit.prevent="submitFeedback" class="space-y-3">
        <div class="space-y-1">
          <label class="block text-xs font-medium text-foreground">Type</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="rounded-md border px-3 py-2 text-left text-xs transition-colors"
              :class="kind === 'feature'
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
              @click="kind = 'feature'"
            >
              <div class="font-semibold text-foreground">Feature</div>
              <div class="mt-0.5 text-[11px]">A new idea for the site</div>
            </button>
            <button
              type="button"
              class="rounded-md border px-3 py-2 text-left text-xs transition-colors"
              :class="kind === 'bug'
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
              @click="kind = 'bug'"
            >
              <div class="font-semibold text-foreground">Bug</div>
              <div class="mt-0.5 text-[11px]">Something isn’t working</div>
            </button>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-medium text-foreground">
            {{ kind === 'bug' ? 'What happened?' : 'What’s the idea?' }}
            <span class="text-destructive">*</span>
          </label>
          <textarea
            v-model="message"
            required
            minlength="8"
            maxlength="4000"
            rows="4"
            :placeholder="kind === 'bug'
              ? 'What were you doing, and what went wrong?'
              : 'Describe the feature you’d like to see…'"
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          ></textarea>
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-medium text-foreground">
            Your handle <span class="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <UiInput
            v-model="submittedBy"
            placeholder="@yourhandle or Anonymous"
          />
        </div>

        <div v-if="errorMessage" class="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive-foreground text-xs">
          {{ errorMessage }}
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <UiButton type="button" variant="ghost" size="sm" @click="closeModal">
            Cancel
          </UiButton>
          <UiButton type="submit" size="sm" :disabled="loading">
            <span v-if="loading" class="w-3 h-3 mr-1.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
            <span>{{ loading ? 'Sending...' : 'Send feedback' }}</span>
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
  initialPagePath?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const kind = ref<'feature' | 'bug'>('feature')
const message = ref('')
const submittedBy = ref('')
const pagePath = ref('')
const loading = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

const { client, isConfigured } = useSupabase()

watch(() => props.initialPagePath, (val) => {
  if (val) pagePath.value = val
}, { immediate: true })

const closeModal = () => {
  emit('close')
}

const resetAndClose = () => {
  kind.value = 'feature'
  message.value = ''
  submittedBy.value = ''
  submitted.value = false
  errorMessage.value = ''
  emit('close')
}

const submitFeedback = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!client || !isConfigured) {
      throw new Error('Supabase client not initialized')
    }

    const { error } = await client
      .from('site_feedback')
      .insert({
        kind: kind.value,
        message: message.value.trim(),
        page_path: pagePath.value || null,
        submitted_by: submittedBy.value.trim() || null,
        status: 'pending'
      })

    if (error) {
      console.error('Feedback error:', error)
      throw new Error(error.message || 'Could not send feedback')
    }

    submitted.value = true
  } catch (err: any) {
    errorMessage.value = err.message || 'Could not save your feedback. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
