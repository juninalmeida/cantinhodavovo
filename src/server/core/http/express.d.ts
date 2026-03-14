import type { AuthenticatedUser } from '../../../shared/contracts/app.js'

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser
  }
}

export {}
