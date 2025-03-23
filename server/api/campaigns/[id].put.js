import { getDb } from '~/server/utils/db'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params
        const body = await readBody(event)

        if (!id) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: 'Thiếu ID campaign!'
            }))
        }

        const { name, description, status, content } = body

        if (!name || !content) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: 'Thiếu name hoặc content!'
            }))
        }

        const db = await getDb()

        const campaign = await db.collection('campaigns').findOne({ _id: new ObjectId(id) })
        if (!campaign) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: 'Không tìm thấy campaign!'
            }))
        }

        const updateData = {
            name,
            description: description || '',
            status: status || campaign.status,
            content,
            updatedAt: new Date()
        }

        await db.collection('campaigns').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        return {
            success: true,
            message: 'Cập nhật campaign thành công!',
            data: {
                id,
                ...updateData
            }
        }

    } catch (err) {
        console.error('❌ Lỗi cập nhật campaign:', err)
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Lỗi server!',
            message: err.message
        }))
    }
})
