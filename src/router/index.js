import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'

function hasQueryParams(route) {
    return !!Object.keys(route.query).length
}

const routes = [{ path: '/', component: Main }]

const router = createRouter({
    history: createWebHistory('venoot-webinar'),
    routes,
})

router.beforeEach((to, from, next) => {
    if (!hasQueryParams(to) && hasQueryParams(from)) {
        const toWithQuery = Object.assign({}, to, { query: from.query })
        next(toWithQuery)
    } else {
        next()
    }
})

export default router
