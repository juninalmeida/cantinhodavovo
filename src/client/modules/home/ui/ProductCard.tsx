import type { CatalogProduct } from '@shared/contracts/app'
import { formatCurrency } from '@shared/utils/money'
import { cn } from '@client/shared/utils'

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-cafe/10 bg-white',
        'shadow-[0_2px_12px_rgba(74,46,36,0.06)] transition-all duration-300',
        'hover:-translate-y-1 hover:border-cafe/20 hover:shadow-[0_8px_32px_rgba(74,46,36,0.12)]',
      )}
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden bg-creme-manteiga">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl opacity-30">🍽️</div>
        )}
        {/* Badge de categoria */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cafe/70 shadow-sm backdrop-blur-sm">
            {product.categoryName}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-grow flex-col p-5">
        <h3 className="mb-1.5 font-display text-xl font-medium leading-snug tracking-tight text-cafe">
          {product.name}
        </h3>
        <p className="mb-5 flex-grow text-sm font-light leading-relaxed text-cafe/60">
          {product.description}
        </p>

        {/* Preço e botão */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cafe/40">por apenas</p>
            <span className="font-mono text-2xl font-bold text-tomate">{formatCurrency(product.price)}</span>
          </div>
          <button
            type="button"
            aria-label={`Adicionar ${product.name} ao pedido`}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-cafe bg-white text-cafe shadow-[3px_3px_0px_0px_rgba(74,46,36,0.15)] transition-all duration-200 group-hover:border-tomate group-hover:bg-tomate group-hover:text-white group-hover:shadow-[3px_3px_0px_0px_rgba(193,44,44,0.25)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
