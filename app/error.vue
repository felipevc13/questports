<template>
  <div class="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-background text-foreground">
    <Navbar />
    <main class="flex-1">
      <div class="max-w-xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div class="space-y-3">
          <p class="font-mono text-xs text-primary">{{ statusCode }}</p>
          <h1 class="text-3xl font-bold tracking-tight text-foreground">
            {{ isNotFound ? 'Page not found' : 'Something went wrong' }}
          </h1>
          <p class="text-sm text-muted-foreground leading-relaxed">
            <template v-if="isNotFound">
              That address is not in the QuestPorts catalog. Search for a game, or go back to the full list.
            </template>
            <template v-else>
              QuestPorts could not load this page. Try again in a moment, or go back to the catalog.
            </template>
          </p>
          <p v-if="devDetail" class="font-mono text-[11px] text-muted-foreground">
            {{ devDetail }}
          </p>
        </div>

        <form class="flex flex-col sm:flex-row gap-2" @submit.prevent="searchCatalog">
          <label class="sr-only" for="error-search">Search the catalog</label>
          <input
            id="error-search"
            v-model="query"
            type="search"
            name="q"
            placeholder="Search by game, engine, or developer..."
            class="min-h-11 flex-1 rounded-md border border-border bg-muted/80 px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring md:min-h-0 md:text-sm"
          />
          <button
            type="submit"
            class="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:min-h-0"
          >
            Search
          </button>
        </form>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:min-h-0"
            @click="goTo('/')"
          >
            Browse all ports
          </button>
          <button
            type="button"
            class="min-h-11 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted md:min-h-0"
            @click="retry"
          >
            Try again
          </button>
        </div>

        <div v-if="popularPorts.length" class="space-y-2">
          <h2 class="text-xs font-mono uppercase tracking-wider text-muted-foreground">Popular ports</h2>
          <ul class="space-y-1.5">
            <li v-for="port in popularPorts" :key="port.slug">
              <button
                type="button"
                class="inline-flex min-h-11 items-center text-left text-sm text-primary hover:underline md:min-h-0"
                @click="goTo(`/ports/${port.slug}`)"
              >
                {{ port.title }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NuxtError } from '#app'
import { INITIAL_PORTS } from '~/data/mockPorts'
import { canonicalPageUrl } from '~/lib/siteUrl'

const props = defineProps<{ error: NuxtError }>()

const query = ref('')
const statusCode = computed(() => props.error?.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)
const route = useRoute()
const pageUrl = computed(() => canonicalPageUrl(route.path))

const devDetail = computed(() => {
  if (!import.meta.dev || isNotFound.value) return ''
  const text = String(props.error?.statusMessage || props.error?.message || '')
  const firstLine = text.split('\n')[0]?.trim() || ''
  if (!firstLine || /at\s+.+\s+\(.+:\d+:\d+\)/.test(firstLine)) return ''
  return firstLine.slice(0, 180)
})

const popularPorts = INITIAL_PORTS.filter(port => port.featured).slice(0, 4)

useSeoMeta({
  title: () => isNotFound.value ? 'Page not found — QuestPorts' : 'Something went wrong — QuestPorts',
  robots: 'noindex, nofollow',
  ogUrl: () => pageUrl.value
})

useHead(() => ({
  link: [{ rel: 'canonical', href: pageUrl.value }]
}))

const goTo = (path: string) => {
  clearError({ redirect: path })
}

const searchCatalog = () => {
  const term = query.value.trim()
  goTo(term ? `/?q=${encodeURIComponent(term)}` : '/')
}

const retry = () => {
  clearError()
}
</script>
