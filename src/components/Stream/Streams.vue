<template>
    <div :class="['w-full h-full', outterLayout()]">
        <div v-if = "s.vonage.layout !== 'full-screen'" :class="['', layout()]">
            <template v-for="person of streams" :key="person.stream.id">
                <Stream :person="person" :fake="fake"/>
            </template>
        </div>
        <div id="focused-speaker" v-if="s.vonage.layout === 'focused-speaker' && s.vonage.focusedSpeaker" :class="['flex flex-col justify-center aspect-video', screenLayout()]">
            <Stream :person="focusedPerson" :fake="fake" />
        </div>
        <div id="screen-sharing" v-if="s.vonage.activeScreen && ['full-screen', 'vertical-sharing'].includes(s.vonage.layout)" :class="['flex flex-col justify-center aspect-video', screenLayout()]">
            <Stream :person="sharedScreen" :fake="fake" />
        </div>
    </div>
</template>

<script setup>
import Stream from './Stream.vue'
import { useStore } from "../../store"
import { computed } from 'vue';

const s = useStore()

const props = defineProps({
    fake: { type: Boolean, default: false }
})

const streams = computed(() => {
    return s.streams.filter(stream => {        
        if (!stream.onCamera) {
            return false
        }

        if (stream.stream) {
            if (s.vonage.layout === 'focused-speaker' && s.vonage.focusedSpeaker === stream.stream.id) {
                return false
            }

            if (stream.stream.videoType === 'camera' && stream.stream.videoType !== 'screen') {
                return true
            }
        } else if (props.fake) {
            return true
        }

        return false        
    })
})

const focusedPerson = computed(() => s.streams.find(stream => stream.stream.id === s.vonage.focusedSpeaker))
const sharedScreen = computed(() => s.streams.find(stream => stream.stream.id === s.vonage.activeScreen))

const outterLayout = () => {
    switch (s.vonage.layout) {
        case 'default':
            return ''

        case 'focused-speaker':
            return 'flex flex-row'

        case 'full-screen':
            return ''

        case 'vertical-sharing':
            return 'flex flex-row'
    }
}

const layout = () => {
    switch (s.vonage.layout) {
        case 'default':
            return 'flex flex-row flex-wrap gap-x-4 justify-center items-center h-full'

        case 'focused-speaker':
            return 'flex flex-col gap-2 w-[14%] p-2'

        case 'full-screen':
            return ''

        case 'vertical-sharing':
            return 'flex flex-col gap-2 w-[14%] p-2'
    }
}

const screenLayout = () => {
    switch (s.vonage.layout) {

        case 'horizontal-sharing':
            return 'h-[83%]'

        case 'focused-speaker':
        case 'vertical-sharing':
            return 'w-[85%]'

        case 'full-screen':
            return 'p-2'
    }
}

</script>

<style lang="scss" scoped></style>