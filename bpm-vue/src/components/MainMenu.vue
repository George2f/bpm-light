<script lang="ts" setup>
import { cn } from '../utils/cn';

const emit = defineEmits({
    color1Click: null,
    color2Click: null,
});
const props = defineProps<{
    randomizeColors: boolean;
}>();
</script>
<template></template>
