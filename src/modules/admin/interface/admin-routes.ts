import { Router } from 'express'
import { requireAuth, requireRole } from '../../../server/middleware/auth.js'
import type { JwtService } from '../../auth/infrastructure/token-service.js'
import type { AdminService } from '../application/admin-service.js'

export function createAdminRouter(adminService: AdminService, jwtService: JwtService) {
  const router = Router()

  router.use(requireAuth(jwtService), requireRole(['ADMIN']))

  router.get('/orders', async (_request, response) => {
    const orders = await adminService.listOrders()
    response.json({ orders })
  })

  router.get('/metrics', async (_request, response) => {
    const metrics = await adminService.getMetrics()
    response.json({ metrics })
  })

  return router
}
