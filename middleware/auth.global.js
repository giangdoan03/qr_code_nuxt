export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token', { path: '/' })

    const publicRoutes = ['/', '/login', '/register', '/contact']

    if (!publicRoutes.includes(to.path) && !token.value) {
        console.warn('🚫 Không có token ➡ redirect /login')
        return navigateTo('/login')
    }
})
