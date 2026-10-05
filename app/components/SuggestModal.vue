<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        @keydown.esc="closeModal"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
          @click="closeModal"
        ></div>

        <!-- Modal Dialog -->
        <div
          class="relative w-full max-w-lg bg-slate-900 border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 z-10 overflow-hidden"
          @click.stop
        >
          <!-- Neon ambient background glow -->
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Close button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Close"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Success Screen -->
          <div v-if="submitted" class="text-center py-6">
            <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-black text-white mb-2">Suggestion Received!</h3>
            <p class="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto mb-6">
              Thank you for contributing to QuestPorts! We will review the standalone compatibility, extract authentic media, and list it in the catalog.
            </p>
            <button
              @click="resetAndClose"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all"
            >
              Done
            </button>
          </div>

          <!-- Submission Form -->
          <div v-else>
            <!-- Header -->
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Community Submit
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              Suggest a Standalone Port
            </h2>
            <p class="text-xs sm:text-sm text-slate-400 mb-6">
              Know of a native Meta Quest source port, emulator, or 6DoF VR injection? Share it with the community!
            </p>

            <form @submit.prevent="submitSuggestion" class="space-y-4">
              <!-- Game Title -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  Game / Port Title <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="e.g. Return to Castle Wolfenstein, Quake 3 Arena..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              <!-- URL / Repository -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  GitHub Repository, SideQuest, or Website <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.url"
                  type="url"
                  required
                  placeholder="https://github.com/... or https://sidequestvr.com/app/..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              <!-- Video / Trailer (Optional) -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  Gameplay Trailer / YouTube Video <span class="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  v-model="form.video_url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              <!-- Notes / Compatibility Details -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notes & Details <span class="text-slate-500 font-normal">(Hardware, controls, quirks)</span>
                </label>
                <textarea
                  v-model="form.notes"
                  rows="2"
                  placeholder="e.g. Native 6DoF motion controls, runs on Quest 2 & Quest 3, requires original PC game files..."
                  class="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                ></textarea>
              </div>

              <!-- Submitter Credit (Optional) -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Name or Discord <span class="text-slate-500 font-normal">(For catalog contributor credit)</span>
                </label>
                <input
                  v-model="form.submitted_by"
                  type="text"
                  placeholder="@yourhandle or Anonymous"
                  class="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              <!-- Error Alert -->
              <div v-if="errorMessage" class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {{ errorMessage }}
              </div>

              <!-- Actions -->
              <div class="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all cursor-pointer"
                >
                  <span v-if="loading" class="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>{{ loading ? 'Sending...' : 'Submit Suggestion' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

// Watch initial title if provided
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
