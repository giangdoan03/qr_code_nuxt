// === server/api/qr-types/index.get.js ===
import { getAllQrTypes } from '~/server/models/qrTypes'

export default defineEventHandler(async () => {
    const qrTypes = await getAllQrTypes()
    return {
        success: true,
        data: qrTypes
    }
})