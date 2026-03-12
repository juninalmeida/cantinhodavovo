import type { CatalogProduct } from '../../shared/contracts/app'
import { formatCurrency } from '../../shared/utils/money'
import { cn } from '../utils/cn'

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className={cn('group relative flex h-full flex-col rounded-2xl border-2 border-cafe/10 bg-white p-4 hover-tato hover:border-cafe')}>
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-cafe/5 bg-creme-manteiga">
        <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-[1.04]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-cafe/40">Sem imagem</div>
          )}
        </div>
      </div>

      <div className="flex flex-grow flex-col px-1">
        <h3 className="mb-1.5 font-display text-xl font-medium tracking-tight text-cafe">{product.name}</h3>
        <p className="mb-5 flex-grow text-sm font-light leading-relaxed text-cafe/60">{product.description}</p>

        <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-cafe/10 pt-4">
          <span className="font-mono text-xl font-medium text-tomate">{formatCurrency(product.price)}</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cafe bg-white text-cafe shadow-sm transition-all group-hover:border-tomate group-hover:bg-tomate group-hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  )
}
