import type { CookieOptions, Response } from 'express'
import { env } from '../config/env.js'

const sameSitePolicy = env.NODE_ENV === 'production' ? 'strict' : 'lax'

export const cookieNames = {
  accessToken: env.NODE_ENV === 'production' ? '__Host-cv-access-token' : 'cv_access_token',
  refreshToken: env.NODE_ENV === 'production' ? '__Host-cv-refresh-token' : 'cv_refresh_token',
  csrfToken: env.NODE_ENV === 'production' ? '__Host-cv-csrf-token' : 'cv_csrf_token',
} as const

function buildBaseCookieOptions(maxAge: number): CookieOptions {
  return {
    sameSite: sameSitePolicy,
    secure: env.COOKIE_SECURE,
    maxAge,
    path: '/',
  }
}

export function buildSessionCookieOptions(maxAge: number): CookieOptions {
  return {
    ...buildBaseCookieOptions(maxAge),
    httpOnly: true,
  }
}

export function buildCsrfCookieOptions(maxAge: number): CookieOptions {
  return {
    ...buildBaseCookieOptions(maxAge),
    httpOnly: true,
  }
}

export function clearCookie(response: Response, name: string, maxAge: number) {
  response.clearCookie(name, buildSessionCookieOptions(maxAge))
}

export function readCookieValue(
  cookies: Record<string, unknown> | undefined,
  name: string,
): string | undefined {
  const value = cookies?.[name]
  return typeof value === 'string' ? value : undefined
}
