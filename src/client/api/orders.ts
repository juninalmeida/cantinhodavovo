import type { CreateOrderInput, OrderDetail, OrderMetrics, OrderStatus, OrderSummary } from '../../shared/contracts/app'
import { request } from './http'

export const ordersApi = {
  createOrder(input: CreateOrderInput) {
    return request<{ order: OrderDetail }>('/api/orders', {
      method: 'POST',
      body: input,
    })
  },
  getOrder(id: string) {
    return request<{ order: OrderDetail }>(`/api/orders/${id}`)
  },
  getPublicOrder(trackingCode: string) {
    return request<{ order: OrderDetail }>(`/api/orders/public/${trackingCode}`)
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
  getAdminOrders() {
    return request<{ orders: OrderSummary[] }>('/api/admin/orders')
  },
  getAdminMetrics() {
    return request<{ metrics: OrderMetrics }>('/api/admin/metrics')
  },
}
