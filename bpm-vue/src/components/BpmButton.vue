<script lang="ts" setup>
import { cn } from '../utils/cn';

const props = defineProps<{
  customClass?: string;
}>();
</script>
<template>
  <button
    :class="
      cn(
        'size-10 w-full select-none rounded-xl bg-zinc-700 active:bg-transparent',
        customClass as string | undefined
      )
    ">
    <slot />
  </button>
</template>
