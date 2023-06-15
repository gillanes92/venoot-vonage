<template>
    <div class="p-2 min-w-[5rem] text-center text-white" :style="{ background: s.color }">{{ name }}</div>
</template>

<script setup>
import { useStore } from "../../store"

const props = defineProps({
    name: { type: String, required: true}
})

const s = useStore()
</script>

<style scoped>

</style>