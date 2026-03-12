import { create } from 'zustand';

export const useOrderStore = create((set, get) => ({
  basePrice: 0,
  selectedMassa: { id: 'pastel', name: 'Pastel', price: 0 },
  selectedSabores: [],
  addons: [],

  setMassa: (massa) => set({ selectedMassa: massa }),

  toggleSabor: (sabor) => set((state) => {
    const exists = state.selectedSabores.find(s => s.id === sabor.id);
    if (exists) {
      return { selectedSabores: state.selectedSabores.filter(s => s.id !== sabor.id) };
    }
    return { selectedSabores: [...state.selectedSabores, sabor] };
  }),

  toggleAddon: (addon) => set((state) => {
    const exists = state.addons.find(a => a.id === addon.id);
    if (exists) {
      return { addons: state.addons.filter(a => a.id !== addon.id) };
    }
    return { addons: [...state.addons, addon] };
  }),

  getTotal: () => {
    const { basePrice, selectedMassa, selectedSabores, addons } = get();
    const saborTotal = selectedSabores.reduce((sum, s) => sum + s.price, 0);
    const addonTotal = addons.reduce((sum, a) => sum + a.price, 0);
    return basePrice + selectedMassa.price + saborTotal + addonTotal;
  }
}));
