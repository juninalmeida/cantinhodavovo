import type { OrderItemInput, OrderLineSnapshot, OrderStatus } from '../../../shared/contracts/app.js'
import { ORDER_STATUS_FLOW } from '../../../shared/constants/order.js'
import { toMoney } from '../../../shared/utils/money.js'
import type { ProductRecord } from '../../catalog/domain/product.js'

export function getNextOrderStatus(currentStatus: OrderStatus): OrderStatus | null {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus)

  if (currentIndex === -1 || currentIndex === ORDER_STATUS_FLOW.length - 1) {
    return null
  }

  return ORDER_STATUS_FLOW[currentIndex + 1] ?? null
}

export function canTransitionOrderStatus(currentStatus: OrderStatus, nextStatus: OrderStatus): boolean {
  return getNextOrderStatus(currentStatus) === nextStatus
}

export interface CalculatedOrderSnapshot {
  items: OrderLineSnapshot[]
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
}

export function calculateOrderSnapshot(
  items: OrderItemInput[],
  catalog: ProductRecord[],
  deliveryFee: number,
  discount = 0,
): CalculatedOrderSnapshot {
  const productMap = new Map(catalog.map((product) => [product.id, product]))

  const snapshotItems = items.map((item, index) => {
    const product = productMap.get(item.productId)

    if (!product) {
      throw new Error(`Produto inválido no índice ${index}.`)
    }

    const lineTotal = toMoney(product.price * item.quantity)

    return {
      id: `${product.id}-${index}`,
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal,
      notes: item.notes ?? null,
    }
  })

  const subtotal = toMoney(snapshotItems.reduce((sum, item) => sum + item.lineTotal, 0))
  const total = toMoney(subtotal - discount + deliveryFee)

  return {
    items: snapshotItems,
    subtotal,
    discount,
    deliveryFee,
    total,
  }
}
