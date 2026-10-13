<template>
  <nav class="flex items-center gap-1" aria-label="Catalog or library">
    <NuxtLink
      to="/"
      data-testid="catalog-tab"
      class="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium md:min-h-8"
      :class="current === 'catalog'
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:text-foreground'"
    >
      Catalog
    </NuxtLink>
    <NuxtLink
      to="/library"
      data-testid="library-tab"
      class="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium md:min-h-8"
      :class="current === 'library'
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:text-foreground'"
    >
      Library
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  current: 'catalog' | 'library'
}>()
</script>
