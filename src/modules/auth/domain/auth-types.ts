import type { Address, AuthenticatedUser } from '../../../shared/contracts/app.js'

export interface AuthSession {
  user: AuthenticatedUser
  defaultAddress?: Address | null
  accessToken: string
  refreshToken: string
}
