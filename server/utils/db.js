import { MongoClient } from 'mongodb'

// Khai báo biến toàn cục (giữ kết nối nếu đã tạo)
let cachedClient = null
let cachedDb = null

export async function getDb() {
    // Nếu đã kết nối, trả luôn db
    if (cachedDb) {
        return cachedDb
    }

    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017'
        const dbName = process.env.MONGO_DB_NAME || 'app_qr_code'

        // Tạo client nếu chưa có
        if (!cachedClient) {
            cachedClient = new MongoClient(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })

            await cachedClient.connect()
            console.log('✅ MongoDB connected!')
        }

        // Gán cachedDb
        cachedDb = cachedClient.db(dbName)
        return cachedDb

    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message)
        throw new Error('Không thể kết nối database!')
    }
}
