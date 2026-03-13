import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { env } from '../../src/server/core/config/env.js'

function readRequiredSeedEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required seed env: ${name}`)
  }

  return value
}

async function run() {
  if (env.NODE_ENV === 'production') {
    throw new Error('User seed is disabled in production. Use npm run admin:create for privileged access.')
  }

  if (process.env.ALLOW_USER_SEED !== 'true') {
    console.log('User seed skipped. Set ALLOW_USER_SEED=true and provide SEED_CUSTOMER_EMAIL/SEED_CUSTOMER_PASSWORD to create a local demo account.')
    return
  }

  const pool = new Pool({ connectionString: env.DATABASE_URL })
  const user = {
    name: process.env.SEED_CUSTOMER_NAME ?? 'Cliente Demo',
    email: readRequiredSeedEnv('SEED_CUSTOMER_EMAIL'),
    phone: process.env.SEED_CUSTOMER_PHONE ?? '82999990000',
    password: readRequiredSeedEnv('SEED_CUSTOMER_PASSWORD'),
    role: 'CUSTOMER',
    address: {
      label: 'Principal',
      street: process.env.SEED_CUSTOMER_STREET ?? 'Rua da Vovo',
      number: process.env.SEED_CUSTOMER_NUMBER ?? '25',
      neighborhood: process.env.SEED_CUSTOMER_NEIGHBORHOOD ?? 'Centro',
      city: process.env.SEED_CUSTOMER_CITY ?? 'Maceio',
      state: process.env.SEED_CUSTOMER_STATE ?? 'AL',
      reference: process.env.SEED_CUSTOMER_REFERENCE ?? 'Ao lado da praca',
    },
  }

  try {
    const passwordHash = await bcrypt.hash(user.password, 10)

    await pool.query(
      `
        INSERT INTO users (name, email, phone, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE
        SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          updated_at = NOW()
      `,
      [user.name, user.email.toLowerCase(), user.phone, passwordHash, user.role],
    )

    const userResult = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [user.email.toLowerCase()])
    const userId = String(userResult.rows[0].id)

    await pool.query(
      `
        DELETE FROM addresses
        WHERE user_id = $1
          AND is_default = TRUE
      `,
      [userId],
    )

    await pool.query(
      `
        INSERT INTO addresses (user_id, label, street, number, neighborhood, city, state, reference, is_default)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
      `,
      [
        userId,
        user.address.label,
        user.address.street,
        user.address.number,
        user.address.neighborhood,
        user.address.city,
        user.address.state,
        user.address.reference,
      ],
    )

    console.log('Seed completed')
  } finally {
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Seed failed', error)
  process.exit(1)
})
