import { validateCampaignInput } from '~/server/validators/campaign.validator'
import { isValidImageUrl } from '~/server/utils/image'
import { buildCampaign } from '~/server/models/campaign.model'
import { createCampaign } from '~/server/models/campaigns'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { name, type, description, content, imageUrl, logo } = body
        const { avatar } = content || {}

        console.log('📦 Body nhận được:', JSON.stringify(body, null, 2))

        // 1. Validate input
        const validationError = validateCampaignInput({ name, type, content })
        if (validationError) {
            return sendError(event, createError({ statusCode: 400, statusMessage: validationError }))
        }

        // 2. Validate hình ảnh theo từng loại
        switch (type) {
            case 'vcard':
                if (avatar && !isValidImageUrl(avatar)) {
                    return sendError(event, createError({ statusCode: 400, statusMessage: 'Avatar không hợp lệ!' }))
                }
                content.avatar = avatar || ''
                break

            case 'product':
                if (imageUrl && !isValidImageUrl(imageUrl)) {
                    return sendError(event, createError({ statusCode: 400, statusMessage: 'Ảnh sản phẩm không hợp lệ!' }))
                }
                content.imageUrl = imageUrl || ''
                break

            case 'business':
                if (logo && !isValidImageUrl(logo)) {
                    return sendError(event, createError({ statusCode: 400, statusMessage: 'Logo không hợp lệ!' }))
                }
                content.logo = logo || ''
                break
        }

        // 3. Build campaign & insert DB
        const campaign = buildCampaign({ name, description, type, content })
        const result = await createCampaign(campaign)

        // 4. Trả kết quả
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
