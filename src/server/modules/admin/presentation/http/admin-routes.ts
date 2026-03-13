import { Router } from 'express'
import { z } from 'zod'
import { customerModes, orderStatuses } from '../../../../../shared/contracts/app.js'
import { env } from '../../../../core/config/env.js'
import { requireAuth, requireRole } from '../../../../core/middleware/auth.js'
import { createRateLimit } from '../../../../core/security/rate-limit.js'
import type { JwtService } from '../../../auth/infrastructure/token-service.js'
import type { AdminService } from '../../application/admin-service.js'

const adminOrdersFilterSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  customerMode: z.enum(customerModes).optional(),
  search: z.string().min(1).optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
})

const adminRateLimit = createRateLimit({
  bucket: 'admin:panel',
  windowMs: 60 * 1000,
  limit: env.NODE_ENV === 'development' ? 240 : 90,
  message: 'Muitas operacoes administrativas em pouco tempo. Aguarde e tente novamente.',
})

export function createAdminRouter(adminService: AdminService, jwtService: JwtService) {
  const router = Router()

  router.use(requireAuth(jwtService), requireRole(['ADMIN']))
  router.use(adminRateLimit)

  router.get('/orders', async (request, response) => {
    const filters = adminOrdersFilterSchema.parse(request.query)
    const orders = await adminService.listOrders(filters)
    response.json({ orders })
  })

  router.get('/metrics', async (_request, response) => {
    const metrics = await adminService.getMetrics()
    response.json({ metrics })
  })

  router.get('/users', async (_request, response) => {
    const users = await adminService.listUsers()
    response.json({ users })
  })

  return router
}
