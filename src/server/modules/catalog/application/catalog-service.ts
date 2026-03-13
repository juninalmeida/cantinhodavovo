import type { CatalogProduct, ComboOption } from '../../../../shared/contracts/app.js'
import type { CatalogRepository } from '../infrastructure/catalog-repository.js'

export class CatalogService {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async listProducts(): Promise<CatalogProduct[]> {
    return this.catalogRepository.listMenuProducts()
  }

  async listComboOptions(): Promise<ComboOption[]> {
    return this.catalogRepository.listComboOptions()
  }
}
