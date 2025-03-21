import { getDb } from '../../utils/db'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const db = await getDb()

    const existingUser = await db.collection('users').findOne({ email: body.email })
    if (existingUser) {
        throw createError({ statusCode: 400, statusMessage: 'Email đã tồn tại' })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    await db.collection('users').insertOne({
        email: body.email,
        password: hashedPassword,
        createdAt: new Date()
    })

    return { message: 'Đăng ký thành công!' }
})
