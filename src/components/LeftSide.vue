<template>
    <div class="inline-flex flex-col bg-slate-900 p-3 gap-4 shrink min-w-[205px] text-white">
        <div class="inline-flex bg-slate-700 rounded-lg p-3 cursor-pointer">
            <UserPlusIcon class="h-6 w-6 mr-1" />
            Invitar huéspedes
        </div>
        <div class="inline-flex flex-col">
            <template v-for="source of s.previewSources">
                <PreviewStream :source="source" :fake="fake" />
            </template>
        </div>
    </div>
</template>

<script setup>
import PreviewStream from "./Stream/PreviewStream.vue"
import { UserPlusIcon } from "@heroicons/vue/24/outline"
import { useStore } from "../store"

const s = useStore()

const props = defineProps({
    fake: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped></style>