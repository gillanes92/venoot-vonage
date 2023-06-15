<template>
    <div class="relative">
        <template v-for="banner of s.banners">
            <Transition>
                <Banner v-show="banner.shown" :banner="banner" />
            </Transition>
        </template>
    </div>
</template>

<script setup>
import { useStore } from "/src/store";
import Banner from "./Banner.vue"

const s = useStore();
</script>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>