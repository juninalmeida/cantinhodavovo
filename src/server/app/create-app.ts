import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import type { RequestHandler } from 'express'
import { AppError } from '../core/http/app-error.js'
import { createCatalogRouter } from '../modules/catalog/presentation/http/catalog-routes.js'
import { createAdminRouter } from '../modules/admin/presentation/http/admin-routes.js'
import { createAuthRouter } from '../modules/auth/presentation/http/auth-routes.js'
import { createOrderRouter } from '../modules/orders/presentation/http/order-routes.js'
import { env } from '../core/config/env.js'
import { requireAuth, requireRole } from '../core/middleware/auth.js'
import { errorHandler } from '../core/middleware/error-handler.js'
import { requireCsrfProtection } from '../core/security/csrf.js'
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

function withApiAliases(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const withoutApiPrefix = normalizedPath.startsWith('/api/')
    ? normalizedPath.replace(/^\/api/, '')
    : normalizedPath

  return [...new Set([normalizedPath, withoutApiPrefix])]
}

function mountWithApiAliases(app: express.Express, path: string, router: express.Router) {
  for (const alias of withApiAliases(path)) {
    app.use(alias, router)
  }
}

function getWithApiAliases(app: express.Express, path: string, ...handlers: RequestHandler[]) {
  for (const alias of withApiAliases(path)) {
    app.get(alias, ...handlers)
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
  const allowedOrigins = buildAllowedOrigins([env.APP_ORIGIN, env.FRONTEND_URL, env.CORS_ORIGIN], env.NODE_ENV)

  app.disable('x-powered-by')
  app.set('trust proxy', 1)

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
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  )
  app.use(express.json({ limit: '32kb' }))
  app.use(cookieParser())
  app.use(requireCsrfProtection(allowedOrigins))

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' })
  })
  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' })
  })

  mountWithApiAliases(app, '/api/auth', createAuthRouter(services.authService))

  const catalogRouter = createCatalogRouter(services.catalogService)
  mountWithApiAliases(app, '/api/catalog', catalogRouter)
  app.use('/', catalogRouter)

  mountWithApiAliases(app, '/api/orders', createOrderRouter(services.orderService, services.jwtService))

  getWithApiAliases(app, '/api/me/orders', requireAuth(services.jwtService), requireRole(['CUSTOMER']), async (request, response) => {
    const orders = await services.orderService.listOwnOrders(request.user!.id)
    response.json({ orders })
  })

  getWithApiAliases(app, '/api/attendant/orders', requireAuth(services.jwtService), requireRole(['ATTENDANT', 'ADMIN']), async (_request, response) => {
    const orders = await services.orderService.listOperationalOrders()
    response.json({ orders })
  })

  mountWithApiAliases(app, '/api/admin', createAdminRouter(services.adminService, services.jwtService))

  app.use(errorHandler)

  return app
}
