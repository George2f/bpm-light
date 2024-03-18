<script lang="ts" setup>
defineProps<{
  colors: string[];
  onChange: (index: number) => void;
}>();

defineEmits({
  change: (index: number) => true,
});
</script>
<template>
  <div
    class="m-4 ml-auto mr-auto grid max-h-svh w-[200px] grid-cols-2 gap-4 overflow-scroll rounded-xl bg-zinc-800 p-4">
    <button
      v-for="(color, index) in colors"
      :key="color"
      class="size-20 w-full rounded-xl text-2xl"
      :style="{
        backgroundColor: color,
      }"
      @click="$emit('change', index)"></button>
  </div>
</template>
