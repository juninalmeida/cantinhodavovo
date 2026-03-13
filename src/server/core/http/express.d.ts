import type { AuthenticatedUser } from '../../../shared/contracts/app.js'

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

export {}
