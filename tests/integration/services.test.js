import { AdminService } from '../../dist-server/server/modules/admin/application/admin-service.js'
import { AuthService } from '../../dist-server/server/modules/auth/application/auth-service.js'
import { CatalogService } from '../../dist-server/server/modules/catalog/application/catalog-service.js'
import { PasswordService } from '../../dist-server/server/modules/auth/infrastructure/password-service.js'
import { JwtService } from '../../dist-server/server/modules/auth/infrastructure/token-service.js'
import { OrderService } from '../../dist-server/server/modules/orders/application/order-service.js'
import { AppError } from '../../dist-server/server/core/http/app-error.js'

function createUserRepository() {
  const users = []

  return {
    users,
    async create(input) {
      const user = {
        id: `user-${users.length + 1}`,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        passwordHash: input.passwordHash,
        role: input.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      users.push(user)
      return user
    },
    async findByEmail(email) {
      return users.find((user) => user.email === email.toLowerCase()) ?? null
    },
    async findById(id) {
      return users.find((user) => user.id === id) ?? null
    },
    async listAdminSummaries() {
      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        hasDefaultAddress: user.role === 'CUSTOMER',
      }))
    },
  }
}

function createRefreshTokenRepository() {
  const tokens = []

  return {
    async create(userId, tokenHash, expiresAt) {
      tokens.push({
        id: `rt-${tokens.length + 1}`,
        userId,
        tokenHash,
        expiresAt: expiresAt.toISOString(),
        revokedAt: null,
      })
    },
    async findActiveByTokenHash(tokenHash) {
      return (
        tokens.find((token) => token.tokenHash === tokenHash && !token.revokedAt && new Date(token.expiresAt).getTime() > Date.now()) ??
        null
      )
    },
    async revokeByTokenHash(tokenHash) {
      const token = tokens.find((item) => item.tokenHash === tokenHash && !item.revokedAt)
      if (token) {
        token.revokedAt = new Date().toISOString()
      }
    },
  }
}

function createAddressRepository() {
  const addresses = []

  return {
    async create(input) {
      const address = {
        id: `address-${addresses.length + 1}`,
        label: input.label ?? null,
        street: input.street,
        number: input.number,
        neighborhood: input.neighborhood,
        city: input.city,
        state: input.state,
        reference: input.reference ?? null,
        isDefault: Boolean(input.isDefault),
      }
      addresses.push({ ...address, userId: input.userId })
      return address
    },
    async findDefaultByUserId(userId) {
      const address = addresses.find((item) => item.userId === userId && item.isDefault)
      if (!address) {
        return null
      }

      const { userId: _userId, ...rest } = address
      return rest
    },
  }
}

function createCatalogRepository() {
  const products = [
    {
      id: 'coxinha-vovo',
      categoryId: 'salgados',
      categoryName: 'Salgados',
      name: 'Coxinha',
      description: 'desc',
      price: 7.9,
      imageUrl: null,
      productKind: 'MENU',
      comboGroup: null,
    },
    {
      id: 'massa-pastel',
      categoryId: 'massas',
      categoryName: 'Massas',
      name: 'Pastel',
      description: 'Massa do combo',
      price: 0,
      imageUrl: null,
      productKind: 'COMBO_COMPONENT',
      comboGroup: 'MASSA',
    },
  ]

  return {
    async listMenuProducts() {
      return products.filter((product) => product.productKind === 'MENU')
    },
    async listComboOptions() {
      return products
        .filter((product) => product.productKind === 'COMBO_COMPONENT')
        .map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          group: product.comboGroup,
        }))
    },
    async findByIds(ids) {
      return products.filter((product) => ids.includes(product.id))
    },
  }
}

function createOrderRepository() {
  const orders = []
  const toSummary = (order) => ({
    id: order.id,
    trackingCode: order.trackingCode,
    status: order.status,
    createdAt: order.createdAt,
    total: order.total,
    paymentMethod: order.paymentMethod,
    customerName: order.customerName,
  })

  return {
    orders,
    async createOrder(input) {
      const order = {
        id: `order-${orders.length + 1}`,
        userId: input.userId ?? null,
        customerMode: input.customerMode,
        trackingCode: input.trackingCode,
        status: input.status,
        createdAt: new Date().toISOString(),
        total: input.total,
        subtotal: input.subtotal,
        deliveryFee: input.deliveryFee,
        discount: input.discount,
        changeFor: input.changeFor ?? null,
        paymentMethod: input.paymentMethod,
        customerName: input.guestName ?? 'Cliente autenticado',
        deliveryAddress: input.deliveryAddress,
        items: input.items.map((item, index) => ({
          id: `item-${index + 1}`,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          notes: item.notes ?? null,
        })),
        history: [
          {
            fromStatus: null,
            toStatus: input.status,
            changedAt: new Date().toISOString(),
            changedByName: null,
          },
        ],
        notes: input.notes ?? null,
      }

      orders.push(order)
      return order
    },
    async findById(id) {
      return orders.find((order) => order.id === id) ?? null
    },
    async findByTrackingCode(trackingCode) {
      return orders.find((order) => order.trackingCode === trackingCode) ?? null
    },
    async listByUserId(userId) {
      return orders.filter((order) => order.userId === userId).map(toSummary)
    },
    async listOperationalOrders() {
      return orders.filter((order) => order.status !== 'DELIVERED').map(toSummary)
    },
    async listAllOrders() {
      return orders.map(toSummary)
    },
    async updateStatus(orderId, currentStatus, nextStatus, actor) {
      const order = orders.find((item) => item.id === orderId)
      if (!order) {
        throw new Error('ORDER_NOT_FOUND')
      }
      order.status = nextStatus
      order.history.push({
        fromStatus: currentStatus,
        toStatus: nextStatus,
        changedAt: new Date().toISOString(),
        changedByName: actor.name,
      })
      return order
    },
    async getMetrics() {
      return {
        totalOrders: orders.length,
        pendingOrders: orders.filter((order) => order.status === 'PENDING').length,
        deliveredOrders: orders.filter((order) => order.status === 'DELIVERED').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      }
    },
  }
}

function createAuditLogRepository() {
  return {
    entries: [],
    async record(entry) {
      this.entries.push(entry)
    },
  }
}

describe('service integration', () => {
  it('handles register, login, refresh and logout', async () => {
    const users = createUserRepository()
    const addresses = createAddressRepository()
    const refreshTokens = createRefreshTokenRepository()
    const authService = new AuthService(users, addresses, refreshTokens, new PasswordService(), new JwtService())

    const registerSession = await authService.register({
      name: 'Cliente',
      email: 'cliente@test.dev',
      phone: '82999999999',
      password: 'Senha@123',
      defaultAddress: {
        street: 'Rua A',
        number: '10',
        neighborhood: 'Centro',
        city: 'Maceió',
        state: 'AL',
      },
    })

    expect(registerSession.user.role).toBe('CUSTOMER')
    expect(registerSession.refreshToken).toBeTruthy()
    expect(registerSession.defaultAddress?.isDefault).toBe(true)

    const loginSession = await authService.login({
      email: 'cliente@test.dev',
      password: 'Senha@123',
    })

    expect(loginSession.user.email).toBe('cliente@test.dev')
    expect(loginSession.defaultAddress?.street).toBe('Rua A')

    const refreshedSession = await authService.refresh(loginSession.refreshToken)
    expect(refreshedSession.refreshToken).not.toBe(loginSession.refreshToken)

    await authService.logout(refreshedSession.refreshToken)

    await expect(authService.refresh(refreshedSession.refreshToken)).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('creates guest and authenticated orders, blocks customer updates, and aggregates admin metrics', async () => {
    const catalogRepository = createCatalogRepository()
    const orderRepository = createOrderRepository()
    const auditLogs = createAuditLogRepository()
    const userRepository = createUserRepository()
    const catalogService = new CatalogService(catalogRepository)
    const orderService = new OrderService(catalogRepository, orderRepository, auditLogs)
    const adminService = new AdminService(orderRepository, userRepository)

    await userRepository.create({
      name: 'Cliente',
      email: 'cliente@test.dev',
      phone: '82999999999',
      passwordHash: 'hash',
      role: 'CUSTOMER',
    })
    await userRepository.create({
      name: 'Atendente',
      email: 'atendente@test.dev',
      phone: '82999999998',
      passwordHash: 'hash',
      role: 'ATTENDANT',
    })
    await userRepository.create({
      name: 'Admin',
      email: 'admin@test.dev',
      phone: '82999999997',
      passwordHash: 'hash',
      role: 'ADMIN',
    })

    const customer = {
      id: 'customer-1',
      name: 'Cliente',
      email: 'cliente@test.dev',
      phone: '82999999999',
      role: 'CUSTOMER',
    }
    const attendant = {
      id: 'attendant-1',
      name: 'Atendente',
      email: 'atendente@test.dev',
      phone: '82999999998',
      role: 'ATTENDANT',
    }

    const guestOrder = await orderService.createOrder({
      customerMode: 'GUEST',
      guestInfo: { name: 'Visitante', phone: '82900000000' },
      items: [{ productId: 'coxinha-vovo', quantity: 1 }],
      deliveryAddress: {
        street: 'Rua A',
        number: '10',
        neighborhood: 'Centro',
        city: 'Maceio',
        state: 'AL',
      },
      paymentMethod: 'PIX',
    })

    const authenticatedOrder = await orderService.createOrder(
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
      customer,
    )

    expect(guestOrder.userId).toBeNull()
    expect(authenticatedOrder.userId).toBe('customer-1')

    await expect(orderService.getOrderById(guestOrder.id, customer)).rejects.toMatchObject({
      statusCode: 403,
    })

    const updatedOrder = await orderService.updateStatus(authenticatedOrder.id, 'PROCESSING', attendant)
    expect(updatedOrder.status).toBe('PROCESSING')

    const menuProducts = await catalogService.listProducts()
    const comboOptions = await catalogService.listComboOptions()

    expect(menuProducts).toHaveLength(1)
    expect(comboOptions).toHaveLength(1)

    const ownOrders = await orderService.listOwnOrders(customer.id)
    expect(ownOrders).toHaveLength(1)

    const metrics = await adminService.getMetrics()
    expect(metrics.totalOrders).toBe(2)
    expect(metrics.pendingOrders).toBe(1)

    const adminUsers = await adminService.listUsers()
    expect(adminUsers).toHaveLength(3)
  })
})
