<template>
  <footer class="mt-20 border-t border-white/5 py-12 glass-panel text-slate-400 text-xs">
    <div class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-6 shrink-0">
          <AppLogo class="w-full h-full" />
        </div>
        <div class="space-y-1 text-center md:text-left">
          <p class="font-bold text-slate-200">QuestPorts — The Standalone VR Database</p>
          <p class="text-[11px] text-slate-500">
            Built by the community for VR enthusiasts. Meta Quest is a registered trademark of Meta Platforms, Inc.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-6 text-slate-400">
        <a href="https://github.com/felipevc13/questports" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-400 transition-colors">GitHub</a>
        <a href="https://sidequestvr.com" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-400 transition-colors">SideQuest</a>
      </div>
    </div>
  </footer>
</template>
