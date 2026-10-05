<template>
  <footer class="mt-20 border-t border-border bg-card/50 py-10 text-muted-foreground text-xs">
    <div class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <div class="w-7 h-5 shrink-0">
          <AppLogo class="w-full h-full" />
        </div>
        <div class="space-y-0.5 text-center md:text-left">
          <p class="font-medium text-foreground">QuestPorts — Standalone VR Database</p>
          <p class="text-[11px] text-muted-foreground">
            Open-source community directory for native 6DoF ports and injections on Meta Quest.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <button
          @click="suggestModal.open()"
          class="hover:text-foreground transition-colors cursor-pointer text-xs"
        >
          Suggest a Game
        </button>
        <a href="https://github.com/felipevc13/questports" target="_blank" rel="noopener noreferrer" class="hover:text-foreground transition-colors">GitHub</a>
        <a href="https://sidequestvr.com" target="_blank" rel="noopener noreferrer" class="hover:text-foreground transition-colors">SideQuest</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const suggestModal = useSuggestModal()
</script>
