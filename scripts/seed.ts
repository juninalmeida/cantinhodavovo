import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { env } from '../src/server/config/env.js'

const users = [
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
