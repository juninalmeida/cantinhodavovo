import type { OrderStatusHistoryEntry } from '../../shared/contracts/app'
import { StatusBadge } from './StatusBadge'

export function OrderTimeline({ history }: { history: OrderStatusHistoryEntry[] }) {
  return (
    <div className="space-y-3">
      {history.map((entry, index) => (
        <div key={`${entry.changedAt}-${index}`} className="rounded-2xl border-2 border-cafe/10 bg-creme-manteiga/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusBadge status={entry.toStatus} />
            <span className="text-xs text-cafe/50">{new Date(entry.changedAt).toLocaleString('pt-BR')}</span>
          </div>
          <p className="mt-2 text-sm text-cafe/80">
            {entry.fromStatus ? `Saiu de ${entry.fromStatus} e foi para ${entry.toStatus}.` : `Pedido criado com status ${entry.toStatus}.`}
          </p>
          {entry.changedByName && <p className="mt-1 text-xs text-cafe/50">Atualizado por {entry.changedByName}</p>}
        </div>
      ))}
    </div>
  )
}
