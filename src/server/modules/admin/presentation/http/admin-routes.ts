import { Router } from 'express'
import { z } from 'zod'
import { customerModes, orderStatuses } from '../../../../../shared/contracts/app.js'
import { requireAuth, requireRole } from '../../../../core/middleware/auth.js'
import type { JwtService } from '../../../auth/infrastructure/token-service.js'
import type { AdminService } from '../../application/admin-service.js'

const adminOrdersFilterSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  customerMode: z.enum(customerModes).optional(),
  search: z.string().min(1).optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
})

export function createAdminRouter(adminService: AdminService, jwtService: JwtService) {
  const router = Router()

  router.use(requireAuth(jwtService), requireRole(['ADMIN']))

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
