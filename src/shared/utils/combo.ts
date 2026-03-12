import type { ComboOption, OrderItemInput } from '../contracts/app.js'

export interface ComboSelection {
  massaId: string | null
  saborIds: string[]
  addonIds: string[]
}

export function isComboSelectionReady(selection: ComboSelection): boolean {
  return Boolean(selection.massaId) && selection.saborIds.length > 0
}

export function buildComboOrderItems(selection: ComboSelection): OrderItemInput[] {
  if (!isComboSelectionReady(selection)) {
    throw new Error('Combo invalido: escolha uma massa e pelo menos um sabor.')
  }

  return [
    { productId: selection.massaId!, quantity: 1 },
    ...selection.saborIds.map((productId) => ({ productId, quantity: 1 })),
    ...selection.addonIds.map((productId) => ({ productId, quantity: 1 })),
  ]
}

export function groupComboOptions(options: ComboOption[]) {
  return {
    massas: options.filter((option) => option.group === 'MASSA'),
    sabores: options.filter((option) => option.group === 'SABOR'),
    addons: options.filter((option) => option.group === 'ADDON'),
  }
}
