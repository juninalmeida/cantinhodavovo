import { Router } from 'express'
import type { CatalogService } from '../application/catalog-service.js'

export function createCatalogRouter(catalogService: CatalogService) {
  const router = Router()

  router.get('/products', async (_request, response) => {
    const products = await catalogService.listProducts()
    response.json({ products })
  })

  router.get('/combo-options', async (_request, response) => {
    const comboOptions = await catalogService.listComboOptions()
    response.json({ comboOptions })
  })

  return router
}
