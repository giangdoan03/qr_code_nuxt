import dayjs from 'dayjs'

// 💡 Import đúng cách: Không dùng from – dùng import().then()
export default defineNuxtPlugin(async (nuxtApp) => {
    const advancedFormat = (await import('dayjs/plugin/advancedFormat.js')).default
    const customParseFormat = (await import('dayjs/plugin/customParseFormat.js')).default
    const relativeTime = (await import('dayjs/plugin/relativeTime.js')).default

    dayjs.extend(advancedFormat)
    dayjs.extend(customParseFormat)
    dayjs.extend(relativeTime)

    nuxtApp.provide('dayjs', dayjs)
})
