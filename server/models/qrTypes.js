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

