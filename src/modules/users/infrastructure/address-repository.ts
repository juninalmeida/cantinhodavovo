import type { Pool } from 'pg'
import type { Address, DeliveryAddressInput } from '../../../shared/contracts/app.js'

export interface CreateAddressInput extends DeliveryAddressInput {
  userId: string
  label?: string
  isDefault?: boolean
}

export interface AddressRepository {
  create(input: CreateAddressInput): Promise<Address>
  findDefaultByUserId(userId: string): Promise<Address | null>
}

function mapAddress(row: Record<string, unknown>): Address {
  return {
    id: String(row.id),
    label: row.label ? String(row.label) : null,
    street: String(row.street),
    number: String(row.number),
    neighborhood: String(row.neighborhood),
    city: String(row.city),
    state: String(row.state),
    reference: row.reference ? String(row.reference) : null,
    isDefault: Boolean(row.is_default),
  }
}

export class PgAddressRepository implements AddressRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateAddressInput): Promise<Address> {
    const result = await this.pool.query(
      `
        INSERT INTO addresses (user_id, label, street, number, neighborhood, city, state, reference, is_default)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `,
      [
        input.userId,
        input.label ?? null,
        input.street,
        input.number,
        input.neighborhood,
        input.city,
        input.state,
        input.reference ?? null,
        input.isDefault ?? false,
      ],
    )

    return mapAddress(result.rows[0] as Record<string, unknown>)
  }

  async findDefaultByUserId(userId: string): Promise<Address | null> {
    const result = await this.pool.query(
      `
        SELECT *
        FROM addresses
        WHERE user_id = $1
          AND is_default = TRUE
        ORDER BY created_at ASC
        LIMIT 1
      `,
      [userId],
    )

    return result.rowCount ? mapAddress(result.rows[0] as Record<string, unknown>) : null
  }
}
