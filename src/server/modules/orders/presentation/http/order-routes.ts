import { Router } from 'express'
import { z } from 'zod'
import {
  customerModes,
  paymentMethods,
} from '../../../../../shared/contracts/app.js'
import { env } from '../../../../core/config/env.js'
import { requireAuth, requireRole } from '../../../../core/middleware/auth.js'
import { cookieNames, readCookieValue } from '../../../../core/security/cookies.js'
import { createRateLimit } from '../../../../core/security/rate-limit.js'
import { requireTurnstile } from '../../../../core/security/turnstile.js'
import type { JwtService } from '../../../auth/infrastructure/token-service.js'
import type { OrderService } from '../../application/order-service.js'

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      notes: z.string().max(255).optional(),
    }),
  ).min(1),
  deliveryAddress: z.object({
    street: z.string().min(3),
    number: z.string().min(1),
    neighborhood: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    reference: z.string().max(255).optional(),
  }),
  paymentMethod: z.enum(paymentMethods),
  changeFor: z.number().positive().optional(),
  notes: z.string().max(255).optional(),
  customerMode: z.enum(customerModes),
  guestInfo: z
    .object({
      name: z.string().min(3),
      phone: z.string().min(8),
    })
    .optional(),
})

const updateStatusSchema = z.object({
  status: z.enum(['PROCESSING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED']),
})

const createOrderRateLimit = createRateLimit({
  bucket: 'orders:create',
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: 'Muitos pedidos enviados em pouco tempo. Aguarde alguns minutos e tente novamente.',
})

const publicTrackingRateLimit = createRateLimit({
  bucket: 'orders:tracking',
  windowMs: 5 * 60 * 1000,
  limit: env.NODE_ENV === 'development' ? 200 : 40,
  message: 'Muitas consultas de acompanhamento em pouco tempo. Aguarde e tente novamente.',
})

const updateStatusRateLimit = createRateLimit({
  bucket: 'orders:status',
  windowMs: 60 * 1000,
  limit: env.NODE_ENV === 'development' ? 240 : 90,
  message: 'Muitas atualizacoes de status em pouco tempo. Aguarde e tente novamente.',
})

const trackingCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^CV-[A-Z0-9]{6,20}$/, 'Codigo de acompanhamento invalido.')

export function createOrderRouter(orderService: OrderService, jwtService: JwtService) {
  const router = Router()

  router.post('/', createOrderRateLimit, requireTurnstile(), async (request, response) => {
    const input = createOrderSchema.parse(request.body)
    const userToken = readCookieValue(request.cookies, cookieNames.accessToken)
    const user = userToken ? jwtService.verifyAccessToken(userToken) : undefined
    const order = await orderService.createOrder(input, user)
    response.status(201).json({ order })
  })

  router.get('/public/:trackingCode', publicTrackingRateLimit, async (request, response) => {
    const rawTrackingCode = Array.isArray(request.params.trackingCode) ? request.params.trackingCode[0] : request.params.trackingCode
    const trackingCode = trackingCodeSchema.parse(rawTrackingCode)
    const order = await orderService.getPublicOrderByTrackingCode(trackingCode)
    response.json({ order })
  })

  router.get('/:id', requireAuth(jwtService), async (request, response) => {
    const orderId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id
    const order = await orderService.getOrderById(orderId, request.user!)
    response.json({ order })
  })

  router.patch(
    '/:id/status',
    updateStatusRateLimit,
    requireAuth(jwtService),
    requireRole(['ATTENDANT', 'ADMIN']),
    async (request, response) => {
      const input = updateStatusSchema.parse(request.body)
      const orderId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id
      const order = await orderService.updateStatus(orderId, input.status, request.user!)
      response.json({ order })
    },
  )

  return router
}
