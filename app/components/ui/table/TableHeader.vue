<template>
  <thead :class="cn('[&_tr]:border-b [&_tr]:border-border', $attrs.class ?? '')">
    <slot />
  </thead>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
</script>
