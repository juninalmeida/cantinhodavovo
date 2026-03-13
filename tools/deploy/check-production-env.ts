const REQUIRED_VARS = [
  'NODE_ENV',
  'APP_ORIGIN',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'COOKIE_SECURE',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'TURNSTILE_SITE_KEY',
  'TURNSTILE_SECRET_KEY',
  'VITE_TURNSTILE_SITE_KEY',
] as const

function fail(message: string) {
  console.error(message)
  process.exit(1)
}

function main() {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name])

  if (missing.length) {
    fail(`Missing production environment variables: ${missing.join(', ')}`)
  }

  if (process.env.NODE_ENV !== 'production') {
    fail('NODE_ENV must be set to production.')
  }

  if (!process.env.APP_ORIGIN?.startsWith('https://')) {
    fail('APP_ORIGIN must use https:// in production.')
  }

  if (process.env.COOKIE_SECURE !== 'true') {
    fail('COOKIE_SECURE must be true in production.')
  }

  console.log('Production environment looks complete.')
  console.log(`APP_ORIGIN=${process.env.APP_ORIGIN}`)
}

main()
