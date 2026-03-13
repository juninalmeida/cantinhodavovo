import { jest } from '@jest/globals'
import { cookieNames } from '../../dist-server/server/core/security/cookies.js'
import { csrfTokenHandler, requireCsrfProtection } from '../../dist-server/server/core/security/csrf.js'

function createResponse() {
  return {
    cookie: jest.fn(),
    json: jest.fn(),
  }
}

describe('http security integration', () => {
  it('issues a csrf token and stores it in a cookie', () => {
    const response = createResponse()

    csrfTokenHandler({ cookies: {} }, response)

    expect(response.cookie).toHaveBeenCalledWith(
      cookieNames.csrfToken,
      expect.stringMatching(/^[a-f0-9]{64}$/),
      expect.objectContaining({
        httpOnly: true,
        path: '/',
      }),
    )

    expect(response.json).toHaveBeenCalledWith({
      csrfToken: expect.stringMatching(/^[a-f0-9]{64}$/),
    })
  })

  it('rejects mutating requests with missing csrf header', () => {
    const middleware = requireCsrfProtection(['http://localhost:5173'])
    const next = jest.fn()

    middleware(
      {
        method: 'POST',
        path: '/api/auth/login',
        cookies: {
          [cookieNames.csrfToken]: 'a'.repeat(64),
        },
        headers: {
          origin: 'http://localhost:5173',
        },
        header() {
          return undefined
        },
      },
      {},
      next,
    )

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        code: 'CSRF_INVALID',
      }),
    )
  })

  it('allows mutating requests with matching csrf cookie and header', () => {
    const middleware = requireCsrfProtection(['http://localhost:5173'])
    const next = jest.fn()
    const token = 'b'.repeat(64)

    middleware(
      {
        method: 'POST',
        path: '/api/auth/login',
        cookies: {
          [cookieNames.csrfToken]: token,
        },
        headers: {
          origin: 'http://localhost:5173',
        },
        header(name) {
          return name === 'x-csrf-token' ? token : undefined
        },
      },
      {},
      next,
    )

    expect(next).toHaveBeenCalledWith()
  })
})
