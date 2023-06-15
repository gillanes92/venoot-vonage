import { useStore } from '../store'
import OT from '@opentok/client'

export const useDevices = () => {
    const s = useStore()

    const getDevices = () => {
        OT.getDevices((error, devices) => {
            if (error) {
                s.log(error)
            } else {
                for (const device of devices) {
                    if (device.kind === 'audioInput') {
                        s.audioInputDevices.push(device)

                        if (device.deviceId === 'default') {
                            s.currentAudioInputDevice = device.deviceId
                        }
                    } else if (device.kind === 'videoInput') {
                        s.videoInputDevices.push(device)
                    }
                }

                if (s.videoInputDevices.length > 0) {
                    s.currentVideoInputDevice = s.videoInputDevices[0].deviceId
                }

                s.gotInputDevices = true
            }
        })

        OT.getAudioOutputDevices().then(devices => {
            s.audioOutputDevices = devices

            for (const device of devices) {
                if (device.deviceId === 'default') {
                    s.currentAudioOutputDevice = device.deviceId
                }
            }

            s.gotOutputDevices = true
        })
    }

    const getUserStream = async () => {
        try {
            const stream = await OT.getUserMedia({
                audioSource: s.vonage.localAudio
                    ? s.currentAudioOutputDevice
                    : null,
                videoSource: s.vonage.localVideo
                    ? s.currentVideoInputDevice
                    : null,
            })

            return Promise.resolve(stream)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const createVideoElement = (stream, width, height) => {
        const video = document.createElement('video')
        video.srcObject = stream
        video.autoplay = true
        video.controls = false
        video.muted = false

        // if (width) {
        //     video.width = width
        // }

        // if (height) {
        //     video.height = height
        // }

        return video
    }

    const getUserMedia = async () => {
        try {
            const stream = await OT.getUserMedia({
                audioSource: s.vonage.localAudio
                    ? s.currentAudioOutputDevice
                    : null,
                videoSource: s.vonage.localVideo
                    ? s.currentVideoInputDevice
                    : null,
            })

            const video = document.createElement('video')
            video.srcObject = stream
            video.autoplay = true
            video.controls = false
            video.muted = false

            return Promise.resolve(video)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const setAudioOutput = async () => {
        try {
            await OT.setAudioOutputDevice(s.currentAudioOutputDevice)
            return Promise.resolve(s.currentAudioOutputDevice)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return {
        getDevices,
        getUserStream,
        createVideoElement,
        getUserMedia,

        setAudioOutput,
    }
}
