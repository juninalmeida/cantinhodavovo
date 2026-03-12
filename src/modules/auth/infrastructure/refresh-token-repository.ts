import type { Pool } from 'pg'

export interface RefreshTokenRecord {
  id: string
  userId: string
  tokenHash: string
  expiresAt: string
  revokedAt: string | null
}

export interface RefreshTokenRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<void>
  findActiveByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null>
  revokeByTokenHash(tokenHash: string): Promise<void>
}

function mapRefreshToken(row: Record<string, unknown>): RefreshTokenRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    tokenHash: String(row.token_hash),
    expiresAt: new Date(String(row.expires_at)).toISOString(),
    revokedAt: row.revoked_at ? new Date(String(row.revoked_at)).toISOString() : null,
  }
}

export class PgRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly pool: Pool) {}

  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.pool.query(
      `
        INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
      `,
      [userId, tokenHash, expiresAt.toISOString()],
    )
  }

  async findActiveByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const result = await this.pool.query(
      `
        SELECT *
        FROM refresh_tokens
        WHERE token_hash = $1
          AND revoked_at IS NULL
          AND expires_at > NOW()
        LIMIT 1
      `,
      [tokenHash],
    )

    return result.rowCount ? mapRefreshToken(result.rows[0] as Record<string, unknown>) : null
  }

  async revokeByTokenHash(tokenHash: string): Promise<void> {
    await this.pool.query(
      `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE token_hash = $1
          AND revoked_at IS NULL
      `,
      [tokenHash],
    )
  }
}
