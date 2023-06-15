<template>
    <Panel class="px-4 py-7 max-w-2xl flex flex-col">
        <div class="flex flex-row min-w-fit gap-4">
            <div class="flex flex-col w-1/2 gap-2">
                <div class="font-medium">Dispositivo de video</div>
                <div class="relative w-[390px] h-[219px]">
                    <div v-if="!s.vonage.localVideo"
                        class="absolute w-full h-full flex justify-center items-center rounded text-blue-300/80 bg-gray-600">
                        <UserCircleIcon class="w-28 h-28" />
                    </div>
                    <div ref="stream" class="h-full"></div>
                </div>
                <div>
                    <select v-model="s.currentVideoInputDevice">
                        <option v-for="device in s.videoInputDevices" :value="device.deviceId"
                            :selected="selectedVideo(device)">{{ device.label }}</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-col w-1/2 gap-2">
                <div>
                    <label class="block mb-1 font-medium">Microfono</label>
                    <select class="mt-2" v-model="s.currentAudioInputDevice">
                        <option v-for="device in s.audioInputDevices" :value="device.deviceId"
                            :selected="selectedAudioInput(device)">{{ device.label }}</option>
                    </select>
                </div>
                <div>
                    <label class="block mb-1 font-medium">Audio</label>
                    <select v-model="s.currentAudioOutputDevice">
                        <option v-for="device in s.audioOutputDevices" :value="device.deviceId"
                            :selected="selectedAudioOutput(device)">{{ device.label }}</option>
                    </select>
                </div>

                <div class="mt-4">
                    <label class="block mb-1 font-medium">Funciones</label>
                    <div class="flex flex-row gap-2 justify-center">
                        <BigButton @button-click="toogleLocalAudio"
                            :class="['flex flex-col', s.vonage.localAudio ? 'text-secondary' : 'text-secondary/30']">
                            <div class="flex flex-col items-center">
                                <MicrophoneIcon class="w-5 h-5" />
                            </div>
                            <span class="text-xs">MICROFONO</span>
                        </BigButton>
                        <BigButton @button-click="toogleLocalVideo"
                            :class="['flex flex-col', s.vonage.localVideo ? 'text-secondary' : 'text-secondary/30']">
                            <div class="flex flex-col items-center">
                                <VideoCameraIcon class="w-5 h-5" />
                            </div>
                            <div class="text-xs text-center">CAMARA</div>
                        </BigButton>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 mt-4 gap-4 w-full">
            <div class="flex flex-col">
                <label class="block mb-1 font-medium">Nombre</label>
                <input type="text" v-model="name"
                    class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-primary focus:border-primary"
                    required>
            </div>
            <Button class="self-end" @click="join" :active="buttonActive || s.accepted === false" :loading="!buttonActive && s.accepted === null">
                {{ buttonText }}
            </Button>
        </div>

        <!-- Message to Host Modal -->
        <VueFinalModal v-model="showMessageToHost" :click-to-close="false" :esc-to-close="false"
            class="flex justify-center items-center">
            <Panel class="w-96 max-w-[90%] px-8 py-3">
                <div class="flex flex-col w-full gap-1">
                    <h1>Mensage para el Anfitrión (Opcional)</h1>
                    <input v-model="messageToHost" class="grow h-10 rounded text-black font-bold px-2" />
                    <Button @click="askToJoin">
                        ACEPTAR
                    </Button>
                </div>
            </Panel>
        </VueFinalModal>
    </Panel>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from '../store'
import { useDevices } from '../composables/devices'
import { storeToRefs } from 'pinia'
import { MicrophoneIcon, VideoCameraIcon, UserCircleIcon } from "@heroicons/vue/24/solid"
import { VueFinalModal } from "vue-final-modal"

import Panel from './Panels/Panel.vue'
import Button from './Buttons/Button.vue'
import BigButton from './Buttons/BigButton.vue'
import useVenoot from '../composables/venoot'

const s = useStore()
const d = useDevices()
const ve = useVenoot()
const selectedVideo = (device) => s.currentVideoInputDevice === device.deviceId
const selectedAudioInput = (device) => s.currentAudioInputDevice === device.deviceId
const selectedAudioOutput = (device) => s.currentAudioInputDevice === device.deviceId

const stream = ref(null)
const name = ref(s.name ?? "")
const buttonActive = ref(true)
const showMessageToHost = ref(false)
const messageToHost = ref('')

const emits = defineEmits(['run-setup'])

const buttonText = computed(() => {

    if (s.isHost) {
        return "ACEPTAR"
    } else if (s.isPresenter) {
        if (s.accepted) {
            return "ACEPTED"
        } else if (s.accepted === false) {
            return "PEDIR INGRESO NUEVAMENTE"
        } else if (!buttonActive.value) {
            return "ESPERANDO..."
        } else {
            return "PEDIR INGRESO"
        }
    }
})

const join = async () => {
    s.setName(name.value)
    if (s.isHost) {
        let track = stream.value.firstChild.srcObject.getAudioTracks()[0]
        track.stop()
        stream.value.firstChild.srcObject.removeTrack(track)

        track = stream.value.firstChild.srcObject.getVideoTracks()[0]
        track.stop()
        stream.value.firstChild.srcObject.removeTrack(track)

        emits('run-setup')
        s.showConfig = false
        s.closableConfig = true
    } else if (s.isPresenter) {
        buttonActive.value = false
        showMessageToHost.value = true
    }
}

const askToJoin = async () => {
    showMessageToHost.value = false
    s.accepted = null
    await ve.joinRequest(name.value, messageToHost.value)
}

const toogleLocalAudio = async () => {
    s.vonage.localAudio = !s.vonage.localAudio
    if (s.vonage.localAudio) {
        const mediaStream = await d.getUserStream()
        stream.value.firstChild.srcObject.addTrack(mediaStream.getAudioTracks()[0])
    } else {
        const track = stream.value.firstChild.srcObject.getAudioTracks()[0]
        track.stop()
        stream.value.firstChild.srcObject.removeTrack(track)
    }
}

const toogleLocalVideo = async () => {
    s.vonage.localVideo = !s.vonage.localVideo
    if (s.vonage.localVideo) {
        const mediaStream = await d.getUserStream()
        stream.value.firstChild.srcObject.addTrack(mediaStream.getVideoTracks()[0])
    } else {
        const track = stream.value.firstChild.srcObject.getVideoTracks()[0]
        track.stop()
        stream.value.firstChild.srcObject.removeTrack(track)
    }
}

const setUserVideoStream = async () => {
    try {
        const mediaStream = await d.getUserStream()
        const video = d.createVideoElement(mediaStream, 390, 219)
        stream.value.replaceChildren(video)
    } catch (error) {
        s.log(error)
    }
}

const setAudioOutput = async () => {
    await d.setAudioOutput()
}

const storeRefs = storeToRefs(s)
watch([storeRefs.currentAudioInputDevice, storeRefs.currentVideoInputDevice],
    async () => {
        s.log('Replacing Video Test Stream')
        await setUserVideoStream()
    })
watch(storeRefs.currentAudioOutputDevice, async () => {
    s.log('Replacing Audio Test Output')
    await setAudioOutput()
})

onMounted(async () => {
    await setUserVideoStream()
})
</script>

<style scoped></style>