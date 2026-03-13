import type { Request } from 'express'

const SENSITIVE_KEY_PARTS = ['password', 'token', 'secret', 'cookie', 'authorization', 'session']

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isSensitiveKey(key: string) {
  const normalized = key.toLowerCase()
  return SENSITIVE_KEY_PARTS.some((part) => normalized.includes(part))
}

export function redactSensitiveValue(value: unknown, key = '', depth = 0): unknown {
  if (depth > 4) {
    return '[TRUNCATED]'
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveValue(item, key, depth + 1))
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => {
        if (isSensitiveKey(entryKey)) {
          return [entryKey, '[REDACTED]']
        }

        return [entryKey, redactSensitiveValue(entryValue, entryKey, depth + 1)]
      }),
    )
  }

  if (typeof value === 'string' && isSensitiveKey(key)) {
    return '[REDACTED]'
  }

  return value
}

export function buildSafeRequestLog(request: Request) {
  return {
    method: request.method,
    path: request.originalUrl,
    ip: request.ip,
    headers: redactSensitiveValue({
      origin: request.headers.origin,
      'user-agent': request.headers['user-agent'],
      cookie: request.headers.cookie,
      'x-forwarded-for': request.headers['x-forwarded-for'],
      'x-vercel-id': request.headers['x-vercel-id'],
    }),
    body: redactSensitiveValue(request.body),
  }
}
