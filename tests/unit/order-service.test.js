import { OrderService } from '../../dist-server/server/modules/orders/application/order-service.js'

let lastCreatedOrderInput = null

const catalogRepository = {
  async listActiveProducts() {
    return []
  },
  async findByIds() {
    return [
      {
        id: 'coxinha-vovo',
        categoryId: 'salgados',
        categoryName: 'Salgados',
        name: 'Coxinha',
        description: 'desc',
        price: 7.9,
        imageUrl: null,
      },
    ]
  },
}

const createdOrder = {
  id: 'order-1',
  userId: 'user-1',
  customerMode: 'AUTHENTICATED',
  trackingCode: 'CV-ABC123',
  status: 'PENDING',
  createdAt: new Date().toISOString(),
  total: 14.4,
  subtotal: 7.9,
  deliveryFee: 6.5,
  discount: 0,
  changeFor: null,
  paymentMethod: 'PIX',
  customerName: 'Maria Silva',
  deliveryAddress: {
    street: 'Rua A',
    number: '10',
    neighborhood: 'Centro',
    city: 'Maceio',
    state: 'AL',
  },
  items: [
    {
      id: 'item-1',
      productId: 'coxinha-vovo',
      productName: 'Coxinha',
      quantity: 1,
      unitPrice: 7.9,
      lineTotal: 7.9,
      notes: null,
    },
  ],
  history: [],
  notes: null,
}

const orderRepository = {
  async createOrder(input) {
    lastCreatedOrderInput = input
    return {
      ...createdOrder,
      trackingCode: input.trackingCode,
    }
  },
  async findById() {
    return createdOrder
  },
  async findByTrackingCode() {
    return createdOrder
  },
  async listByUserId() {
    return []
  },
  async listOperationalOrders() {
    return []
  },
  async listAllOrders() {
    return []
  },
  async updateStatus() {
    return { ...createdOrder, status: 'PROCESSING' }
  },
  async getMetrics() {
    return {
      totalOrders: 1,
      pendingOrders: 1,
      deliveredOrders: 0,
      totalRevenue: 14.4,
    }
  },
}

const auditLogs = {
  async record() {
    return undefined
  },
}

describe('OrderService validation', () => {
  it('rejects authenticated order without logged user', async () => {
    const service = new OrderService(catalogRepository, orderRepository, auditLogs)

    await expect(
      service.createOrder({
        customerMode: 'AUTHENTICATED',
        items: [{ productId: 'coxinha-vovo', quantity: 1 }],
        deliveryAddress: {
          street: 'Rua A',
          number: '10',
          neighborhood: 'Centro',
          city: 'Maceio',
          state: 'AL',
        },
        paymentMethod: 'PIX',
      }),
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it('requires guest data for visitor checkout', async () => {
    const service = new OrderService(catalogRepository, orderRepository, auditLogs)

    await expect(
      service.createOrder({
        customerMode: 'GUEST',
        items: [{ productId: 'coxinha-vovo', quantity: 1 }],
        deliveryAddress: {
          street: 'Rua A',
          number: '10',
          neighborhood: 'Centro',
          city: 'Maceio',
          state: 'AL',
        },
        paymentMethod: 'PIX',
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('requires change amount when payment is cash', async () => {
    const service = new OrderService(catalogRepository, orderRepository, auditLogs)

    await expect(
      service.createOrder(
        {
          customerMode: 'AUTHENTICATED',
          items: [{ productId: 'coxinha-vovo', quantity: 1 }],
          deliveryAddress: {
            street: 'Rua A',
            number: '10',
            neighborhood: 'Centro',
            city: 'Maceio',
            state: 'AL',
          },
          paymentMethod: 'CASH',
        },
        {
          id: 'user-1',
          name: 'Cliente',
          email: 'cliente@test.dev',
          phone: null,
          role: 'CUSTOMER',
        },
      ),
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('generates opaque tracking codes for newly created orders', async () => {
    const service = new OrderService(catalogRepository, orderRepository, auditLogs)

    await service.createOrder(
      {
        customerMode: 'AUTHENTICATED',
        items: [{ productId: 'coxinha-vovo', quantity: 1 }],
        deliveryAddress: {
          street: 'Rua A',
          number: '10',
          neighborhood: 'Centro',
          city: 'Maceio',
          state: 'AL',
        },
        paymentMethod: 'PIX',
      },
      {
        id: 'user-1',
        name: 'Cliente',
        email: 'cliente@test.dev',
        phone: null,
        role: 'CUSTOMER',
      },
    )

    expect(lastCreatedOrderInput.trackingCode).toMatch(/^CV-[A-F0-9]{12}$/)
  })

  it('returns a masked public payload for tracking lookups', async () => {
    const service = new OrderService(catalogRepository, orderRepository, auditLogs)

    const result = await service.getPublicOrderByTrackingCode('cv-abc123')

    expect(result).toEqual({
      trackingCode: createdOrder.trackingCode,
      status: createdOrder.status,
      createdAt: createdOrder.createdAt,
      total: createdOrder.total,
      customerName: 'Maria',
      history: createdOrder.history,
    })
  })
})
