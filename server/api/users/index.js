import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || 10
        const skip = (page - 1) * limit

        const role = query.role || ''
        const status = query.status || ''

        const db = await getDb()

        const filter = {}
        if (role) filter.role = role
        if (status) filter.status = status

        // Đếm tổng
        const total = await db.collection('users').countDocuments(filter)

        // Lấy dữ liệu user
        const users = await db.collection('users')
            .find(filter)
            .skip(skip)
            .limit(limit)
            .project({ password: 0 }) // Không trả về password
            .toArray()

        return {
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total
            }
        }
    } catch (err) {
        console.error('❌ Lỗi server users:', err.message)
        return {
            success: false,
            message: 'Li server users',
            error: err.message
        }
    }
})
