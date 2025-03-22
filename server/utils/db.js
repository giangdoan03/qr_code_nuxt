import { MongoClient } from 'mongodb'

// Biến global lưu client và db
let cachedClient = null
let cachedDb = null

export async function getDb() {
    // Nếu đã có kết nối DB, trả về luôn
    if (cachedDb) {
        return cachedDb
    }

    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017'
        const dbName = process.env.MONGO_DB_NAME || 'app_qr_code'

        // Nếu chưa có client, tạo mới
        if (!cachedClient) {
            cachedClient = new MongoClient(uri)
            await cachedClient.connect()
            console.log('✅ Đã kết nối MongoDB thành công!')
        }

        // Lấy database
        cachedDb = cachedClient.db(dbName)
        console.log(`✅ Đã chọn database: ${dbName}`)

        return cachedDb

    } catch (err) {
        console.error('❌ MongoDB connection error:', err)
        throw new Error('Không thể kết nối database!')
    }
}
