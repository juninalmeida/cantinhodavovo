import { useEffect, useState } from 'react'
import type { OrderStatus, OrderSummary } from '../../shared/contracts/app'
import { formatCurrency } from '../../shared/utils/money'
import { ordersApi } from '../api/orders'
import { Panel } from '../components/Panel'
import { StatusBadge } from '../components/StatusBadge'

const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'PROCESSING',
  PROCESSING: 'READY',
  READY: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
}

export function AttendantAreaPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  async function loadOrders() {
    setLoading(true)
    try {
      const { orders } = await ordersApi.getAttendantOrders()
      setOrders(orders)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  async function handleAdvance(orderId: string, nextStatus: OrderStatus) {
    await ordersApi.updateOrderStatus(orderId, nextStatus)
    setMessage('Status atualizado com sucesso.')
    await loadOrders()
  }

  return (
    <Panel>
      <p className="eyebrow">Operacao</p>
      <h1 className="mt-2 text-3xl font-black">Fila do atendente</h1>
      <p className="mt-3 text-sm text-cafe/50">Somente pedidos ainda não entregues aparecem aqui.</p>
      {message && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-cafe/50">Carregando fila...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border-2 border-cafe/10 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-cafe/50">{order.trackingCode}</p>
                  <h2 className="mt-1 text-lg font-bold">{order.customerName}</h2>
                  <p className="text-sm text-cafe/50">{formatCurrency(order.total)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              {nextStatusMap[order.status] && (
                <button className="button-primary mt-4" onClick={() => void handleAdvance(order.id, nextStatusMap[order.status]!)}>
                  Avancar para {nextStatusMap[order.status]}
                </button>
              )}
            </article>
          ))}
          {!orders.length && <p className="text-sm text-cafe/50">Não há pedidos pendentes na fila operacional.</p>}
        </div>
      )}
    </Panel>
  )
}
