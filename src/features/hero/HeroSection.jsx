import { Icon } from '../../components/icons/Icon';
import { VovoIcon } from '../../components/icons/VovoIcon';

function BasketIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full relative z-10 drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Steam wisps ── */}
      <path d="M64,58 C61,50 66,43 63,35" stroke="#B43A2F" strokeWidth="1.6" strokeLinecap="round" className="animate-vapor" opacity="0.45"/>
      <path d="M100,52 C97,44 102,37 99,29" stroke="#B43A2F" strokeWidth="1.6" strokeLinecap="round" className="animate-vapor-delay" opacity="0.45"/>
      <path d="M136,56 C133,48 138,41 135,33" stroke="#B43A2F" strokeWidth="1.6" strokeLinecap="round" className="animate-vapor-delay-2" opacity="0.45"/>

      {/* ── SALGADOS peeking above basket rim ── */}

      {/* LEFT — Coxinha (tilted -18°) */}
      <g transform="rotate(-18 64 95)">
        <path
          d="M64,120 C52,120 37,109 34,93 C31,79 41,63 54,57 C58,55 62,53 64,53 C66,53 70,55 74,57 C87,63 97,79 94,93 C91,109 76,120 64,120Z"
          fill="#D9913B" stroke="#4A2E24" strokeWidth="2.5" strokeLinejoin="round"
        />
        <path
          d="M64,53 C66,53 70,55 74,57 C85,64 97,82 94,93 C91,109 76,120 64,120 C64,118 70,110 72,98 C74,86 70,68 64,53Z"
          fill="#C07A25" fillOpacity="0.38"
        />
        <path
          d="M60,55 C61,48 63,43 64,40 C65,43 67,48 68,55"
          fill="#D9913B" stroke="#4A2E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="55" cy="75" r="1.5" fill="#C07A25" fillOpacity="0.5"/>
        <circle cx="70" cy="68" r="1.2" fill="#C07A25" fillOpacity="0.45"/>
      </g>

      {/* CENTER — Quibe (tilted +12°) */}
      <g transform="rotate(12 100 88)">
        <path
          d="M100,58 C114,58 140,70 142,88 C140,106 114,118 100,118 C86,118 60,106 58,88 C60,70 86,58 100,58Z"
          fill="#6B3D1E" stroke="#4A2E24" strokeWidth="2.5" strokeLinejoin="round"
        />
        <path
          d="M100,58 C114,58 140,70 142,88 C140,106 114,118 100,118 C107,108 116,97 118,85 C120,73 114,62 100,58Z"
          fill="#4A2E24" fillOpacity="0.2"
        />
        <path d="M82,70 Q85,75 82,80 M92,65 Q95,70 92,75 M108,65 Q111,70 108,75 M118,70 Q121,75 118,80"
          stroke="#4A2E24" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
      </g>

      {/* RIGHT — Bolinha */}
      <path
        d="M138,122 C124,122 110,109 110,95 C110,80 122,67 138,67 C154,67 167,80 167,95 C167,109 152,122 138,122Z"
        fill="#D9913B" stroke="#4A2E24" strokeWidth="2.5" strokeLinejoin="round"
      />
      <path
        d="M138,67 C154,67 167,80 167,95 C167,109 152,122 138,122 C142,114 149,104 150,94 C151,82 147,71 138,67Z"
        fill="#C07A25" fillOpacity="0.42"
      />
      <ellipse cx="128" cy="79" rx="8" ry="8" fill="white" fillOpacity="0.22"/>
      <ellipse cx="132" cy="74" rx="4" ry="4" fill="white" fillOpacity="0.16"/>

      {/* ── BASKET body ── */}
      {/* Basket shadow */}
      <ellipse cx="100" cy="194" rx="74" ry="10" fill="#4A2E24" fillOpacity="0.11"/>

      {/* Basket body */}
      <path
        d="M24,187 L24,132 C24,118 58,108 100,108 C142,108 176,118 176,132 L176,187 Z"
        fill="#C8935A" stroke="#4A2E24" strokeWidth="3"
      />

      {/* Wicker horizontal bands */}
      <path d="M24,140 C58,132 142,132 176,140" stroke="#A06830" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M24,152 C58,144 142,144 176,152" stroke="#A06830" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M24,164 C58,156 142,156 176,164" stroke="#A06830" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M24,177 C58,169 142,169 176,177" stroke="#A06830" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Wicker vertical marks */}
      {[40,52,64,76,88,100,112,124,136,148,158].map((x, i) => (
        <line key={i} x1={x} y1="120" x2={x - 2} y2="186" stroke="#A06830" strokeWidth="1" opacity="0.4"/>
      ))}

      {/* Basket bottom ellipse */}
      <ellipse cx="100" cy="187" rx="76" ry="14" fill="#A56520" stroke="#4A2E24" strokeWidth="2.5"/>

      {/* Basket rim */}
      <ellipse cx="100" cy="132" rx="76" ry="24" fill="#D4A574" stroke="#4A2E24" strokeWidth="3"/>

      {/* Gingham cloth inside rim */}
      <clipPath id="rim-gingham">
        <ellipse cx="100" cy="132" rx="73" ry="21"/>
      </clipPath>
      <g clipPath="url(#rim-gingham)">
        <rect x="27" y="111" width="146" height="42" fill="#FCFAF5"/>
        <rect x="27" y="115" width="146" height="3.5" fill="#B43A2F" fillOpacity="0.7"/>
        <rect x="27" y="122" width="146" height="3.5" fill="#B43A2F" fillOpacity="0.7"/>
        <rect x="27" y="129" width="146" height="3.5" fill="#B43A2F" fillOpacity="0.7"/>
        <rect x="27" y="136" width="146" height="3.5" fill="#B43A2F" fillOpacity="0.7"/>
        <rect x="27" y="143" width="146" height="3.5" fill="#B43A2F" fillOpacity="0.7"/>
        {[31,43,55,67,79,91,103,115,127,139,151,163].map((x, i) => (
          <rect key={i} x={x} y="111" width="3.5" height="42" fill="#B43A2F" fillOpacity="0.7"/>
        ))}
      </g>
    </svg>
  );
}

export function HeroSection({ setActiveTab }) {
  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
      <div className="animate-fade-in-up flex flex-col items-start relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border-2 border-cafe mb-6 relative bg-white rotate-[-2deg]">
          <Icon name="vovo-fogo" size={14} className="text-tomate animate-micro-pulse" />
          <span className="text-xs font-medium text-cafe uppercase tracking-widest font-mono">
            Cozinha Aberta
          </span>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-creme-manteiga/80 backdrop-blur-sm rotate-[3deg]"/>
        </div>

        <h1 className="font-display font-medium text-4xl md:text-6xl text-cafe tracking-tight leading-[1.05] mb-6 relative">
          Salgadinho feito
          <br />
          <span className="relative inline-block">
            <span className="italic font-normal text-tomate">
              do jeito da vovó.
            </span>
            <svg className="absolute -bottom-2 left-0 w-full text-dourado" viewBox="0 0 200 12" fill="none">
              <path d="M2 9C50 2 150 2 198 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>

        <p className="text-base md:text-lg text-cafe/75 max-w-md font-light leading-relaxed mb-10">
          Coxinha quentinha, quibe crocante, bolinha de queijo e muito mais.
          Receita de família, feita na hora, entregue na sua porta.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('monte-seu-combo')}
            className="inline-flex items-center justify-center gap-2 bg-tomate text-white px-8 py-4 rounded-xl text-sm font-medium hover:bg-[#962f25] transition-colors shadow-[4px_4px_0px_0px_rgba(74,46,36,1)] hover:shadow-[2px_2px_0px_0px_rgba(74,46,36,1)] hover:translate-y-[2px] hover:translate-x-[2px]"
          >
            <Icon name="vovo-estrela" size={18} className="text-dourado" />
            Monte seu Combo
          </button>
          <button
            onClick={() => setActiveTab('cardapio')}
            className="inline-flex items-center justify-center gap-2 bg-creme-manteiga text-cafe border-2 border-cafe px-8 py-4 rounded-xl text-sm font-medium hover:bg-white transition-colors"
          >
            Ver o Cardápio
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-cafe/55 font-light">
          <Icon name="vovo-tempo" size={17} className="text-dourado" />
          Sai quentinho (aprox. 30–40 min)
        </div>
      </div>

      {/* Illustration column */}
      <div className="animate-fade-in-up [animation-delay:100ms] relative w-full aspect-square md:aspect-[4/3]">
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-creme-manteiga border-2 border-cafe shadow-[8px_8px_0px_0px_rgba(74,46,36,0.1)]">
          {/* Subtle xadrez background */}
          <div className="absolute inset-0 bg-xadrez opacity-60"/>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,250,245,0.85)_0%,transparent_72%)]"/>

          <div className="w-full h-full flex items-center justify-center p-6 md:p-12 relative overflow-hidden group">
            <BasketIllustration />
          </div>
        </div>

        {/* Spinning badge */}
        <div className="absolute bottom-3 left-3 md:-bottom-5 md:-left-7 w-28 h-28 animate-float drop-shadow-lg z-10">
          <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 animate-spin-slow text-cafe">
            <circle cx="50" cy="50" r="48" fill="#FCFAF5" stroke="currentColor" strokeWidth="1.5"/>
            <path id="spin-badge-curve" d="M 50 14 A 36 36 0 1 1 49.9 14" fill="transparent"/>
            <text fontSize="7.5" fontFamily="IBM Plex Mono, monospace" fontWeight="500" fill="#4A2E24" className="uppercase">
              <textPath href="#spin-badge-curve" startOffset="0%">• feito hoje • receita de vó •</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <VovoIcon size={36} />
          </div>
        </div>
      </div>
    </section>
  );
}
