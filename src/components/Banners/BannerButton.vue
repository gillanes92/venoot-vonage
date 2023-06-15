<template>
  <div :class="[
    'flex flex-col p-4 rounded bg-slate-700 text-white border-2 cursor-pointer',
    banner.shown ? 'border-white' : 'border-transparent',
  ]">
    <div class="text-lg">{{ banner.title }}</div>
    <div class="text-sm text-gray-400">{{ banner.text }}</div>
    <div class="flex flex-row justify-around mt-4">
      <div class="flex items-center p-1 px-3 border rounded cursor-pointer" @click.stop="changeBannerType('box')">
        <input type="radio" value="box" v-model="banner.type"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer" />
        <label class="ml-2 text-sm font-medium text-gray-300 cursor-pointer">Caja</label>
      </div>

      <div class="flex items-center p-1 px-3 border rounded cursor-pointer" @click.stop="changeBannerType('ticker')">
        <input type="radio" value="ticker" v-model="banner.type"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer" />
        <label class="ml-2 text-sm font-medium text-gray-300 cursor-pointer">Ticker</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "/src/store"

const s = useStore()

const props = defineProps({
  banner: { type: Object, required: true },
})

const changeBannerType = (type) => {
  props.banner.type = type
  s.vonage.session.signal({ type: 'banner-type-change', data: JSON.stringify({ index: s.banners.indexOf(props.banner), type }) })
}
</script>

<style lang="scss" scoped></style>
