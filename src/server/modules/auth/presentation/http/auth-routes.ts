import { Router } from 'express'
import type { Response } from 'express'
import { z } from 'zod'
import { AppError } from '../../../../core/http/app-error.js'
import { env } from '../../../../core/config/env.js'
import { createRateLimit } from '../../../../core/security/rate-limit.js'
import { clearCsrfToken, csrfTokenHandler } from '../../../../core/security/csrf.js'
import {
  buildSessionCookieOptions,
  clearCookie,
  cookieNames,
  readCookieValue,
} from '../../../../core/security/cookies.js'
import { requireTurnstile } from '../../../../core/security/turnstile.js'
import type { AuthService } from '../../application/auth-service.js'
import type { AuthSession } from '../../domain/auth-types.js'

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8).optional(),
  password: z.string().min(8),
  defaultAddress: z.object({
    street: z.string().min(3),
    number: z.string().min(1),
    neighborhood: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    reference: z.string().max(255).optional(),
  }),
})

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
})

const loginRateLimit = createRateLimit({
  bucket: 'auth:login',
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === 'development' ? 100 : 20,
  message: 'Muitas tentativas de autenticacao. Aguarde alguns minutos e tente novamente.',
  keyGenerator: (request) => String(request.body?.email ?? 'anonymous'),
})

const registerRateLimit = createRateLimit({
  bucket: 'auth:register',
  windowMs: 30 * 60 * 1000,
  limit: env.NODE_ENV === 'development' ? 50 : 10,
  message: 'Muitos cadastros enviados em pouco tempo. Aguarde alguns minutos e tente novamente.',
  keyGenerator: (request) => String(request.body?.email ?? 'anonymous'),
})

const refreshRateLimit = createRateLimit({
  bucket: 'auth:refresh',
  windowMs: 10 * 60 * 1000,
  limit: env.NODE_ENV === 'development' ? 120 : 30,
  message: 'Muitas atualizacoes de sessao em pouco tempo. Tente novamente em instantes.',
})

interface SessionRestoreResult {
  session: AuthSession | null
  refreshed: boolean
}

export async function restoreSessionFromCookies(
  authService: AuthService,
  cookies: Record<string, unknown> | undefined,
): Promise<SessionRestoreResult> {
  const accessToken = readCookieValue(cookies, cookieNames.accessToken)
  const refreshToken = readCookieValue(cookies, cookieNames.refreshToken)

  if (accessToken) {
    try {
      const session = await authService.getSessionFromAccessToken(accessToken)
      return { session, refreshed: false }
    } catch (error) {
      if (!(error instanceof AppError) || error.statusCode !== 401) {
        throw error
      }
    }
  }

  if (!refreshToken) {
    return { session: null, refreshed: false }
  }

  try {
    const session = await authService.refresh(refreshToken)
    return { session, refreshed: true }
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 401) {
      return { session: null, refreshed: false }
    }

    throw error
  }
}

export function createAuthRouter(authService: AuthService) {
  const router = Router()
  const accessCookieMaxAge = env.ACCESS_TOKEN_TTL_MINUTES * 60 * 1000
  const refreshCookieMaxAge = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000

  const clearSessionTokens = (response: Response) => {
    clearCookie(response, cookieNames.accessToken, accessCookieMaxAge)
    clearCookie(response, cookieNames.refreshToken, refreshCookieMaxAge)
  }

  const clearSession = (response: Response) => {
    clearSessionTokens(response)
    clearCsrfToken(response)
  }

  const writeSession = (response: Response, session: Awaited<ReturnType<AuthService['login']>>) => {
    response.cookie(cookieNames.accessToken, session.accessToken, buildSessionCookieOptions(accessCookieMaxAge))
    response.cookie(cookieNames.refreshToken, session.refreshToken, buildSessionCookieOptions(refreshCookieMaxAge))
    response.status(200).json({ user: session.user, defaultAddress: session.defaultAddress ?? null })
  }

  const writeUnauthenticated = (response: Response) => {
    clearSessionTokens(response)
    response.status(200).json({ user: null, defaultAddress: null })
  }

  router.get('/csrf', csrfTokenHandler)

  router.post('/register', registerRateLimit, requireTurnstile(), async (request, response) => {
    const input = registerSchema.parse(request.body)
    const session = await authService.register(input)
    writeSession(response, session)
  })

  router.post('/login', loginRateLimit, requireTurnstile(), async (request, response) => {
    const input = loginSchema.parse(request.body)
    const session = await authService.login(input)
    writeSession(response, session)
  })

  router.post('/refresh', refreshRateLimit, async (request, response) => {
    const session = await authService.refresh(readCookieValue(request.cookies, cookieNames.refreshToken))
    writeSession(response, session)
  })

  router.post('/logout', refreshRateLimit, async (request, response) => {
    await authService.logout(readCookieValue(request.cookies, cookieNames.refreshToken))
    clearSession(response)
    response.status(204).send()
  })

  router.get('/me', async (request, response) => {
    const result = await restoreSessionFromCookies(authService, request.cookies)

    if (!result.session) {
      writeUnauthenticated(response)
      return
    }

    if (result.refreshed) {
      writeSession(response, result.session)
      return
    }

    response.json({ user: result.session.user, defaultAddress: result.session.defaultAddress ?? null })
  })

  return router
}
