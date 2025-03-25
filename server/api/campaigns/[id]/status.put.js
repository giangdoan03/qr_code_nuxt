import { updateCampaignStatus, getCampaignById } from '~/server/models/campaign.model'

export default defineEventHandler(async (event) => {
    const { id } = event.context.params
    const { status } = await readBody(event)

    if (!['active', 'inactive'].includes(status)) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Giá trị status không hợp lệ!'
        }))
    }

    const campaign = await getCampaignById(id)
    if (!campaign) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: 'Không tìm thấy campaign!'
        }))
    }

    await updateCampaignStatus(id, status)

    return {
        success: true,
        message: 'Cập nhật trạng thái thành công!',
        data: { id, status }
    }
})
