import {Pool} from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false,
    max: 10
})

export const db = drizzle(pool)

export async function getClient() {
    const client = pool.connect()
    return client
}