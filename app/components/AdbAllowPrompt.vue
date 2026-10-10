<template>
  <div
    data-testid="adb-allow-prompt"
    class="flex items-center gap-2.5 rounded-lg border border-amber-500/25 bg-black/40 p-2.5"
    aria-hidden="true"
  >
    <svg class="h-11 w-14 shrink-0 text-amber-200" viewBox="0 0 64 48" fill="none">
      <path d="M6 22c6-2 10-8 14-8h24c4 0 8 6 14 8v4c-6 2-10 8-14 8H20c-4 0-8-6-14-8v-4z" stroke="currentColor" stroke-width="2" />
      <rect x="16" y="18" width="12" height="10" rx="3" stroke="currentColor" stroke-width="2" />
      <rect x="36" y="18" width="12" height="10" rx="3" stroke="currentColor" stroke-width="2" />
      <path d="M10 26H6m48 0h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <div class="min-w-0 flex-1 rounded-md border border-white/10 bg-zinc-950 px-2.5 py-2">
      <p class="text-[11px] font-semibold text-white">Allow USB debugging?</p>
      <p class="mt-1 font-mono text-[9px] leading-tight text-zinc-400">RSA key fingerprint</p>
      <p class="font-mono text-[9px] leading-tight text-zinc-300">A1:B2:C3:D4:E5:F6:…</p>
      <p class="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-300">
        <span class="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border border-emerald-400 bg-emerald-500/20">
          <svg viewBox="0 0 12 12" class="h-2.5 w-2.5" fill="none">
            <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span>Always allow from this computer</span>
      </p>
      <div class="mt-1.5 flex justify-end">
        <span class="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-black ring-2 ring-emerald-300/70">Allow</span>
      </div>
    </div>
  </div>
</template>
