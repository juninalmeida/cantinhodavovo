import { useMemo, useState } from 'react'
import type { CatalogProduct } from '../../shared/contracts/app'
import { Icon } from './icons/Icon'
import { ProductCard } from './ProductCard'

interface MenuSectionProps {
  products: CatalogProduct[]
  loading: boolean
  isExpanded: boolean
  onOpen: () => void
  onMinimize: () => void
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  salgados: 'vovo-fogo',
  especiais: 'vovo-estrela',
}

export function MenuSection({ products, loading, isExpanded, onOpen, onMinimize }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const map = new Map<string, string>()
    products.forEach((product) => {
      map.set(product.categoryId, product.categoryName)
    })
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }))
  }, [products])

  const filteredProducts = activeCategory === 'all' ? products : products.filter((product) => product.categoryId === activeCategory)

  return (
    <section id="cardapio" className="relative mx-auto max-w-7xl px-6 py-20">
      <svg className="absolute right-6 top-10 hidden text-cafe/8 md:block" width="96" height="96" viewBox="0 0 100 100" fill="none">
        <path d="M10 10 L90 10 L90 90 M20 20 L80 20 L80 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="relative z-10 mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 font-manual text-xl text-tomate">
            <Icon name="vovo-panela" size={20} className="text-dourado" />
            Caderno de receitas
          </div>
          <h2 className="mb-2 font-display text-3xl font-medium tracking-tight text-cafe md:text-4xl">Direto da panela pra você</h2>
          <p className="flex items-center gap-2 text-sm font-light text-cafe/60">
            <Icon name="vovo-estrela" size={14} className="text-tomate" />
            Tudo feito no momento, com tempero de família.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {!isExpanded ? null : (
            <>
              <button
                onClick={() => setActiveCategory('all')}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all md:px-5 md:py-2.5 ${
                  activeCategory === 'all'
                    ? 'border-cafe bg-cafe text-creme-claro shadow-[3px_3px_0px_0px_rgba(74,46,36,0.25)]'
                    : 'border-cafe/10 bg-white text-cafe hover:border-cafe'
                }`}
              >
                Todos
              </button>
              {categories.map((category) => {
                const isActive = activeCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all md:px-5 md:py-2.5 ${
                      isActive
                        ? 'border-cafe bg-cafe text-creme-claro shadow-[3px_3px_0px_0px_rgba(74,46,36,0.25)]'
                        : 'border-cafe/10 bg-white text-cafe hover:border-cafe'
                    }`}
                  >
                    <Icon name={CATEGORY_ICON_MAP[category.id] ?? 'vovo-estrela'} size={17} />
                    {category.label}
                  </button>
                )
              })}
              <button type="button" onClick={onMinimize} className="brand-pill">
                Ocultar o Cardápio e focar na Nossa Cozinha
              </button>
            </>
          )}
        </div>
      </div>

      {!isExpanded ? (
        <div className="rounded-2xl border-2 border-cafe/10 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(74,46,36,0.05)]">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-light text-cafe/60">
                O caderno de receitas fica recolhido até você abrir. São {products.length} delícias esperando por você.
              </p>
            </div>
            <button type="button" onClick={onOpen} className="button-secondary">
              Abrir o Cardápio
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-cafe/10 bg-white p-8 text-center text-cafe/60">Carregando o cardápio da VóVó...</div>
      ) : (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
