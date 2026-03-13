import { Pool } from 'pg'
import { env } from '../config/env.js'

const globalForDb = globalThis as typeof globalThis & {
  __cantinhoDaVovoDbPool?: Pool
}

export const dbPool =
  globalForDb.__cantinhoDaVovoDbPool ??
  new Pool({
  connectionString: env.DATABASE_URL,
    max: env.NODE_ENV === 'production' ? 5 : 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: true,
  })

if (!globalForDb.__cantinhoDaVovoDbPool) {
  globalForDb.__cantinhoDaVovoDbPool = dbPool
}
