import type { ComboGroup, ProductKind } from '../../../shared/contracts/app.js'

export interface ProductRecord {
  id: string
  categoryId: string
  categoryName: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  productKind: ProductKind
  comboGroup: ComboGroup | null
}
