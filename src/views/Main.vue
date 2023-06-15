<template>
  <div class="flex flex-row">

    <!-- LEFT SIDE -->
    <!-- <LeftSide v-if="s.isHost" :fake="fake" /> -->

    <!-- MIDDLE SIDE -->
    <!-- <Middle :fake="fake" /> -->
    <div class="aspect-video grow bg-pink-800"></div>

    <!-- RIGHT SIDE -->
    <!-- <RightSide :fake="fake" /> -->

  </div>
</template>

<script setup>
import { ref } from "vue"

import LeftSide from "../components/LeftSide.vue"
import Middle from "../components/Middle.vue"
import RightSide from "../components/RightSide.vue"

const fake = ref(false)
</script>

<style scoped>
</style>
