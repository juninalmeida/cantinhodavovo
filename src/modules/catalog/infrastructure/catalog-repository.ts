import type { Pool } from 'pg'
import type { ComboOption } from '../../../shared/contracts/app.js'
import { toMoney } from '../../../shared/utils/money.js'
import type { ProductRecord } from '../domain/product.js'

export interface CatalogRepository {
  listMenuProducts(): Promise<ProductRecord[]>
  listComboOptions(): Promise<ComboOption[]>
  findByIds(ids: string[]): Promise<ProductRecord[]>
}

function mapProduct(row: Record<string, unknown>): ProductRecord {
  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    categoryName: String(row.category_name),
    name: String(row.name),
    description: String(row.description),
    price: toMoney(Number(row.price)),
    imageUrl: row.image_url ? String(row.image_url) : null,
    productKind: String(row.product_kind) as ProductRecord['productKind'],
    comboGroup: row.combo_group ? (String(row.combo_group) as ProductRecord['comboGroup']) : null,
  }
}

export class PgCatalogRepository implements CatalogRepository {
  constructor(private readonly pool: Pool) {}

  async listMenuProducts(): Promise<ProductRecord[]> {
    const result = await this.pool.query(`
      SELECT
        p.id,
        p.category_id,
        c.name AS category_name,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.product_kind,
        p.combo_group
      FROM products p
      INNER JOIN product_categories c ON c.id = p.category_id
      WHERE p.active = TRUE
        AND p.product_kind = 'MENU'
      ORDER BY c.name, p.name
    `)

    return result.rows.map((row) => mapProduct(row as Record<string, unknown>))
  }

  async listComboOptions(): Promise<ComboOption[]> {
    const result = await this.pool.query(`
      SELECT
        id,
        name,
        description,
        price,
        combo_group
      FROM products
      WHERE active = TRUE
        AND product_kind = 'COMBO_COMPONENT'
      ORDER BY
        CASE combo_group
          WHEN 'MASSA' THEN 1
          WHEN 'SABOR' THEN 2
          WHEN 'ADDON' THEN 3
          ELSE 4
        END,
        name
    `)

    return result.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      description: row.description ? String(row.description) : undefined,
      price: toMoney(Number(row.price)),
      group: String(row.combo_group) as ComboOption['group'],
    }))
  }

  async findByIds(ids: string[]): Promise<ProductRecord[]> {
    if (!ids.length) {
      return []
    }

    const result = await this.pool.query(
      `
        SELECT
          p.id,
          p.category_id,
          c.name AS category_name,
          p.name,
          p.description,
          p.price,
          p.image_url,
          p.product_kind,
          p.combo_group
        FROM products p
        INNER JOIN product_categories c ON c.id = p.category_id
        WHERE p.active = TRUE
          AND p.id = ANY($1::text[])
      `,
      [ids],
    )

    return result.rows.map((row) => mapProduct(row as Record<string, unknown>))
  }
}
