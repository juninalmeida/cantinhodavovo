import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'
import { AppError } from '../http/app-error.js'
import { getRequestIp } from './rate-limit.js'

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyTurnstileToken(token: string | undefined, remoteIp?: string) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return
  }

  if (!token) {
    throw new AppError(400, 'Complete a verificacao anti-bot para continuar.', 'TURNSTILE_REQUIRED')
  }

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  })

  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    throw new AppError(503, 'Nao foi possivel validar a verificacao anti-bot agora.', 'TURNSTILE_UNAVAILABLE')
  }

  const payload = (await response.json()) as TurnstileVerifyResponse

  if (!payload.success) {
    throw new AppError(403, 'Verificacao anti-bot invalida. Tente novamente.', 'TURNSTILE_INVALID')
  }
}

export function requireTurnstile() {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      await verifyTurnstileToken(request.header('x-turnstile-token') ?? undefined, getRequestIp(request))
      next()
    } catch (error) {
      next(error as Error)
    }
  }
}
