import type { AdminDashboardMetrics, AdminOrderFilters, AdminOrderSummary, AdminUserSummary, CreateOrderInput, OrderDetail, OrderStatus, OrderSummary, PublicOrderTracking } from '@shared/contracts/app'
import { request } from '@client/shared/api'

export const ordersApi = {
  createOrder(input: CreateOrderInput, turnstileToken?: string) {
    return request<{ order: OrderDetail }>('/api/orders', {
      method: 'POST',
      body: input,
      turnstileToken,
    })
  },
  getOrder(id: string) {
    return request<{ order: OrderDetail }>(`/api/orders/${id}`)
  },
  getPublicOrder(trackingCode: string) {
    return request<{ order: PublicOrderTracking }>(`/api/orders/public/${trackingCode}`)
  },
  getMyOrders() {
    return request<{ orders: OrderSummary[] }>('/api/me/orders')
  },
  getAttendantOrders() {
    return request<{ orders: OrderSummary[] }>('/api/attendant/orders')
  },
  updateOrderStatus(id: string, status: OrderStatus) {
    return request<{ order: OrderDetail }>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    })
  },
  getAdminOrders(filters: AdminOrderFilters = {}) {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    const query = params.toString()
    return request<{ orders: AdminOrderSummary[] }>(`/api/admin/orders${query ? `?${query}` : ''}`)
  },
  getAdminMetrics() {
    return request<{ metrics: AdminDashboardMetrics }>('/api/admin/metrics')
  },
  getAdminUsers() {
    return request<{ users: AdminUserSummary[] }>('/api/admin/users')
  },
}
