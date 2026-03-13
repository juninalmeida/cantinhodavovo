import { randomBytes } from 'node:crypto'
import type {
  AuthenticatedUser,
  CreateOrderInput,
  OrderDetail,
  PublicOrderTracking,
  OrderStatus,
  OrderSummary,
} from '../../../../shared/contracts/app.js'
import { env } from '../../../core/config/env.js'
import { AppError } from '../../../core/http/app-error.js'
import type { PgAuditLogRepository } from '../../../core/database/audit-log-repository.js'
import type { CatalogRepository } from '../../catalog/infrastructure/catalog-repository.js'
import { calculateOrderSnapshot, canTransitionOrderStatus } from '../domain/order-rules.js'
import type { OrderRepository } from '../infrastructure/order-repository.js'

export class OrderService {
  constructor(
    private readonly catalogRepository: CatalogRepository,
    private readonly orderRepository: OrderRepository,
    private readonly auditLogs: PgAuditLogRepository,
  ) {}

  async createOrder(input: CreateOrderInput, user?: AuthenticatedUser): Promise<OrderDetail> {
    if (!input.items.length) {
      throw new AppError(400, 'O pedido precisa ter ao menos um item.')
    }

    if (input.customerMode === 'AUTHENTICATED' && !user) {
      throw new AppError(401, 'Login obrigatorio para pedidos autenticados.')
    }

    if (input.customerMode === 'GUEST' && !input.guestInfo) {
      throw new AppError(400, 'Pedidos de visitante exigem nome e telefone.')
    }

    if (input.paymentMethod === 'CASH' && !input.changeFor) {
      throw new AppError(400, 'Informe o troco para pagamento em dinheiro.')
    }

    const products = await this.catalogRepository.findByIds(input.items.map((item) => item.productId))

    if (products.length !== input.items.length) {
      throw new AppError(400, 'Um ou mais produtos enviados não existem mais no catálogo.')
    }

    let snapshot

    try {
      snapshot = calculateOrderSnapshot(input.items, products, env.DEFAULT_DELIVERY_FEE, 0)
    } catch (error) {
      throw new AppError(400, error instanceof Error ? error.message : 'Não foi possível calcular o pedido.')
    }

    const order = await this.orderRepository.createOrder({
      trackingCode: this.generateTrackingCode(),
      userId: user?.id ?? null,
      customerMode: input.customerMode,
      guestName: input.customerMode === 'GUEST' ? input.guestInfo?.name ?? null : null,
      guestPhone: input.customerMode === 'GUEST' ? input.guestInfo?.phone ?? null : null,
      status: 'PENDING',
      subtotal: snapshot.subtotal,
      discount: snapshot.discount,
      deliveryFee: snapshot.deliveryFee,
      total: snapshot.total,
      paymentMethod: input.paymentMethod,
      changeFor: input.changeFor ?? null,
      deliveryAddress: input.deliveryAddress,
      paymentSnapshot: {
        method: input.paymentMethod,
        changeFor: input.changeFor ?? null,
      },
      notes: input.notes,
      items: snapshot.items,
    })

    await this.auditLogs.record({
      actorUserId: user?.id ?? null,
      action: 'ORDER_CREATED',
      entityType: 'ORDER',
      entityId: order.id,
      metadata: {
        trackingCode: order.trackingCode,
        customerMode: input.customerMode,
      },
    })

    return order
  }

  async getOrderById(id: string, user: AuthenticatedUser): Promise<OrderDetail> {
    const order = await this.safeFindById(id)

    if (user.role === 'CUSTOMER' && order.userId !== user.id) {
      throw new AppError(403, 'Você não pode acessar este pedido.')
    }

    return order
  }

  async getPublicOrderByTrackingCode(trackingCode: string): Promise<PublicOrderTracking> {
    const order = await this.orderRepository.findByTrackingCode(trackingCode.trim().toUpperCase())

    if (!order) {
      throw new AppError(404, 'Pedido não encontrado.')
    }

    return {
      trackingCode: order.trackingCode,
      status: order.status,
      createdAt: order.createdAt,
      total: order.total,
      customerName: order.customerName.split(' ')[0] ?? 'Cliente',
      history: order.history,
    }
  }

  async listOwnOrders(userId: string): Promise<OrderSummary[]> {
    return this.orderRepository.listByUserId(userId)
  }

  async listOperationalOrders(): Promise<OrderSummary[]> {
    return this.orderRepository.listOperationalOrders()
  }

  async updateStatus(orderId: string, nextStatus: OrderStatus, actor: AuthenticatedUser): Promise<OrderDetail> {
    const order = await this.safeFindById(orderId)

    if (!canTransitionOrderStatus(order.status, nextStatus)) {
      throw new AppError(400, `Transicao invalida: ${order.status} -> ${nextStatus}.`)
    }

    const updatedOrder = await this.orderRepository.updateStatus(orderId, order.status, nextStatus, {
      id: actor.id,
      name: actor.name,
    })

    await this.auditLogs.record({
      actorUserId: actor.id,
      action: 'ORDER_STATUS_UPDATED',
      entityType: 'ORDER',
      entityId: orderId,
      metadata: {
        fromStatus: order.status,
        toStatus: nextStatus,
      },
    })

    return updatedOrder
  }

  private async safeFindById(id: string): Promise<OrderDetail & { userId: string | null }> {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      throw new AppError(404, 'Pedido não encontrado.')
    }

    return order
  }

  private generateTrackingCode(): string {
    const token = randomBytes(6).toString('hex').toUpperCase()
    return `CV-${token}`
  }
}
