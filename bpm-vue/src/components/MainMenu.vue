<script lang="ts" setup>
import { cn } from '../utils/cn';
import BpmButton from './BpmButton.vue';

const emit = defineEmits({
  color1Click: null,
  color2Click: null,
  randomizeColorsClick: null,
  bpmChange: null,
  play: null,
  tutorialClick: null,
  splitClick: null,
});
const props = defineProps<{
  randomizeColors: boolean;
  split: number;
  bpm: number;
  isBlinking: boolean;
  runTutorial: boolean;
}>();

function handleInput(e: Event) {
  emit('bpmChange', Number.parseInt((e.target as HTMLInputElement)?.value));
}

function handleBpmChange(bpm: number) {
  emit('bpmChange', bpm);
}

function handleListenStart() {
  if (props.isBlinking) {
    emit('play');
  }
}

function handlePlayClick(e: any) {
  e.preventDefault();
  emit('play');
}

function handleMinusClick() {
  handleBpmChange(props.bpm - 1);
}

function handlePlusClick() {
  handleBpmChange(props.bpm + 1);
}

function handleSplitClick() {
  emit('splitClick');
}
</script>
<template>
  <div
    class="fixed bottom-0 m-4 flex flex-col gap-2 rounded-xl bg-zinc-800 p-4 text-xl font-bold text-white">
    <div class="grid grid-cols-3 gap-2">
      <div class="grid grid-cols-1 gap-2">
        <h2 class="m-0 w-full text-center">Color</h2>
        <div
          id="color-selectors"
          class="grid gap-2 md:grid-cols-2">
          <BpmButton @click="$emit('color1Click')"> Choose 1 </BpmButton>
          <BpmButton @click="$emit('color2Click')"> Choose 2 </BpmButton>
        </div>
        <div class="grid gap-2 md:grid-cols-2">
          <BpmButton
            id="button-random-colors"
            :custom-class="
              cn({
                'bg-zinc-800': !randomizeColors,
                'bg-zinc-500': randomizeColors,
              })
            "
            @click="$emit('randomizeColorsClick')">
            Random
          </BpmButton>
          <BpmButton
            id="button-split-colors"
            @click="handleSplitClick">
            {{ split > 1 ? `1/${split}` : '1' }}
          </BpmButton>
        </div>
      </div>
      <form
        id="bpm"
        class="block w-full">
        <input
          id="input-bpm"
          class="h-full !w-full rounded-xl bg-zinc-800 text-center"
          :value="bpm"
          type="number"
          inputMode="decimal"
          @input="handleInput" />
      </form>
      <div class="grid grid-cols-1 gap-2">
        <h2 class="m-0 w-full text-center">BPM</h2>
        <div class="grid gap-2 md:grid-cols-2">
          <TapAnalyzer
            id="button-tap"
            @bpm-change="handleBpmChange" />
          <AutoAnalyzer
            id="button-auto"
            @bpm-change="handleBpmChange"
            @listen-start="handleListenStart" />
        </div>
        <BpmButton
          v-if="!runTutorial"
          @click="$emit('tutorialClick')">
          Tutorial
        </BpmButton>
      </div>
    </div>
    <div
      id="player"
      class="grid grid-cols-3 gap-2 rounded-xl bg-zinc-900 p-2">
      <BpmButton @click="handleMinusClick"> - </BpmButton>
      <BpmButton
        id="button-play"
        :custom-class="
          cn({
            'bg-zinc-100': !isBlinking,
            'text-zinc-900': !isBlinking,
            'bg-zinc-500': isBlinking,
          })
        "
        type="submit"
        form="bpm"
        auto-focus
        @click="handlePlayClick">
        {{ isBlinking ? 'PAUSE' : 'PLAY' }}
      </BpmButton>
      <BpmButton @click="handlePlusClick"> + </BpmButton>
    </div>
  </div>
</template>
