import Echo from 'laravel-echo'
import { useStore } from '../store'
import { axios } from '../plugins/vue-auth'
import useAuth from './auth'
import { useToast } from 'vue-toast-notification'

const useVenoot = () => {
    const s = useStore()
    const auth = useAuth()
    const toast = useToast()

    const preflight = async () => {
        s.venoot.echo = new Echo({
            broadcaster: 'socket.io',
            host:
                window.location.hostname + (import.meta.env.DEV ? ':6001' : ''),
            path: import.meta.env.DEV ? '' : '/ws/socket.io/',
            auth: {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + auth.token(),
                },
            },
        })

        axios.interceptors.request.use(function (config) {
            config.headers['X-Socket-Id'] = s.venoot.echo.socketId()
            return config
        })

        s.log('Connecting to Venoot (Preflight)...')
        try {
            if (s.isHost) {
                await s.venoot.echo
                    .private(`host.event.${s.venoot.event.id}`)
                    .listen('WebinarJoinRequestEvent', e => {
                        s.venoot.waitingJoin.push(e)
                    })
            }

            if (s.isPresenter) {
                await s.venoot.echo.private(
                    `presenter.${s.venoot.presenterUuid}.event.${s.venoot.event.id}`
                ).listen('WebinarJoinResponseEvent', e => {
                    if (e.token) {
                        s.vonage.token = e.token
                        s.accepted = true
                    } else {
                        toast.error('Su peticion para unirse al webinar ha sido rechazada.')
                        s.accepted = false
                    }
                })
            }

            s.log('Connected to Venoot (Preflight)!')
            return Promise.resolve()
        } catch (error) {
            s.log(error)
            return Promise.reject()
        }
    }

    const connect = async () => {
        try {
            s.log('Connecting to Venoot...')
            await s.venoot.echo.join(`event.${s.venoot.event.id}`)
            await s.venoot.echo
                .private(`event.${s.venoot.event.id}`)

                // CHAT
                .listenForWhisper('chat.message', data => {
                    s.chatMessages.push({
                        from: data.from,
                        text: data.text,
                        mine: false,
                    })
                })

                // POLL
                .listenForWhisper('poll.start', data => {
                    s.questions[0].status = 'active'
                })
                .listenForWhisper('poll.vote', data => {
                    s.questions[0].options.filter(
                        option => option.text === data.text
                    )[0].selected += 1
                })
                .listenForWhisper('poll.close', data => {
                    s.questions[0].status = 'done'
                })
                .listenForWhisper('poll.show', data => {
                    s.questions[0].status = 'shown'
                })

            s.log('Connected to Venoot!')
            return Promise.resolve()
        } catch {
            return Promise.reject()
        }
    }

    const joinRequest = async (name, message) => {
        try {
            const response = await axios.post('chatter/webinars/join', {
                name,
                message,
            })

            if (response.data.token) {
                s.vonage.token = response.data.token
                s.accepted = true
            }

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const joinResponse = async (person, status) => {
        try {
            const response = await axios.post('chatter/webinars/response-join', {
                status,
                presenter_uuid: person.presenter_uuid,
            })

            if (response.data.token) {
                s.vonage.token = response.data.token
                s.accepted = true
            }

            const index = s.venoot.waitingJoin.indexOf(person)
            s.venoot.waitingJoin.splice(index, 1)

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {
        preflight,
        connect,

        joinRequest,
        joinResponse,
    }
}

export default useVenoot
