import type { OrderStatus } from '../contracts/app.js'

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]
