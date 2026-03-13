import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type {
  AdminDashboardMetrics,
  AdminOrderFilters,
  AdminOrderSummary,
  AdminUserSummary,
  CustomerMode,
  OrderStatus,
} from '@shared/contracts/app'
import { formatCurrency } from '@shared/utils/money'
import { ordersApi, StatusBadge, nextOrderStatusActionLabels } from '@client/modules/orders'

const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'PROCESSING',
  PROCESSING: 'READY',
  READY: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
}

const customerModeLabels: Record<CustomerMode, string> = {
  AUTHENTICATED: 'Cadastrado',
  GUEST: 'Convidado',
}

const roleBadgeStyle: Record<string, string> = {
  ADMIN: 'bg-tomate/10 text-tomate',
  ATTENDANT: 'bg-dourado/20 text-dourado',
  CUSTOMER: 'bg-cafe/10 text-cafe/70',
}

interface StatCardProps {
  label: string
  value: string | number
  highlight?: boolean
}

function StatCard({ label, value, highlight = false }: StatCardProps) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl border-2 px-4 py-3 ${
        highlight
          ? 'border-tomate/20 bg-tomate/5'
          : 'border-cafe/10 bg-white/70'
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-cafe/50">{label}</p>
      <p className={`text-2xl font-black leading-none ${highlight ? 'text-tomate' : 'text-cafe'}`}>{value}</p>
    </div>
  )
}

export function AdminAreaPage() {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null)
  const [orders, setOrders] = useState<AdminOrderSummary[]>([])
  const [users, setUsers] = useState<AdminUserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'finance'>('orders')
  const [filters, setFilters] = useState<AdminOrderFilters>({
    status: undefined,
    customerMode: undefined,
    search: '',
    dateFrom: '',
    dateTo: '',
  })

  const loadDashboard = useCallback(async (activeFilters: AdminOrderFilters) => {
    setLoading(true)
    try {
      const [metricsResponse, ordersResponse, usersResponse] = await Promise.all([
        ordersApi.getAdminMetrics(),
        ordersApi.getAdminOrders(activeFilters),
        ordersApi.getAdminUsers(),
      ])
      setMetrics(metricsResponse.metrics)
      setOrders(ordersResponse.orders)
      setUsers(usersResponse.users)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard(filters)
    }, 200)
    return () => window.clearTimeout(timer)
  }, [filters, loadDashboard])

  const filteredRevenue = useMemo(() => orders.reduce((total, order) => total + order.total, 0), [orders])
  const filteredAverageTicket = useMemo(
    () => (orders.length ? filteredRevenue / orders.length : 0),
    [filteredRevenue, orders.length],
  )
  const roleCounts = useMemo(
    () =>
      users.reduce(
        (acc, user) => {
          acc[user.role] += 1
          return acc
        },
        { ADMIN: 0, ATTENDANT: 0, CUSTOMER: 0 },
      ),
    [users],
  )

  async function handleAdvance(orderId: string, nextStatus: OrderStatus) {
    await ordersApi.updateOrderStatus(orderId, nextStatus)
    setMessage('Pedido atualizado com sucesso.')
    setTimeout(() => setMessage(null), 4000)
    await loadDashboard(filters)
  }

  const tabs = [
    { id: 'orders' as const, label: 'Pedidos', count: orders.length },
    { id: 'users' as const, label: 'Usuários', count: users.length },
    { id: 'finance' as const, label: 'Financeiro', count: null },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">

      {/* Toast de sucesso */}
      {message && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-xl">
          ✓ {message}
        </div>
      )}

      {/* Header do painel */}
      <div className="mb-6">
        <p className="eyebrow">Administração</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-cafe sm:text-4xl">
          Painel de controle
        </h1>
      </div>

      {/* Cards de métricas — 2 colunas no mobile, 4 no tablet, 8 no desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <StatCard label="Pedidos" value={metrics?.totalOrders ?? 0} />
        <StatCard label="Pendentes" value={metrics?.pendingOrders ?? 0} />
        <StatCard label="Processando" value={metrics?.processingOrders ?? 0} />
        <StatCard label="Prontos" value={metrics?.readyOrders ?? 0} />
        <StatCard label="Em entrega" value={metrics?.outForDeliveryOrders ?? 0} />
        <StatCard label="Entregues" value={metrics?.deliveredOrders ?? 0} />
        <StatCard label="Receita" value={formatCurrency(metrics?.totalRevenue ?? 0)} highlight />
        <StatCard label="Hoje" value={metrics?.ordersToday ?? 0} highlight />
      </div>

      {/* Tabs de navegação */}
      <div className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border-2 border-cafe/10 bg-white/60 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-cafe text-white shadow-sm'
                : 'text-cafe/60 hover:bg-cafe/5 hover:text-cafe'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-cafe/10 text-cafe/60'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── ABA: PEDIDOS ───────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="mt-4 space-y-4">
          {/* Filtros */}
          <div className="rounded-3xl border-2 border-cafe/10 bg-white/80 p-4 backdrop-blur-sm sm:p-6">
            <p className="mb-4 text-sm font-semibold text-cafe/60">Filtros</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label className="flex flex-col gap-1 text-xs font-medium text-cafe/60">
                Buscar
                <input
                  className="input"
                  placeholder="Tracking ou cliente"
                  value={filters.search ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-cafe/60">
                Status
                <select
                  className="input"
                  value={filters.status ?? ''}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, status: (e.target.value || undefined) as OrderStatus | undefined }))
                  }
                >
                  <option value="">Todos</option>
                  <option value="PENDING">Pendente</option>
                  <option value="PROCESSING">Processando</option>
                  <option value="READY">Pronto</option>
                  <option value="OUT_FOR_DELIVERY">Saiu para entrega</option>
                  <option value="DELIVERED">Entregue</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-cafe/60">
                Tipo do cliente
                <select
                  className="input"
                  value={filters.customerMode ?? ''}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      customerMode: (e.target.value || undefined) as CustomerMode | undefined,
                    }))
                  }
                >
                  <option value="">Todos</option>
                  <option value="AUTHENTICATED">Cadastrado</option>
                  <option value="GUEST">Convidado</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-cafe/60">
                De
                <input
                  className="input"
                  type="date"
                  value={filters.dateFrom ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-cafe/60">
                Até
                <input
                  className="input"
                  type="date"
                  value={filters.dateTo ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                />
              </label>
            </div>
          </div>

          {/* Tabela de pedidos */}
          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border-2 border-cafe/10 bg-white/60 py-16">
              <p className="text-sm text-cafe/50">Carregando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-cafe/15 bg-white/60 py-16 text-center">
              <p className="text-2xl">🔍</p>
              <p className="text-sm text-cafe/50">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            <>
              {/* Tabela visível em md+ */}
              <div className="hidden overflow-hidden rounded-3xl border-2 border-cafe/10 md:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-cafe/10 bg-white">
                    <thead className="bg-creme-manteiga/50 text-left text-[10px] uppercase tracking-[0.18em] text-cafe/50">
                      <tr>
                        <th className="px-4 py-3">Tracking</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Tipo</th>
                        <th className="px-4 py-3 whitespace-nowrap">Criado em</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cafe/10">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-creme-manteiga/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-cafe">{order.trackingCode}</td>
                          <td className="px-4 py-3 text-sm text-cafe/70">{order.customerName}</td>
                          <td className="px-4 py-3 text-sm text-cafe/60">
                            {customerModeLabels[order.customerMode]}
                          </td>
                          <td className="px-4 py-3 text-xs text-cafe/50 whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3 font-semibold text-cafe">{formatCurrency(order.total)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-2">
                              <Link className="brand-pill w-fit text-xs" to={`/pedido/${order.id}`}>
                                Ver detalhe
                              </Link>
                              {nextStatusMap[order.status] ? (
                                <button
                                  className="button-primary-compact"
                                  onClick={() => void handleAdvance(order.id, nextStatusMap[order.status]!)}
                                >
                                  {nextOrderStatusActionLabels[nextStatusMap[order.status]!] ?? 'Avançar'}
                                </button>
                              ) : (
                                <span className="text-xs text-cafe/40">Concluído</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cards de pedido visíveis em mobile */}
              <div className="space-y-3 md:hidden">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-3xl border-2 border-cafe/10 bg-white/80 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cafe">{order.trackingCode}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-cafe/70">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cafe/40">Cliente</p>
                        <p>{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cafe/40">Tipo</p>
                        <p>{customerModeLabels[order.customerMode]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cafe/40">Criado</p>
                        <p>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cafe/40">Total</p>
                        <p className="font-semibold text-cafe">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Link className="brand-pill flex-1 text-center text-xs" to={`/pedido/${order.id}`}>
                        Ver detalhe
                      </Link>
                      {nextStatusMap[order.status] ? (
                        <button
                          className="button-primary-compact flex-1"
                          onClick={() => void handleAdvance(order.id, nextStatusMap[order.status]!)}
                        >
                          {nextOrderStatusActionLabels[nextStatusMap[order.status]!] ?? 'Avançar'}
                        </button>
                      ) : (
                        <span className="flex-1 text-center text-xs text-cafe/40 self-center">Concluído</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── ABA: USUÁRIOS ──────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="mt-4 space-y-4">
          {/* Contadores por papel */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-tomate/20 bg-tomate/5 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-tomate/60">Admins</p>
              <p className="mt-1 text-2xl font-black text-tomate">{roleCounts.ADMIN}</p>
            </div>
            <div className="rounded-2xl border-2 border-dourado/30 bg-dourado/5 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-cafe/50">Atendentes</p>
              <p className="mt-1 text-2xl font-black text-cafe">{roleCounts.ATTENDANT}</p>
            </div>
            <div className="rounded-2xl border-2 border-cafe/10 bg-white/70 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-cafe/50">Clientes</p>
              <p className="mt-1 text-2xl font-black text-cafe">{roleCounts.CUSTOMER}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border-2 border-cafe/10 bg-white/60 py-16">
              <p className="text-sm text-cafe/50">Carregando usuários...</p>
            </div>
          ) : (
            <>
              {/* Tabela em md+ */}
              <div className="hidden overflow-hidden rounded-3xl border-2 border-cafe/10 md:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-cafe/10 bg-white">
                    <thead className="bg-creme-manteiga/50 text-left text-[10px] uppercase tracking-[0.18em] text-cafe/50">
                      <tr>
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3">E-mail</th>
                        <th className="px-4 py-3">Telefone</th>
                        <th className="px-4 py-3">Papel</th>
                        <th className="px-4 py-3">Endereço</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cafe/10">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-creme-manteiga/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-cafe">{user.name}</td>
                          <td className="px-4 py-3 text-sm text-cafe/70">{user.email}</td>
                          <td className="px-4 py-3 text-sm text-cafe/60">{user.phone ?? '—'}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadgeStyle[user.role] ?? 'bg-cafe/10 text-cafe/70'}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-cafe/60">
                            {user.hasDefaultAddress ? '✓ Sim' : '— Não'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cards de usuário no mobile */}
              <div className="space-y-3 md:hidden">
                {users.map((user) => (
                  <div key={user.id} className="rounded-3xl border-2 border-cafe/10 bg-white/80 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cafe">{user.name}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadgeStyle[user.role] ?? 'bg-cafe/10 text-cafe/70'}`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-sm text-cafe/60">{user.email}</p>
                    <div className="flex gap-4 text-xs text-cafe/50">
                      <span>{user.phone ?? '—'}</span>
                      <span>Endereço: {user.hasDefaultAddress ? 'Sim' : 'Não'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── ABA: FINANCEIRO ────────────────────────────── */}
      {activeTab === 'finance' && (
        <div className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Faturamento total', value: formatCurrency(metrics?.totalRevenue ?? 0), highlight: true },
              { label: 'Faturamento hoje', value: formatCurrency(metrics?.revenueToday ?? 0), highlight: true },
              { label: 'Ticket médio geral', value: formatCurrency(metrics?.averageTicket ?? 0) },
              { label: 'Receita (filtros ativos)', value: formatCurrency(filteredRevenue) },
              { label: 'Ticket médio filtrado', value: formatCurrency(filteredAverageTicket) },
              { label: 'Total de clientes', value: metrics?.customerCount ?? 0 },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 ${
                  item.highlight
                    ? 'border-tomate/20 bg-tomate/5'
                    : 'border-cafe/10 bg-white/80'
                }`}
              >
                <span className="text-sm text-cafe/70">{item.label}</span>
                <strong className={`text-lg font-black ${item.highlight ? 'text-tomate' : 'text-cafe'}`}>
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
