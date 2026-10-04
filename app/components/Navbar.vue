<template>
  <header class="sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-md">
    <div class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-quest-purple to-pink-500 p-[2px] shadow-glow-cyan transition-transform group-hover:scale-105">
          <div class="w-full h-full bg-quest-dark rounded-[10px] flex items-center justify-center">
            <!-- VR Headset Icon -->
            <svg class="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M6 8h12a3 3 0 013 3v2a3 3 0 01-3 3H6a3 3 0 01-3-3v-2a3 3 0 013-3z" />
              <circle cx="8.5" cy="12" r="1.5" fill="currentColor" />
              <circle cx="15.5" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              QuestPorts
            </span>
            <span class="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Zero PC
            </span>
          </div>
          <p class="text-[11px] text-slate-400 font-mono hidden sm:block">The Standalone VR Database</p>
        </div>
      </NuxtLink>

      <!-- Navigation & Action Links -->
      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>100% Native Hardware</span>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-quest-card hover:bg-quest-border border border-white/10 transition-colors"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span class="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </div>
  </header>
</template>
