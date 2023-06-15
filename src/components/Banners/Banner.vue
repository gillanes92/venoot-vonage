<template>
  <div :class="['absolute bottom-0 w-full', banner.type === 'box' ? 'mb-6' : '']">
    <div v-if="banner.type == 'box'" class="flex flex-col rounded-xl max-w-[85%]">
      <div class="rounded-tr-xl px-8 py-2 text-white text-2xl font-bold" :style="{ backgroundColor: s.color }">
        {{ banner.title }}
      </div>
      <div class="rounded-br-xl bg-slate-800 px-10 py-2 text-gray-300 text-lg">
        {{ banner.text }}
      </div>
    </div>
    <div v-if="banner.type == 'ticker'" class="overflow-hidden py-2" :style="{ backgroundColor: s.color }">
      <div class="marquee text-white text-xl justify-center translate-x-full flex flex-row ">
        <span class="min-w-full" v-for="x in 10">{{ banner.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "/src/store";

const s = useStore();

const props = defineProps({
  banner: { type: Object, required: true }
})
</script>

<style scoped>
.marquee {
  animation: scroll-left 15s linear infinite;
}

@-moz-keyframes scroll-left {
  0% {
    -moz-transform: translateX(100%);
  }

  100% {
    -moz-transform: translateX(-100%);
  }
}

@-webkit-keyframes scroll-left {
  0% {
    -webkit-transform: translateX(100%);
  }

  100% {
    -webkit-transform: translateX(-100%);
  }
}

@keyframes scroll-left {
  0% {
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }

  100% {
    -moz-transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }
}
</style>
