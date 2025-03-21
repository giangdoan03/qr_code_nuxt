import { getDb } from '../../utils/db' // ✅ Đúng rồi nha Giang!

export default defineEventHandler(async (event) => {
    const slug = event.context.params.slug

    const db = await getDb() // ✅ Kết nối db từ getDb()

    // Tìm sản phẩm dựa vào qrSlug
    const product = await db.collection('products').findOne({ qrSlug: slug })

    if (!product) {
        throw createError({ statusCode: 404, statusMessage: 'Không tìm thấy sản phẩm!' })
    }

    return {
        type: 'product',
        ...product
    }
})
