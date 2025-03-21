import { MongoClient } from 'mongodb'

let client
let db

export async function getDb() {
    if (!client) {
        client = new MongoClient(process.env.MONGO_URI)
        await client.connect()
        db = client.db(process.env.MONGO_DB_NAME)
    }

    return db
}
