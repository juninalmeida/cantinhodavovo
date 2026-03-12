import type { Pool } from 'pg'
import type { UserRole } from '../../../shared/contracts/app.js'
import type { UserRecord } from '../domain/user.js'

export interface CreateUserInput {
  name: string
  email: string
  phone?: string
  passwordHash: string
  role: UserRole
}

export interface UserRepository {
  create(input: CreateUserInput): Promise<UserRecord>
  findByEmail(email: string): Promise<UserRecord | null>
  findById(id: string): Promise<UserRecord | null>
}

function mapUser(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone ? String(row.phone) : null,
    passwordHash: String(row.password_hash),
    role: row.role as UserRole,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  }
}

export class PgUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateUserInput): Promise<UserRecord> {
    const result = await this.pool.query(
      `
        INSERT INTO users (name, email, phone, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [input.name, input.email.toLowerCase(), input.phone ?? null, input.passwordHash, input.role],
    )

    return mapUser(result.rows[0] as Record<string, unknown>)
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase()])
    return result.rowCount ? mapUser(result.rows[0] as Record<string, unknown>) : null
  }

  async findById(id: string): Promise<UserRecord | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id])
    return result.rowCount ? mapUser(result.rows[0] as Record<string, unknown>) : null
  }
}
