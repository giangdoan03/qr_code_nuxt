// server/api/users/[id]/delete.delete.js

import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
    const db = useDB()
    const { id } = event.context.params

    await db.collection('users').deleteOne({ _id: new ObjectId(id) })

    return { success: true, message: 'Xóa user thành công!' }
})
