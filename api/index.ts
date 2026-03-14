import type { IncomingMessage, ServerResponse } from 'node:http'
import { createApp } from '../src/server/app/create-app.js'

const app = createApp()

export default function handler(request: IncomingMessage & { url?: string }, response: ServerResponse) {
  if (request.url) {
    const url = new URL(request.url, 'http://localhost')
    request.url = url.pathname + url.search
  }
  return app(request, response)
}
