import type { AuthenticatedUser, UserRole } from '../../../../shared/contracts/app.js'

export interface UserRecord {
  id: string
  name: string
  email: string
  phone: string | null
  passwordHash: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export function toAuthenticatedUser(user: UserRecord): AuthenticatedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }
}
