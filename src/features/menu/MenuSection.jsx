import { useState } from 'react';
import { Icon } from '../../components/icons/Icon';
import { ProductCard } from './ProductCard';

const ALL_PRODUCTS = [
  {
    id: 1,
    category: 'salgados',
    name: 'Coxinha da Vovó Carmem',
    description: 'Massa fininha feita na mão, recheio de frango desfiado com tempero do quintal e catupiry caseiro. Frita na hora.',
    price: 7.90,
    badge: 'A favorita!',
    tag: 'fresca',
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1667868018725-36d4a1f32922?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    category: 'salgados',
    name: 'Quibe da Saudade',
    description: 'Carne moída temperada do jeito antigo, com hortelã e canela. Frito crocante por fora, macio por dentro.',
    price: 7.50,
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1667546202642-e3c506786caa?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    category: 'salgados',
    name: 'Bolinha de Queijo do Terreiro',
    description: 'Recheio de queijo meia-cura que derrete, cascão dourado e crocante. Chega quentinha pra você.',
    price: 6.90,
    tag: 'quentinha',
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1693086421089-847b0a2724f8?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    category: 'salgados',
    name: 'Enroladinho da Sorte',
    description: 'Massa folhada enrolada com carinho ao redor de linguiça artesanal. Douradinho do jeito que você gosta.',
    price: 7.00,
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1670357424576-beb4e3c43f56?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 5,
    category: 'salgados',
    name: 'Esfiha Aberta da Família',
    description: 'Massa grossa de forno, carne moída com cebola roxa e pimenta-síria. Receita que a família guarda a sete chaves.',
    price: 8.50,
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1694981405366-0ffd13044535?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 6,
    category: 'salgados',
    name: 'Risole da Comadre',
    description: 'Meia-lua crocante com recheio de camarão ao molho de tomate e coentro. Especial de toda semana.',
    price: 9.90,
    badge: 'Especial!',
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1667807515956-fbe501d03e26?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 7,
    category: 'lanches',
    name: 'Pastel de Carne Moída',
    description: 'Massa fininha e bem frita, recheada com carne moída temperada no alho, cebola e cheiro-verde. O clássico que nunca sai de moda.',
    price: 8.00,
    badge: 'O clássico!',
    tag: 'crocante',
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1667545409223-f67c693d91ff?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 8,
    category: 'lanches',
    name: 'Pastel de Queijo Muçarela',
    description: 'Queijo muçarela derretendo por dentro, massa sequinha e dourada por fora. Simples do jeito que a tradição manda.',
    price: 7.50,
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1761415381247-6144c36ea3c6?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 9,
    category: 'lanches',
    name: 'Coxinha de Frango c/ Catupiry',
    description: 'Massa de batata crocante por fora e macia por dentro, com frango desfiado e catupiry cremoso. A mais pedida da semana.',
    price: 9.50,
    badge: 'A mais pedida!',
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1764176479893-6590154dccc1?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 10,
    category: 'lanches',
    name: 'Risole de Frango com Queijo',
    description: 'Meia-lua dourada com recheio cremoso de frango desfiado, requeijão e temperos da casa. Frito fresquinho na hora.',
    price: 9.00,
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1668618295141-68d726813100?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 11,
    category: 'lanches',
    name: 'Tapioca de Carne Seca c/ Queijo Coalho',
    description: 'Tapioca artesanal com carne seca desfiada, queijo coalho grelhado e manteiga de garrafa. O Nordeste na sua mesa.',
    price: 14.00,
    badge: 'Novidade!',
    tag: 'nordestina',
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1681084014230-636f3e64c378?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 12,
    category: 'lanches',
    name: 'Tapioca de Frango c/ Catupiry',
    description: 'Tapioca cremosa com frango desfiado, catupiry derretido e um toque de ervas frescas. Leve, saborosa e feita na ordem.',
    price: 12.00,
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1725469970148-fe8eec0d5044?w=600&q=80&auto=format&fit=crop',
  },
];

const CATEGORIES = [
  { id: 'salgados', label: 'Salgados da Vovó', icon: 'vovo-fogo' },
  { id: 'lanches',  label: 'Salgados Especiais', icon: 'vovo-estrela' },
];

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('salgados');

  const filtered = ALL_PRODUCTS.filter(p => p.category === activeCategory);
  const counts = Object.fromEntries(
    CATEGORIES.map(c => [c.id, ALL_PRODUCTS.filter(p => p.category === c.id).length])
  );

  return (
    <section id="cardapio" className="max-w-7xl mx-auto px-6 py-20 relative">
      <svg className="absolute top-10 right-6 text-cafe/8 hidden md:block" width="96" height="96" viewBox="0 0 100 100" fill="none">
        <path d="M10 10 L90 10 L90 90 M20 20 L80 20 L80 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 relative z-10 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 text-tomate font-manual text-xl mb-2">
            <Icon name="vovo-panela" size={20} className="text-dourado" />
            Caderno de receitas
          </div>
          <h2 className="font-display font-medium text-3xl md:text-4xl tracking-tight text-cafe mb-2">
            Direto da panela pra você
          </h2>
          <p className="text-sm text-cafe/60 font-light flex items-center gap-2">
            <Icon name="vovo-estrela" size={14} className="text-tomate" />
            Tudo feito no momento, com tempero de família.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-medium border-2 hover-tato transition-all ${
                  isActive
                    ? 'bg-cafe text-creme-claro border-cafe shadow-[3px_3px_0px_0px_rgba(74,46,36,0.25)]'
                    : 'bg-white text-cafe border-cafe/10 hover:border-cafe'
                }`}
              >
                <Icon name={cat.icon} size={17} />
                {cat.label}
                <span className={`text-[10px] font-mono ml-1 px-1.5 py-0.5 rounded-sm ${
                  isActive ? 'bg-tomate text-white' : 'bg-creme-manteiga text-cafe'
                }`}>
                  {counts[cat.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-3 text-sm text-cafe/50 font-light">
        <div className="h-px flex-1 bg-cafe/8"/>
        <span className="font-manual text-xl text-cafe/40">Aproveite o cardápio da VoVó</span>
        <div className="h-px flex-1 bg-cafe/8"/>
      </div>
    </section>
  );
}
