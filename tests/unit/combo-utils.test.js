import { buildComboOrderItems, groupComboOptions, isComboSelectionReady } from '../../dist-server/shared/utils/combo.js'

describe('combo utils', () => {
  it('validates the minimum combo selection', () => {
    expect(
      isComboSelectionReady({
        massaId: null,
        saborIds: ['sabor-frango-catupiry'],
        addonIds: [],
      }),
    ).toBe(false)

    expect(
      isComboSelectionReady({
        massaId: 'massa-pastel',
        saborIds: [],
        addonIds: [],
      }),
    ).toBe(false)

    expect(
      isComboSelectionReady({
        massaId: 'massa-pastel',
        saborIds: ['sabor-frango-catupiry'],
        addonIds: [],
      }),
    ).toBe(true)
  })

  it('transforms a combo selection into regular order items', () => {
    expect(
      buildComboOrderItems({
        massaId: 'massa-pastel',
        saborIds: ['sabor-frango-catupiry', 'sabor-queijo-mucarela'],
        addonIds: ['addon-bacon'],
      }),
    ).toEqual([
      { productId: 'massa-pastel', quantity: 1 },
      { productId: 'sabor-frango-catupiry', quantity: 1 },
      { productId: 'sabor-queijo-mucarela', quantity: 1 },
      { productId: 'addon-bacon', quantity: 1 },
    ])
  })

  it('groups combo options by the kitchen stages', () => {
    const grouped = groupComboOptions([
      { id: 'massa-pastel', name: 'Pastel', price: 0, group: 'MASSA' },
      { id: 'sabor-frango', name: 'Frango', price: 10, group: 'SABOR' },
      { id: 'addon-bacon', name: 'Bacon', price: 4, group: 'ADDON' },
    ])

    expect(grouped.massas).toHaveLength(1)
    expect(grouped.sabores).toHaveLength(1)
    expect(grouped.addons).toHaveLength(1)
  })
})
