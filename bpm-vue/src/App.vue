<script setup lang="ts">
import Blinker from './components/Blinker.vue';
import MainMenu from './components/MainMenu.vue';
import ColorSelector from './components/ColorSelector.vue';
import Button from './components/Button.vue';
</script>

<template>
    <div>
        <Blinker />
        <MainMenu />
        <ColorSelector />
        <Button @click="console.log('klik')" customClass="size-10 w-full">
            This is button
        </Button>
    </div>
</template>
