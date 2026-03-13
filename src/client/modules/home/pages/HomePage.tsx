import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CatalogProduct, ComboOption, CreateOrderInput, PaymentMethod } from '@shared/contracts/app'
import { buildComboOrderItems, groupComboOptions, isComboSelectionReady } from '@shared/utils/combo'
import { formatCurrency } from '@shared/utils/money'
import { useAuth } from '@client/modules/auth'
import { catalogApi } from '@client/modules/catalog'
import { useSectionNav } from '@client/modules/home'
import { ordersApi } from '@client/modules/orders'
import { ComboOrderTicket } from '@client/modules/home/ui/ComboOrderTicket'
import { HeroSection } from '@client/modules/home/ui/HeroSection'
import { Icon } from '@client/shared/icons'
import { MenuSection } from '@client/modules/home/ui/MenuSection'
import { decorateComboOption } from '@client/modules/home/model/comboVisuals'

const deliveryFeePreview = 6.5

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'Pix' },
  { value: 'CREDIT_CARD', label: 'Cartão de crédito' },
  { value: 'DEBIT_CARD', label: 'Cartão de débito' },
  { value: 'CASH', label: 'Dinheiro' },
]

function toggleSelection(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function ComboOptionArt({ option }: { option: ComboOption }) {
  if (option.iconKey) {
    return <Icon name={option.iconKey} size={option.group === 'ADDON' ? 14 : 32} className="ilustracao text-cafe" />
  }

  const emoji = option.id.includes('queijo') ? '🧀' : option.id.includes('camarão') || option.id.includes('camarao') ? '🦐' : '🍴'
  return <span className="text-2xl">{emoji}</span>
}

export function HomePage() {
  const navigate = useNavigate()
  const { goToSection, activeSection } = useSectionNav()
  const { user, defaultAddress } = useAuth()
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [comboOptions, setComboOptions] = useState<ComboOption[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCombo, setLoadingCombo] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [comboError, setComboError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [useSavedAddress, setUseSavedAddress] = useState(true)
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)
  const [ticketPinned, setTicketPinned] = useState(false)
  const [ticketMotionY, setTicketMotionY] = useState(0)
  const ticketStickyAnchorRef = useRef<HTMLDivElement | null>(null)
  const ticketCardRef = useRef<HTMLDivElement | null>(null)
  const comboSectionRef = useRef<HTMLElement | null>(null)
  const [selection, setSelection] = useState({
    massaId: null as string | null,
    saborIds: [] as string[],
    addonIds: [] as string[],
  })
  const [form, setForm] = useState({
    guestName: '',
    guestPhone: '',
    street: '',
    number: '',
    neighborhood: '',
    city: 'Maceió',
    state: 'AL',
    reference: '',
    paymentMethod: 'PIX' as PaymentMethod,
    changeFor: '',
    notes: '',
  })

  useEffect(() => {
    let active = true

    async function loadHomeData() {
      const [productsResult, comboResult] = await Promise.allSettled([
        catalogApi.listProducts(),
        catalogApi.listComboOptions(),
      ])

      if (!active) {
        return
      }

      if (productsResult.status === 'fulfilled') {
        setProducts(productsResult.value.products)
        setCatalogError(null)
      } else {
        setProducts([])
        setCatalogError('Não foi possível carregar o Cardápio agora.')
      }

      if (comboResult.status === 'fulfilled') {
        setComboOptions(comboResult.value.comboOptions.map(decorateComboOption))
        setComboError(null)
      } else {
        setComboOptions([])
        setComboError('Não foi possível carregar o Monte seu Combo agora.')
      }

      setLoadingProducts(false)
      setLoadingCombo(false)
    }

    void loadHomeData()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!defaultAddress) {
      return
    }

    setForm((current) => ({
      ...current,
      street: defaultAddress.street,
      number: defaultAddress.number,
      neighborhood: defaultAddress.neighborhood,
      city: defaultAddress.city,
      state: defaultAddress.state,
      reference: defaultAddress.reference ?? '',
    }))
  }, [defaultAddress])

  const { massas, sabores, addons } = useMemo(() => groupComboOptions(comboOptions), [comboOptions])

  const selectedMassa = useMemo(
    () => massas.find((option) => option.id === selection.massaId) ?? null,
    [massas, selection.massaId],
  )
  const selectedSabores = useMemo(
    () => sabores.filter((option) => selection.saborIds.includes(option.id)),
    [sabores, selection.saborIds],
  )
  const selectedAddons = useMemo(
    () => addons.filter((option) => selection.addonIds.includes(option.id)),
    [addons, selection.addonIds],
  )

  const comboReady = isComboSelectionReady(selection)
  const isCardapioExpanded = activeSection === 'cardapio'
  const isComboExpanded = activeSection === 'combo'
  const saborSelectionKey = selection.saborIds.join(',')
  const addonSelectionKey = selection.addonIds.join(',')

  useEffect(() => {
    setIsOrderConfirmed(false)
  }, [selection.massaId, saborSelectionKey, addonSelectionKey])

  useEffect(() => {
    if (!isComboExpanded) {
      setTicketPinned(false)
      setTicketMotionY(0)
      return
    }

    const syncPinnedState = () => {
      if (!ticketStickyAnchorRef.current || !ticketCardRef.current || !comboSectionRef.current || window.innerWidth < 1024) {
        setTicketPinned(false)
        setTicketMotionY(0)
        return
      }

      const wrapperRect = ticketStickyAnchorRef.current.getBoundingClientRect()
      const sectionRect = comboSectionRef.current.getBoundingClientRect()
      const cardHeight = ticketCardRef.current.offsetHeight
      const viewportOffset = 96
      const availableTravel = Math.max(comboSectionRef.current.offsetHeight - cardHeight - viewportOffset - 24, 0)
      const sectionProgressRaw = viewportOffset - sectionRect.top
      const progress = availableTravel === 0 ? 0 : Math.min(Math.max(sectionProgressRaw / availableTravel, 0), 1)

      setTicketPinned(wrapperRect.top <= viewportOffset)
      setTicketMotionY(progress * availableTravel)
    }

    syncPinnedState()
    window.addEventListener('scroll', syncPinnedState, { passive: true })
    window.addEventListener('resize', syncPinnedState)

    return () => {
      window.removeEventListener('scroll', syncPinnedState)
      window.removeEventListener('resize', syncPinnedState)
    }
  }, [isComboExpanded])

  const comboSubtotal = useMemo(
    () =>
      [selectedMassa, ...selectedSabores, ...selectedAddons]
        .filter(Boolean)
        .reduce((total, option) => total + (option?.price ?? 0), 0),
    [selectedMassa, selectedSabores, selectedAddons],
  )
  const comboTotal = comboReady ? comboSubtotal + deliveryFeePreview : comboSubtotal

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setMessage(null)

    if (!isOrderConfirmed) {
      setSubmitting(false)
      setMessage('Confirme primeiro que esse é o pedido que você quer.')
      return
    }

    let items

    try {
      items = buildComboOrderItems(selection)
    } catch (error) {
      setSubmitting(false)
      setMessage(error instanceof Error ? error.message : 'Monte o combo antes de continuar.')
      return
    }

    const deliveryAddress =
      user && defaultAddress && useSavedAddress
        ? {
            street: defaultAddress.street,
            number: defaultAddress.number,
            neighborhood: defaultAddress.neighborhood,
            city: defaultAddress.city,
            state: defaultAddress.state,
            reference: defaultAddress.reference ?? undefined,
          }
        : {
            street: form.street,
            number: form.number,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
            reference: form.reference || undefined,
          }

    const input: CreateOrderInput = {
      items,
      deliveryAddress,
      paymentMethod: form.paymentMethod,
      changeFor: form.paymentMethod === 'CASH' && form.changeFor ? Number(form.changeFor) : undefined,
      notes: form.notes || undefined,
      customerMode: user ? 'AUTHENTICATED' : 'GUEST',
      guestInfo: user
        ? undefined
        : {
            name: form.guestName,
            phone: form.guestPhone,
          },
    }

    try {
      const { order } = await ordersApi.createOrder(input)
      setMessage(`Pedido criado com sucesso. Código de acompanhamento: ${order.trackingCode}`)

      if (user) {
        navigate(`/pedido/${order.id}`, {
          state: { createdTrackingCode: order.trackingCode },
        })
      } else {
        navigate(`/acompanhar/${order.trackingCode}`)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível criar o pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div id="home-hero">
        <HeroSection onOpenMenu={() => goToSection('cardapio')} onOpenCombo={() => goToSection('combo')} />
      </div>

      <MenuSection
        products={products}
        loading={loadingProducts}
        isExpanded={isCardapioExpanded}
        onOpen={() => goToSection('cardapio')}
        onMinimize={() => goToSection('cozinha')}
        errorMessage={catalogError}
      />

      <section id="pedido" ref={comboSectionRef} className="bg-caderno-receita relative scroll-mt-28 border-y-2 border-cafe py-20">
        <div className={`relative z-10 mx-auto max-w-7xl gap-12 px-6 ${isComboExpanded ? 'grid items-start lg:grid-cols-[1fr_400px]' : 'block'}`}>
          <div>
            <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 font-manual text-2xl text-tomate">
                  <Icon name="vovo-estrela" size={24} />
                  A sua receita
                </div>
                <h2 className="mb-3 font-display text-4xl font-medium tracking-tight text-cafe">Monte seu Combo</h2>
                <p className="max-w-xl text-base font-light text-cafe/70">
                  Primeiro monte o salgado do seu jeito. Quando o combo estiver pronto, a entrega e o pagamento aparecem logo abaixo.
                </p>
              </div>

              {isComboExpanded && (
                <button type="button" onClick={() => goToSection('cozinha')} className="brand-pill w-fit">
                  Ocultar o Monte seu Combo e focar na Nossa Cozinha
                </button>
              )}
            </div>

            {!isComboExpanded ? (
              <div className="rounded-[2rem] border-2 border-cafe/10 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(74,46,36,0.05)]">
                <p className="text-sm font-light text-cafe/60">
                  O Monte seu Combo fica recolhido até você abrir. Quando clicar, a massa, os sabores e os extras aparecem para você montar do seu jeito.
                </p>
                <div className="mt-5">
                  <button type="button" onClick={() => goToSection('combo')} className="button-secondary">
                    Abrir Monte seu Combo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <fieldset>
                  <legend className="mb-6 flex w-full items-center gap-3 font-display text-2xl font-medium text-cafe">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cafe bg-white font-mono text-sm text-cafe">
                      1
                    </span>
                    A massa
                  </legend>

                {loadingCombo ? (
                  <div className="rounded-2xl border-2 border-cafe/10 bg-white p-6 text-cafe/60">Carregando as opções da cozinha...</div>
                ) : comboError ? (
                  <div className="rounded-2xl border-2 border-tomate/20 bg-white p-6 text-tomate">{comboError}</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                      {massas.map((massa) => {
                        const isSelected = selectedMassa?.id === massa.id

                        return (
                          <label key={massa.id} className="input-lanchonete relative block cursor-pointer">
                            <input
                              type="radio"
                              name="massa"
                              className="sr-only"
                              checked={isSelected}
                              onChange={() => setSelection((current) => ({ ...current, massaId: massa.id }))}
                            />
                            <div className="card-ingrediente group relative flex h-full flex-col items-center overflow-hidden rounded-xl border-2 border-cafe/10 bg-white p-5 text-center">
                              <ComboOptionArt option={massa} />
                              <span className="mb-1 mt-4 block text-sm font-medium text-cafe">{massa.name}</span>
                              <span className={`font-mono text-[10px] uppercase tracking-wider ${isSelected ? 'text-tomate' : 'text-cafe/40'}`}>
                                {massa.tag ?? formatCurrency(massa.price)}
                              </span>
                              <div className="marca-carimbo absolute right-3 top-3 hidden">
                                <Icon name="vovo-check" size={20} className="text-tomate" />
                              </div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="mb-6 flex w-full items-center gap-3 font-display text-2xl font-medium text-cafe">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cafe bg-white font-mono text-sm text-cafe">
                      2
                    </span>
                    O sabor
                    <span className="ml-2 mt-1 text-xs font-manual text-cafe/60">Pode ser mais de um!</span>
                  </legend>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {sabores.map((sabor) => {
                      const isSelected = selection.saborIds.includes(sabor.id)

                      return (
                        <label key={sabor.id} className="input-lanchonete relative block cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() =>
                              setSelection((current) => ({
                                ...current,
                                saborIds: toggleSelection(current.saborIds, sabor.id),
                              }))
                            }
                          />
                          <div className="card-ingrediente relative flex items-center gap-4 rounded-xl border-2 border-cafe/10 bg-white p-4">
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-cafe/10 bg-creme-manteiga">
                              <ComboOptionArt option={sabor} />
                            </div>
                            <div className="flex-grow pr-6">
                              <span className="block text-sm font-medium text-cafe">{sabor.name}</span>
                              <span className="mb-1 block text-xs text-cafe/60">{sabor.description}</span>
                              <span className={`font-mono text-xs font-medium ${isSelected ? 'text-tomate' : 'text-cafe/50'}`}>
                                + {formatCurrency(sabor.price)}
                              </span>
                            </div>
                            <div className="marca-carimbo absolute right-4 top-4 hidden">
                              <Icon name="vovo-check" size={20} className="text-tomate" />
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-6 flex w-full items-center gap-3 font-display text-2xl font-medium text-cafe">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cafe bg-white font-mono text-sm text-cafe">
                      3
                    </span>
                    Da cozinha
                  </legend>

                  <div className="flex flex-wrap gap-3">
                    {addons.map((addon) => {
                      const isSelected = selection.addonIds.includes(addon.id)

                      return (
                        <label key={addon.id} className="chip-ingrediente relative cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() =>
                              setSelection((current) => ({
                                ...current,
                                addonIds: toggleSelection(current.addonIds, addon.id),
                              }))
                            }
                          />
                          <div className="flex items-center gap-2 rounded-full border-2 border-cafe/20 bg-white px-5 py-2.5 text-sm font-medium text-cafe transition-all hover:bg-creme-manteiga">
                            {addon.iconKey && <Icon name={addon.iconKey} size={14} className="text-current" />}
                            {addon.name}
                            <span className="font-mono text-[10px] opacity-60">
                              {addon.price > 0 ? `+${addon.price.toFixed(2).replace('.', ',')}` : 'Grátis'}
                            </span>
                          </div>
                          {addon.tag && <span className="absolute -right-2 -top-4 rotate-12 font-manual text-lg text-tomate">{addon.tag}</span>}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                {comboReady && isOrderConfirmed && (
                  <form id="public-order-form" className="space-y-10 rounded-[2rem] border-2 border-cafe/10 bg-white/60 p-6" onSubmit={handleSubmit}>
                    <fieldset>
                      <legend className="mb-6 flex w-full items-center gap-3 font-display text-2xl font-medium text-cafe">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cafe bg-white font-mono text-sm text-cafe">
                          4
                        </span>
                        Quem vai receber?
                      </legend>

                      {!user ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block text-sm font-medium text-cafe">
                            Nome completo
                            <input className="input mt-2" value={form.guestName} onChange={(event) => setForm((current) => ({ ...current, guestName: event.target.value }))} />
                          </label>
                          <label className="block text-sm font-medium text-cafe">
                            Número de telefone
                            <input className="input mt-2" value={form.guestPhone} onChange={(event) => setForm((current) => ({ ...current, guestPhone: event.target.value }))} />
                          </label>
                        </div>
                      ) : (
                        <div className="rounded-2xl border-2 border-cafe/10 bg-creme-manteiga/30 p-5">
                          <p className="font-display text-xl text-cafe">Pedido autenticado para {user.name}</p>
                          <p className="mt-2 text-sm text-cafe/60">Seu pedido ficará salvo no histórico da Área do Cliente.</p>
                        </div>
                      )}
                    </fieldset>

                    <fieldset>
                      <legend className="mb-6 flex w-full items-center gap-3 font-display text-2xl font-medium text-cafe">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cafe bg-white font-mono text-sm text-cafe">
                          5
                        </span>
                        Endereço de entrega
                      </legend>

                      {user && defaultAddress ? (
                        <div className="space-y-4">
                          <label className="flex items-start gap-3 rounded-2xl border-2 border-cafe/10 bg-white p-4">
                            <input
                              type="radio"
                              name="delivery-mode"
                              className="mt-1"
                              checked={useSavedAddress}
                              onChange={() => setUseSavedAddress(true)}
                            />
                            <div>
                              <p className="font-display text-xl text-cafe">Usar endereço cadastrado</p>
                              <p className="mt-2 text-sm text-cafe/65">
                                {defaultAddress.street}, {defaultAddress.number} • {defaultAddress.neighborhood} • {defaultAddress.city}/{defaultAddress.state}
                              </p>
                              {defaultAddress.reference && <p className="mt-1 text-xs text-cafe/50">Referência: {defaultAddress.reference}</p>}
                            </div>
                          </label>

                          <label className="flex items-start gap-3 rounded-2xl border-2 border-cafe/10 bg-white p-4">
                            <input
                              type="radio"
                              name="delivery-mode"
                              className="mt-1"
                              checked={!useSavedAddress}
                              onChange={() => setUseSavedAddress(false)}
                            />
                            <div>
                              <p className="font-display text-xl text-cafe">Enviar para outro endereço</p>
                              <p className="mt-2 text-sm text-cafe/65">Informe outro local de entrega só para este pedido.</p>
                            </div>
                          </label>
                        </div>
                      ) : null}

                      {(!user || !defaultAddress || !useSavedAddress) && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <label className="block text-sm font-medium text-cafe sm:col-span-2">
                            Rua
                            <input className="input mt-2" value={form.street} onChange={(event) => setForm((current) => ({ ...current, street: event.target.value }))} />
                          </label>
                          <label className="block text-sm font-medium text-cafe">
                            Número
                            <input className="input mt-2" value={form.number} onChange={(event) => setForm((current) => ({ ...current, number: event.target.value }))} />
                          </label>
                          <label className="block text-sm font-medium text-cafe">
                            Bairro
                            <input className="input mt-2" value={form.neighborhood} onChange={(event) => setForm((current) => ({ ...current, neighborhood: event.target.value }))} />
                          </label>
                          <label className="block text-sm font-medium text-cafe">
                            Cidade
                            <input className="input mt-2" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
                          </label>
                          <label className="block text-sm font-medium text-cafe">
                            Estado
                            <input className="input mt-2" value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} />
                          </label>
                          <label className="block text-sm font-medium text-cafe sm:col-span-2">
                            Ponto de referência
                            <input className="input mt-2" value={form.reference} onChange={(event) => setForm((current) => ({ ...current, reference: event.target.value }))} />
                          </label>
                        </div>
                      )}
                    </fieldset>

                    <fieldset>
                      <legend className="mb-6 flex w-full items-center gap-3 font-display text-2xl font-medium text-cafe">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cafe bg-white font-mono text-sm text-cafe">
                          6
                        </span>
                        Pagamento e observações
                      </legend>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-medium text-cafe">
                          Forma de pagamento
                          <select className="input mt-2" value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value as PaymentMethod }))}>
                            {paymentOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        {form.paymentMethod === 'CASH' && (
                          <label className="block text-sm font-medium text-cafe">
                            Troco para
                            <input className="input mt-2" min={0} step="0.01" type="number" value={form.changeFor} onChange={(event) => setForm((current) => ({ ...current, changeFor: event.target.value }))} />
                          </label>
                        )}
                        <label className="block text-sm font-medium text-cafe sm:col-span-2">
                          Observações
                          <textarea className="input mt-2 min-h-28" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
                        </label>
                      </div>
                    </fieldset>

                    <div className="flex justify-end">
                      <button className="button-primary min-w-[240px]" disabled={submitting} type="submit">
                        {submitting ? 'Enviando pedido...' : 'Confirmar pedido'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {isComboExpanded && (
              <ComboOrderTicket
                massa={selectedMassa}
                sabores={selectedSabores}
                addons={selectedAddons}
                subtotal={comboSubtotal}
                deliveryFee={deliveryFeePreview}
                total={comboTotal}
                isReady={comboReady}
                message={message}
                submitting={submitting}
                isPinned={ticketPinned}
                scrollMotionY={ticketMotionY}
                canConfirm={comboReady}
                isConfirmed={isOrderConfirmed}
                onConfirm={() => setIsOrderConfirmed(true)}
                containerRef={ticketStickyAnchorRef}
                cardRef={ticketCardRef}
              />
          )}
        </div>
      </section>
    </>
  )
}
