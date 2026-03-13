import type { Pool, PoolClient } from 'pg'
import type {
  AdminDashboardMetrics,
  AdminOrderFilters,
  AdminOrderSummary,
  CustomerMode,
  DeliveryAddressInput,
  OrderDetail,
  OrderStatus,
  OrderSummary,
  PaymentMethod,
} from '../../../../shared/contracts/app.js'
import { toMoney } from '../../../../shared/utils/money.js'

interface CreateOrderItemRecord {
  productId: string
  productName: string
  unitPrice: number
  quantity: number
  notes?: string | null
  lineTotal: number
}

interface StatusActor {
  id: string
  name: string
}

export interface StoredOrderDetail extends OrderDetail {
  userId: string | null
  customerMode: CustomerMode
}

export interface CreateOrderRecordInput {
  trackingCode: string
  userId?: string | null
  customerMode: CustomerMode
  guestName?: string | null
  guestPhone?: string | null
  status: OrderStatus
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  paymentMethod: PaymentMethod
  changeFor?: number | null
  deliveryAddress: DeliveryAddressInput
  paymentSnapshot: Record<string, unknown>
  notes?: string
  items: CreateOrderItemRecord[]
}

export interface OrderRepository {
  createOrder(input: CreateOrderRecordInput): Promise<StoredOrderDetail>
  findById(id: string): Promise<StoredOrderDetail | null>
  findByTrackingCode(trackingCode: string): Promise<StoredOrderDetail | null>
  listByUserId(userId: string): Promise<OrderSummary[]>
  listOperationalOrders(): Promise<OrderSummary[]>
  listAllOrders(filters?: AdminOrderFilters): Promise<AdminOrderSummary[]>
  updateStatus(orderId: string, currentStatus: OrderStatus, nextStatus: OrderStatus, actor: StatusActor): Promise<StoredOrderDetail>
  getMetrics(): Promise<AdminDashboardMetrics>
}

function mapOrderSummary(row: Record<string, unknown>): OrderSummary {
  return {
    id: String(row.id),
    trackingCode: String(row.tracking_code),
    status: row.status as OrderStatus,
    createdAt: new Date(String(row.created_at)).toISOString(),
    total: toMoney(Number(row.total)),
    paymentMethod: row.payment_method as PaymentMethod,
    customerName: String(row.customer_name),
  }
}

function mapAdminOrderSummary(row: Record<string, unknown>): AdminOrderSummary {
  return {
    ...mapOrderSummary(row),
    customerMode: row.customer_mode as CustomerMode,
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  }
}

function buildTimestampColumn(status: OrderStatus): string | null {
  switch (status) {
    case 'PROCESSING':
      return 'confirmed_at'
    case 'READY':
      return 'ready_at'
    case 'OUT_FOR_DELIVERY':
      return 'out_for_delivery_at'
    case 'DELIVERED':
      return 'delivered_at'
    default:
      return null
  }
}

export class PgOrderRepository implements OrderRepository {
  constructor(private readonly pool: Pool) {}

  async createOrder(input: CreateOrderRecordInput): Promise<StoredOrderDetail> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const orderResult = await client.query(
        `
          INSERT INTO orders (
            tracking_code,
            user_id,
            customer_mode,
            guest_name,
            guest_phone,
            status,
            subtotal,
            discount,
            delivery_fee,
            total,
            payment_method,
            change_for,
            delivery_address,
            payment_snapshot,
            notes
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14::jsonb, $15)
          RETURNING id
        `,
        [
          input.trackingCode,
          input.userId ?? null,
          input.customerMode,
          input.guestName ?? null,
          input.guestPhone ?? null,
          input.status,
          input.subtotal,
          input.discount,
          input.deliveryFee,
          input.total,
          input.paymentMethod,
          input.changeFor ?? null,
          JSON.stringify(input.deliveryAddress),
          JSON.stringify(input.paymentSnapshot),
          input.notes ?? null,
        ],
      )

      const orderId = String(orderResult.rows[0].id)

      for (const item of input.items) {
        await client.query(
          `
            INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, notes, line_total)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [orderId, item.productId, item.productName, item.unitPrice, item.quantity, item.notes ?? null, item.lineTotal],
        )
      }

      await client.query(
        `
          INSERT INTO payments (order_id, method, change_for, details)
          VALUES ($1, $2, $3, $4::jsonb)
        `,
        [orderId, input.paymentMethod, input.changeFor ?? null, JSON.stringify(input.paymentSnapshot)],
      )

      await client.query(
        `
          INSERT INTO order_status_history (order_id, from_status, to_status)
          VALUES ($1, NULL, $2)
        `,
        [orderId, input.status],
      )

      await client.query('COMMIT')
      const createdOrder = await this.getDetailById(orderId, client)

      if (!createdOrder) {
        throw new Error('ORDER_NOT_FOUND')
      }

      return createdOrder
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async findById(id: string): Promise<StoredOrderDetail | null> {
    return this.getDetailById(id)
  }

  async findByTrackingCode(trackingCode: string): Promise<StoredOrderDetail | null> {
    const result = await this.pool.query('SELECT id FROM orders WHERE tracking_code = $1 LIMIT 1', [trackingCode])

    if (!result.rowCount) {
      return null
    }

    return this.getDetailById(String(result.rows[0].id))
  }

  async listByUserId(userId: string): Promise<OrderSummary[]> {
    const result = await this.pool.query(
      `
        SELECT
          o.id,
          o.tracking_code,
          o.status,
          o.created_at,
          o.total,
          o.payment_method,
          COALESCE(u.name, o.guest_name) AS customer_name
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC
      `,
      [userId],
    )

    return result.rows.map((row) => mapOrderSummary(row as Record<string, unknown>))
  }

  async listOperationalOrders(): Promise<OrderSummary[]> {
    const result = await this.pool.query(
      `
        SELECT
          o.id,
          o.tracking_code,
          o.status,
          o.created_at,
          o.total,
          o.payment_method,
          COALESCE(u.name, o.guest_name) AS customer_name
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        WHERE o.status <> 'DELIVERED'
        ORDER BY o.created_at ASC
      `,
    )

    return result.rows.map((row) => mapOrderSummary(row as Record<string, unknown>))
  }

  async listAllOrders(filters: AdminOrderFilters = {}): Promise<AdminOrderSummary[]> {
    const params: unknown[] = []
    const whereClauses: string[] = []

    if (filters.status) {
      params.push(filters.status)
      whereClauses.push(`o.status = $${params.length}`)
    }

    if (filters.customerMode) {
      params.push(filters.customerMode)
      whereClauses.push(`o.customer_mode = $${params.length}`)
    }

    if (filters.search) {
      params.push(`%${filters.search.toLowerCase()}%`)
      whereClauses.push(`(
        LOWER(o.tracking_code) LIKE $${params.length}
        OR LOWER(COALESCE(u.name, o.guest_name)) LIKE $${params.length}
      )`)
    }

    if (filters.dateFrom) {
      params.push(`${filters.dateFrom}T00:00:00.000Z`)
      whereClauses.push(`o.created_at >= $${params.length}`)
    }

    if (filters.dateTo) {
      params.push(`${filters.dateTo}T23:59:59.999Z`)
      whereClauses.push(`o.created_at <= $${params.length}`)
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const result = await this.pool.query(
      `
        SELECT
          o.id,
          o.tracking_code,
          o.status,
          o.customer_mode,
          o.created_at,
          o.updated_at,
          o.total,
          o.payment_method,
          COALESCE(u.name, o.guest_name) AS customer_name
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        ${whereSql}
        ORDER BY o.created_at DESC
      `,
      params,
    )

    return result.rows.map((row) => mapAdminOrderSummary(row as Record<string, unknown>))
  }

  async updateStatus(orderId: string, currentStatus: OrderStatus, nextStatus: OrderStatus, actor: StatusActor): Promise<StoredOrderDetail> {
    const client = await this.pool.connect()
    const timestampColumn = buildTimestampColumn(nextStatus)

    try {
      await client.query('BEGIN')

      if (timestampColumn) {
        await client.query(
          `
            UPDATE orders
            SET status = $2, updated_at = NOW(), ${timestampColumn} = NOW()
            WHERE id = $1
          `,
          [orderId, nextStatus],
        )
      } else {
        await client.query('UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1', [orderId, nextStatus])
      }

      await client.query(
        `
          INSERT INTO order_status_history (order_id, from_status, to_status, changed_by_user_id, changed_by_name)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [orderId, currentStatus, nextStatus, actor.id, actor.name],
      )

      await client.query('COMMIT')
      const updatedOrder = await this.getDetailById(orderId, client)

      if (!updatedOrder) {
        throw new Error('ORDER_NOT_FOUND')
      }

      return updatedOrder
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async getMetrics(): Promise<AdminDashboardMetrics> {
    const result = await this.pool.query(`
      SELECT
        COUNT(*)::int AS total_orders,
        COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending_orders,
        COUNT(*) FILTER (WHERE status = 'PROCESSING')::int AS processing_orders,
        COUNT(*) FILTER (WHERE status = 'READY')::int AS ready_orders,
        COUNT(*) FILTER (WHERE status = 'OUT_FOR_DELIVERY')::int AS out_for_delivery_orders,
        COUNT(*) FILTER (WHERE status = 'DELIVERED')::int AS delivered_orders,
        COALESCE(SUM(total), 0) AS total_revenue,
        COALESCE(SUM(total) FILTER (WHERE created_at >= CURRENT_DATE), 0) AS revenue_today,
        COALESCE(AVG(total), 0) AS average_ticket,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::int AS orders_today,
        (
          SELECT COUNT(*)::int
          FROM users
          WHERE role = 'CUSTOMER'
        ) AS customer_count
      FROM orders
    `)

    const row = result.rows[0] as Record<string, unknown>

    return {
      totalOrders: Number(row.total_orders),
      pendingOrders: Number(row.pending_orders),
      processingOrders: Number(row.processing_orders),
      readyOrders: Number(row.ready_orders),
      outForDeliveryOrders: Number(row.out_for_delivery_orders),
      deliveredOrders: Number(row.delivered_orders),
      totalRevenue: toMoney(Number(row.total_revenue)),
      revenueToday: toMoney(Number(row.revenue_today)),
      averageTicket: toMoney(Number(row.average_ticket)),
      customerCount: Number(row.customer_count),
      ordersToday: Number(row.orders_today),
    }
  }

  private async getDetailById(id: string, client: Pool | PoolClient = this.pool): Promise<StoredOrderDetail | null> {
    const orderResult = await client.query(
      `
        SELECT
          o.*,
          COALESCE(u.name, o.guest_name) AS customer_name
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        WHERE o.id = $1
        LIMIT 1
      `,
      [id],
    )

    if (!orderResult.rowCount) {
      return null
    }

    const orderRow = orderResult.rows[0] as Record<string, unknown>
    const itemsResult = await client.query(
      `
        SELECT id, product_id, product_name, quantity, unit_price, line_total, notes
        FROM order_items
        WHERE order_id = $1
        ORDER BY id ASC
      `,
      [id],
    )

    const historyResult = await client.query(
      `
        SELECT from_status, to_status, changed_at, changed_by_name
        FROM order_status_history
        WHERE order_id = $1
        ORDER BY changed_at ASC
      `,
      [id],
    )

    return {
      id: String(orderRow.id),
      userId: orderRow.user_id ? String(orderRow.user_id) : null,
      customerMode: orderRow.customer_mode as CustomerMode,
      trackingCode: String(orderRow.tracking_code),
      status: orderRow.status as OrderStatus,
      createdAt: new Date(String(orderRow.created_at)).toISOString(),
      total: toMoney(Number(orderRow.total)),
      subtotal: toMoney(Number(orderRow.subtotal)),
      deliveryFee: toMoney(Number(orderRow.delivery_fee)),
      discount: toMoney(Number(orderRow.discount)),
      changeFor: orderRow.change_for ? toMoney(Number(orderRow.change_for)) : null,
      paymentMethod: orderRow.payment_method as PaymentMethod,
      customerName: String(orderRow.customer_name),
      deliveryAddress: JSON.parse(String(JSON.stringify(orderRow.delivery_address))) as DeliveryAddressInput,
      items: itemsResult.rows.map((itemRow) => ({
        id: String(itemRow.id),
        productId: String(itemRow.product_id),
        productName: String(itemRow.product_name),
        quantity: Number(itemRow.quantity),
        unitPrice: toMoney(Number(itemRow.unit_price)),
        lineTotal: toMoney(Number(itemRow.line_total)),
        notes: itemRow.notes ? String(itemRow.notes) : null,
      })),
      history: historyResult.rows.map((historyRow) => ({
        fromStatus: historyRow.from_status ? (String(historyRow.from_status) as OrderStatus) : null,
        toStatus: String(historyRow.to_status) as OrderStatus,
        changedAt: new Date(String(historyRow.changed_at)).toISOString(),
        changedByName: historyRow.changed_by_name ? String(historyRow.changed_by_name) : null,
      })),
      notes: orderRow.notes ? String(orderRow.notes) : null,
    }
  }
}
