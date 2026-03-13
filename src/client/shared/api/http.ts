import { clearCsrfTokenCache, getCsrfToken } from './csrf'

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly payload?: unknown,
  ) {
    super(message)
  }
}

interface RequestOptions extends RequestInit {
  body?: unknown
  turnstileToken?: string
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

async function executeRequest<T>(path: string, options: RequestOptions = {}, allowCsrfRetry = true): Promise<T> {
  const headers = new Headers(options.headers)
  const method = (options.method ?? 'GET').toUpperCase()

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (!SAFE_METHODS.has(method)) {
    headers.set('x-csrf-token', await getCsrfToken())
  }

  if (options.turnstileToken) {
    headers.set('x-turnstile-token', options.turnstileToken)
  }

  const response = await fetch(path, {
    ...options,
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 403 && payload?.code === 'CSRF_INVALID' && allowCsrfRetry) {
      await getCsrfToken(true)
      return executeRequest<T>(path, options, false)
    }

    const message = typeof payload?.message === 'string' ? payload.message : 'Falha na requisicao.'
    throw new HttpError(response.status, message, payload)
  }

  return payload as T
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const result = await executeRequest<T>(path, options)

  if (path === '/api/auth/logout') {
    clearCsrfTokenCache()
  }

  return result
}
