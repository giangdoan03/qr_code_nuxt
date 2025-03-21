import {process} from "std-env";

export default defineNuxtConfig({
    runtimeConfig: {
        mongoUri: process.env.MONGO_URI,
        mongoDbName: process.env.MONGO_DB_NAME,
        jwtSecret: process.env.JWT_SECRET
    },

    nitro: {
        externals: {
            external: ['mongodb'] // ✅ Thêm dòng này để fix cảnh báo
        }
    },

    compatibilityDate: '2025-03-20',

})