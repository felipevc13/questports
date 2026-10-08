<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
    <Navbar />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <Footer />
    <!-- Global Suggest / Feedback modals -->
    <SuggestModal :is-open="suggestModal.isOpen.value" :initial-title="suggestModal.prefillTitle.value" @close="suggestModal.close" />
    <FeedbackModal :is-open="feedbackModal.isOpen.value" :initial-page-path="feedbackModal.pagePath.value" @close="feedbackModal.close" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSuggestModal } from '~/composables/useSuggestModal'
import { useFeedbackModal } from '~/composables/useFeedbackModal'
import { useQuestAdb } from '~/composables/useQuestAdb'

const suggestModal = useSuggestModal()
const feedbackModal = useFeedbackModal()
const questAdb = useQuestAdb()

onMounted(() => {
  questAdb.setupUsbEventListeners()
  questAdb.tryAutoConnect()
})
</script>
