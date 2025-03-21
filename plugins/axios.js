import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const instance = axios.create({
        baseURL: 'http://localhost:3000' // hoặc process.env.API_URL
    })

    return {
        provide: {
            axios: instance
        }
    }
})
