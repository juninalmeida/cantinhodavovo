import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { AppError } from '../core/http/app-error.js'
import { createCatalogRouter } from '../modules/catalog/presentation/http/catalog-routes.js'
import { createAdminRouter } from '../modules/admin/presentation/http/admin-routes.js'
import { createAuthRouter } from '../modules/auth/presentation/http/auth-routes.js'
import { createOrderRouter } from '../modules/orders/presentation/http/order-routes.js'
import { env } from '../core/config/env.js'
import { requireAuth, requireRole } from '../core/middleware/auth.js'
import { errorHandler } from '../core/middleware/error-handler.js'
import { buildAppServices, type AppServices } from './build-services.js'

const loopbackHosts = ['localhost', '127.0.0.1', '[::1]'] as const
const viteDevPorts = ['5173', '5174'] as const

function isLoopbackHost(hostname: string) {
  return loopbackHosts.includes(hostname as (typeof loopbackHosts)[number])
}

function isViteDevPort(port: string) {
  return viteDevPorts.includes(port as (typeof viteDevPorts)[number])
}

function addOrigin(originSet: Set<string>, value: string) {
  originSet.add(new URL(value).origin)
}

function addLoopbackAliases(originSet: Set<string>, value: string) {
  const parsedOrigin = new URL(value)

  if (!isLoopbackHost(parsedOrigin.hostname)) {
    return
  }

  for (const host of loopbackHosts) {
    const hostVariant = new URL(parsedOrigin.origin)
    hostVariant.hostname = host
    addOrigin(originSet, hostVariant.origin)

    if (!isViteDevPort(parsedOrigin.port)) {
      continue
    }

    for (const port of viteDevPorts) {
      const viteVariant = new URL(hostVariant.origin)
      viteVariant.port = port
      addOrigin(originSet, viteVariant.origin)
    }
  }
}

export function buildAllowedOrigins(
  configuredOrigins: string[],
  nodeEnv: 'development' | 'test' | 'production',
) {
  const originSet = new Set<string>()

  for (const origin of configuredOrigins) {
    addOrigin(originSet, origin)

    if (nodeEnv === 'development') {
      addLoopbackAliases(originSet, origin)
    }
  }

  return [...originSet]
}

export function ensureCorsOriginAllowed(origin: string | undefined, allowedOrigins: string[]) {
  if (!origin || allowedOrigins.includes(origin)) {
    return
  }

  throw new AppError(403, `CORS bloqueado para origem: ${origin}`)
}

export function createApp(services: AppServices = buildAppServices()) {
  const app = express()
  const allowedOrigins = buildAllowedOrigins([env.FRONTEND_URL, env.CORS_ORIGIN], env.NODE_ENV)

  app.use(
    cors({
      origin: (origin, callback) => {
        try {
          ensureCorsOriginAllowed(origin, allowedOrigins)
          callback(null, true)
        } catch (error) {
          callback(error as Error)
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
