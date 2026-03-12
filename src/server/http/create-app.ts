import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { CatalogService } from '../../modules/catalog/application/catalog-service.js'
import { PgCatalogRepository } from '../../modules/catalog/infrastructure/catalog-repository.js'
import { createCatalogRouter } from '../../modules/catalog/interface/catalog-routes.js'
import { AdminService } from '../../modules/admin/application/admin-service.js'
import { createAdminRouter } from '../../modules/admin/interface/admin-routes.js'
import { AuthService } from '../../modules/auth/application/auth-service.js'
import { PasswordService } from '../../modules/auth/infrastructure/password-service.js'
import { PgRefreshTokenRepository } from '../../modules/auth/infrastructure/refresh-token-repository.js'
import { JwtService } from '../../modules/auth/infrastructure/token-service.js'
import { createAuthRouter } from '../../modules/auth/interface/auth-routes.js'
import { OrderService } from '../../modules/orders/application/order-service.js'
import { PgOrderRepository } from '../../modules/orders/infrastructure/order-repository.js'
import { createOrderRouter } from '../../modules/orders/interface/order-routes.js'
import { PgUserRepository } from '../../modules/users/infrastructure/user-repository.js'
import { PgAddressRepository } from '../../modules/users/infrastructure/address-repository.js'
import { env } from '../config/env.js'
import { PgAuditLogRepository } from '../db/audit-log-repository.js'
import { dbPool } from '../db/pool.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { errorHandler } from '../middleware/error-handler.js'

export interface AppServices {
  authService: AuthService
  catalogService: CatalogService
  orderService: OrderService
  adminService: AdminService
  jwtService: JwtService
}

export function buildAppServices(): AppServices {
  const users = new PgUserRepository(dbPool)
  const addresses = new PgAddressRepository(dbPool)
  const refreshTokens = new PgRefreshTokenRepository(dbPool)
  const catalogRepository = new PgCatalogRepository(dbPool)
  const orderRepository = new PgOrderRepository(dbPool)
  const auditLogs = new PgAuditLogRepository(dbPool)
  const passwordService = new PasswordService()
  const jwtService = new JwtService()

  const authService = new AuthService(users, addresses, refreshTokens, passwordService, jwtService)
  const catalogService = new CatalogService(catalogRepository)
  const orderService = new OrderService(catalogRepository, orderRepository, auditLogs)
  const adminService = new AdminService(orderRepository)

  return {
    authService,
    catalogService,
    orderService,
    adminService,
    jwtService,
  }
}

export function createApp(services: AppServices = buildAppServices()) {
  const app = express()

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  )
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  )
  app.use(express.json())
  app.use(cookieParser())

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' })
  })

  app.use('/api/auth', createAuthRouter(services.authService))
  app.use('/api/catalog', createCatalogRouter(services.catalogService))
  app.use('/api/orders', createOrderRouter(services.orderService, services.jwtService))

  app.get('/api/me/orders', requireAuth(services.jwtService), requireRole(['CUSTOMER']), async (request, response) => {
    const orders = await services.orderService.listOwnOrders(request.user!.id)
    response.json({ orders })
  })

  app.get('/api/attendant/orders', requireAuth(services.jwtService), requireRole(['ATTENDANT', 'ADMIN']), async (_request, response) => {
    const orders = await services.orderService.listOperationalOrders()
    response.json({ orders })
  })

  app.use('/api/admin', createAdminRouter(services.adminService, services.jwtService))

  app.use(errorHandler)

  return app
}
