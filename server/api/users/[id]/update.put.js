// server/api/users/[id]/update.put.js

import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
    const db = useDB()
    const { id } = event.context.params
    const body = await readBody(event)

    const updateFields = {
        name: body.name,
        role: body.role,
        status: body.status,
        avatar: body.avatar,
        updatedAt: new Date(),
    }

    await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
    )

    return { success: true, message: 'Cập nhật thành công!' }
})
