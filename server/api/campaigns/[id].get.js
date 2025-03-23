import { getDb } from '~/server/utils/db'
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params

        if (!id) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: 'Thiếu ID campaign!'
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

        return {
            success: true,
            data: campaign
        }

    } catch (err) {
        console.error('🔥 Lỗi lấy campaign chi tiết:', err)
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Lỗi server!',
            message: err.message
        }))
    }
})

