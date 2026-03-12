import { Icon } from '../icons/Icon';
import { VovoIcon } from '../icons/VovoIcon';

export function Header({ activeTab, setActiveTab }) {
  return (
    <header className="fixed w-full top-0 z-50 bg-creme-claro/92 backdrop-blur-md border-b border-cafe/10 transition-all duration-300">
      {/* Faixa xadrez no topo do header */}
      <div className="faixa-xadrez h-2 w-full"/>

      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-3">
        {/* Logo */}
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-full border-2 border-cafe flex items-center justify-center group-hover:border-tomate group-hover:bg-tomate/5 transition-all">
            <VovoIcon size={38} className="transition-transform"/>
          </div>
          <span className="font-display font-medium text-xl uppercase tracking-tighter text-cafe group-hover:text-tomate transition-colors leading-none">
            Cantinho da <span className="text-tomate">VóVó</span>
          </span>
        </button>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('cardapio')} 
            className={`text-sm font-medium transition-colors relative group ${activeTab === 'cardapio' ? 'text-tomate' : 'text-cafe/75 hover:text-tomate'}`}
          >
            Cardápio
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-tomate transition-all rounded-full ${activeTab === 'cardapio' ? 'w-full' : 'w-0 group-hover:w-full'}`}/>
          </button>
          <button 
            onClick={() => setActiveTab('monte-seu-combo')} 
            className={`text-sm font-medium flex items-center gap-1.5 relative ${activeTab === 'monte-seu-combo' ? 'text-tomate' : 'text-cafe/75 hover:text-tomate'}`}
          >
            <Icon name="vovo-estrela" size={13} className={activeTab === 'monte-seu-combo' ? 'text-dourado' : 'text-cafe/50 group-hover:text-dourado transition-colors'}/>
            Monte seu Combo
            {activeTab === 'monte-seu-combo' && (
              <svg width="40" height="4" className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-dourado" viewBox="0 0 40 4" fill="none">
                <path d="M1 2C10 -1 30 5 39 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('home')} 
            className={`text-sm font-medium transition-colors relative group ${activeTab === 'home' ? 'text-tomate' : 'text-cafe/75 hover:text-tomate'}`}
          >
            Nossa Cozinha
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-tomate transition-all rounded-full ${activeTab === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}/>
          </button>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/5582999419901"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-cafe/60 hover:text-tomate transition-colors border border-cafe/10 hover:border-tomate/30 px-3 py-1.5 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-verde-tempero animate-micro-pulse inline-block"/>
            (82) 99941-9901
          </a>
          <button className="relative flex items-center justify-center p-2 text-cafe hover:text-tomate transition-colors group">
            <Icon name="vovo-sacola" size={23} className="group-hover:-translate-y-0.5 transition-transform"/>
            <span className="absolute top-1 right-0 bg-tomate text-white text-[9px] font-mono font-medium w-4 h-4 rounded-full flex items-center justify-center border-2 border-creme-claro shadow-sm">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
