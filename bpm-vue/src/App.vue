<script lang="ts" setup>
import BpmBlinker from './components/BpmBlinker.vue';
import MainMenu from './components/MainMenu.vue';
import ColorSelector from './components/ColorSelector.vue';
import { watch, ref, onUnmounted } from 'vue';
import { BLINKER_COLORS, BLINKER_COLORS_2 } from './constants/blinkerColors';
import { cn } from './utils/cn';

const isBlinking = ref<boolean>(false);
const bpm = ref<number>(140);
const colorIndex = ref<[number, number]>([0, 0]);
const beat = ref<boolean>(false);
const offBeat = ref<boolean>(false);
const randomizeColors = ref<boolean>(false);
const split = ref<number>(1);
const canRunTutorial = ref<boolean>(false);
const colorSelectorOpen = ref<number | false>(false);
const menuVisible = ref<boolean>(true);

canRunTutorial.value = localStorage.getItem('visitedPreviously') !== 'true';

setTimeout(() => localStorage.setItem('visitedPreviously', 'true'), 10000);

let interval: number = 0;

watch([bpm, isBlinking], () => {
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(
    () => {
      if (isBlinking.value) {
        let index1 = colorIndex.value[0];
        let index2 = colorIndex.value[1];

        if (randomizeColors.value) {
          const newIndex1 = Math.floor(Math.random() * BLINKER_COLORS.length);
          let newIndex2 = Math.floor(Math.random() * BLINKER_COLORS_2.length);
          if (BLINKER_COLORS[newIndex1] === BLINKER_COLORS_2[newIndex2]) {
            newIndex2 = newIndex2 - 1;
          }
          index1 = newIndex1;
          index2 = newIndex2;
        }
        colorIndex.value = [index1, index2];

        beat.value = true;
        setTimeout(
          () => {
            beat.value = false;
          },
          (60 / bpm.value) * 250
        );

        setTimeout(
          () => {
            offBeat.value = true;
          },
          (60 / bpm.value) * 500
        );
        setTimeout(
          () => {
            offBeat.value = false;
          },
          (60 / bpm.value) * 750
        );
      }
    },
    (60 / bpm.value) * 1000
  );

  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<template>
  <div
    :class="cn('flex h-full w-full flex-col items-center justify-center')"
    :style="{ backgroundColor: 'black' }">
    <button
      @click="menuVisible = !menuVisible"
      :class="cn('flex h-full w-full items-center justify-center')"
      id="button-main"
      tabIndex="{-1}">
      <bpm-blinker
        :is-blinking="isBlinking && !colorSelectorOpen"
        :beat="beat"
        :off-beat="offBeat"
        :split="split"
        :color1="BLINKER_COLORS[colorIndex[0]]"
        :color2="BLINKER_COLORS_2[colorIndex[1]]" />
    </button>
    <div
      v-if="colorSelectorOpen"
      class="fixed left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center">
      <button
        @click="colorSelectorOpen = false"
        class="fixed left-0 top-0 -z-10 h-full w-full bg-black opacity-30" />
      <color-selector
        :colors="colorSelectorOpen === 1 ? BLINKER_COLORS : BLINKER_COLORS_2"
        @change="
          (ci: number) => {
            if (colorSelectorOpen === 1) {
              colorIndex = [ci, colorIndex[1]];
            } else {
              colorIndex = [colorIndex[0], ci];
            }
            colorSelectorOpen = false;
          }
        " />
    </div>
    <main-menu
      v-if="menuVisible"
      @color1-click="
        () => {
          randomizeColors = false;
          colorSelectorOpen = 1;
        }
      "
      @color2-click="
        () => {
          randomizeColors = false;
          colorSelectorOpen = 2;
        }
      "
      @randomize-colors-click="randomizeColors = !randomizeColors"
      @split-click="
        () => {
          split = split === 4 ? 1 : split * 2;
        }
      "
      @bpm-change="(v) => (bpm = Math.max(1, Math.min(v, 3600)))"
      @tutorial-click="canRunTutorial = true"
      @play="isBlinking = !isBlinking"
      :randomize-colors="randomizeColors"
      :split="split"
      :bpm="bpm"
      :is-blinking="isBlinking"
      :run-tutorial="canRunTutorial" />
  </div>
</template>
