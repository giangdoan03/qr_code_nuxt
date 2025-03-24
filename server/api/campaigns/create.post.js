import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        console.log('📦 Body nhận được:', JSON.stringify(body, null, 2))

        const {
            name,
            type,
            description,
            content,
            avatar,
            imageUrl,
            logo
        } = body

        if (!name || !type || !content) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: 'Thiếu thông tin name, type hoặc content!'
            }))
        }

        const validTypes = ['product', 'vcard', 'business']
        if (!validTypes.includes(type)) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: 'Loại type không hợp lệ!'
            }))
        }

        const validationError = validateContentByType(type, content)
        if (validationError) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: validationError
            }))
        }

        // Xử lý avatar riêng cho vCard
        if (type === 'vcard') {
            console.log('✅ Avatar nhận được:', avatar)

            if (avatar && !isValidImageUrl(avatar)) {
                return sendError(event, createError({
                    statusCode: 400,
                    statusMessage: 'Avatar không hợp lệ! (jpg/jpeg/png)'
                }))
            }

            content.avatar = avatar || ''
            console.log('✅ Content vCard:', content)
        }

        // Xử lý product image
        if (type === 'product') {
            if (imageUrl && !isValidImageUrl(imageUrl)) {
                return sendError(event, createError({
                    statusCode: 400,
                    statusMessage: 'Ảnh sản phẩm không hợp lệ!'
                }))
            }

            content.imageUrl = imageUrl || ''
        }

        // Xử lý logo doanh nghiệp
        if (type === 'business') {
            if (logo && !isValidImageUrl(logo)) {
                return sendError(event, createError({
                    statusCode: 400,
                    statusMessage: 'Logo không hợp lệ!'
                }))
            }

            content.logo = logo || ''
        }

        const db = await getDb()

        const campaign = {
            name,
            description: description || '',
            type,
            content,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        console.log('✅ Campaign chuẩn bị insert:', JSON.stringify(campaign, null, 2))

        const result = await db.collection('campaigns').insertOne(campaign)

        return {
            success: true,
            message: 'Tạo campaign thành công!',
            data: {
                id: result.insertedId.toString(),
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

function validateContentByType(type, content) {
    if (typeof content !== 'object') {
        return 'Content phải là object!'
    }

    switch (type) {
        case 'product':
            if (!content.productName || typeof content.price !== 'number') {
                return 'Thiếu thông tin sản phẩm hoặc price không đúng định dạng!'
            }
            break

        case 'vcard':
            if (!content.fullName || !content.phone) {
                return 'Thiếu thông tin vCard!'
            }
            break

        case 'business':
            if (!content.companyName || !content.address) {
                return 'Thiếu thông tin business!'
            }
            break

        default:
            return 'Loại type không hỗ trợ!'
    }

    return null
}

function isValidImageUrl(url) {
    return typeof url === 'string' && /\.(jpg|jpeg|png)$/i.test(url)
}
