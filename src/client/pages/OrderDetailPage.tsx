import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { OrderDetail } from '../../shared/contracts/app'
import { formatCurrency } from '../../shared/utils/money'
import { ordersApi } from '../api/orders'
import { OrderTimeline } from '../components/OrderTimeline'
import { Panel } from '../components/Panel'
import { StatusBadge } from '../components/StatusBadge'

export function OrderDetailPage() {
  const { id = '' } = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(null)

  useEffect(() => {
    let active = true

    async function loadOrder() {
      const { order } = await ordersApi.getOrder(id)
      if (active) {
        setOrder(order)
      }
    }

    void loadOrder()
    return () => {
      active = false
    }
  }, [id])

  if (!order) {
    return <div className="page-shell">Carregando pedido...</div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel>
        <p className="eyebrow">Pedido autenticado</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black">{order.trackingCode}</h1>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-6 space-y-3 text-sm text-cafe/70">
          <p>
            <strong>Cliente:</strong> {order.customerName}
          </p>
          <p>
            <strong>Endereço:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.number} - {order.deliveryAddress.neighborhood}
          </p>
          <p>
            <strong>Forma de pagamento:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Subtotal:</strong> {formatCurrency(order.subtotal)}
          </p>
          <p>
            <strong>Taxa de entrega:</strong> {formatCurrency(order.deliveryFee)}
          </p>
          <p>
            <strong>Total:</strong> {formatCurrency(order.total)}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="rounded-2xl border-2 border-cafe/10 bg-creme-manteiga/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-cafe/50">Qtd: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.lineTotal)}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <p className="eyebrow">Timeline</p>
        <h2 className="mt-2 text-2xl font-bold">Histórico do pedido</h2>
        <div className="mt-6">
          <OrderTimeline history={order.history} />
        </div>
      </Panel>
    </div>
  )
}
