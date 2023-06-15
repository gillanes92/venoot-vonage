<script setup>
import useAuth from './composables/auth'
import useVonage from './composables/vonage'
import useVenoot from './composables/venoot'
import { useDevices } from './composables/devices'
import { useStore } from "./store"
import { ModalsContainer, VueFinalModal } from "vue-final-modal"
import { computed, onMounted, ref } from "vue"

import Spinner from './components/Spinners/Spinner.vue'
import Panel from './components/Panels/Panel.vue'
import Controls from './components/Controls.vue'
import Button from './components/Buttons/Button.vue'

const auth = useAuth()
const s = useStore()
const d = useDevices()
const v = useVonage()
const ve = useVenoot()

const name = ref(s.name)
s.showNameChange = !s.name

const runSetup = async () => {
    console.log('Running setup')
    await setup()
}

const setup = async () => {
    try {

        d.getDevices()
        //v.createSession()
        // await ve.connect()
        // await Promise.all[ve.connect(), v.connect()]
        //v.publish()
        // s.ready = true
        return Promise.resolve()
    } catch (error) {
        s.log(error)
        return Promise.reject()
    }
}

// const setName = async (name) => {
//     s.setName(name)
//     s.showNameChange = false
//     await setup()
// }

const peopleWaiting = computed(() => s.venoot.waitingJoin.length > 0)

const responseRequest = async (person, status) => {
    console.log(person.presenter_uuid, status)
    person.loading = true
    try {
        await ve.joinResponse(person, status)
        return Promise.resolve()
    } catch {
        return Promise.reject()
    } finally {
        person.loading = false
    }
}

onMounted(async () => {
    try {
        await auth.checkLogin()
        await ve.preflight()
        await setup()
    } catch (error) {
        s.log(error)
    }
})
</script>

<template>
    <!-- min-w-[100vw] min-h-screen max-h-[100vh] max-w-[100vw]  -->
    <div class="w-screen h-screen overflow-hidden">
        <!-- <RouterView v-if="auth.ready() && s.ready && s.name"></RouterView> -->

        <!-- Initial Panel -->
        <div v-if="auth.ready() && !s.ready" class="h-full flex justify-center items-center">
            <Panel class="py-7 grow max-w-[300px]">
                <div class="max-w-fit inline-flex items-center gap-2">
                    <Spinner class="mt-0.5" />
                    <div v-if="s.loadingText">{{ s.loadingText }}</div>
                </div>
            </Panel>

        </div>

        <!-- Name Change Modal -->
        <!-- <VueFinalModal v-if="auth.ready() && s.ready" v-model="s.showNameChange" class="flex justify-center items-center"
                                    :click-to-close="false" :esc-to-close="false">
                                    <div class="flex flex-col rounded-2xl bg-red-700 border-2 px-8 py-10 gap-4 max-h-min">
                                        <h1>Ingrese Su Nombre</h1>
                                        <input v-model="name" class="rounded h-10 w-96 text-black font-bold px-2" />
                                        <button @click="setName(name)" class="self-end bg-white text-red-700 px-4 py-2 font-bold">
                                            CONFIRMAR
                                        </button>
                                    </div>
                                </VueFinalModal> -->

        <!-- Join Requests -->
        <VueFinalModal v-if="auth.ready() /**&& s.ready*/" v-model="peopleWaiting" class="relative" :click-to-close="false"
            :esc-to-close="false" hideOverlay>
            <div class="absolute top-3 w-full flex justify-center">
                <Panel class="w-fit max-w-[90%] max-h-min">
                    <div class="flex flex-col px-6 py-4 gap-3">
                        <h1>Requerimientos de Entrada</h1>
                        <div class="flex flex-col justify-center gap-1 font-light">
                            <div v-for="person in s.venoot.waitingJoin" class="flex flex-row gap-6">
                                <div class="grow">{{ person.name }}</div>
                                <div class="grow">{{ person.message }}</div>
                                <div class="flex flex-row gap-1">
                                    <Button @click="responseRequest(person, false)" size="xs" class="text-xs"
                                        :active="!person.loading" :loading="person.loading" inner-classes="px-2">
                                        DECLINAR
                                    </Button>
                                    <Button @click="responseRequest(person, true)" size="xs" class="text-xs"
                                        :active="!person.loading" :loading="person.loading" inner-classes="px-2">
                                        ACEPTAR
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        </VueFinalModal>

        <!-- Controls Modal -->
        <VueFinalModal v-if="auth.ready() && s.gotInputDevices && s.gotOutputDevices && !s.isHost" v-model="s.showConfig"
            class="flex justify-center items-center" :click-to-close="s.closableConfig" :esc-to-close="s.closableConfig">
            <Controls @run-setup="runSetup" />
        </VueFinalModal>

        <ModalsContainer />

        <div class="hidden w-20 h-20"></div>
    </div>
</template>

<style></style>
