import { Icon } from './icons/Icon'
import { VovoIcon } from './icons/VovoIcon'

function BasketIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="relative z-10 h-full w-full drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]" fill="none">
      <path d="M64,58 C61,50 66,43 63,35" stroke="#B43A2F" strokeWidth="1.6" strokeLinecap="round" className="animate-vapor" opacity="0.45" />
      <path d="M100,52 C97,44 102,37 99,29" stroke="#B43A2F" strokeWidth="1.6" strokeLinecap="round" className="animate-vapor-delay" opacity="0.45" />
      <path d="M136,56 C133,48 138,41 135,33" stroke="#B43A2F" strokeWidth="1.6" strokeLinecap="round" className="animate-vapor-delay-2" opacity="0.45" />
      <g transform="rotate(-18 64 95)">
        <path d="M64,120 C52,120 37,109 34,93 C31,79 41,63 54,57 C58,55 62,53 64,53 C66,53 70,55 74,57 C87,63 97,79 94,93 C91,109 76,120 64,120Z" fill="#D9913B" stroke="#4A2E24" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g transform="rotate(12 100 88)">
        <path d="M100,58 C114,58 140,70 142,88 C140,106 114,118 100,118 C86,118 60,106 58,88 C60,70 86,58 100,58Z" fill="#6B3D1E" stroke="#4A2E24" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <path d="M138,122 C124,122 110,109 110,95 C110,80 122,67 138,67 C154,67 167,80 167,95 C167,109 152,122 138,122Z" fill="#D9913B" stroke="#4A2E24" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="100" cy="194" rx="74" ry="10" fill="#4A2E24" fillOpacity="0.11" />
      <path d="M24,187 L24,132 C24,118 58,108 100,108 C142,108 176,118 176,132 L176,187 Z" fill="#C8935A" stroke="#4A2E24" strokeWidth="3" />
      <ellipse cx="100" cy="187" rx="76" ry="14" fill="#A56520" stroke="#4A2E24" strokeWidth="2.5" />
      <ellipse cx="100" cy="132" rx="76" ry="24" fill="#D4A574" stroke="#4A2E24" strokeWidth="3" />
    </svg>
  )
}

export function HeroSection({
  onOpenMenu,
  onOpenCombo,
}: {
  onOpenMenu: () => void
  onOpenCombo: () => void
}) {
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-2 md:pb-32 md:pt-24">
      <div className="animate-fade-in-up relative z-10 flex flex-col items-start">
        <div className="relative mb-6 inline-flex rotate-[-2deg] items-center gap-2 rounded-sm border-2 border-cafe bg-white px-3 py-1.5">
          <Icon name="vovo-fogo" size={14} className="animate-micro-pulse text-tomate" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-cafe">Cozinha Aberta</span>
          <div className="absolute left-1/2 top-[-0.5rem] h-3 w-8 -translate-x-1/2 rotate-[3deg] bg-creme-manteiga/80 backdrop-blur-sm" />
        </div>

        <h1 className="relative mb-6 font-display text-4xl font-medium leading-[1.05] tracking-tight text-cafe md:text-6xl">
          Salgadinho feito
          <br />
          <span className="relative inline-block italic font-normal text-tomate">
            do jeito da vovó.
            <svg className="absolute -bottom-2 left-0 w-full text-dourado" viewBox="0 0 200 12" fill="none">
              <path d="M2 9C50 2 150 2 198 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="mb-10 max-w-md text-base font-light leading-relaxed text-cafe/75 md:text-lg">
          Coxinha quentinha, quibe crocante, bolinha de queijo e muito mais. Receita de família, feita na hora, entregue na sua porta.
        </p>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <button type="button" onClick={onOpenCombo} className="button-primary">
            <Icon name="vovo-estrela" size={18} className="text-dourado" />
            Monte seu Combo
          </button>
          <button type="button" onClick={onOpenMenu} className="button-secondary">
            Ver o Cardápio
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm font-light text-cafe/55">
          <Icon name="vovo-tempo" size={17} className="text-dourado" />
          Sai quentinho (aprox. 30-40 min)
        </div>
      </div>

      <div className="animate-fade-in-up relative aspect-square w-full md:aspect-[4/3] [animation-delay:100ms]">
        <div className="absolute inset-0 overflow-hidden rounded-2xl border-2 border-cafe bg-creme-manteiga shadow-[8px_8px_0px_0px_rgba(74,46,36,0.1)]">
          <div className="absolute inset-0 bg-xadrez opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,250,245,0.85)_0%,transparent_72%)]" />
          <div className="group relative flex h-full w-full items-center justify-center overflow-hidden p-6 md:p-12">
            <BasketIllustration />
          </div>
        </div>

        <div className="absolute bottom-3 left-3 z-10 h-28 w-28 animate-float drop-shadow-lg md:-bottom-5 md:-left-7">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow text-cafe">
            <circle cx="50" cy="50" r="48" fill="#FCFAF5" stroke="currentColor" strokeWidth="1.5" />
            <path id="spin-badge-curve" d="M 50 14 A 36 36 0 1 1 49.9 14" fill="transparent" />
            <text fontSize="7.5" fontFamily="IBM Plex Mono, monospace" fontWeight="500" fill="#4A2E24" className="uppercase">
              <textPath href="#spin-badge-curve" startOffset="0%">
                • feito hoje • receita de vó •
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <VovoIcon size={36} />
          </div>
        </div>
      </div>
    </section>
  )
}
