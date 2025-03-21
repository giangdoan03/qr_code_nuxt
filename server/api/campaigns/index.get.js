import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const db = await getDb()

        // Lấy query params để phân trang và lọc
        const query = getQuery(event)

        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || 10
        const skip = (page - 1) * limit

        // Khởi tạo bộ lọc
        const filter = {}

        // Nếu có query type thì filter theo type
        if (query.type && query.type !== '') {
            filter.type = query.type
        }

        // Nếu có query status thì filter theo status
        if (query.status && query.status !== '') {
            filter.status = query.status
        }

        console.log('👉 Bộ lọc:', filter)

        // Lấy danh sách campaigns theo filter + phân trang
        const campaigns = await db
            .collection('campaigns')
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .toArray()

        // Tổng số documents cho filter hiện tại
        const total = await db.collection('campaigns').countDocuments(filter)

        return {
            success: true,
            message: 'Lấy danh sách campaigns thành công!',
            data: campaigns,
            pagination: {
                total,
                page,
                limit
            }
        }

    } catch (err) {
        console.error('🔥 Lỗi lấy danh sách campaigns:', err)
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Lỗi server!',
            message: err.message
        }))
    }
})
