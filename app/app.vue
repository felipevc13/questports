<template>
  <div class="min-h-screen flex flex-col bg-quest-dark text-slate-100 selection:bg-cyan-500 selection:text-black">
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
