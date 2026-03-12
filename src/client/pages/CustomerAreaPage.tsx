import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { OrderSummary } from '../../shared/contracts/app'
import { formatCurrency } from '../../shared/utils/money'
import { ordersApi } from '../api/orders'
import { Panel } from '../components/Panel'
import { StatusBadge } from '../components/StatusBadge'

export function CustomerAreaPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadOrders() {
      try {
        const { orders } = await ordersApi.getMyOrders()
        if (active) {
          setOrders(orders)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadOrders()
    return () => {
      active = false
    }
  }, [])

  return (
    <Panel>
      <p className="eyebrow">Área do Cliente</p>
      <h1 className="mt-2 text-3xl font-black">Seus pedidos</h1>
      {loading ? (
        <p className="mt-6 text-sm text-cafe/50">Carregando pedidos...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border-2 border-cafe/10 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-cafe/50">{order.trackingCode}</p>
                  <h2 className="mt-1 text-xl font-bold">{formatCurrency(order.total)}</h2>
                  <p className="text-sm text-cafe/50">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="button-secondary" to={`/pedido/${order.id}`}>
                  Ver detalhes
                </Link>
                <Link className="button-secondary" to={`/acompanhar/${order.trackingCode}`}>
                  Tracking publico
                </Link>
              </div>
            </article>
          ))}
          {!orders.length && <p className="text-sm text-cafe/50">Você ainda não tem pedidos autenticados.</p>}
        </div>
      )}
    </Panel>
  )
}
