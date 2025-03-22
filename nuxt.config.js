module.exports = {
    runtimeConfig: {
        mongoUri: process.env.MONGO_URI,
        mongoDbName: process.env.MONGO_DB_NAME,
        jwtSecret: process.env.JWT_SECRET
    },


    app: {
        head: {
            title: 'QR Marketing Dashboard',
            titleTemplate: '%s - QR Marketing Dashboard',
            meta: [
                { name: 'description', content: 'Nền tảng tạo và quản lý QR Code chuyên nghiệp' },
                { charset: 'utf-8' }
            ]
        }
    },

    nitro: {
        externals: {
            external: ['mongodb']
        }
    },

    compatibilityDate: '2025-03-02',

    modules: ['@nuxtjs/tailwindcss'],

    css: ['~/assets/css/tailwind.css', '~/assets/css/homepage.css'],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },

    // ✅ Không cần plugins nữa!
    vite: {}
}
