import { getDb } from '../../utils/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        console.log('📥 Body nhận từ client:', body)

        if (!body.email || !body.password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Thiếu email hoặc password!',
                message: 'Thiếu email hoặc password!'
            })
        }

        const db = await getDb()

        // Tìm user theo email
        const user = await db.collection('users').findOne({ email: body.email })

        if (!user) {
            console.log('❌ Không tìm thấy email:', body.email)
            throw createError({
                statusCode: 401,
                statusMessage: 'Email không tồn tại!',
                message: 'Email không tồn tại!'
            })
        }

        console.log('✅ User tìm thấy:', user.email)
        console.log('👉 Password nhập vào:', body.password)
        console.log('👉 Password lưu Mongo:', user.password)

        // So sánh mật khẩu
        const passwordValid = await bcrypt.compare(body.password, user.password)

        console.log('✅ Kết quả so sánh mật khẩu:', passwordValid)

        if (!passwordValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Sai mật khẩu!',
                message: 'Sai mật khẩu!'
            })
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'yourDefaultSecret',
            { expiresIn: '1d' }
        )

        console.log('🎉 Đăng nhập thành công!')

        // Xoá password trước khi trả về thông tin user
        const { password, ...userData } = user

        // Trả về token + thông tin user
        return {
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: userData
        }

    } catch (err) {
        console.log('🔥 Lỗi đăng nhập:', err.message)

        // Trả về lỗi chuẩn REST API
        return sendError(event, err)
    }
})
