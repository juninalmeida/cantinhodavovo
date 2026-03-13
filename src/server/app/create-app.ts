import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { createCatalogRouter } from '../modules/catalog/presentation/http/catalog-routes.js'
import { createAdminRouter } from '../modules/admin/presentation/http/admin-routes.js'
import { createAuthRouter } from '../modules/auth/presentation/http/auth-routes.js'
import { createOrderRouter } from '../modules/orders/presentation/http/order-routes.js'
import { env } from '../core/config/env.js'
import { requireAuth, requireRole } from '../core/middleware/auth.js'
import { errorHandler } from '../core/middleware/error-handler.js'
import { buildAppServices, type AppServices } from './build-services.js'

export function createApp(services: AppServices = buildAppServices()) {
  const app = express()

  const allowedOrigins =
    env.NODE_ENV === 'development'
      ? [env.CORS_ORIGIN, env.CORS_ORIGIN.replace(':5173', ':5174'), env.CORS_ORIGIN.replace(':5174', ':5173')]
      : [env.CORS_ORIGIN]

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error(`CORS bloqueado para origem: ${origin}`))
        }
      },
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
