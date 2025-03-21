module.exports = {
    runtimeConfig: {
        mongoUri: process.env.MONGO_URI,
        mongoDbName: process.env.MONGO_DB_NAME,
        jwtSecret: process.env.JWT_SECRET
    },

    nitro: {
        externals: {
            external: ['mongodb']
        }
    },

    compatibilityDate: '2025-03-02',

    modules: ['@nuxtjs/tailwindcss'],

    css: ['~/assets/css/tailwind.css'],

    // ✅ Không cần plugins nữa!
    vite: {}
}
