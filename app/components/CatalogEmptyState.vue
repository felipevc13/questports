<template>
  <div data-testid="catalog-empty" class="rounded-lg border border-border bg-card px-4 py-10 text-center">
    <h3 class="text-base font-semibold text-foreground break-words">
      <template v-if="query">No ports match "{{ query }}"</template>
      <template v-else>No ports found</template>
    </h3>
    <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
      <template v-if="requestable && suggestions.length">
        Nothing in the catalog matches that search. Request it, or try a close match.
      </template>
      <template v-else-if="requestable">
        Nothing in the catalog matches that search.
      </template>
      <template v-else-if="query">
        These match your search, but the current filters hide them.
      </template>
      <template v-else>
        Try another category, headset, or developer.
      </template>
    </p>

    <div v-if="suggestions.length" class="mx-auto mt-5 max-w-md text-left">
      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Did you mean</p>
      <ul class="mt-2 space-y-2">
        <li v-for="(hit, index) in suggestions" :key="hit.item.slug">
          <NuxtLink
            :to="`/ports/${hit.item.slug}`"
            data-testid="search-suggestion"
            class="flex min-h-11 items-center rounded-md border border-border bg-muted/40 px-3 py-2 text-left hover:border-primary/50"
            @click="emit('open', hit, index)"
          >
            <span class="min-w-0">
              <span class="block truncate text-sm font-semibold text-foreground">{{ hit.item.title }}</span>
              <span class="block truncate text-xs text-muted-foreground">{{ hit.item.developer }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
      <button
        v-if="requestable"
        type="button"
        data-testid="request-this-game"
        class="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        @click="emit('request')"
      >
        Request this game
      </button>
      <button
        v-else-if="!query"
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        @click="emit('suggest')"
      >
        Suggest a game
      </button>
      <button
        v-if="filtersActive"
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground"
        @click="emit('clear')"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CatalogSearchHit } from '~/lib/catalogSearch'
import type { Port } from '~/types/port'

defineProps<{
  query: string
  suggestions: CatalogSearchHit<Port>[]
  filtersActive: boolean
  requestable: boolean
}>()

const emit = defineEmits<{
  request: []
  suggest: []
  clear: []
  open: [hit: CatalogSearchHit<Port>, index: number]
}>()
</script>
