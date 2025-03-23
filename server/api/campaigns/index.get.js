import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const db = await getDb()

        // Lấy query params: page, limit, filter type/status...
        const query = getQuery(event)

        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || 10
        const skip = (page - 1) * limit

        // Khởi tạo bộ lọc cơ bản
        const filter = {}

        if (query.type && query.type !== '') {
            filter.type = query.type
        }

        if (query.status && query.status !== '') {
            filter.status = query.status
        }

        // 👉 Tùy chọn: lọc thêm theo các field trong content (nếu cần)
        if (query.search && query.search !== '') {
            filter.name = { $regex: query.search, $options: 'i' }
        }

        console.log('👉 Bộ lọc tìm kiếm:', filter)

        // Query MongoDB
        const campaigns = await db
            .collection('campaigns')
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .toArray()

        // Đếm tổng số records theo filter hiện tại
        const total = await db.collection('campaigns').countDocuments(filter)

        return {
            success: true,
            message: 'Lấy danh sách campaigns thành công!',
            data: campaigns,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
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
