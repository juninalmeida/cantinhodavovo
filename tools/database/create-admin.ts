import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { env } from '../../src/server/core/config/env.js'

function readRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }

  return value
}

async function run() {
  const name = process.env.ADMIN_NAME ?? 'Project Owner'
  const email = readRequiredEnv('ADMIN_EMAIL').toLowerCase()
  const password = readRequiredEnv('ADMIN_PASSWORD')
  const phone = process.env.ADMIN_PHONE ?? null

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must have at least 12 characters.')
  }

  const pool = new Pool({ connectionString: env.DATABASE_URL })

  try {
    const passwordHash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      `
        INSERT INTO users (name, email, phone, password_hash, role)
        VALUES ($1, $2, $3, $4, 'ADMIN')
        ON CONFLICT (email) DO UPDATE
        SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          password_hash = EXCLUDED.password_hash,
          role = 'ADMIN',
          updated_at = NOW()
        RETURNING id, email, role
      `,
      [name, email, phone, passwordHash],
    )

    console.log(`Admin provisioned: ${String(result.rows[0].email)} (${String(result.rows[0].role)})`)
  } finally {
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Admin bootstrap failed', error)
  process.exit(1)
})
