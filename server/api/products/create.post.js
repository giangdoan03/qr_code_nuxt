import { getDb } from '../../utils/db' // ✅ import đúng

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const db = await getDb() // ✅ gọi kết nối DB

    const product = {
        name: body.name,
        description: body.description,
        price: body.price,
        images: body.images,
        qrSlug: body.slug,
        createdAt: new Date()
    }

    const result = await db.collection('products').insertOne(product)

    return {
        success: true,
        data: result.insertedId
    }
})
