import { useAuth } from '@websanova/vue-auth'
import { useStore } from '../store'
import { v4 as uuid } from 'uuid'

const auth = () => {
    const auth = useAuth()
    const s = useStore()

    const ready = () => {
        return auth.ready()
    }

    const token = () => {
        return auth.token()
    }

    const user = () => {
        return auth.user()
    }

    const startRefresh = () => {
        const refresh = setInterval(async () => {
            try {
                await auth.refresh({ url: 'chatter/auth/refresh' })
            } catch (error) {
                clearInterval(refresh)
            }
        }, 900000)
    }

    const login = async () => {
        s.log('Login...')

        if (s.isPresenter && !s.venoot.presenterUuid) {
            s.venoot.presenterUuid = uuid()
            localStorage.setItem('presenter_uuid', s.venoot.presenterUuid)
        }

        try {
            const response = await auth.login({
                data: {
                    token: s.venoot.token,
                    type: s.venoot.mode,
                    presenter_uuid: s.venoot.presenterUuid,
                },
            })

            s.log('Login Acepted!')
            s.loadingText = 'Credenciales Aceptadas'
            s.venoot.event = response.data.event
            s.mode = response.data.type

            if (s.mode === 'participant') {
                // s.ams = response.data.data.ams_streamId
            } else {
                s.vonage.sessionId = response.data.sessionId

                if (s.isHost) {
                    s.accepted = true
                    s.vonage.token = response.data.token
                    s.venoot.waitingJoin = response.data.join_requests.map(joinRequest => ({ name: joinRequest.name, message: joinRequest.message, presenter_uuid: joinRequest.chatter.presenter_uuid }))
                }
            }

            //startRefresh()
            return Promise.resolve('logged')
        } catch (error) {
            s.log('Password Error')
            s.loadingText = 'Credenciales Erroneas'
            return Promise.reject(error)
        }
    }

    const checkLogin = async () => {
        try {
            await auth.load()
            if (s.venoot.token && s.venoot.mode) {
                s.loadingText = 'Ingresando Credenciales...'
                return await login()
            } else {
                s.log('Missing Credentials')
                s.loadingText = 'Faltan Credenciales'
                return Promise.reject('missing_credentials')
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {
        ready,
        token,
        user,

        login,
        checkLogin,
        startRefresh,
    }
}

export default auth
