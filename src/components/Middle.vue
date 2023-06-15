<template>
    <div class="relative grow p-4 flex flex-col w-full h-full">
        <!-- TITLE -->
        <div class="flex flex-row pb-4 text-white">
            <div class="text-3xl">{{ s.eventName ?? "Titulo Desconocido" }}</div>
            <div class="grow"></div>
            <div class="flex flex-row gap-2">
                <div class="flex flex-row p-2 text-green-500" v-if="s.isHost">
                    <span class="mr-1 text-xl leading-none mt-1 -mb-3">0</span>
                    <UserGroupIcon class="w-6 h-6 mr-1" />
                </div>
                <div class="flex flex-row bg-gray-700 p-2 rounded-lg cursor-pointer" v-if="s.isHost">
                    <CloudArrowUpIcon class="w-6 h-6 mr-1" />
                    DESTINO
                </div>
                <div class="flex flex-row bg-red-700 p-2 rounded-lg cursor-pointer w-36" @click="s.onAir = false"
                    v-if="s.onAir && s.isHost">
                    <VideoCameraSlashIcon class="w-6 h-6 mr-1" />
                    TERMINAR
                </div>
                <div class="flex flex-row bg-green-600 p-2 rounded-lg cursor-pointer w-36" @click="s.onAir = true"
                    v-else-if="!s.onAir && s.isHost">
                    <VideoCameraIcon class="w-6 h-6 mr-1" />
                    COMENZAR
                </div>
            </div>
        </div>

        <!-- VIDEO -->
        <div class="relative aspect-video bg-slate-700 rounded-lg">
            <template v-if="s.mode !== 'participant'">

                <!-- BACKGROUND -->
                <div v-if="s.bg" class="absolute top-0 left-0">
                    <img :src="`/${s.bg}`" class="object-contain" />
                </div>

                <!-- CAMERAS -->
                <div class="absolute top-0 left-0 w-full h-full">
                    <Streams @nameChange="$emit('name-change')" :fake="fake" />
                </div>
                <!-- CHART -->
                <!-- <Chart v-if="s.questions.findIndex((q) => q.status === 'shown') >= 0"></Chart> -->

                <!-- OVERLAY -->
                <div v-if="s.overlay" class="absolute top-0 left-0">
                    <img :src="`/${s.overlay}`" class="object-contain" />
                </div>

                <!-- LOGO -->
                <div v-if="s.logo" class="absolute top-4 left-4">
                    <img :src="`/${s.logo}`" />
                </div>

                <!-- BANNER -->
                <div class="absolute bottom-0 w-full">
                    <Banners />   
                </div>
            </template>

            <!-- <template v-else>
                <iframe width="100%" height="100%" :src="`https://venoot-media.work:5443/LiveApp/play.html?name=${s.ams}`"
                    frameborder="0" allowfullscreen></iframe>
            </template> -->
        </div>

        <!-- MAIN BUTTONS -->
        <div class="flex flex-row mt-4 justify-center gap-4" v-if="s.mode !== 'participant'">
            <RoundButton :active="s.vonage.localAudio" @click="toggleAudio">
                <MicrophoneIcon class="w-6 h-6" />
            </RoundButton>
            <RoundButton v-if="!s.vonage.localVideo" :active="false" @click="startCamera">
                <VideoCameraIcon class="w-6 h-6" />
            </RoundButton>
            <RoundButton v-else :active="true" @click="stopCamera">
                <VideoCameraIcon class="w-6 h-6" />
            </RoundButton>
            <RoundButton v-if="s.vonage.screenSharing" :active="false" @click="stopCapture" color="bg-green-700"
                class="mr-10">
                <TvIcon class="w-6 h-6" />
            </RoundButton>
            <RoundButton v-else :active="true" @click="startCapture" class="mr-10">
                <TvIcon class="w-6 h-6" />
            </RoundButton>
            <template v-if="s.isHost">
                <RoundButton @click="changeLayout('default')">1</RoundButton>
                <RoundButton @click="changeLayout('focused-speaker')">2</RoundButton>
                <RoundButton @click="changeLayout('vertical-sharing')">3</RoundButton>
                <RoundButton @click="changeLayout('full-screen')">4</RoundButton>
            </template>
        </div>

        <div class="absolute bottom-0 right-5 z-50">
            <div v-for="question in s.questions.filter((q) => q.status === 'active')"
                class="bg-slate-600 rounded border border-white p-2">
                <div class="text-white text-lg mb-3">{{ question.title }}</div>
                <div v-for="(option, index) in question.options" class="flex flex-row italic w-full mb-1">
                    <div class="select-none cursor-pointer bg-slate-500 p-1 px-3 rounded border border-slate-800"
                        @click="voteFor(option.text)">
                        <span class="text-slate-300">{{ index + 1 }}.</span>
                        <span class="text-slate-100 ml-1">{{ option.text }}</span>
                    </div>
                    <div class="grow min-w-[4rem]"></div>
                    <div class="text-md text-blue-200">{{ option.selected }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from "../store"

import Streams from "../components/Stream/Streams.vue"
import RoundButton from "./Buttons/RoundButton.vue"
import Banners from "./Banners/Banners.vue"
import { CloudArrowUpIcon, VideoCameraIcon, VideoCameraSlashIcon, MicrophoneIcon, TvIcon, UserGroupIcon } from "@heroicons/vue/24/outline"
import { useAuth } from "@websanova/vue-auth"
import { toRaw, onMounted } from "vue"

const s = useStore()
const auth = useAuth()
let session = null 

const props = defineProps({
    fake: { type: Boolean, default: false }
})

const toggleAudio = () => {
    if (fake) {
        s.vonage.localAudio = !s.vonage.localAudio
    } else if (props.person.local) {
        props.person.publisher.publishAudio(!s.vonage.localAudio)
    }
}

const startCamera = () => {
    s.log('video: ' + true)

    if (!fake.value) {
        s.vonage.publisher.publishVideo(true)
    }
    s.vonage.localVideo = true
}

const stopCamera = () => {
    s.log('video: ' + false)
    if (!fake.value) {
        s.vonage.publisher.publishVideo(false)
    }
    s.vonage.localVideo = false
}

const startCapture = async () => {
    OT.checkScreenSharingCapability(function (response) {
        if (!response.supported || response.extensionRegistered === false) {
            // This browser does not support screen sharing.
        } else if (response.extensionInstalled === false) {
            // Prompt to install the extension.
        } else {
            s.vonage.screenPublisher = OT.initPublisher(null,
                { videoSource: 'screen', insertDefaultUI: false },
                function (error) {
                    if (error) {
                        // Look at error.message to see what went wrong.
                    } else {
                        session.publish(s.vonage.screenPublisher, function (error) {
                            if (error) {
                                // Look error.message to see what went wrong.
                            } else {
                                s.vonage.screenSharing = true
                                s.log("Screen sharing published")
                            }
                        });
                    }
                }
            )
                .on({
                    videoElementCreated: (event) => {
                        s.localStream = { element: event.element }
                    },
                    streamCreated: event => {
                        s.log("Local screen stream")
                        s.localStream.stream = event.stream
                        s.localStream.publisher = event.target
                        s.vonage.screenSharing = true
                        s.streams.push({ ...s.localStream, local: true, onCamera: false })
                    },
                })

            s.vonage.screenPublisher.on({
                streamDestroyed: event => {
                    s.log("Local screen stopped")
                    s.streams = s.streams.filter(stream => stream.stream.id !== event.stream.id)
                    s.vonage.screenSharing = false
                    s.vonage.activeScreen = null
                },
            })
        }
    })
}

const stopCapture = () => {
    s.vonage.screenSharing = false
    s.vonage.activeScreen = null
    s.vonage.screenPublisher.destroy()
}

const changeLayout = (newLayout, passive = false) => {
    switch (newLayout) {
        case 'default':
            s.vonage.layout = 'default'
            if (!passive) {
                s.vonage.session.signal({ type: 'change-layout', data: 'default' })
            }
            break

        case 'focused-speaker':
            if (s.vonage.focusedSpeaker === null) {
                s.vonage.focusedSpeaker = s.streams[0].stream.id

                if (!passive) {
                    s.vonage.session.signal({ type: 'focused-speaker', data: s.vonage.focusedSpeaker })
                }
            }

            if (s.streams.filter(stream => stream.stream.videoType === 'camera').length === 1) {
                s.vonage.layout = 'default'
                if (!passive) {
                    s.vonage.session.signal({ type: 'change-layout', data: 'default' })
                }
            } else {
                s.vonage.layout = 'focused-speaker'
                if (!passive) {
                    s.vonage.session.signal({ type: 'focused-speaker', data: s.vonage.focusedSpeaker })
                    s.vonage.session.signal({ type: 'change-layout', data: 'focused-speaker' })
                }
            }
            break

        case 'vertical-sharing':
            if (s.vonage.activeScreen) {
                s.vonage.layout = 'vertical-sharing'
                if (!passive) {
                    s.vonage.session.signal({ type: 'change-layout', data: 'vertical-sharing' })
                }
            } else {
                s.vonage.layout = 'default'
                if (!passive) {
                    s.vonage.session.signal({ type: 'change-layout', data: 'default' })
                }
            }
            break

        case 'full-screen':
            if (s.vonage.activeScreen) {
                s.vonage.layout = 'full-screen'
                if (!passive) {
                    s.vonage.session.signal({ type: 'change-layout', data: 'full-screen' })
                }
            } else {
                s.vonage.layout = 'default'
                if (!passive) {
                    s.vonage.session.signal({ type: 'change-layout', data: 'default' })
                }
            }
            break
    }
}

const voteFor = optionText => {
    s.questions[0].options.filter(option => option.text === optionText)[0].selected += 1
    window.Echo.private(`event.${auth.user().event_id}`)
        .whisper('poll.vote', { text: optionText })
}

onMounted(() => {
    session = toRaw(s.vonage.session)
})
</script>

<style lang="scss" scoped></style>