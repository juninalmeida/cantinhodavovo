import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Pool } from 'pg'
import { env } from '../../src/server/core/config/env.js'

async function run() {
  const pool = new Pool({ connectionString: env.DATABASE_URL })
  const client = await pool.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const files = (await readdir(join(process.cwd(), 'infra/database/migrations')))
      .filter((file) => file.endsWith('.sql'))
      .sort()

    for (const file of files) {
      const exists = await client.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [file])

      if (exists.rowCount) {
        continue
      }

      const sql = await readFile(join(process.cwd(), 'infra/database/migrations', file), 'utf8')

      await client.query('BEGIN')
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file])
      await client.query('COMMIT')
      console.log(`Applied migration: ${file}`)
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Migration failed', error)
  process.exit(1)
})
