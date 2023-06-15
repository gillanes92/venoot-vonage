<template>
  <div
    :class="['relative flex flex-col w-14 h-14 rounded-full text-gray-300 justify-center items-center cursor-pointer', active ? 'bg-slate-700' : 'bg-red-700 '+ color]">
    <div v-if="name">{{ name }}</div>
    <div :class="[active ? '' : 'opacity-60']">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String },
  active: { type: Boolean, default: true },
  color: { type: String, default: 'bg-red-700'}
});
</script>

<style lang="scss" scoped></style>
