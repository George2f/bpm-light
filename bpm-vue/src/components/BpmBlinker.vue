<script lang="ts" setup>
import { cn } from '../utils/cn';

const props = defineProps<{
  beat: boolean;
  offBeat: boolean;
  isBlinking: boolean;
  color1: string;
  color2: string;
  split: number;
}>();
</script>
<template>
  <div
    :class="
      cn('grid h-full w-full grid-cols-1', {
        'grid-cols-2': split === 2 || split === 4,
      })
    ">
    <div
      class="h-full w-full"
      :style="{
        backgroundColor: beat || !isBlinking ? color1 : color2,
      }" />
    <div
      v-if="split >= 2"
      class="h-full w-full"
      :style="{
        backgroundColor: offBeat || !isBlinking ? color1 : color2,
      }" />
    <div
      v-if="split >= 4"
      class="h-full w-full"
      :style="{
        backgroundColor: offBeat || !isBlinking ? color1 : color2,
      }" />
    <div
      v-if="split >= 4"
      class="h-full w-full"
      :style="{
        backgroundColor: beat || !isBlinking ? color1 : color2,
      }" />
  </div>
</template>
