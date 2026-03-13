import type { ComboOption } from '@shared/contracts/app'

const comboVisualMap: Record<string, Pick<ComboOption, 'iconKey' | 'tag'>> = {
  'massa-pastel': { iconKey: 'ing-pastel', tag: 'Incluso' },
  'massa-coxinha': { iconKey: 'ing-coxinha', tag: 'Incluso' },
  'massa-tapioca': { iconKey: 'ing-tapioca', tag: '+R$ 2,00' },
  'massa-enroladinho': { iconKey: 'ing-enroladinho', tag: 'Incluso' },
  'massa-rissole': { iconKey: 'ing-rissole', tag: 'Incluso' },
  'sabor-frango-catupiry': { iconKey: 'ing-frango' },
  'sabor-carne-queijo': { iconKey: 'ing-carne' },
  'sabor-frango-simples': { iconKey: 'ing-frango' },
  'sabor-calabresa-cebola': { iconKey: 'vovo-fogo' },
  'addon-bacon': { iconKey: 'vovo-fogo' },
  'addon-molho-vovo': { tag: 'Secreta!' },
}

export function decorateComboOption<T extends ComboOption>(option: T): T {
  return {
    ...option,
    ...comboVisualMap[option.id],
  }
}
