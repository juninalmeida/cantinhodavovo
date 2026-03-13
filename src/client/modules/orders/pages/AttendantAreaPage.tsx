import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { OrderStatus, OrderSummary } from '@shared/contracts/app'
import { formatCurrency } from '@shared/utils/money'
import { ordersApi, StatusBadge, nextOrderStatusActionLabels } from '@client/modules/orders'
import { Panel } from '@client/shared/ui'

const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'PROCESSING',
  PROCESSING: 'READY',
  READY: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
}

const operationalGroups: { status: OrderStatus; title: string }[] = [
  { status: 'PENDING', title: 'Pedidos pendentes' },
  { status: 'PROCESSING', title: 'Em preparo' },
  { status: 'READY', title: 'Pedidos prontos' },
  { status: 'OUT_FOR_DELIVERY', title: 'Saíram para entrega' },
]

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

  const groupedOrders = useMemo(
    () =>
      operationalGroups.map((group) => ({
        ...group,
        orders: orders.filter((order) => order.status === group.status),
      })),
    [orders],
  )

  async function handleAdvance(orderId: string, nextStatus: OrderStatus) {
    await ordersApi.updateOrderStatus(orderId, nextStatus)
    setMessage('Status atualizado com sucesso.')
    await loadOrders()
  }

  return (
    <div className="space-y-6">
      <Panel>
        <p className="eyebrow">Operação</p>
        <h1 className="mt-2 text-3xl font-black">Fila do atendente</h1>
        <p className="mt-3 text-sm text-cafe/50">Acompanhe os pedidos em andamento e avance cada um para o próximo estágio do preparo.</p>
        {message && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
      </Panel>

      {loading ? (
        <Panel>
          <p className="text-sm text-cafe/50">Carregando fila...</p>
        </Panel>
      ) : (
        <div className="grid gap-6">
          {groupedOrders.map((group) => (
            <Panel key={group.status}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">{group.status}</p>
                  <h2 className="mt-2 text-2xl font-black">{group.title}</h2>
                </div>
                <span className="rounded-full bg-creme-manteiga px-4 py-2 text-sm font-semibold text-cafe">{group.orders.length}</span>
              </div>

              {group.orders.length === 0 ? (
                <p className="mt-6 rounded-2xl border-2 border-cafe/10 bg-white p-4 text-sm text-cafe/60">Nenhum pedido em {group.title.toLowerCase()}.</p>
              ) : (
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {group.orders.map((order) => (
                    <article key={order.id} className="rounded-3xl border-2 border-cafe/10 bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-cafe/50">{order.trackingCode}</p>
                          <h3 className="mt-1 text-lg font-bold">{order.customerName}</h3>
                          <p className="text-sm text-cafe/50">{formatCurrency(order.total)}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link className="brand-pill" to={`/pedido/${order.id}`}>
                          Ver detalhe
                        </Link>
                        {nextStatusMap[order.status] && (
                          <button className="button-primary" onClick={() => void handleAdvance(order.id, nextStatusMap[order.status]!)}>
                            {nextOrderStatusActionLabels[nextStatusMap[order.status]!] ?? 'Atualizar status'}
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}
    </div>
  )
}
