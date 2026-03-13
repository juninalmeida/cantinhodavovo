import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

interface RateLimitStore {
  consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult>
}

interface RateLimitOptions {
  bucket: string
  limit: number
  windowMs: number
  message: string
  keyGenerator?: (request: Request) => string | string[]
}

const localWindows = new Map<string, { count: number; resetAt: number }>()

class MemoryRateLimitStore implements RateLimitStore {
  async consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now()
    const current = localWindows.get(key)

    if (!current || current.resetAt <= now) {
      localWindows.set(key, { count: 1, resetAt: now + windowMs })
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt: now + windowMs,
      }
    }

    current.count += 1

    return {
      allowed: current.count <= limit,
      remaining: Math.max(limit - current.count, 0),
      resetAt: current.resetAt,
    }
  }
}

class UpstashRateLimitStore implements RateLimitStore {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  private async command(parts: string[]): Promise<unknown> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/${parts.map((part) => encodeURIComponent(part)).join('/')}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Upstash request failed with status ${response.status}`)
    }

    const payload = (await response.json()) as { result?: unknown }
    return payload.result
  }

  async consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const namespacedKey = `rl:${key}`
    const count = Number(await this.command(['INCR', namespacedKey]))

    if (count === 1) {
      await this.command(['PEXPIRE', namespacedKey, String(windowMs)])
    }

    const ttl = Number(await this.command(['PTTL', namespacedKey]))

    return {
      allowed: count <= limit,
      remaining: Math.max(limit - count, 0),
      resetAt: Date.now() + (ttl > 0 ? ttl : windowMs),
    }
  }
}

const globalForRateLimit = globalThis as typeof globalThis & {
  __cantinhoDaVovoRateLimitStore?: RateLimitStore
}

function createStore(): RateLimitStore {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    return new UpstashRateLimitStore(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN)
  }

  return new MemoryRateLimitStore()
}

const rateLimitStore = globalForRateLimit.__cantinhoDaVovoRateLimitStore ?? createStore()

if (!globalForRateLimit.__cantinhoDaVovoRateLimitStore) {
  globalForRateLimit.__cantinhoDaVovoRateLimitStore = rateLimitStore
}

function normalizeRateLimitPart(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(':')
  }

  return value ?? 'anonymous'
}

export function getRequestIp(request: Request) {
  const forwarded = request.headers['x-forwarded-for']

  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }

  if (request.ip) {
    return request.ip
  }

  return request.socket.remoteAddress ?? 'unknown'
}

export function createRateLimit(options: RateLimitOptions) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const extraKeyPart = normalizeRateLimitPart(options.keyGenerator?.(request))
    const key = [options.bucket, getRequestIp(request), extraKeyPart]
      .filter(Boolean)
      .join(':')
      .toLowerCase()
      .slice(0, 240)

    try {
      const result = await rateLimitStore.consume(key, options.limit, options.windowMs)

      response.setHeader('X-RateLimit-Limit', String(options.limit))
      response.setHeader('X-RateLimit-Remaining', String(result.remaining))
      response.setHeader('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)))

      if (!result.allowed) {
        response.setHeader('Retry-After', String(Math.max(Math.ceil((result.resetAt - Date.now()) / 1000), 1)))
        response.status(429).json({
          message: options.message,
          code: 'RATE_LIMITED',
        })
        return
      }

      next()
    } catch (error) {
      console.error('Rate limit backend unavailable', error)
      next()
    }
  }
}
