import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
    try {
        const form = formidable({
            multiples: false,
            keepExtensions: true,
            uploadDir: path.join(process.cwd(), '/public/uploads/avatars')
        })

        const [fields, files] = await form.parse(event.node.req)

        const avatarFile = files.file?.[0] // ✅ Đây là file trả về (nếu version 3+)
        if (!avatarFile) {
            return {
                success: false,
                message: 'Không tìm thấy file upload!'
            }
        }

        const oldPath = avatarFile.filepath // ✅ Đường dẫn file tạm
        const fileExt = path.extname(avatarFile.originalFilename)
        const fileName = `${Date.now()}${fileExt}`

        const uploadFolder = path.join(process.cwd(), '/public/uploads/avatars')
        const newPath = path.join(uploadFolder, fileName)

        // Di chuyển file từ oldPath -> newPath
        fs.renameSync(oldPath, newPath)

        // Trả về đường dẫn public cho client
        return {
            success: true,
            message: 'Upload ảnh thành công!',
            imagePath: `/uploads/avatars/${fileName}` // Đường dẫn public
        }

    } catch (error) {
        console.error('🔥 Lỗi upload:', error)
        return {
            success: false,
            message: 'Lỗi khi upload ảnh!',
            error: error.message
        }
    }
})
