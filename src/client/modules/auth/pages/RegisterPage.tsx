import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@client/shared/icons'
import { useAuth } from '@client/modules/auth/hooks/useAuth'
import { TurnstileWidget } from '@client/shared/security/TurnstileWidget'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    number: '',
    neighborhood: '',
    city: 'Maceió',
    state: 'AL',
    reference: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const requiresChallenge = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (requiresChallenge && !turnstileToken) {
      setLoading(false)
      setError('Confirme a verificacao anti-bot antes de criar a conta.')
      return
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        defaultAddress: {
          street: form.street,
          number: form.number,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
          reference: form.reference || undefined,
        },
        turnstileToken: turnstileToken ?? undefined,
      })
      navigate('/area-cliente')
    } catch (submitError: any) {
      setTurnstileToken(null)
      setTurnstileResetKey((current) => current + 1)

      if (submitError.status >= 400 && submitError.status < 500 && submitError.message) {
        setError(submitError.message)
      } else {
        setError(submitError instanceof Error ? submitError.message : 'Não foi possível criar a conta.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_0.75fr]">
        <section className="hero-surface flex flex-col justify-between">
          <div>
            <p className="eyebrow">Cadastro do cliente</p>
            <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-cafe md:text-5xl">
              Crie sua conta para acompanhar os pedidos e voltar mais rápido na próxima visita.
            </h1>
            <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-cafe/70">
              O cadastro não muda o clima do site. Ele só adiciona histórico, autenticação segura e uma Área do Cliente integrada ao Cantinho da VóVó.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border-2 border-cafe/10 bg-white/70 px-4 py-3">
              <Icon name="vovo-estrela" size={18} className="text-dourado" />
              <span className="text-sm text-cafe/70">Histórico dos pedidos feitos no site.</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-cafe/10 bg-white/70 px-4 py-3">
              <Icon name="vovo-panela" size={18} className="text-tomate" />
              <span className="text-sm text-cafe/70">Mais facilidade para repetir o pedido do seu jeito.</span>
            </div>
          </div>
        </section>

        <section className="ticket-card">
          <div className="borda-comanda" />
          <div className="p-8 pb-10">
            <div className="mb-8 border-b-2 border-dashed border-cafe/20 pb-6 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cafe/60">Primeira visita</p>
              <h2 className="mt-2 font-display text-3xl font-medium text-cafe">Criar conta</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-cafe/70">
                Nome completo
                <input className="input mt-2" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label className="block text-sm font-medium text-cafe/70">
                E-mail
                <input className="input mt-2" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              </label>
              <label className="block text-sm font-medium text-cafe/70">
                Telefone
                <input className="input mt-2" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
              </label>
              <label className="block text-sm font-medium text-cafe/70">
                Senha
                <input className="input mt-2" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              </label>

              <div className="rounded-2xl border-2 border-cafe/10 bg-creme-manteiga/30 p-4">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-cafe/50">Endereço padrão</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-cafe/70 sm:col-span-2">
                    Rua
                    <input className="input mt-2" value={form.street} onChange={(event) => setForm((current) => ({ ...current, street: event.target.value }))} />
                  </label>
                  <label className="block text-sm font-medium text-cafe/70">
                    Número
                    <input className="input mt-2" value={form.number} onChange={(event) => setForm((current) => ({ ...current, number: event.target.value }))} />
                  </label>
                  <label className="block text-sm font-medium text-cafe/70">
                    Bairro
                    <input className="input mt-2" value={form.neighborhood} onChange={(event) => setForm((current) => ({ ...current, neighborhood: event.target.value }))} />
                  </label>
                  <label className="block text-sm font-medium text-cafe/70">
                    Cidade
                    <input className="input mt-2" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
                  </label>
                  <label className="block text-sm font-medium text-cafe/70">
                    Estado
                    <input className="input mt-2" value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} />
                  </label>
                  <label className="block text-sm font-medium text-cafe/70 sm:col-span-2">
                    Ponto de referência
                    <input className="input mt-2" value={form.reference} onChange={(event) => setForm((current) => ({ ...current, reference: event.target.value }))} />
                  </label>
                </div>
              </div>

              <TurnstileWidget onTokenChange={setTurnstileToken} resetKey={turnstileResetKey} />
              {requiresChallenge && !turnstileToken && (
                <p className="text-xs text-cafe/55">A verificacao anti-bot precisa ser concluida para liberar o cadastro.</p>
              )}

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button className="button-primary w-full" disabled={loading || (requiresChallenge && !turnstileToken)} type="submit">
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <p className="mt-6 text-sm text-cafe/50">
              Já tem uma conta?{' '}
              <Link className="font-semibold text-tomate underline" to="/login">
                Entrar agora
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
