// === server/models/campaign.model.js ===
import { getDb } from '~/server/utils/db'
import { ObjectId } from 'mongodb'

/**
 * Hàm tạo campaign mới với đầy đủ trường mặc định
 */
export function buildCampaign({ name, description, type, content }) {
    return {
        name,
        description: description || '',
        type,
        content,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

/**
 * Lấy toàn bộ campaign
 */
export const getAllCampaigns = async () => {
    const db = await getDb()
    return db.collection('campaigns').find({}).sort({ createdAt: -1 }).toArray()
}

/**
 * Lấy campaign theo ID
 */
export const getCampaignById = async (id) => {
    const db = await getDb()
    return db.collection('campaigns').findOne({ _id: new ObjectId(id) })
}

/**
 * Tạo campaign mới
 */
export const createCampaign = async (campaignData) => {
    const db = await getDb()
    return db.collection('campaigns').insertOne(campaignData)
}

/**
 * Cập nhật campaign
 */
export const updateCampaign = async (id, updateData) => {
    const db = await getDb()
    return db.collection('campaigns').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } }
    )
}

/**
 * Xóa campaign
 */
export const deleteCampaign = async (id) => {
    const db = await getDb()
    return db.collection('campaigns').deleteOne({ _id: new ObjectId(id) })
}

/**
 * Cập nhật trạng thái campaign
 */
export const updateCampaignStatus = async (id, status) => {
    const db = await getDb()
    return db.collection('campaigns').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
    )
}
