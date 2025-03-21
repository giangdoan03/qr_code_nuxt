import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        // Kiểm tra dữ liệu cơ bản
        if (!body.name || !body.type || !body.content) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: 'Thiếu thông tin name, type hoặc content!'
            }))
        }

        const db = await getDb()

        const campaign = {
            name: body.name,
            description: body.description || '',
            type: body.type,
            content: body.content,
            status: 'active',                // hoặc 'inactive'
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await db.collection('campaigns').insertOne(campaign)

        return {
            success: true,
            message: 'Tạo campaign thành công!',
            data: {
                id: result.insertedId,
                ...campaign
            }
        }

    } catch (err) {
        console.error('🔥 Lỗi tạo campaign:', err)
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Lỗi server!',
            message: err.message
        }))
    }
})
