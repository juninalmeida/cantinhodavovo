import { Link } from 'react-router-dom'
import { Icon } from '@client/shared/icons'

export function BrandFooter() {
  return (
    <footer className="relative overflow-hidden bg-cafe text-creme-manteiga">
      <div className="faixa-xadrez h-2 w-full" />

      <div className="relative pb-4 pt-6">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle fill="currentColor" cx="2" cy="2" r="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#footer-dots)" />
        </svg>

        <div className="relative z-10 mx-auto mb-4 grid max-w-7xl gap-4 border-b border-creme-manteiga/10 px-6 pb-4 md:grid-cols-[1.15fr_0.85fr_1fr]">
          <div>
            <Link to="/" className="mb-2 flex items-center gap-2">
              <Icon name="vovo-panela" size={22} className="text-tomate" />
              <span className="font-display text-2xl font-medium uppercase tracking-tighter text-white">
                Cantinho da <span className="text-tomate">VóVó</span>
              </span>
            </Link>
            <p className="max-w-xs text-[13px] font-light leading-relaxed text-creme-manteiga/65">
              Comida de verdade, feita por gente de verdade, pra abraçar o seu estômago e o seu coração.
            </p>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-display text-sm uppercase tracking-widest text-white">
              <Icon name="vovo-estrela" size={14} className="text-dourado" />
              Navegue
            </h4>
            <ul className="space-y-1.5 text-sm text-creme-manteiga/65">
              <li>
                <Link to="/" className="transition-all hover:pl-2 hover:text-white">
                  Nossa Cozinha
                </Link>
              </li>
              <li>
                <Link to="/#cardapio" className="transition-all hover:pl-2 hover:text-white">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link to="/#pedido" className="transition-all hover:pl-2 hover:text-white">
                  Monte seu Combo
                </Link>
              </li>
              <li>
                <Link to="/acompanhar" className="transition-all hover:pl-2 hover:text-white">
                  Acompanhar pedido
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-display text-sm uppercase tracking-widest text-white">
              <Icon name="vovo-fogo" size={14} className="text-tomate" />
              A Cozinha
            </h4>
            <p className="mb-2 text-[13px] font-light text-creme-manteiga/65">Delivery • Alagoas, AL</p>
            <div className="flex flex-col gap-1.5 text-sm">
              <a
                href="https://wa.me/5582999419901"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1ebe5a]"
              >
                Chamar no WhatsApp
              </a>
              <a
                href="https://instagram.com/lanchonetedavovo25"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-creme-manteiga/20 bg-creme-manteiga/10 px-3 py-2 text-sm font-medium text-creme-manteiga transition-colors hover:bg-creme-manteiga/20"
              >
                @lanchonetedavovo25
              </a>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 px-6 text-[10px] font-mono text-creme-manteiga/35 md:flex-row">
          <span>© 2026 Cantinho da VóVó. Feito à mão com carinho.</span>
          <span>Sistema Operacional</span>
        </div>
      </div>
    </footer>
  )
}
