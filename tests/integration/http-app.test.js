import { AppError } from '../../dist-server/server/core/http/app-error.js'
import { buildAllowedOrigins, ensureCorsOriginAllowed } from '../../dist-server/server/app/create-app.js'
import { restoreSessionFromCookies } from '../../dist-server/server/modules/auth/presentation/http/auth-routes.js'

function createAuthService(overrides = {}) {
  return {
    async refresh() {
      throw new Error('not used in this test')
    },
    async getSessionFromAccessToken() {
      throw new Error('not used in this test')
    },
    ...overrides,
  }
}

describe('http app integration', () => {
  it('allows localhost and 127.0.0.1 loopback origins in development', () => {
    const allowedOrigins = buildAllowedOrigins(['http://localhost:5173'], 'development')

    expect(allowedOrigins).toEqual(
      expect.arrayContaining([
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://[::1]:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://[::1]:5174',
      ]),
    )

    expect(() => ensureCorsOriginAllowed('http://localhost:5173', allowedOrigins)).not.toThrow()
    expect(() => ensureCorsOriginAllowed('http://127.0.0.1:5173', allowedOrigins)).not.toThrow()
  })

  it('blocks origins outside the local allowlist with a 403', async () => {
    expect.assertions(2)

    try {
      ensureCorsOriginAllowed('http://maliciosa.example.com', ['http://localhost:5173', 'http://127.0.0.1:5173'])
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
      expect(error).toMatchObject({
        statusCode: 403,
        message: 'CORS bloqueado para origem: http://maliciosa.example.com',
      })
    }
  })

  it('returns an unauthenticated session state when there are no cookies', async () => {
    const result = await restoreSessionFromCookies(createAuthService(), undefined)

    expect(result).toEqual({
      session: null,
      refreshed: false,
    })
  })

  it('restores the session from refresh token when access token is missing', async () => {
    const result = await restoreSessionFromCookies(
      createAuthService({
        async refresh(refreshToken) {
          expect(refreshToken).toBe('refresh-token-ok')

          return {
            user: {
              id: 'admin-1',
              name: 'Admin Teste',
              email: 'admin@test.dev',
              phone: null,
              role: 'ADMIN',
            },
            defaultAddress: null,
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          }
        },
      }),
      { cv_refresh_token: 'refresh-token-ok' },
    )

    expect(result).toEqual({
      session: {
        user: {
          id: 'admin-1',
          name: 'Admin Teste',
          email: 'admin@test.dev',
          phone: null,
          role: 'ADMIN',
        },
        defaultAddress: null,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      },
      refreshed: true,
    })
  })
})
