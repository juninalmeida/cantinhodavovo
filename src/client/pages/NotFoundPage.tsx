import { Link } from 'react-router-dom'
import { Panel } from '../components/Panel'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl">
      <Panel>
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-3xl font-black">Página não encontrada</h1>
        <p className="mt-4 text-sm text-cafe/70">A rota solicitada não existe nesta versão da plataforma.</p>
        <Link className="button-primary mt-6 inline-flex" to="/">
          Voltar ao inicio
        </Link>
      </Panel>
    </div>
  )
}
