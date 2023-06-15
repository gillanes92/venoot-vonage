<template>
    <div class="relative aspect-video rounded-lg bg-slate-400">
        <div class="absolute w-full top-0 rounded-b-lg opacity-60" ref="preview">
        </div>

        <div class="absolute m-1 cursor-pointer">
            <MicrophoneIcon :class="['w-5 h-5', s.vonage.localAudio ? 'text-white' : 'text-red-700']" />
        </div>

        <!-- <label v-if="s.isHost" class="absolute right-0 inline-flex items-center cursor-pointer m-1.5">
            <input type="checkbox" v-model="source.onCamera" class="sr-only peer" @change="activateScreen" />
            <div
                class="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:left-[0px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600">
            </div>
        </label> -->

        <label v-if="s.isHost" class="absolute bottom-7 right-0 inline-flex items-center cursor-pointer mr-1.5"
            @click="focusSpeaker">
            <BoltIcon
                :class="['w-5 h-5', s.vonage.focusedSpeaker === source.stream.id ? 'text-yellow-300' : 'text-slate-500']" />
        </label>

        <div v-if="!fake"
            :class="['absolute w-full h-6 bottom-0 bg-red-200 text-slate-800 text-sm text-left font-bold px-3 rounded-b-lg', source.local ? 'cursor-pointer' : '']"
            @click="source.local && $emit('name-change')">
            {{ source.stream.name + (source.stream.videoType !== 'camera' ? "'s Share" : "") }}
        </div>

    </div>
</template>

<script setup>
import { MicrophoneIcon, BoltIcon } from '@heroicons/vue/24/outline'
import { onMounted, onUpdated, ref } from 'vue'
import { useStore } from "../../store"

const s = useStore()
const preview = ref(null)

const props = defineProps({
    source: { type: Object, required: true },
    fake: { type: Boolean, default: false }
})

// if (!props.fake) {
//     s.vonage.localAudio = props.source.stream.hasAudio
//     if (props.source.local) {
//         props.source.publisher.session.on('streamPropertyChanged', (event) => {
//             s.log("StreamPropertyChangedEvent")
//             if (event.changedProperty === 'hasAudio') {
//                 s.vonage.localAudio = event.newValue
//             }
//         })
//     }
// }

const focusSpeaker = () => {
    if (s.vonage.focusedSpeaker === props.source.stream.id) {
        s.vonage.focusedSpeaker = null
        s.vonage.session.signal({ type: 'focused-speaker', data: '' })

        if (s.vonage.layout === 'focused-speaker') {
            s.vonage.layout = 'default'
            s.vonage.session.signal({ type: 'change-layout', data: 'default' })
        }
    } else {
        s.vonage.focusedSpeaker = props.source.stream.id
        s.vonage.session.signal({ type: 'focused-speaker', data: props.source.stream.id })
    }
}

const activateScreen = () => {
    if (props.source.stream.videoType === 'screen') {
        s.log(props.source.onCamera)
        if (props.source.onCamera) {
            s.log(props.source.stream.id)
            s.vonage.activeScreen = props.source.stream.id
            s.vonage.session.signal({ type: 'screen-sharing', data: props.source.stream.id })
        } else {
            s.vonage.activeScreen = null
            s.vonage.session.signal({ type: 'screen-sharing', data: '' })
        }
    } else if (props.source.stream.videoType === 'camera') {
        s.vonage.session.signal({ type: props.source.onCamera ? 'on-camera' : 'off-camera', data: props.source.stream.id })
    }
}

onMounted(() => {
    if (!props.fake) {
        preview.value.appendChild(props.source.element)
    }
})

onUpdated(() => {
    if (!props.fake) {
        preview.value.appendChild(props.source.element)
    }
})
</script>

<style lang="scss" scoped></style>
