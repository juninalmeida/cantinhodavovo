import { Router } from 'express'
import { z } from 'zod'
import {
  customerModes,
  paymentMethods,
} from '../../../../../shared/contracts/app.js'
import { requireAuth, requireRole } from '../../../../core/middleware/auth.js'
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

export function createOrderRouter(orderService: OrderService, jwtService: JwtService) {
  const router = Router()

  router.post('/', async (request, response) => {
    const input = createOrderSchema.parse(request.body)
    const userToken = request.cookies?.cv_access_token
    const user = userToken ? jwtService.verifyAccessToken(userToken) : undefined
    const order = await orderService.createOrder(input, user)
    response.status(201).json({ order })
  })

  router.get('/public/:trackingCode', async (request, response) => {
    const trackingCode = Array.isArray(request.params.trackingCode) ? request.params.trackingCode[0] : request.params.trackingCode
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
