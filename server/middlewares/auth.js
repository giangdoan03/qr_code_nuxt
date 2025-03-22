export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token') || event.headers.authorization?.split(' ')[1]

    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Bạn chưa đăng nhập!' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        event.context.user = decoded
    } catch (err) {
        console.error('❌ Token lỗi:', err.message)
        throw createError({ statusCode: 401, statusMessage: 'Token không hợp lệ hoặc hết hạn!' })
    }
})
