import type { OrderStatus } from '@shared/contracts/app'
import { cn } from '@client/shared/utils'
import { getOrderStatusLabel } from '@client/modules/orders/model/orderStatus'

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', {
        'bg-amber-100 text-amber-900': status === 'PENDING',
        'bg-blue-100 text-blue-900': status === 'PROCESSING',
        'bg-violet-100 text-violet-900': status === 'READY',
        'bg-orange-100 text-orange-900': status === 'OUT_FOR_DELIVERY',
        'bg-emerald-100 text-emerald-900': status === 'DELIVERED',
      })}
    >
      {getOrderStatusLabel(status)}
    </span>
  )
}
