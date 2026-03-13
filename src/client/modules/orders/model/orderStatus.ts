import type { OrderStatus } from '@shared/contracts/app'

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  READY: 'Pedido pronto',
  OUT_FOR_DELIVERY: 'Saiu para entrega',
  DELIVERED: 'Entregue',
}

export const nextOrderStatusActionLabels: Partial<Record<OrderStatus, string>> = {
  PROCESSING: 'Marcar como Processando',
  READY: 'Marcar como Pedido pronto',
  OUT_FOR_DELIVERY: 'Marcar como Saiu para entrega',
  DELIVERED: 'Marcar como Entregue',
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return orderStatusLabels[status]
}
