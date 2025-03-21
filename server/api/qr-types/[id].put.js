import { updateQrType } from '~/server/models/qrTypes'

export default defineEventHandler(async (event) => {
    const { id } = event.context.params
    const body = await readBody(event)

    const result = await updateQrType(id, body)

    return {
        success: true,
        message: 'Cập nhật thành công!',
        data: result
    }
})