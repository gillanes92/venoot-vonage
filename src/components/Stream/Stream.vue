<template>
  <div ref="stream" :class="['relative', fake ? 'aspect-video w-full bg-pink-900' : '', layoutClasses]" :style="{width: `${layoutSize}%`}">
    <DefaultName v-if="s.buttonTheme == 'default'" :name="person.stream.name" class="absolute bottom-2"></DefaultName>
    <BlockName v-if="s.buttonTheme == 'block'" :name="person.stream.name" class="absolute bottom-2"></BlockName>
    <RoundedName v-if="s.buttonTheme == 'rounded'" :name="person.stream.name" class="absolute bottom-2 left-2"></RoundedName>
  </div>
</template>

<script setup>
import DefaultName from "../Names/DefaultName.vue";
import BlockName from "../Names/BlockName.vue";
import RoundedName from "../Names/RoundedName.vue";
import { useStore } from "../../store";
import { computed, onMounted, ref } from "vue";

const s = useStore();

const props = defineProps({
  person: { type: Object, required: true },
  width: { type: Number, default: 30 },
  fake: { type: Boolean, default: false }
});

const stream = ref(null)
const streams = computed(() => s.streams.filter(stream => stream.onCamera && stream.stream.videoType === 'camera')) 

const layoutSize = computed(() => {
  switch (s.vonage.layout) {
    case 'default':
      if (streams.value.length >= 5) {
        return 31
      }
      else if (streams.value.length >= 2) {
        return 48
      } else if (streams.value.length == 1) {
        return 100
      }
      break

    case 'vertical':
      return 100 / s.streams.length

    case 'focused-speaker':
    case 'vertical-sharing':
      return 100
  }
})

const layoutClasses = computed(() => {
  switch (s.vonage.layout) {
    case 'default':
      if (streams.value.length >= 5) {
        return 'w-[31%]'
      }
      else if (streams.value.length >= 2) {
        return 'w-[48%]'
      }
      break

    case 'focused-speaker':
      return ''

    case 'vertical-sharing':
      return ''

    case 'horizontal-sharing':
      return ''
  }
})

onMounted(() => {
  if (!props.fake) {
    const video = document.createElement('video')
    video.srcObject = props.person.element.srcObject.clone()
    video.autoplay = true;
    video.controls = false;
    video.muted = false;
    stream.value.appendChild(video)
  }
})


</script>

<style lang="scss" scoped></style>
