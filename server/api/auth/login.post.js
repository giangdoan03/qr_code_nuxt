import { getDb } from '../../utils/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        // Kiểm tra dữ liệu đầu vào
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
            throw createError({
                statusCode: 401,
                statusMessage: 'Email không tồn tại!',
                message: 'Email không tồn tại!'
            })
        }

        // So sánh mật khẩu đã hash
        const isPasswordValid = await bcrypt.compare(body.password, user.password)

        if (!isPasswordValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Sai mật khẩu!',
                message: 'Sai mật khẩu!'
            })
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                id: user._id.toString(), // bảo đảm _id là string
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'yourDefaultSecret',
            { expiresIn: '1d' }
        )

        console.log('🎉 Đăng nhập thành công:', user.email)

        // Xoá trường nhạy cảm trước khi trả user về
        const { password, ...userSafeData } = user

        // Trả response
        return {
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: userSafeData
        }

    } catch (err) {
        console.log('🔥 Lỗi đăng nhập:', err.message)
        // Trả về lỗi chuẩn REST API
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Đã xảy ra lỗi!',
            message: err.message || 'Đăng nhập thất bại!'
        })
    }
})
