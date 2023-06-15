import { defineStore } from 'pinia'

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
})

export const useStore = defineStore('main', {
    state: () => ({
        dev: import.meta.env.DEV,
        originalURL: window.location.href,

        venoot: {
            echo: null,
            token: params.token,
            presenterUuid: localStorage.getItem('presenter_uuid'),
            mode: params.mode,
            event: null,

            waitingJoin: []
        },

        vonage: {
            sessionId: null,
            token: null,

            session: null,
            publisher: null,
            screenPublisher: null,

            element: null,
            stream: null,

            localAudio: true,
            localVideo: true,

            layout: 'default',
            focusedSpeaker: null,
            screenSharing: false,
            activeScreen: null,
        },

        showConfig: true,
        closableConfig: false,

        accepted: null,
        loading: true,
        loadingText: 'Cargando',
        ready: false,

        name: localStorage.getItem('user_name') ?? "Visita",
        showNameChange: false,

        gotInputDevices: false,
        gotOutputDevices: false,
        videoInputDevices: [],
        audioInputDevices: [],
        audioOutputDevices: [],
        currentVideoInputDevice: null,
        currentAudioInputDevice: null,
        currentAudioOutputDevice: null,

        user: null,
        ams: null,

        localStream: null,
        streams: [],
        previewSources: [],

        banners: [
            {
                title: 'Lorem ipsum dolor',
                text: 'Some really long description',
                type: 'box',
                shown: false,
            },
            {
                title: 'Lorem ipsum',
                text: 'Other banner test',
                type: 'box',
                shown: false,
            },
        ],

        showBanner: false,
        showLastBanner: false,
        banner: null,
        lastBanner: null,

        logos: ['logo.png'],

        overlays: ['overlay.png'],

        bgs: ['background.png'],

        buttonTheme: 'default',
        color: '#DC2626',

        logo: null,
        overlay: null,
        bg: null,

        layout: 'default',

        onAir: false,

        tab: 'chat',

        brand: 'venoot',
        brands: [
            // {
            //     name: 'default',
            //     logos: ['logo.png'],

            //     overlays: ['overlay.png'],

            //     bgs: ['background.png'],

            //     buttonTheme: 'default',
            //     color: '#DC2626',

            //     logo: null,
            //     overlay: null,
            //     bg: null,
            // },

            {
                name: 'venoot',
                logos: ['logo.png'],

                overlays: ['overlay.png'],

                bgs: ['background.png'],

                buttonTheme: 'rounded',
                color: '#1A56DB',

                logo: null,
                overlay: null,
                bg: null,
            },
        ],

        chatMessages: [
            // { from: "Cristobal", text: "Lorem Ipsum", mine: true },
            // { from: "Pedro", text: "Lorem Ipsum", mine: false },
            // { from: "Cristobal", text: "Lorem Ipsum", mine: true },
            // { from: "Cristobal", text: "Lorem Ipsum", mine: true },
            // { from: "Pedro", text: "Lorem Ipsum", mine: false },
            // { from: "Pedro", text: "Lorem Ipsum", mine: false },
        ],

        questions: [
            {
                title: 'Color Favorito',
                options: [
                    { text: 'Azul', selected: 0 },
                    { text: 'Blanco', selected: 0 },
                    { text: 'Rojo', selected: 0 },
                    { text: 'Transparente', selected: 0 },
                ],
                status: 'idle',
            },
        ],
    }),

    getters: {
        isHost(state) {
            return state.venoot.mode === 'host'
        },

        isPresenter(state) {
            return state.venoot.mode === 'presenter'
        },

        isParticipant(state) {
            return state.venoot.mode === 'participant'
        },
    },

    actions: {
        log(message) {
            if (this.dev) {
                console.log(message)
            }
        },

        OTexceptionHandler(error) {
            switch (error.code) {
                case 1004:
                    break

                case 1005:
                    break

                case 1006:
                    break

                case 1007:
                    break

                case 1008:
                    break

                case 1009:
                    break

                case 1010:
                    break

                case 1011:
                    break

                case 1013:
                    break

                case 1014:
                    break

                case 1026:
                    break

                case 1500:
                    break

                case 1520:
                    break

                case 1530:
                    break

                case 1535:
                    break

                case 2000:
                    break

                case 2010:
                    break
            }
        },

        // connect() {
        //     const token =
        //         this.mode === 'host'
        //             ? this.vonage.moderatorToken
        //             : this.vonage.publisherToken

        //     this.vonage.session.connect(token, error => {
        //         if (error) {
        //             error => {
        //                 console.log(error)
        //             }
        //         } else {
        //             if (this.vonage.session.capabilities.forceMute) {
        //                 // let mutedSessions = localStorage.getItem('mutedSessions')
        //                 // if (!mutedSessions) {
        //                 //   mutedSessions = []
        //                 // }

        //                 // if (!mutedSessions.includes(session.id)) {
        //                 console.log('Mutting Session...')
        //                 this.vonage.session.forceMuteAll()
        //                 //   mutedSessions.push(session.id)
        //                 //   localStorage.setItem('mutedSessions', mutedSessions)
        //                 // } else {
        //                 //   console.log("Session already muted")
        //                 // }
        //             }

        //             console.log('Publishing...')
        //             this.vonage.publisher = OT.initPublisher(
        //                 null,
        //                 {
        //                     insertDefaultUI: false,
        //                     name: this.name,
        //                 },
        //                 error => {
        //                     if (error) {
        //                         console.log(error)
        //                     }
        //                 }
        //             ).on({
        //                 videoElementCreated: event => {
        //                     this.vonage.element = event.element
        //                 },
        //                 streamCreated: event => {
        //                     this.vonage.stream = event.stream
        //                     this.previewSources.push({
        //                         element: this.vonage.element,
        //                         stream: this.vonage.stream,
        //                         local: true,
        //                     })
        //                 },
        //                 muteForced: event => {
        //                     console.log('Forced Mute')
        //                 },
        //             })

        //             this.vonage.session.publish(
        //                 this.vonage.publisher,
        //                 error => {
        //                     if (error) {
        //                         console.log(error)
        //                     }
        //                 }
        //             )
        //             console.log('Successfully published')
        //         }
        //     })
        // },

        setName(name) {
            this.name = name
            localStorage.setItem('user_name', name)
        },

        changeLayout(newLayout, passive = false) {
            switch (newLayout) {
                case 'default':
                    this.vonage.layout = 'default'
                    if (!passive) {
                        this.vonage.session.signal({
                            type: 'change-layout',
                            data: 'default',
                        })
                    }
                    break

                case 'focused-speaker':
                    if (this.vonage.focusedSpeaker === null) {
                        this.vonage.focusedSpeaker = this.streams[0].stream.id

                        if (!passive) {
                            this.vonage.session.signal({
                                type: 'focused-speaker',
                                data: this.vonage.focusedSpeaker,
                            })
                        }
                    }

                    if (
                        this.streams.filter(
                            stream => stream.stream.videoType === 'camera'
                        ).length === 1
                    ) {
                        this.vonage.layout = 'default'
                        if (!passive) {
                            this.vonage.session.signal({
                                type: 'change-layout',
                                data: 'default',
                            })
                        }
                    } else {
                        this.vonage.layout = 'focused-speaker'
                        if (!passive) {
                            this.vonage.session.signal({
                                type: 'focused-speaker',
                                data: this.vonage.focusedSpeaker,
                            })
                            this.vonage.session.signal({
                                type: 'change-layout',
                                data: 'focused-speaker',
                            })
                        }
                    }
                    break

                case 'vertical-sharing':
                    if (this.vonage.activeScreen) {
                        this.vonage.layout = 'vertical-sharing'
                        if (!passive) {
                            this.vonage.session.signal({
                                type: 'change-layout',
                                data: 'vertical-sharing',
                            })
                        }
                    } else {
                        this.vonage.layout = 'default'
                        if (!passive) {
                            this.vonage.session.signal({
                                type: 'change-layout',
                                data: 'default',
                            })
                        }
                    }
                    break

                case 'full-screen':
                    if (this.vonage.activeScreen) {
                        this.vonage.layout = 'full-screen'
                        if (!passive) {
                            this.vonage.session.signal({
                                type: 'change-layout',
                                data: 'full-screen',
                            })
                        }
                    } else {
                        this.vonage.layout = 'default'
                        if (!passive) {
                            this.vonage.session.signal({
                                type: 'change-layout',
                                data: 'default',
                            })
                        }
                    }
                    break
            }
        },
    },
})
