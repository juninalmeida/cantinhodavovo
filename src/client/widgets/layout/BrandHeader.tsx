import { Link } from 'react-router-dom'
import { useAuth } from '@client/modules/auth'
import { useSectionNav } from '@client/modules/home'
import { Icon, VovoIcon } from '@client/shared/icons'

export function BrandHeader() {
  const { user, logout } = useAuth()
  const { activeSection, toggleSection, goToSection } = useSectionNav()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-cafe/10 bg-creme-claro/92 backdrop-blur-md transition-all duration-300">
      <div className="faixa-xadrez h-2 w-full" />

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-cafe transition-all group-hover:border-tomate group-hover:bg-tomate/5">
            <VovoIcon size={38} className="transition-transform" />
          </div>
          <span className="font-display text-xl font-medium uppercase leading-none tracking-tighter text-cafe transition-colors group-hover:text-tomate">
            Cantinho da <span className="text-tomate">VóVó</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            onClick={() => goToSection('cozinha')}
            className={`brand-navlink ${activeSection === 'cozinha' ? 'brand-navlink-active' : ''}`}
          >
            Nossa Cozinha
          </button>
          <button
            type="button"
            onClick={() => toggleSection('cardapio')}
            className={`brand-navlink ${activeSection === 'cardapio' ? 'brand-navlink-active' : ''}`}
          >
            Cardápio
          </button>
          <button
            type="button"
            onClick={() => toggleSection('combo')}
            className={`brand-navlink ${activeSection === 'combo' ? 'brand-navlink-active' : ''}`}
          >
            Monte seu Combo
          </button>
          <Link to="/acompanhar" className="brand-navlink">
            Acompanhar
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <Link className="brand-pill" to="/area-cliente">
                  Área do Cliente
                </Link>
              )}
              {(user.role === 'ATTENDANT' || user.role === 'ADMIN') && (
                <Link className="brand-pill" to="/area-atendente">
                  Atendente
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link className="brand-pill" to="/area-admin">
                  Admin
                </Link>
              )}
              <button className="brand-icon-button group" onClick={() => void logout()}>
                <Icon name="vovo-sacola" size={23} className="transition-transform group-hover:-translate-y-0.5" />
              </button>
            </>
          ) : (
            <>
              <Link className="brand-pill" to="/login">
                Entrar
              </Link>
              <Link className="button-primary-compact" to="/cadastro">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
