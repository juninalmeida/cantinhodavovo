import { AdminService } from '../modules/admin/application/admin-service.js'
import { AuthService } from '../modules/auth/application/auth-service.js'
import { PasswordService } from '../modules/auth/infrastructure/password-service.js'
import { PgRefreshTokenRepository } from '../modules/auth/infrastructure/refresh-token-repository.js'
import { JwtService } from '../modules/auth/infrastructure/token-service.js'
import { CatalogService } from '../modules/catalog/application/catalog-service.js'
import { PgCatalogRepository } from '../modules/catalog/infrastructure/catalog-repository.js'
import { OrderService } from '../modules/orders/application/order-service.js'
import { PgOrderRepository } from '../modules/orders/infrastructure/order-repository.js'
import { PgAddressRepository } from '../modules/users/infrastructure/address-repository.js'
import { PgUserRepository } from '../modules/users/infrastructure/user-repository.js'
import { PgAuditLogRepository } from '../core/database/audit-log-repository.js'
import { dbPool } from '../core/database/pool.js'

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

  return {
    authService: new AuthService(users, addresses, refreshTokens, passwordService, jwtService),
    catalogService: new CatalogService(catalogRepository),
    orderService: new OrderService(catalogRepository, orderRepository, auditLogs),
    adminService: new AdminService(orderRepository, users),
    jwtService,
  }
}
