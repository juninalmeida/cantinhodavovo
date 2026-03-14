import type { IncomingMessage, ServerResponse } from 'node:http'
import { createApp } from '../app/create-app.js'

const app = createApp()

function withLeadingSlash(value: string) {
  return value.startsWith('/') ? value : `/${value}`
}

function normalizePrefix(prefix: string) {
  const normalizedPrefix = withLeadingSlash(prefix)
  return normalizedPrefix.endsWith('/') ? normalizedPrefix.slice(0, -1) : normalizedPrefix
}

function buildUrlForPrefix(rawUrl: string | undefined, prefix: string) {
  const url = new URL(rawUrl ?? '/', 'http://localhost')
  const normalizedPrefix = normalizePrefix(prefix)
  const shortPrefix = normalizedPrefix.replace(/^\/api/, '') || '/'

  let suffix = url.pathname

  if (suffix.startsWith(normalizedPrefix)) {
    suffix = suffix.slice(normalizedPrefix.length) || '/'
  } else if (shortPrefix !== '/' && suffix.startsWith(shortPrefix)) {
    suffix = suffix.slice(shortPrefix.length) || '/'
  } else if (suffix === '/') {
    suffix = '/'
  }

  if (!suffix.startsWith('/')) {
    suffix = `/${suffix}`
  }

  return `${normalizedPrefix}${suffix === '/' ? '' : suffix}${url.search}`
}

export function createPrefixHandler(prefix: string) {
  return (request: IncomingMessage & { url?: string }, response: ServerResponse) => {
    request.url = buildUrlForPrefix(request.url, prefix)
    return app(request, response)
  }
}

export function createExactHandler(path: string) {
  const normalizedPath = withLeadingSlash(path)

  return (request: IncomingMessage & { url?: string }, response: ServerResponse) => {
    const url = new URL(request.url ?? normalizedPath, 'http://localhost')
    request.url = `${normalizedPath}${url.search}`
    return app(request, response)
  }
}
