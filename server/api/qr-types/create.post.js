// === server/api/qr-types/create.post.js ===
import { createQrType } from '~/server/models/qrTypes'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.name || !body.type) {
        return sendError(event, createError({ statusCode: 400, message: 'Tên và type là bắt buộc!' }))
    }

    const qrType = {
        name: body.name,
        type: body.type,
        description: body.description || '',
        fields: body.fields || [],
        active: true,
        createdAt: new Date()
    }

    const result = await createQrType(qrType)
    return {
        success: true,
        message: 'Tạo loại QR thành công!',
        data: result
    }
})
