// === server/models/qrTypes.js ===
import { getDb } from '~/server/utils/db'

export const getAllQrTypes = async () => {
    const db = await getDb()
    return db.collection('qr_types').find({ active: true }).toArray()
}

export const createQrType = async (qrType) => {
    const db = await getDb()
    return db.collection('qr_types').insertOne(qrType)
}

export const updateQrType = async (id, updateData) => {
    const db = await getDb()
    return db.collection('qr_types').updateOne({ _id: new ObjectId(id) }, { $set: updateData })
}

export const deleteQrType = async (id) => {
    const db = await getDb()
    return db.collection('qr_types').deleteOne({ _id: new ObjectId(id) })
}


// === server/api/qr-types/index.get.js ===
import { getAllQrTypes } from '~/server/models/qrTypes'

export default defineEventHandler(async () => {
    const qrTypes = await getAllQrTypes()
    return {
        success: true,
        data: qrTypes
    }
})