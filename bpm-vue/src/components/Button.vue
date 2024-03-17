<script lang="ts" setup>
import { cn } from '../utils/cn';

interface IButtonProps {
    customClass?: string;
}

const props = defineProps<IButtonProps>();
</script>
<template>
    <button
        :class="
            cn(
                'size-10 w-full select-none rounded-xl bg-zinc-700 active:bg-transparent',
                customClass as string | undefined
            )
        " />
</template>
