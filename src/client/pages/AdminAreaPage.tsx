import { useEffect, useState } from 'react'
import type { OrderMetrics, OrderSummary } from '../../shared/contracts/app'
import { formatCurrency } from '../../shared/utils/money'
import { ordersApi } from '../api/orders'
import { Panel } from '../components/Panel'
import { StatusBadge } from '../components/StatusBadge'

export function AdminAreaPage() {
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null)
  const [orders, setOrders] = useState<OrderSummary[]>([])

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      const [metricsResponse, ordersResponse] = await Promise.all([
        ordersApi.getAdminMetrics(),
        ordersApi.getAdminOrders(),
      ])

      if (active) {
        setMetrics(metricsResponse.metrics)
        setOrders(ordersResponse.orders)
      }
    }

    void loadDashboard()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Panel>
          <p className="eyebrow">Pedidos</p>
          <p className="mt-2 text-3xl font-black">{metrics?.totalOrders ?? 0}</p>
        </Panel>
        <Panel>
          <p className="eyebrow">Pendentes</p>
          <p className="mt-2 text-3xl font-black">{metrics?.pendingOrders ?? 0}</p>
        </Panel>
        <Panel>
          <p className="eyebrow">Entregues</p>
          <p className="mt-2 text-3xl font-black">{metrics?.deliveredOrders ?? 0}</p>
        </Panel>
        <Panel>
          <p className="eyebrow">Receita</p>
          <p className="mt-2 text-3xl font-black">{formatCurrency(metrics?.totalRevenue ?? 0)}</p>
        </Panel>
      </div>

      <Panel>
        <p className="eyebrow">Financeiro e comandas</p>
        <h1 className="mt-2 text-3xl font-black">Visao administrativa</h1>
        <div className="mt-6 overflow-hidden rounded-3xl border-2 border-cafe/10">
          <table className="min-w-full divide-y divide-cafe/10 bg-white">
            <thead className="bg-creme-manteiga/50 text-left text-xs uppercase tracking-[0.18em] text-cafe/50">
              <tr>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cafe/10">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-semibold">{order.trackingCode}</td>
                  <td className="px-4 py-3 text-sm text-cafe/70">{order.customerName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
