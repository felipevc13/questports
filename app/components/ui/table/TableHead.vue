<template>
  <th :class="cn('h-10 px-3 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', $attrs.class ?? '')">
    <slot />
  </th>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
</script>
