import { calculateOrderSnapshot, canTransitionOrderStatus, getNextOrderStatus } from '../../dist-server/server/modules/orders/domain/order-rules.js'

describe('order rules', () => {
  it('advances order statuses only to the immediate next status', () => {
    expect(getNextOrderStatus('PENDING')).toBe('PROCESSING')
    expect(canTransitionOrderStatus('READY', 'OUT_FOR_DELIVERY')).toBe(true)
    expect(canTransitionOrderStatus('PENDING', 'READY')).toBe(false)
    expect(getNextOrderStatus('DELIVERED')).toBeNull()
  })

  it('calculates snapshot totals from authoritative catalog data', () => {
    const snapshot = calculateOrderSnapshot(
      [
        { productId: 'coxinha-vovo', quantity: 2 },
        { productId: 'pastel-carne', quantity: 1, notes: 'sem pimenta' },
      ],
      [
        {
          id: 'coxinha-vovo',
          categoryId: 'salgados',
          categoryName: 'Salgados',
          name: 'Coxinha',
          description: 'desc',
          price: 7.9,
          imageUrl: null,
        },
        {
          id: 'pastel-carne',
          categoryId: 'especiais',
          categoryName: 'Especiais',
          name: 'Pastel',
          description: 'desc',
          price: 8,
          imageUrl: null,
        },
      ],
      6.5,
      0,
    )

    expect(snapshot.subtotal).toBe(23.8)
    expect(snapshot.deliveryFee).toBe(6.5)
    expect(snapshot.total).toBe(30.3)
    expect(snapshot.items[1].lineTotal).toBe(8)
  })
})
