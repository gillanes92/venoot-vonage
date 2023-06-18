import axios from 'axios'

const baseURL =
    window.location.protocol +
    '//' +
    window.location.host.split(':')[0] +
    (import.meta.env.DEV ? ':8001' : '')
const instance = axios.create({
    baseURL,
})

export default instance
