<script lang="ts" setup>
import { ref } from 'vue';
import BpmButton from './BpmButton.vue';

interface TapRecord {
  timestamp: number;
  bpm: number;
}
const emit = defineEmits({
  bpmChange: (bpm: number) => true,
});

const history = ref<TapRecord[]>([]);

function handleClick() {
  const now = Date.now();

  if (history.value.length === 0) {
    return history.value.push({ timestamp: now, bpm: 0 });
  }

  const lastTap = history.value[history.value.length - 1];
  const bpm = 60000 / (now - lastTap.timestamp);
  history.value.push({ timestamp: now, bpm });

  // Remove taps older than 5 seconds
  const fiveSecondsAgo = now - 5000;
  history.value = history.value.filter((tap) => tap.timestamp > fiveSecondsAgo);

  const averageBpm = Math.round(
    history.value.reduce((sum, tap) => sum + tap.bpm, 0) / history.value.length
  );

  emit('bpmChange', averageBpm);
}
</script>
<template>
  <BpmButton @click="handleClick"> Tap </BpmButton>
</template>
