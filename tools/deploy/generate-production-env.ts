import { randomBytes } from 'node:crypto'

function generateSecret() {
  return randomBytes(32).toString('hex')
}

const accessSecret = generateSecret()
const refreshSecret = generateSecret()

console.log('Production secret generator')
console.log('')
console.log('Use these values in Vercel Environment Variables.')
console.log('Do not commit them to Git.')
console.log('')
console.log(`JWT_ACCESS_SECRET=${accessSecret}`)
console.log(`JWT_REFRESH_SECRET=${refreshSecret}`)
console.log('')
console.log('Suggested production env template:')
console.log('NODE_ENV=production')
console.log('APP_ORIGIN=https://SEU-PROJETO.vercel.app')
console.log('DATABASE_URL=cole_a_url_do_neon')
console.log(`JWT_ACCESS_SECRET=${accessSecret}`)
console.log(`JWT_REFRESH_SECRET=${refreshSecret}`)
console.log('COOKIE_SECURE=true')
console.log('UPSTASH_REDIS_REST_URL=cole_a_url_do_upstash')
console.log('UPSTASH_REDIS_REST_TOKEN=cole_o_token_do_upstash')
console.log('TURNSTILE_SITE_KEY=cole_a_site_key_do_cloudflare')
console.log('TURNSTILE_SECRET_KEY=cole_a_secret_key_do_cloudflare')
console.log('VITE_TURNSTILE_SITE_KEY=cole_a_site_key_do_cloudflare')
console.log('')
console.log('Next step:')
console.log('- Copy these values to Vercel > Project Settings > Environment Variables')
console.log('- After the first deploy, adjust APP_ORIGIN to the exact *.vercel.app URL if needed')
