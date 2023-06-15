<template>
    <div :class="['flex justify-center items-center rounded border border-primary/70 bg-terciary', fit]">
        <slot />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    fit: { type: Boolean, default: false },
})

const fit = computed(() => props.fit ? 'w-fit h-fit' : '')
</script>

<style scoped></style>