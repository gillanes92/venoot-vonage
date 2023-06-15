import { markRaw } from 'vue'
import { useStore } from '../store'
import OT from '@opentok/client'

const useVonage = () => {
    const s = useStore()

    const createSession = async () => {
        s.vonage.session = markRaw(
            OT.initSession(import.meta.env.VITE_API_KEY, s.vonage.sessionId)
        )
    }

    const publish = () => {
        s.log('Publising to Vonage...')
        s.vonage.publisher = OT.initPublisher(
            null,
            {
                insertDefaultUI: false,
                name: s.name,
            },
            error => {
                if (error) {
                    s.log(error)
                }
            }
        ).on({
            videoElementCreated: event => {
                s.log('Local Video Element Created!')
                s.vonage.element = event.element
            },
            streamCreated: event => {
                s.log('Local Stream Created!')
                s.vonage.stream = event.stream
                s.previewSources.push({
                    element: s.vonage.element,
                    stream: s.vonage.stream,
                    local: true,
                })
            },
            muteForced: event => {
                s.log('Forced Mute')
            },
        })

        s.vonage.session.publish(s.vonage.publisher, error => {
            if (error) {
                s.log(error)
            } else {
                s.log('Published to Vonage!')
            }
        })
    }

    const connect = async () => {
        s.log('Connecting to Vonage...')

        let doneConnect = false
        let statusConnect = false
        const waitForConnect = async () => {
            return new Promise((resolve, reject) => {
                const interval = setInterval(async () => {
                    if (doneConnect) {
                        resolve()
                        clearInterval(interval)
                    } else {
                        s.log('Waiting on Vonage...')
                    }
                }, 200)
            })
        }

        s.vonage.session.on({
            streamCreated: event => {
                //subscribe(event)
                alert('Subscribe goes here!')
            },

            streamDestroyed: event => {
                s.log('Remote stream stopped')
                s.streams = s.streams.filter(
                    stream => stream.stream.id !== event.stream.id
                )
            },
        })
        // .on('signal:change-layout', event => {
        //     if (
        //         event.from.connectionId !== s.vonage.session.connection.id
        //     ) {
        //         s.changeLayout(event.data, true)
        //     }
        // })
        // .on('signal:focused-speaker', event => {
        //     if (
        //         event.from.connectionId !== s.vonage.session.connection.id
        //     ) {
        //         s.vonage.focusedSpeaker = event.data
        //     }
        // })
        // .on('signal:change-logo', event => {
        //     if (event.data) {
        //         s.logo = event.data
        //     } else {
        //         s.logo = null
        //     }
        // })
        // .on('signal:change-bg', event => {
        //     if (event.data) {
        //         s.bg = event.data
        //     } else {
        //         s.bg = null
        //     }
        // })
        // .on('signal:change-banner', event => {
        //     if (event.data) {
        //         s.layout = event.data
        //     } else {
        //         s.layout = null
        //     }
        // })
        // .on('signal:add-banner', event => {
        //     if (
        //         event.from.connectionId === s.vonage.session.connection.id
        //     ) {
        //         return
        //     }

        //     s.banners = [...s.banners, JSON.parse(event.data)]
        // })
        // .on('signal:banner-show', event => {
        //     if (
        //         event.from.connectionId === s.vonage.session.connection.id
        //     ) {
        //         return
        //     }

        //     const banner = s.banners[Number(event.data)]
        //     for (const otherBanner of s.banners) {
        //         otherBanner.shown = otherBanner === banner
        //     }
        // })
        // .on('signal:banner-hide', event => {
        //     s.log('banner.hide')
        //     if (
        //         event.from.connectionId === s.vonage.session.connection.id
        //     ) {
        //         return
        //     }
        //     for (const otherBanner of s.banners) {
        //         otherBanner.shown = false
        //     }
        // })
        // .on('signal:banner-type-change', event => {
        //     const data = JSON.parse(event.data)
        //     const banner = s.banners[data.index]
        //     banner.type = data.type
        // })
        // .on('signal:change-button-theme', event => {
        //     s.theme = event.data
        // })
        // .on('signal:on-camera', event => {
        //     const streamIndex = s.streams.findIndex(
        //         person => person.stream.id === event.data
        //     )
        //     s.streams[streamIndex].onCamera = true
        // })
        // .on('signal:off-camera', event => {
        //     const streamIndex = s.streams.findIndex(
        //         person => person.stream.id === event.data
        //     )
        //     s.streams[streamIndex].onCamera = false
        // })
        // .on('signal:screen-sharing', event => {
        //     if (event.data) {
        //         s.vonage.activateScreen = event.data
        //     } else {
        //         s.vonage.activateScreen = null
        //     }
        // })

        s.loadingText = 'Conectando...'
        s.vonage.session
            .connect(s.vonage.token, error => {
                if (error) {
                    s.log(`session.connect ${error}`)
                    statusConnect = false
                } else {
                    s.log('Connected to Vonage!')
                    statusConnect = true
                }
                doneConnect = true
            })
            .on({
                connectionCreated: event => {
                    s.log(`Vonage Connection Created!`)
                    // s.log(event)
                },

                sessionConnected: event => {
                    s.log(`Vonage Session Connected!`)
                    // s.log(event)
                },
            })

        await waitForConnect()
        if (statusConnect) {
            s.ready = true
            s.log('Ready!')
            return Promise.resolve()
        } else {
            s.loadingText = 'Fallo de Conexión'
            return Promise.reject()
        }
    }

    return {
        createSession,
        connect,
        publish,
    }
}

export default useVonage
