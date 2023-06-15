<template>
    <div class="flex flex-row text-white">
        <div class="w-2" :style="{ background: s.color }"></div>
        <div class="bg-black p-2  text-center">{{ name }}</div>
    </div>
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