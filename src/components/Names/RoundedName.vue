<template>
        <div class="bg-black p-2 rounded-full border-b-2 border-r-2 text-white text-center" :style="{ borderColor: s.color }">{{ name }}</div>
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