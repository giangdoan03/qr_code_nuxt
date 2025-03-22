// server/api/users/create.post.js

import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const db = useDB()
    const body = await readBody(event)

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const newUser = {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        role: body.role || 'user',
        avatar: body.avatar || `https://i.pravatar.cc/150?u=${body.email}`,
        status: body.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        campaignsCreated: 0,
        loginHistory: [],
        "2faEnabled": false,
        provider: "local",
    }

    const result = await db.collection('users').insertOne(newUser)

    return { success: true, id: result.insertedId }
})
