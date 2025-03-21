export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token')

    // Exclude route không cần login
    const publicRoutes = ['/', '/login', '/register']

    if (!publicRoutes.includes(to.path) && !token.value) {
        return navigateTo('/login')
    }

    // Optionally log
    console.log('✅ Passed middleware auth')
})
