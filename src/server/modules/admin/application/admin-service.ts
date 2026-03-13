import type { AdminDashboardMetrics, AdminOrderFilters, AdminOrderSummary, AdminUserSummary } from '../../../../shared/contracts/app.js'
import type { OrderRepository } from '../../orders/infrastructure/order-repository.js'
import type { UserRepository } from '../../users/infrastructure/user-repository.js'

export class AdminService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async listOrders(filters: AdminOrderFilters): Promise<AdminOrderSummary[]> {
    return this.orderRepository.listAllOrders(filters)
  }

  async getMetrics(): Promise<AdminDashboardMetrics> {
    return this.orderRepository.getMetrics()
  }

  async listUsers(): Promise<AdminUserSummary[]> {
    return this.userRepository.listAdminSummaries()
  }
}
