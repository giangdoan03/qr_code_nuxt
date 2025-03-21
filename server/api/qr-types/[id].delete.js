// === server/api/qr-types/[id].delete.js ===
import { deleteQrType } from '~/server/models/qrTypes'

export default defineEventHandler(async (event) => {
    const { id } = event.context.params
    const result = await deleteQrType(id)

    return {
        success: true,
        message: 'Xóa thành công!',
        data: result
    }
})