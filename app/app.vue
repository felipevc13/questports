<template>
  <div class="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
    <Navbar />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <Footer />
    <!-- Global Suggest / Feedback modals -->
    <SuggestModal :is-open="suggestModal.isOpen.value" :initial-title="suggestModal.prefillTitle.value" @close="suggestModal.close" />
    <FeedbackModal :is-open="feedbackModal.isOpen.value" :initial-page-path="feedbackModal.pagePath.value" @close="feedbackModal.close" />
    <ClientOnly>
      <MockQuestPanel />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSuggestModal } from '~/composables/useSuggestModal'
import { useFeedbackModal } from '~/composables/useFeedbackModal'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { canonicalPageUrl } from '~/lib/siteUrl'

const route = useRoute()
const pageUrl = computed(() => canonicalPageUrl(route.path))

useHead(() => ({
  link: [{ rel: 'canonical', href: pageUrl.value }]
}))

useSeoMeta({
  ogUrl: () => pageUrl.value
})

const suggestModal = useSuggestModal()
const feedbackModal = useFeedbackModal()
const questAdb = useQuestAdb()

onMounted(async () => {
  questAdb.setupUsbEventListeners()
  await questAdb.tryAutoConnect()
})
</script>
