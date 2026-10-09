<template>
  <div class="mx-auto max-w-lg px-4 py-10">
    <h1 class="text-xl font-bold text-foreground">Add a headset verification</h1>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
      Felipe only. The secret stays in this form until you submit it. The server checks it and writes with the service role. Nothing here is linked from the catalog.
    </p>
    <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
      These statuses are a real playtest. Only this form can mark a port as having issues or as broken. A one-click install never does: if the APK installs, the card shows <span class="text-green-300">✓ Installed</span>, even when the game files were copied with SideQuest or a file manager instead of through the site.
    </p>
    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
      <li><span class="text-foreground">Works</span> — you played it and it runs. The card shows <span class="text-green-400">✓ Verified</span>.</li>
      <li><span class="text-foreground">Works with issues</span> — real problems, such as crashes or broken controls. The card shows <span class="text-amber-400">⚠ Issues</span>.</li>
      <li><span class="text-foreground">Doesn't work</span> — it does not run. The port page says so. The card stays blank.</li>
    </ul>

    <form class="mt-6 space-y-3" @submit.prevent="submit">
      <label class="block text-xs text-muted-foreground">
        Admin secret
        <input
          v-model="secret"
          type="password"
          autocomplete="current-password"
          required
          class="mt-1 w-full rounded-md border border-border bg-muted/80 px-3 py-2 text-sm text-foreground"
        />
      </label>

      <label class="block text-xs text-muted-foreground">
        Port slug
        <input
          v-model="slug"
          type="text"
          required
          placeholder="halocequest"
          class="mt-1 w-full rounded-md border border-border bg-muted/80 px-3 py-2 font-mono text-sm text-foreground"
        />
      </label>

      <label class="block text-xs text-muted-foreground">
        Tested version
        <input
          v-model="testedVersion"
          type="text"
          required
          placeholder="v1.0.16"
          class="mt-1 w-full rounded-md border border-border bg-muted/80 px-3 py-2 font-mono text-sm text-foreground"
        />
      </label>

      <label class="block text-xs text-muted-foreground">
        Headset
        <select v-model="headsetModel" class="mt-1 w-full rounded-md border border-border bg-muted/80 px-3 py-2 text-sm text-foreground">
          <option v-for="headset in headsets" :key="headset" :value="headset">{{ headset }}</option>
        </select>
      </label>

      <label class="block text-xs text-muted-foreground">
        Result
        <select v-model="result" class="mt-1 w-full rounded-md border border-border bg-muted/80 px-3 py-2 text-sm text-foreground">
          <option value="works">Works</option>
          <option value="works_with_issues">Works with issues</option>
          <option value="doesnt_work">Doesn't work</option>
        </select>
      </label>

      <fieldset class="space-y-1 text-xs text-foreground">
        <legend class="text-muted-foreground">What was confirmed</legend>
        <label class="flex items-center gap-2">
          <input v-model="apkInstalled" type="checkbox" />
          APK installed
        </label>
        <label class="flex items-center gap-2">
          <input v-model="gameFilesDetected" type="checkbox" />
          Game files detected in the expected folder
        </label>
        <label class="flex items-center gap-2">
          <input v-model="storagePathConfirmed" type="checkbox" />
          Storage path confirmed
        </label>
      </fieldset>

      <label class="block text-xs text-muted-foreground">
        Notes
        <textarea
          v-model="notes"
          rows="4"
          class="mt-1 w-full rounded-md border border-border bg-muted/80 px-3 py-2 text-sm text-foreground"
        />
      </label>

      <button
        type="submit"
        :disabled="pending"
        class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {{ pending ? 'Saving…' : 'Save verification' }}
      </button>

      <p v-if="message" role="status" class="text-sm text-foreground">{{ message }}</p>
      <p v-if="error" role="alert" class="text-sm text-rose-300">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HEADSET_MODELS } from '~/lib/verification'

useSeoMeta({
  title: 'Add verification — QuestPorts',
  robots: 'noindex, nofollow'
})

const headsets = HEADSET_MODELS
const secret = ref('')
const slug = ref('')
const testedVersion = ref('')
const headsetModel = ref<(typeof HEADSET_MODELS)[number]>('Quest 3')
const result = ref<'works' | 'works_with_issues' | 'doesnt_work'>('works')
const apkInstalled = ref(true)
const gameFilesDetected = ref(false)
const storagePathConfirmed = ref(false)
const notes = ref('')
const pending = ref(false)
const message = ref('')
const error = ref('')

const submit = async () => {
  pending.value = true
  message.value = ''
  error.value = ''
  try {
    const response = await $fetch<{ id: string }>('/api/admin/verifications', {
      method: 'POST',
      headers: { 'x-questports-admin-secret': secret.value },
      body: {
        slug: slug.value.trim(),
        testedVersion: testedVersion.value.trim(),
        headsetModel: headsetModel.value,
        result: result.value,
        notes: notes.value,
        checks: {
          apk_installed: apkInstalled.value,
          game_files_detected: gameFilesDetected.value,
          storage_path_confirmed: storagePathConfirmed.value
        }
      }
    })
    message.value = `Saved check ${response.id}.`
    notes.value = ''
  } catch (err: unknown) {
    const known = err as { statusMessage?: string; data?: { statusMessage?: string }; message?: string }
    error.value = known.data?.statusMessage || known.statusMessage || known.message || 'Could not save the check.'
  } finally {
    pending.value = false
  }
}
</script>
