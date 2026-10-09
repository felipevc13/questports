<template>
  <div v-if="enabled">
    <div
      v-if="overlay === 'usb-picker'"
      class="fixed left-4 top-20 z-[80] w-[min(380px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl"
      role="dialog"
      aria-label="Simulated WebUSB device picker"
    >
      <div class="border-b border-zinc-700 px-4 py-3">
        <div class="text-[11px] font-semibold uppercase tracking-wide text-amber-300">Simulated browser prompt</div>
        <div class="mt-1 text-sm font-semibold">questports wants to connect to a USB device</div>
        <p class="mt-1 text-[11px] leading-relaxed text-zinc-400">
          No real headset is attached. This stands in for Chrome’s WebUSB chooser.
        </p>
      </div>
      <div class="px-4 py-3">
        <label class="flex items-center gap-2 rounded-lg border border-sky-500/50 bg-sky-500/10 px-3 py-2 text-sm">
          <input type="radio" checked class="accent-sky-400" />
          <span>
            <span class="block font-medium">Meta Quest</span>
            <span class="block font-mono text-[10px] text-zinc-400">Serial MOCK-QUEST-001</span>
          </span>
        </label>
      </div>
      <div class="flex justify-end gap-2 border-t border-zinc-700 px-4 py-3">
        <button type="button" class="rounded-md px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800" @click="choose('cancel')">
          Cancel
        </button>
        <button type="button" class="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500" @click="choose('device')">
          Connect
        </button>
      </div>
    </div>

    <div
      v-if="overlay === 'visor'"
      class="fixed left-4 top-20 z-[80] w-[min(340px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-2xl border border-zinc-600 bg-black text-white shadow-2xl"
      role="dialog"
      aria-label="Simulated Quest USB debugging prompt"
    >
      <div class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-amber-300">Simulated headset visor</div>
      <div class="px-4 pb-4">
        <div class="text-sm font-semibold">Allow USB debugging?</div>
        <p class="mt-1 text-[11px] leading-relaxed text-zinc-400">
          The computer’s RSA key fingerprint is not recognized. This replaces the prompt inside the visor.
        </p>
        <label class="mt-3 flex items-center gap-2 text-[11px] text-zinc-300">
          <input type="checkbox" checked class="accent-emerald-400" />
          Always allow from this computer
        </label>
        <div class="mt-4 flex justify-end gap-2">
          <button type="button" class="rounded-md px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900" @click="choose('deny')">
            Deny
          </button>
          <button type="button" class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500" @click="choose('allow')">
            Allow
          </button>
        </div>
      </div>
    </div>

    <button
      v-if="scenario?.chrome !== false && minimized"
      type="button"
      class="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-[70] inline-flex min-h-11 items-center rounded-full border border-amber-400/50 bg-zinc-950/95 px-3 text-xs font-semibold text-amber-300 shadow-2xl"
      @click="minimized = false"
    >
      Simulated Quest
    </button>

    <form
      v-else-if="scenario?.chrome !== false"
      class="fixed bottom-4 left-4 z-[70] w-[min(320px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] space-y-2 rounded-xl border border-amber-400/50 bg-zinc-950/95 p-3 text-[11px] text-zinc-100 shadow-2xl backdrop-blur"
      @submit.prevent
    >
      <div class="flex items-center justify-between gap-2">
        <div>
          <div class="font-semibold text-amber-300">Simulated Quest</div>
          <div class="text-[10px] text-zinc-400">Test-only. Not shown without <span class="font-mono">?mockQuest=1</span>.</div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="min-h-11 text-[10px] text-zinc-400 underline md:min-h-0" @click="minimized = true">Minimize</button>
          <button type="button" class="min-h-11 text-[10px] text-zinc-400 underline md:min-h-0" @click="hideChrome">Hide</button>
        </div>
      </div>

      <label class="block space-y-1">
        <span class="text-zinc-400">Headset state</span>
        <select class="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1" :value="scenario?.phase" @change="setPhase">
          <option value="disconnected">No headset</option>
          <option value="unsupported">Unsupported browser</option>
          <option value="picker">USB permission prompt</option>
          <option value="authorizing">Authorizing inside visor</option>
          <option value="connected">Connected</option>
          <option value="scanning">Connected, scanning storage</option>
          <option value="unauthorized">Error: device unauthorized</option>
          <option value="usb-locked">Error: USB interface locked</option>
          <option value="cancelled">Error: connection cancelled</option>
          <option value="timeout">Error: authorization timeout</option>
          <option value="generic">Error: developer mode / generic</option>
        </select>
      </label>

      <label class="block space-y-1">
        <span class="text-zinc-400">Next Connect click</span>
        <select class="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1" :value="scenario?.next" @change="setField('mockNext', $event)">
          <option value="ok">USB prompt, then Allow, then connect</option>
          <option value="picker-cancel">Stay on the USB prompt until Cancel</option>
          <option value="unauthorized">Fail: device unauthorized</option>
          <option value="usb-locked">Fail: USB interface locked</option>
          <option value="cancelled">Fail: cancelled by headset</option>
          <option value="timeout">Fail: authorization timeout</option>
          <option value="generic">Fail: generic / developer mode</option>
        </select>
      </label>

      <label class="block space-y-1">
        <span class="text-zinc-400">Next Install click</span>
        <select class="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1" :value="scenario?.install" @change="setField('mockInstall', $event)">
          <option value="ok">Download, transfer, install, succeed</option>
          <option value="hold-downloading">Hold on downloading</option>
          <option value="hold-pushing">Hold on transferring APK</option>
          <option value="hold-installing">Hold on installing</option>
          <option value="hold-success">Hold on success message</option>
          <option value="download-failed">Error: download failed</option>
          <option value="storage">Error: not enough storage</option>
          <option value="disconnect">Error: disconnect mid-install</option>
          <option value="unauthorized">Error: device unauthorized</option>
          <option value="pm-failed">Error: package manager failure</option>
        </select>
      </label>

      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <span class="text-zinc-400">Catalog games</span>
          <select class="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1" :value="scenario?.game" @change="setField('mockGame', $event)">
            <option value="absent">Not installed</option>
            <option value="installed">Installed</option>
            <option value="outdated">Installed, outdated</option>
          </select>
        </label>
        <label class="block space-y-1">
          <span class="text-zinc-400">External files</span>
          <select class="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1" :value="scenario?.files" @change="setField('mockFiles', $event)">
            <option value="missing">Missing</option>
            <option value="stray">Wrong file only</option>
            <option value="primary">Required files (main folder)</option>
            <option value="alternate">Required files (alternate folder)</option>
            <option value="present">Present (same as main folder)</option>
          </select>
        </label>
      </div>

      <label class="block space-y-1">
        <span class="text-zinc-400">Free space</span>
        <select class="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1" :value="freeSpaceValue" @change="setFree">
          <option value="default">Plenty free (88G)</option>
          <option value="low">Low free space (32 MB)</option>
        </select>
      </label>

      <label class="flex items-center justify-between gap-2 text-zinc-300">
        <span>Uninstall command fails</span>
        <input type="checkbox" :checked="scenario?.uninstall === 'fail'" @change="setUninstall" />
      </label>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  isMockQuestEnabled,
  mockOverlay,
  mockScenarioRevision,
  readMockScenario,
  resolveMockChoice,
  writeMockSearch
} from '~/lib/mockQuest'
import { useQuestAdb } from '~/composables/useQuestAdb'

const questAdb = useQuestAdb()
const overlay = mockOverlay
const minimized = ref(false)

onMounted(() => {
  minimized.value = window.matchMedia('(max-width: 767px)').matches
})

const enabled = computed(() => {
  void mockScenarioRevision.value
  return isMockQuestEnabled()
})

const scenario = computed(() => {
  void mockScenarioRevision.value
  return readMockScenario()
})

const choose = (choice: 'device' | 'cancel' | 'allow' | 'deny') => {
  resolveMockChoice(choice)
}

const apply = async () => {
  await questAdb.applyMockScenario()
}

const setPhase = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  writeMockSearch({ mockPhase: value })
  apply()
}

const setField = (key: string, event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  writeMockSearch({ [key]: value })
  apply()
}

const setUninstall = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  writeMockSearch({ mockUninstall: checked ? 'fail' : 'ok' })
  apply()
}

const freeSpaceValue = computed(() => (scenario.value?.freeMb === 32 ? 'low' : 'default'))

const setFree = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  writeMockSearch({ mockFree: value === 'default' ? null : value })
  apply()
}

const hideChrome = () => {
  writeMockSearch({ mockChrome: '0' })
}
</script>
