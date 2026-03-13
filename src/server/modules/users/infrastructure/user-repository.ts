import type { Pool } from 'pg'
import type { AdminUserSummary, UserRole } from '../../../../shared/contracts/app.js'
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
  listAdminSummaries(): Promise<AdminUserSummary[]>
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

  async listAdminSummaries(): Promise<AdminUserSummary[]> {
    const result = await this.pool.query(
      `
        SELECT
          u.id,
          u.name,
          u.email,
          u.phone,
          u.role,
          u.created_at,
          EXISTS (
            SELECT 1
            FROM addresses a
            WHERE a.user_id = u.id
              AND a.is_default = TRUE
          ) AS has_default_address
        FROM users u
        ORDER BY
          CASE u.role
            WHEN 'ADMIN' THEN 1
            WHEN 'ATTENDANT' THEN 2
            WHEN 'CUSTOMER' THEN 3
            ELSE 4
          END,
          u.created_at ASC
      `,
    )

    return result.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      email: String(row.email),
      phone: row.phone ? String(row.phone) : null,
      role: row.role as UserRole,
      createdAt: new Date(String(row.created_at)).toISOString(),
      hasDefaultAddress: Boolean(row.has_default_address),
    }))
  }
}
