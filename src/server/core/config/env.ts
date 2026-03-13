import 'dotenv/config'
import { z } from 'zod'

const booleanString = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => (value === undefined ? undefined : value === 'true'))

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  APP_ORIGIN: z.string().url().default('http://localhost:5173'),
  FRONTEND_URL: z.string().url().optional(),
  CORS_ORIGIN: z.string().url().optional(),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().positive().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().positive().default(7),
  COOKIE_SECURE: booleanString,
  DEFAULT_DELIVERY_FEE: z.coerce.number().nonnegative().default(6.5),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
})

const parsedEnv = envSchema.parse(process.env)

export const env = {
  ...parsedEnv,
  FRONTEND_URL: parsedEnv.FRONTEND_URL ?? parsedEnv.APP_ORIGIN,
  CORS_ORIGIN: parsedEnv.CORS_ORIGIN ?? parsedEnv.APP_ORIGIN,
  COOKIE_SECURE: parsedEnv.COOKIE_SECURE ?? parsedEnv.NODE_ENV === 'production',
}

if (env.NODE_ENV === 'production') {
  const missing = [
    !env.UPSTASH_REDIS_REST_URL && 'UPSTASH_REDIS_REST_URL',
    !env.UPSTASH_REDIS_REST_TOKEN && 'UPSTASH_REDIS_REST_TOKEN',
    !env.TURNSTILE_SITE_KEY && 'TURNSTILE_SITE_KEY',
    !env.TURNSTILE_SECRET_KEY && 'TURNSTILE_SECRET_KEY',
  ].filter(Boolean)

  if (missing.length) {
    throw new Error(`Missing production environment variables: ${missing.join(', ')}`)
  }
}
