<template>
  <td :class="cn('p-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', $attrs.class ?? '')">
    <slot />
  </td>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
</script>
