import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { env } from '../../src/server/core/config/env.js'

const users = [
  {
    name: 'Cliente Cantinho',
    email: 'cliente@cantinhodavovo.local',
    phone: '82999990000',
    password: 'Cliente@123',
    role: 'CUSTOMER',
    address: {
      label: 'Principal',
      street: 'Rua da Vovó',
      number: '25',
      neighborhood: 'Centro',
      city: 'Maceió',
      state: 'AL',
      reference: 'Ao lado da praça',
    },
  },
  {
    name: 'Admin Cantinho',
    email: 'admin@cantinhodavovo.local',
    phone: '82999990001',
    password: 'Admin@123',
    role: 'ADMIN',
  },
  {
    name: 'Atendente Cantinho',
    email: 'atendente@cantinhodavovo.local',
    phone: '82999990002',
    password: 'Atendente@123',
    role: 'ATTENDANT',
  },
]

async function run() {
  const pool = new Pool({ connectionString: env.DATABASE_URL })

  try {
    for (const user of users) {
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
        [user.name, user.email, user.phone, passwordHash, user.role],
      )

      if (user.address) {
        const userResult = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [user.email])
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
      }
    }

    console.log('Seed completed')
  } finally {
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Seed failed', error)
  process.exit(1)
})
