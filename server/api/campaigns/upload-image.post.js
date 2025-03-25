import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
    const form = formidable({
        multiples: false,
        keepExtensions: true,
        uploadDir: path.join(process.cwd(), 'public/uploads/products'),
    })

    return new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
            if (err || !files.file) {
                return resolve({
                    success: false,
                    message: 'Lỗi khi xử lý file!',
                })
            }

            const uploadedFile = files.file[0]
            const filePath = uploadedFile.filepath
            const fileExt = path.extname(uploadedFile.originalFilename)
            const fileName = `${Date.now()}${fileExt}`
            const newPath = path.join(form.uploadDir, fileName)

            fs.renameSync(filePath, newPath)

            return resolve({
                success: true,
                imagePath: `/uploads/products/${fileName}`,
            })
        })
    })
})
