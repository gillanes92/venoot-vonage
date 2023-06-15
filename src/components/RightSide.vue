<template>
    <div class="flex flex-col bg-slate-900 p-4 text-white gap-4 min-w-[340px] w-[340px] h-screen">
        <div class="flex flex-row flex-wrap justify-evenly gap-x-4 gap-y-2">
            <div :class="[
                'flex flex-row p-2 rounded-lg cursor-pointer',
                s.tab == 'chat' ? 'bg-gray-500' : 'bg-gray-700',
            ]" @click="s.tab = 'chat'">
                <ChatBubbleLeftIcon class="w-6 h-6 mr-1" />
                Chat
            </div>

            <div v-if="s.isHost" :class="[
                'flex flex-row p-2 rounded-lg cursor-pointer',
                s.tab == 'banners' ? 'bg-gray-500' : 'bg-gray-700',
            ]" @click="s.tab = 'banners'">
                <Bars3Icon class="w-6 h-6 mr-1" />
                Banners
            </div>

            <div v-if="s.isHost" :class="[
                'flex flex-row p-2 rounded-lg cursor-pointer',
                s.tab == 'media' ? 'bg-gray-500' : 'bg-gray-700',
            ]" @click="s.tab = 'questions'">
                <QuestionMarkCircleIcon class="w-6 h-6 mr-1" />
                Preguntas
            </div>

            <div v-if="s.isHost" :class="[
                'flex flex-row p-2 rounded-lg cursor-pointer',
                s.tab == 'media' ? 'bg-gray-500' : 'bg-gray-700',
            ]" @click="s.tab = 'media'">
                <FilmIcon class="w-6 h-6 mr-1" />
                Graficos
            </div>
        </div>

        <!-- CHAT -->
        <Chat v-if="s.tab == 'chat'"></Chat>

        <!-- BANNER -->
        <div v-if="s.tab == 'banners'" class="flex flex-col gap-2">
            <div class="flex flex-row bg-slate-700 rounded-lg text-white p-3 cursor-pointer justify-center font-bold"
                @click="toggleBanner(null)">
                Limpiar
            </div>
            <BannerButton v-for="banner of s.banners" :banner="banner" @click="toggleBanner(banner)"></BannerButton>
        </div>

        <!-- Preguntas -->
        <Questions v-if="s.tab == 'questions'"></Questions>

        <!-- MEDIA -->
        <div v-if="s.tab == 'media'">
            <div class="flex flex-col">
                <div>Marca</div>
                <div class="flex flex-row bg-slate-700 p-2 rounded-lg justify-around">
                    <select id="countries"
                        class="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                        <option v-for="brand of s.brands" :value="brand.name" :selected="s.brand == brand.name">
                            {{ brand.name }}
                        </option>
                    </select>
                </div>
                <div class="mt-3">Theme</div>
                <div class="flex flex-row bg-slate-700 p-2 rounded-lg justify-around">
                    <div :class="[
                        'cursor-pointer',
                        s.buttonTheme == 'default'
                            ? 'border-2 border-white/60'
                            : 'border-2 border-transparent',
                    ]">
                        <DefaultName name="Default" @click="changeButtonTheme('default')"></DefaultName>
                    </div>
                    <div :class="[
                        'cursor-pointer',
                        s.buttonTheme == 'block'
                            ? 'border-2 border-white/60'
                            : 'border-2 border-transparent',
                    ]">
                        <BlockName name="Block" @click="changeButtonTheme('block')"></BlockName>
                    </div>
                    <div :class="[
                        'cursor-pointer',
                        s.buttonTheme == 'rounded'
                            ? 'border-2 border-white/60'
                            : 'border-2 border-transparent',
                    ]">
                        <RoundedName name="Rounded" @click="changeButtonTheme('rounded')"></RoundedName>
                    </div>
                </div>
            </div>

            <div class="flex flex-col mt-3">
                <div class="mb-3">
                    <label for="default-input"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Color</label>
                    <ColorPicker buttonTheme="dark" :color="s.color" :sucker-hide="false" @changeColor="changeColor"/>
                </div>
            </div>

            <div class="flex flex-col mb-3">
                <div class="mb-1">Logo</div>
                <div class="flex flex-row flex-wrap gap-2">
                    <div v-for="logo of s.logos" class="w-12 h-12 border-2 rounded-lg cursor-pointer" :style="{
                        borderColor:
                            s.logo === logo ? s.color : s.color + '55',
                    }" @click="selectLogo(logo)">
                        <img :src="`/${logo}`" class="object-contain" />
                    </div>
                    <div class="flex justify-center items-center w-12 h-12 border-2 rounded-lg cursor-pointer" :style="{
                        borderColor: s.color + '55',
                    }" @click="showUpload('logo')">
                        <PlusIcon class="w-6 h-6 opacity-50" />
                    </div>
                </div>
            </div>

            <div class="flex flex-col mb-3">
                <div class="mb-1">Overlay</div>
                <div class="flex flex-row flex-wrap gap-2">
                    <div v-for="overlay of s.overlays"
                        class="h-12 aspect-video border-2 rounded-lg cursor-pointer overflow-hidden" :style="{
                            borderColor:
                                s.overlay === overlay
                                    ? s.color
                                    : s.color + '55',
                        }" @click="selectOverlay(overlay)">
                        <img :src="`/${overlay}`" class="w-full object-cover" />
                    </div>
                    <div class="flex justify-center items-center h-12 aspect-video border-2 rounded-lg cursor-pointer"
                        :style="{
                            borderColor: s.color + '55',
                        }" @click="showUpload('overlay')">
                        <PlusIcon class="w-6 h-6 opacity-50" />
                    </div>
                </div>
            </div>

            <div class="flex flex-col">
                <div class="mb-1">Background</div>
                <div class="flex flex-row gap-2">
                    <div v-for="bg of s.bgs" class="h-12 aspect-video border-2 rounded-lg cursor-pointer overflow-hidden"
                        :style="{
                            borderColor: s.bg === bg ? s.color : s.color + '55',
                        }" @click="selectBg(bg)">
                        <img :src="`/${bg}`" class="w-full object-cover" />
                    </div>
                    <div class="flex justify-center items-center h-12 aspect-video border-2 rounded-lg cursor-pointer"
                        :style="{
                            borderColor: s.color + '55',
                        }" @click="showUpload('bg')">
                        <PlusIcon class="w-6 h-6 opacity-50" />
                    </div>
                </div>
            </div>
        </div>

        <VueFinalModal v-model="upload" class="text-white flex justify-center items-center">
            <div class="flex flex-col rounded-2xl bg-red-700 border-2 px-8 py-10 gap-4 max-w-lg max-h-min">
                <h1>{{ uploadText }}</h1>
                <Uploader server="/api/upload" @change="changeMedia" />
            </div>
        </VueFinalModal>
    </div>
</template>

<script setup>
import { useStore } from '../store'
import Uploader from 'vue-media-upload'
import { VueFinalModal } from "vue-final-modal"
import { ColorPicker } from 'vue-color-kit'

import DefaultName from './Names/DefaultName.vue'
import BlockName from './Names/BlockName.vue'
import RoundedName from './Names/RoundedName.vue'
import BannerButton from './Banners/BannerButton.vue'
import Chat from './Controls/Chat.vue'
import Questions from './Controls/Questions.vue'

import { Bars3Icon, ChatBubbleLeftIcon, FilmIcon, PlusIcon, QuestionMarkCircleIcon } from "@heroicons/vue/24/outline"
import { ref } from 'vue'

const s = useStore()
const upload = ref(false)
const uploadText = ref('')

const props = defineProps({
    fake: { type: Boolean, default: false }
})

const changeButtonTheme = theme => {
    s.buttonTheme = theme
    s.vonage.session.signal({ type: 'change-button-theme', data: theme })
} 

const changeColor = color => {
    s.color = color.hex
}

const showUpload = (what) => {
    switch (what) {
        case 'logo':
            uploadText.value = 'Escoja Logo para subir'
            break

        case 'overlay':
            uploadText.value = 'Escoja Overlay para subir'
            break

        case 'bg':
            uploadText.value = 'Escoja Background para subir'
            break
    }
    upload.value = true
}

const selectLogo = logo => {
    if (logo === s.logo) {
        s.logo = null
        s.vonage.session.signal({ type: 'change-logo', data: '' })
    } else {
        s.logo = logo
        s.vonage.session.signal({ type: 'change-logo', data: logo })
    }
}

const selectOverlay = overlay => {
    if (overlay === s.overlay) {
        s.overlay = null
        s.vonage.session.signal({ type: 'change-overlay', data: '' })
    } else {
        s.overlay = overlay
        s.vonage.session.signal({ type: 'change-overlay', data: overlay })
    }
}

const selectBg = bg => {
    if (bg === s.bg) {
        s.bg = null
        s.vonage.session.signal({ type: 'change-bg', data: '' })
    } else {
        s.bg = bg
        s.vonage.session.signal({ type: 'change-bg', data: bg })
    }
}

const toggleBanner = banner => {
    if (!banner) {
        for (const otherBanner of s.banners) {
            otherBanner.shown = false
        }
        s.vonage.session.signal({ type: 'banner-hide', data: '' })
        return
    }

    if (banner.shown) {
        banner.shown = false
        s.vonage.session.signal({ type: 'banner-hide', data: '' })
    } else {
        for (const otherBanner of s.banners) {
            otherBanner.shown = (otherBanner === banner)
        }
        s.vonage.session.signal({ type: 'banner-show', data: s.banners.indexOf(banner).toString() })
    }
}
</script>

<style lang="scss" scoped></style>
