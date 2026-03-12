import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../brand/icons/Icon'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login({ email, password })
      navigate((location.state as { from?: string } | null)?.from ?? '/area-cliente')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_0.75fr]">
        <section className="hero-surface flex flex-col justify-between">
          <div>
            <p className="eyebrow">Acesso seguro</p>
            <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-cafe md:text-5xl">
              Entre para acompanhar seus pedidos e receber novidades da cozinha.
            </h1>
            <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-cafe/70">
              A Área do Cliente continua com a cara do Cantinho da VóVó, mas agora com histórico, tracking e autenticação segura.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border-2 border-cafe/10 bg-white/70 px-4 py-3">
              <Icon name="vovo-check" size={18} className="text-tomate" />
              <span className="text-sm text-cafe/70">Veja o andamento do pedido sem perder a identidade do site.</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-cafe/10 bg-white/70 px-4 py-3">
              <Icon name="vovo-sacola" size={18} className="text-dourado" />
              <span className="text-sm text-cafe/70">Seus pedidos autenticados ficam salvos no histórico da sua conta.</span>
            </div>
          </div>
        </section>

        <section className="ticket-card">
          <div className="borda-comanda" />
          <div className="p-8 pb-10">
            <div className="mb-8 border-b-2 border-dashed border-cafe/20 pb-6 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cafe/60">Portal da cozinha</p>
              <h2 className="mt-2 font-display text-3xl font-medium text-cafe">Entrar</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-cafe/70">
                E-mail
                <input className="input mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label className="block text-sm font-medium text-cafe/70">
                Senha
                <input className="input mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button className="button-primary w-full" disabled={loading} type="submit">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="mt-6 text-sm text-cafe/50">
              Ainda não tem conta?{' '}
              <Link className="font-semibold text-tomate underline" to="/cadastro">
                Criar cadastro
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
