import type { CatalogProduct, ComboOption } from '../../shared/contracts/app'
import { request } from './http'

interface CatalogResponse {
  products: CatalogProduct[]
}

interface ComboOptionsResponse {
  comboOptions: ComboOption[]
}

export const catalogApi = {
  listProducts() {
    return request<CatalogResponse>('/api/catalog/products')
  },
  listComboOptions() {
    return request<ComboOptionsResponse>('/api/catalog/combo-options')
  },
}
