import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Bạn chưa đăng nhập!' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        event.context.user = decoded
    } catch (err) {
        throw createError({ statusCode: 401, statusMessage: 'Token không hợp lệ!' })
    }
})
