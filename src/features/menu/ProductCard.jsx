import { cn } from '../../lib/utils';

export function ProductCard({ product }) {
  const isAvailable = product.available;

  return (
    <article className={cn(
      "group bg-white rounded-2xl p-4 border-2 border-cafe/10 hover:border-cafe hover-tato relative flex flex-col h-full",
      !isAvailable && "opacity-60 grayscale-[0.4] hover:border-cafe/10 hover:translate-y-0 hover:shadow-none cursor-not-allowed"
    )}>
      {product.badge && isAvailable && (
        <div className="absolute top-5 -left-3 z-10 bg-dourado text-white font-manual text-lg px-3 py-1 rotate-[-4deg] shadow-md border border-cafe/20">
          {product.badge}
        </div>
      )}

      {!isAvailable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-2xl">
          <div className="border-4 border-cafe text-cafe font-display font-medium uppercase tracking-widest px-4 py-2 rotate-[-12deg] rounded-sm opacity-80">
            Acabou a fornada
          </div>
        </div>
      )}

      <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-creme-manteiga border border-cafe/5 relative">
        <div className="w-full h-full relative group-hover:scale-[1.04] transition-transform duration-700">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        {product.tag && isAvailable && (
          <span className="absolute bottom-2 right-2 z-10 bg-tomate/90 text-white text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm">
            {product.tag}
          </span>
        )}
      </div>

      <div className="px-1 flex flex-col flex-grow">
        <h3 className="font-display font-medium text-xl tracking-tight mb-1.5 text-cafe">
          {product.name}
        </h3>
        <p className="text-sm text-cafe/60 font-light leading-relaxed mb-5 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-cafe/10 mt-auto">
          <span className={cn(
            "font-mono font-medium text-xl",
            isAvailable ? "text-tomate" : "text-cafe/40"
          )}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {isAvailable && (
            <button className="w-10 h-10 rounded-full border-2 border-cafe text-cafe flex items-center justify-center group-hover:bg-tomate group-hover:text-white group-hover:border-tomate transition-all bg-white shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
