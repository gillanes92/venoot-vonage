import axios from 'axios'

const baseURL =
    window.location.protocol +
    '//' +
    window.location.host.split(':')[0] +
    (import.meta.env.DEV ? ':8000' : '')
const instance = axios.create({
    baseURL,
})

export default instance
