import { CatalogService } from '../../dist-server/server/modules/catalog/application/catalog-service.js'

describe('CatalogService', () => {
  it('separates menu products from combo technical SKUs', async () => {
    const repository = {
      async listMenuProducts() {
        return [
          {
            id: 'coxinha-vovo',
            categoryId: 'salgados',
            categoryName: 'Salgados',
            name: 'Coxinha',
            description: 'desc',
            price: 7.9,
            imageUrl: null,
            productKind: 'MENU',
            comboGroup: null,
          },
        ]
      },
      async listComboOptions() {
        return [
          {
            id: 'massa-pastel',
            name: 'Pastel',
            price: 0,
            group: 'MASSA',
          },
        ]
      },
      async findByIds() {
        return []
      },
    }

    const service = new CatalogService(repository)

    await expect(service.listProducts()).resolves.toEqual([
      expect.objectContaining({ id: 'coxinha-vovo' }),
    ])

    await expect(service.listComboOptions()).resolves.toEqual([
      expect.objectContaining({ id: 'massa-pastel', group: 'MASSA' }),
    ])
  })
})
