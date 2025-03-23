import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        const { name, type, content, description } = body

        // Kiểm tra dữ liệu cơ bản
        if (!name || !type || !content) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: 'Thiếu thông tin name, type hoặc content!'
            }))
        }

        // Validate theo loại type
        const validTypes = ['product', 'vcard', 'business']
        if (!validTypes.includes(type)) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: 'Loại type không hợp lệ! Chỉ nhận: product, vcard, business.'
            }))
        }

        // Xử lý validate theo từng loại campaign
        const validationError = validateContentByType(type, content)
        if (validationError) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: validationError
            }))
        }

        // Kết nối MongoDB
        const db = await getDb()

        // Tạo object campaign
        const campaign = {
            name,
            description: description || '',
            type,
            content,
            status: 'active',                // default status
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

/**
 * Validate content theo type
 * @param {string} type
 * @param {object} content
 * @returns {string|null}
 */
function validateContentByType(type, content) {
    if (typeof content !== 'object') {
        return 'Content phải là object!'
    }

    switch (type) {
        case 'product':
            if (!content.name || !content.price) {
                return 'Thiếu thông tin product: name hoặc price!'
            }
            if (typeof content.price !== 'number') {
                return 'Price của product phải là số!'
            }
            break

        case 'vcard':
            if (!content.fullName || !content.phone) {
                return 'Thiếu thông tin vCard: fullName hoặc phone!'
            }
            break

        case 'business':
            if (!content.companyName || !content.address) {
                return 'Thiếu thông tin business: companyName hoặc address!'
            }
            break

        default:
            return 'Loại type không hỗ trợ!'
    }

    return null
}
