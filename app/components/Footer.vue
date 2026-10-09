<template>
  <footer class="mt-12 border-t border-border bg-card/50 py-8 text-xs text-muted-foreground md:mt-20 md:py-10">
    <div class="mx-auto flex w-full max-w-[1720px] flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-10">
      <div class="flex items-center gap-3">
        <div class="h-5 w-7 shrink-0">
          <AppLogo class="h-full w-full" />
        </div>
        <div class="space-y-0.5 text-center md:text-left">
          <p class="font-medium text-foreground">QuestPorts — Standalone VR Database</p>
          <p class="text-[11px] text-muted-foreground">
            Open-source community directory for native 6DoF ports and injections on Meta Quest.
          </p>
        </div>
      </div>

      <div class="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:items-center md:gap-6">
        <button
          @click="suggestModal.open()"
          class="inline-flex min-h-11 items-center justify-center rounded-md px-2 text-center text-xs transition-colors hover:text-foreground md:min-h-0 md:justify-start md:px-0 md:py-0"
        >
          Suggest a Game
        </button>
        <button
          @click="feedbackModal.open(route.fullPath)"
          class="inline-flex min-h-11 items-center justify-center rounded-md px-2 text-center text-xs transition-colors hover:text-foreground md:min-h-0 md:justify-start md:px-0 md:py-0"
        >
          Feature or bug
        </button>
        <a href="https://github.com/felipevc13/questports" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center justify-center rounded-md px-2 transition-colors hover:text-foreground md:min-h-0 md:justify-start md:px-0">GitHub</a>
        <a href="https://sidequestvr.com" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center justify-center rounded-md px-2 transition-colors hover:text-foreground md:min-h-0 md:justify-start md:px-0">SideQuest</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const suggestModal = useSuggestModal()
const feedbackModal = useFeedbackModal()
const route = useRoute()
</script>
