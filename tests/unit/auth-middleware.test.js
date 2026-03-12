import { requireRole } from '../../dist-server/server/middleware/auth.js'

describe('requireRole middleware', () => {
  it('blocks users without the required role', () => {
    const middleware = requireRole(['ADMIN'])
    const next = jest.fn()

    middleware(
      {
        user: {
          id: 'user-1',
          name: 'Cliente',
          email: 'cliente@test.dev',
          phone: null,
          role: 'CUSTOMER',
        },
      },
      {},
      next,
    )

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }))
  })
})
