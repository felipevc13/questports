<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
    <Navbar />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <Footer />
    <!-- Global Suggest Modal (mounts on top of everything) -->
    <SuggestModal :is-open="suggestModal.isOpen.value" :initial-title="suggestModal.prefillTitle.value" @close="suggestModal.close" />
  </div>
</template>

<script setup lang="ts">
const suggestModal = useSuggestModal()
</script>
