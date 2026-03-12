import { Router } from 'express'
import type { Response } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { env } from '../../../server/config/env.js'
import type { AuthService } from '../application/auth-service.js'

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

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
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

export function createAuthRouter(authService: AuthService) {
  const router = Router()
  const accessCookieMaxAge = env.ACCESS_TOKEN_TTL_MINUTES * 60 * 1000
  const refreshCookieMaxAge = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000

  const writeSession = (response: Response, session: Awaited<ReturnType<AuthService['login']>>) => {
    response.cookie('cv_access_token', session.accessToken, buildCookieOptions(accessCookieMaxAge))
    response.cookie('cv_refresh_token', session.refreshToken, buildCookieOptions(refreshCookieMaxAge))
    response.status(200).json({ user: session.user, defaultAddress: session.defaultAddress ?? null })
  }

  router.use(authRateLimit)

  router.post('/register', async (request, response) => {
    const input = registerSchema.parse(request.body)
    const session = await authService.register(input)
    writeSession(response, session)
  })

  router.post('/login', async (request, response) => {
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
    response.clearCookie('cv_access_token', buildCookieOptions(accessCookieMaxAge))
    response.clearCookie('cv_refresh_token', buildCookieOptions(refreshCookieMaxAge))
    response.status(204).send()
  })

  router.get('/me', async (request, response) => {
    const accessToken = request.cookies?.cv_access_token

    if (!accessToken) {
      response.status(401).json({ message: 'Não autenticado.' })
      return
    }

    const session = await authService.getSessionFromAccessToken(accessToken)
    response.json({ user: session.user, defaultAddress: session.defaultAddress ?? null })
  })

  return router
}
