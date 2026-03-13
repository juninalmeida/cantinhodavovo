import type { RefObject } from 'react'
import type { ComboOption } from '@shared/contracts/app'
import { formatCurrency } from '@shared/utils/money'
import { Icon } from '@client/shared/icons'
import { cn } from '@client/shared/utils'

interface ComboOrderTicketProps {
  massa: ComboOption | null
  sabores: ComboOption[]
  addons: ComboOption[]
  subtotal: number
  deliveryFee: number
  total: number
  isReady: boolean
  message: string | null
  submitting: boolean
  isPinned: boolean
  scrollMotionY: number
  canConfirm: boolean
  isConfirmed: boolean
  onConfirm: () => void
  containerRef?: RefObject<HTMLDivElement | null>
  cardRef?: RefObject<HTMLDivElement | null>
}

function TicketLine({
  label,
  value,
  iconKey,
  emphasize = false,
}: {
  label: string
  value: string
  iconKey?: string
  emphasize?: boolean
}) {
  return (
    <div className={`flex items-end justify-between ${emphasize ? 'font-medium text-tomate' : ''}`}>
      <span className={`relative flex-grow before:absolute before:bottom-1 before:left-0 before:w-full before:border-b-2 before:border-dotted ${emphasize ? 'before:border-tomate/20' : 'before:border-cafe/20'}`}>
        <span className="relative z-10 flex items-center gap-2 bg-creme-claro pr-2">
          {iconKey && <Icon name={iconKey} size={14} />}
          {label}
        </span>
      </span>
      <span className="relative z-10 bg-creme-claro pl-2">{value}</span>
    </div>
  )
}

export function ComboOrderTicket({
  massa,
  sabores,
  addons,
  subtotal,
  deliveryFee,
  total,
  isReady,
  message,
  submitting,
  isPinned,
  scrollMotionY,
  canConfirm,
  isConfirmed,
  onConfirm,
  containerRef,
  cardRef,
}: ComboOrderTicketProps) {
  return (
    <div ref={containerRef} className="sticky top-24 h-max self-start">
      <div
        ref={cardRef}
        className={cn(
          'ticket-card transition-[transform,box-shadow] duration-300 ease-out',
          isPinned
            ? 'translate-y-0 shadow-[16px_16px_0px_0px_rgba(74,46,36,0.08)]'
            : 'translate-y-2 shadow-[12px_12px_0px_0px_rgba(74,46,36,0.05)]',
        )}
        style={{ transform: `translateY(${scrollMotionY}px)` }}
      >
        <div className="borda-comanda" />

        <div className="p-8 pb-10">
          <div className="relative mb-8 border-b-2 border-dashed border-cafe/20 pb-6 text-center">
            <Icon name="vovo-ramo" size={40} className="absolute -top-4 right-0 rotate-[-15deg] text-tomate/20" />
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-cafe/60">Comanda da VóVó</span>
            <h3 className="font-display text-3xl font-medium text-cafe">Anotado!</h3>
          </div>

          <div className="mb-8 space-y-4 font-mono text-sm text-cafe">
            {massa && <TicketLine label={massa.name} value={formatCurrency(massa.price)} iconKey={massa.iconKey} />}

            {sabores.map((sabor) => (
              <TicketLine key={sabor.id} label={`1x ${sabor.name}`} value={formatCurrency(sabor.price)} iconKey={sabor.iconKey} emphasize />
            ))}

            {addons.map((addon) => (
              <TicketLine key={addon.id} label={`+ ${addon.name}`} value={formatCurrency(addon.price)} iconKey={addon.iconKey} />
            ))}

            {isReady && (
              <TicketLine label="Taxa de entrega" value={formatCurrency(deliveryFee)} iconKey="vovo-sacola" />
            )}

            {!isReady && (
              <p className="py-2 text-center font-manual text-xs text-cafe/40">
                Escolha a massa, os sabores e os extras para liberar o restante do pedido...
              </p>
            )}
          </div>

          <div className="mb-4 flex items-end justify-between border-t-2 border-cafe pt-6">
            <div>
              <span className="font-manual text-2xl text-cafe">Total</span>
              {isReady && <p className="mt-1 text-xs font-mono uppercase tracking-[0.18em] text-cafe/45">Subtotal: {formatCurrency(subtotal)}</p>}
            </div>
            <span className="font-mono text-3xl font-medium text-tomate">{formatCurrency(total)}</span>
          </div>

          {message && <p className="mb-4 rounded-xl bg-cafe px-4 py-3 text-sm text-creme-claro">{message}</p>}

          {canConfirm && !isConfirmed && (
            <button type="button" onClick={onConfirm} className="button-primary mb-4 w-full">
              Confirmar que é esse pedido que eu quero
            </button>
          )}

          <div className={`w-full rounded-xl border-2 border-cafe bg-white px-4 py-4 text-sm ${isReady ? 'text-cafe/70' : 'text-cafe/45'}`}>
            {submitting
              ? 'Confirmando pedido...'
              : isConfirmed
                ? 'Pedido confirmado. Agora preencha os dados abaixo.'
                : canConfirm
                  ? 'Confirme que esse é o pedido que você quer antes de seguir.'
                  : 'Monte primeiro o combo para continuar.'}
          </div>
        </div>
      </div>
    </div>
  )
}
