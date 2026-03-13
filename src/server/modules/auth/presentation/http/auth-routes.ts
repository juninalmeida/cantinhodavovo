import { Router } from 'express'
import type { Response } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { AppError } from '../../../../core/http/app-error.js'
import { env } from '../../../../core/config/env.js'
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
  email: z.string().email(),
  password: z.string().min(8),
})

const authAttemptRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === 'development' ? 100 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_request, response) => {
    response.status(429).json({
      message: 'Muitas tentativas de autenticacao. Aguarde alguns minutos e tente novamente.',
    })
  },
})

function buildCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: env.COOKIE_SECURE,
    maxAge,
    path: '/',
  }
}

interface SessionRestoreResult {
  session: AuthSession | null
  refreshed: boolean
}

export async function restoreSessionFromCookies(
  authService: AuthService,
  cookies: { cv_access_token?: string; cv_refresh_token?: string } | undefined,
): Promise<SessionRestoreResult> {
  const accessToken = cookies?.cv_access_token
  const refreshToken = cookies?.cv_refresh_token

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

  const clearSession = (response: Response) => {
    response.clearCookie('cv_access_token', buildCookieOptions(accessCookieMaxAge))
    response.clearCookie('cv_refresh_token', buildCookieOptions(refreshCookieMaxAge))
  }

  const writeSession = (response: Response, session: Awaited<ReturnType<AuthService['login']>>) => {
    response.cookie('cv_access_token', session.accessToken, buildCookieOptions(accessCookieMaxAge))
    response.cookie('cv_refresh_token', session.refreshToken, buildCookieOptions(refreshCookieMaxAge))
    response.status(200).json({ user: session.user, defaultAddress: session.defaultAddress ?? null })
  }

  const writeUnauthenticated = (response: Response) => {
    clearSession(response)
    response.status(200).json({ user: null, defaultAddress: null })
  }

  router.post('/register', authAttemptRateLimit, async (request, response) => {
    const input = registerSchema.parse(request.body)
    const session = await authService.register(input)
    writeSession(response, session)
  })

  router.post('/login', authAttemptRateLimit, async (request, response) => {
    const input = loginSchema.parse(request.body)
    const session = await authService.login(input)
    writeSession(response, session)
  })

  router.post('/refresh', async (request, response) => {
    const session = await authService.refresh(request.cookies?.cv_refresh_token)
    writeSession(response, session)
  })

  router.post('/logout', async (request, response) => {
    await authService.logout(request.cookies?.cv_refresh_token)
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
