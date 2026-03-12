import { useOrderStore } from '../../store/useOrderStore';
import { Icon } from '../../components/icons/Icon';
import { OrderTicket } from './OrderTicket';
import { cn } from '../../lib/utils';

const MASSA_OPTIONS = [
  { id: 'pastel', name: 'Pastel', price: 0, tag: 'Incluso', icon: 'ing-pastel' },
  { id: 'coxinha', name: 'Coxinha', price: 0, tag: 'Incluso', icon: 'ing-coxinha' },
  { id: 'tapioca', name: 'Tapioca', price: 2.00, tag: '+R$ 2,00', icon: 'ing-tapioca' },
  { id: 'enroladinho', name: 'Enroladinho', price: 0, tag: 'Incluso', icon: 'ing-enroladinho' },
  { id: 'rissole', name: 'Rissole', price: 0, tag: 'Incluso', icon: 'ing-rissole' },
];

const SABOR_OPTIONS = [
  { id: 'frango-catupiry', name: 'Frango c/ Catupiry', desc: 'Frango desfiado cremoso', price: 10.00, icon: 'ing-frango' },
  { id: 'carne-queijo', name: 'Carne Moída c/ Queijo', desc: 'Blend bovino temperado', price: 9.00, icon: 'ing-carne' },
  { id: 'queijo-mucarela', name: 'Queijo Muçarela', desc: 'Muçarela derretida', price: 7.00, icon: null },
  { id: 'camarao-cream', name: 'Camarão c/ Cream Cheese', desc: 'Camarão ao molho', price: 15.00, icon: null },
  { id: 'frango-simples', name: 'Frango Simples', desc: 'Temperado com ervas', price: 8.00, icon: 'ing-frango' },
  { id: 'calabresa-cebola', name: 'Calabresa c/ Cebola', desc: 'Calabresa artesanal', price: 9.00, icon: 'vovo-fogo' },
];

const ADDON_OPTIONS = [
  { id: 'catupiry-extra', name: 'Catupiry Extra', price: 3.00 },
  { id: 'queijo-extra', name: 'Queijo Extra', price: 2.00 },
  { id: 'bacon', name: 'Bacon', price: 4.00, icon: 'vovo-fogo' },
  { id: 'vinagrete', name: 'Vinagrete', price: 0 },
  { id: 'pimenta', name: 'Pimenta Biquinho', price: 2.00 },
  { id: 'molho-vovo', name: 'Molho da Vovó', price: 0, isSecret: true },
];

export function CustomizerSection() {
  const {
    selectedMassa, setMassa,
    selectedSabores, toggleSabor,
    addons, toggleAddon
  } = useOrderStore();

  return (
    <section id="monte-seu-combo" className="bg-caderno-receita border-y-2 border-cafe py-20 relative">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_400px] gap-12 relative z-10">

        <div>
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 text-tomate font-manual text-2xl mb-2">
              <Icon name="vovo-estrela" size={24} />
              A sua receita
            </div>
            <h2 className="font-display font-medium text-4xl tracking-tight text-cafe mb-3">
              Monte Seu Combo
            </h2>
            <p className="text-base text-cafe/70 font-light max-w-lg">
              Escolha a massa, o sabor e os ingredientes. A vovó monta do seu jeito.
            </p>
          </div>

          <form className="space-y-12">
            {/* Etapa 1: Massa */}
            <fieldset>
              <legend className="flex items-center gap-3 font-display font-medium text-2xl text-cafe mb-6 w-full">
                <span className="bg-white border-2 border-cafe text-cafe font-mono text-sm w-8 h-8 rounded-full flex items-center justify-center">
                  1
                </span>
                A Massa
              </legend>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {MASSA_OPTIONS.map(massa => {
                  const isSelected = selectedMassa.id === massa.id;
                  return (
                    <label key={massa.id} className="input-lanchonete relative cursor-pointer block">
                      <input
                        type="radio"
                        name="massa"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => setMassa(massa)}
                      />
                      <div className="card-ingrediente border-2 border-cafe/10 rounded-xl p-5 flex flex-col items-center text-center bg-white h-full relative overflow-hidden group">
                        <Icon name={massa.icon} size={48} className="ilustracao text-dourado mb-4" />
                        <span className="text-sm font-medium text-cafe block mb-1">
                          {massa.name}
                        </span>
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider font-mono",
                          isSelected ? "text-tomate" : "text-cafe/40"
                        )}>
                          {massa.tag}
                        </span>

                        <div className="marca-carimbo absolute top-3 right-3 hidden">
                          <Icon name="vovo-check" size={20} className="text-tomate" />
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Etapa 2: Sabor */}
            <fieldset>
              <legend className="flex items-center gap-3 font-display font-medium text-2xl text-cafe mb-6 w-full">
                <span className="bg-white border-2 border-cafe text-cafe font-mono text-sm w-8 h-8 rounded-full flex items-center justify-center">
                  2
                </span>
                O Sabor
                <span className="text-xs font-manual text-cafe/60 ml-2 mt-1">
                  Pode ser mais de um!
                </span>
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SABOR_OPTIONS.map(sabor => {
                  const isSelected = selectedSabores.some(s => s.id === sabor.id);
                  return (
                    <label key={sabor.id} className="input-lanchonete relative cursor-pointer block">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleSabor(sabor)}
                      />
                      <div className="card-ingrediente border-2 border-cafe/10 rounded-xl p-4 flex items-center gap-4 bg-white relative">
                        <div className="w-16 h-16 bg-creme-manteiga rounded-lg border border-cafe/10 flex items-center justify-center flex-shrink-0">
                          {sabor.icon
                            ? <Icon name={sabor.icon} size={32} className="ilustracao text-cafe" />
                            : <span className="text-2xl">🧀</span>
                          }
                        </div>
                        <div className="flex-grow pr-6">
                          <span className="text-sm font-medium text-cafe block">
                            {sabor.name}
                          </span>
                          <span className="text-xs text-cafe/60 block mb-1">
                            {sabor.desc}
                          </span>
                          <span className={cn(
                            "font-mono text-xs font-medium",
                            isSelected ? "text-tomate" : "text-cafe/50"
                          )}>
                            + R$ {sabor.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <div className="marca-carimbo absolute top-4 right-4 hidden">
                          <Icon name="vovo-check" size={20} className="text-tomate" />
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Etapa 3: Da Cozinha */}
            <fieldset>
              <legend className="flex items-center gap-3 font-display font-medium text-2xl text-cafe mb-6 w-full relative">
                <span className="bg-white border-2 border-cafe text-cafe font-mono text-sm w-8 h-8 rounded-full flex items-center justify-center">
                  3
                </span>
                Da Cozinha
              </legend>

              <div className="flex flex-wrap gap-3">
                {ADDON_OPTIONS.map(addon => {
                  const isSelected = addons.some(a => a.id === addon.id);
                  return (
                    <label key={addon.id} className="chip-ingrediente cursor-pointer relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleAddon(addon)}
                      />
                      <div className="px-5 py-2.5 rounded-full border-2 border-cafe/20 text-sm font-medium text-cafe bg-white transition-all hover:bg-creme-manteiga flex items-center gap-2">
                        {addon.icon && <Icon name={addon.icon} size={14} className="text-current" />}
                        {addon.name}
                        <span className="font-mono text-[10px] opacity-60">
                          {addon.price > 0 ? `+${addon.price.toFixed(2).replace('.', ',')}` : 'Grátis'}
                        </span>
                      </div>
                      {addon.isSecret && (
                        <span className="font-manual text-tomate text-lg absolute -top-4 -right-2 rotate-12">
                          Secreta!
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </form>
        </div>

        {/* Coluna Direita: Comanda */}
        <OrderTicket />
      </div>
    </section>
  );
}
