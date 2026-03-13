import { randomBytes, timingSafeEqual } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../http/app-error.js'
import { buildCsrfCookieOptions, cookieNames, readCookieValue } from './cookies.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const CSRF_TOKEN_MAX_AGE = 12 * 60 * 60 * 1000

function normalizeToken(value: string | undefined): string | null {
  if (!value || value.length < 32) {
    return null
  }

  return value
}

function tokensMatch(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)

  if (left.length !== right.length) {
    return false
  }

  return timingSafeEqual(left, right)
}

export function getCsrfTokenFromCookies(cookies: Record<string, unknown> | undefined) {
  return normalizeToken(readCookieValue(cookies, cookieNames.csrfToken))
}

export function issueCsrfToken(response: Response, existingToken?: string | null) {
  const token = existingToken ?? randomBytes(32).toString('hex')
  response.cookie(cookieNames.csrfToken, token, buildCsrfCookieOptions(CSRF_TOKEN_MAX_AGE))
  return token
}

export function clearCsrfToken(response: Response) {
  response.clearCookie(cookieNames.csrfToken, buildCsrfCookieOptions(CSRF_TOKEN_MAX_AGE))
}

export function csrfTokenHandler(request: Request, response: Response) {
  const token = issueCsrfToken(response, getCsrfTokenFromCookies(request.cookies))
  response.json({ csrfToken: token })
}

export function requireCsrfProtection(allowedOrigins: string[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (SAFE_METHODS.has(request.method.toUpperCase()) || request.path === '/api/auth/csrf') {
      next()
      return
    }

    const origin = request.headers.origin

    if (origin && !allowedOrigins.includes(origin)) {
      next(new AppError(403, 'Origem inválida para requisição autenticada.', 'CSRF_ORIGIN_INVALID'))
      return
    }

    const cookieToken = getCsrfTokenFromCookies(request.cookies)
    const headerToken = normalizeToken(request.header('x-csrf-token') ?? undefined)

    if (!cookieToken || !headerToken || !tokensMatch(cookieToken, headerToken)) {
      next(new AppError(403, 'Falha na validacao CSRF. Atualize a pagina e tente novamente.', 'CSRF_INVALID'))
      return
    }

    next()
  }
}
