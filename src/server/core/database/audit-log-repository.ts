import type { Pool } from 'pg'

export interface AuditLogInput {
  actorUserId?: string | null
  action: string
  entityType: string
  entityId?: string | null
  metadata?: Record<string, unknown>
}

export class PgAuditLogRepository {
  constructor(private readonly pool: Pool) {}

  async record(input: AuditLogInput): Promise<void> {
    await this.pool.query(
      `
        INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
        VALUES ($1, $2, $3, $4, $5::jsonb)
      `,
      [
        input.actorUserId ?? null,
        input.action,
        input.entityType,
        input.entityId ?? null,
        JSON.stringify(input.metadata ?? {}),
      ],
    )
  }
}
