import { useOrderStore } from '../../store/useOrderStore';
import { Icon } from '../../components/icons/Icon';

const MASSA_ICON_MAP = {
  pastel: 'ing-pastel',
  coxinha: 'ing-coxinha',
  tapioca: 'ing-tapioca',
  enroladinho: 'ing-enroladinho',
  rissole: 'ing-rissole',
};

const SABOR_ICON_MAP = {
  'frango-catupiry': 'ing-frango',
  'carne-queijo': 'ing-carne',
  'frango-simples': 'ing-frango',
  'calabresa-cebola': 'vovo-fogo',
};

export function OrderTicket() {
  const { selectedMassa, selectedSabores, addons, getTotal } = useOrderStore();
  const total = getTotal();

  return (
    <div className="lg:sticky lg:top-28 h-max">
      <div className="bg-creme-claro shadow-[12px_12px_0px_0px_rgba(74,46,36,0.05)] relative w-full border-2 border-cafe">
        <div className="borda-comanda"></div>

        <div className="p-8 pb-10">
          <div className="text-center mb-8 border-b-2 border-dashed border-cafe/20 pb-6 relative">
            <Icon name="vovo-ramo" size={40} className="absolute -top-4 right-0 text-tomate/20 rotate-[-15deg]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cafe/60 mb-2 block">
              Pedido #042
            </span>
            <h3 className="font-display font-medium text-3xl text-cafe">
              Anotado!
            </h3>
          </div>

          <div className="space-y-4 font-mono text-sm text-cafe mb-8">
            {/* Massa */}
            <div className="flex justify-between items-end">
              <span className="relative before:content-[''] before:absolute before:bottom-1 before:left-0 before:w-full before:border-b-2 before:border-dotted before:border-cafe/20 flex-grow">
                <span className="bg-creme-claro pr-2 relative z-10 flex items-center gap-2">
                  <Icon name={MASSA_ICON_MAP[selectedMassa.id] ?? 'ing-pastel'} size={14} />
                  {selectedMassa.name}
                </span>
              </span>
              <span className="pl-2 bg-creme-claro relative z-10">
                {selectedMassa.price.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Sabores */}
            {selectedSabores.map(sabor => (
              <div key={sabor.id} className="flex justify-between items-end text-tomate font-medium">
                <span className="relative before:content-[''] before:absolute before:bottom-1 before:left-0 before:w-full before:border-b-2 before:border-dotted before:border-tomate/20 flex-grow">
                  <span className="bg-creme-claro pr-2 relative z-10 flex items-center gap-2">
                    {SABOR_ICON_MAP[sabor.id] && (
                      <Icon name={SABOR_ICON_MAP[sabor.id]} size={14} />
                    )}
                    1x {sabor.name}
                  </span>
                </span>
                <span className="pl-2 bg-creme-claro relative z-10">
                  {sabor.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}

            {/* Extras da Cozinha */}
            {addons.map(addon => (
              <div key={addon.id} className="flex justify-between items-end">
                <span className="relative before:content-[''] before:absolute before:bottom-1 before:left-0 before:w-full before:border-b-2 before:border-dotted before:border-cafe/20 flex-grow">
                  <span className="bg-creme-claro pr-2 relative z-10">
                    + {addon.name}
                  </span>
                </span>
                <span className="pl-2 bg-creme-claro relative z-10">
                  {addon.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}

            {selectedSabores.length === 0 && addons.length === 0 && (
              <p className="text-cafe/40 text-xs text-center py-2 font-manual">
                Escolha o sabor e os extras...
              </p>
            )}
          </div>

          <div className="border-t-2 border-cafe pt-6 mb-8 flex justify-between items-end">
            <span className="font-manual text-2xl text-cafe">Total</span>
            <span className="font-mono text-3xl font-medium text-tomate">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button className="w-full bg-tomate text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 border-2 border-cafe shadow-[4px_4px_0px_0px_rgba(74,46,36,1)] hover:shadow-[2px_2px_0px_0px_rgba(74,46,36,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all group">
            Pôr na sacola
            <Icon name="vovo-sacola" size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
