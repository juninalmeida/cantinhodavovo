import { Pool } from 'pg'
import { env } from '../config/env.js'

export const dbPool = new Pool({
  connectionString: env.DATABASE_URL,
})
