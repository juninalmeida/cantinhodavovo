import { AppError } from '../../dist-server/server/core/http/app-error.js'
import { buildAllowedOrigins, ensureCorsOriginAllowed } from '../../dist-server/server/app/create-app.js'

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
})
