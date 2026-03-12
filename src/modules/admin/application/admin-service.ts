import type { OrderMetrics, OrderSummary } from '../../../shared/contracts/app.js'
import type { OrderRepository } from '../../orders/infrastructure/order-repository.js'

export class AdminService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async listOrders(): Promise<OrderSummary[]> {
    return this.orderRepository.listAllOrders()
  }

  async getMetrics(): Promise<OrderMetrics> {
    return this.orderRepository.getMetrics()
  }
}
