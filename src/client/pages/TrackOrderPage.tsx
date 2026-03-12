import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { OrderDetail } from '../../shared/contracts/app'
import { formatCurrency } from '../../shared/utils/money'
import { ordersApi } from '../api/orders'
import { OrderTimeline } from '../components/OrderTimeline'
import { Panel } from '../components/Panel'
import { StatusBadge } from '../components/StatusBadge'

export function TrackOrderPage() {
  const navigate = useNavigate()
  const { codigo = '' } = useParams()
  const [trackingCode, setTrackingCode] = useState(codigo)
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!codigo) {
      return
    }

    let active = true

    async function loadOrder() {
      try {
        const { order } = await ordersApi.getPublicOrder(codigo)
        if (active) {
          setOrder(order)
          setError(null)
        }
      } catch (loadError) {
        if (active) {
          setOrder(null)
          setError(loadError instanceof Error ? loadError.message : 'Pedido não encontrado.')
        }
      }
    }

    void loadOrder()
    return () => {
      active = false
    }
  }, [codigo])

  return (
    <div className="space-y-6">
      <Panel className="mx-auto max-w-3xl">
        <p className="eyebrow">Tracking publico</p>
        <h1 className="mt-2 text-3xl font-black">Acompanhar pedido pelo codigo</h1>
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault()
            if (trackingCode) {
              navigate(`/acompanhar/${trackingCode}`)
            }
          }}
        >
          <input className="input flex-1" placeholder="Ex.: CV-ABC123" value={trackingCode} onChange={(event) => setTrackingCode(event.target.value.toUpperCase())} />
          <button className="button-primary" type="submit">
            Buscar
          </button>
        </form>
        {codigo && error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </Panel>

      {codigo && order && (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Pedido localizado</p>
                <h2 className="mt-2 text-3xl font-black">{order.trackingCode}</h2>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-4 text-sm text-cafe/70">Cliente: {order.customerName}</p>
            <p className="mt-2 text-sm text-cafe/70">Total: {formatCurrency(order.total)}</p>
          </Panel>

          <Panel>
            <p className="eyebrow">Status do pedido</p>
            <h2 className="mt-2 text-2xl font-bold">Linha do tempo</h2>
            <div className="mt-6">
              <OrderTimeline history={order.history} />
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
