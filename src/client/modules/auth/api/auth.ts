import type { Address, AuthenticatedUser, DeliveryAddressInput } from '@shared/contracts/app'
import { request } from '@client/shared/api'

interface SessionResponse {
  user: AuthenticatedUser
  defaultAddress?: Address | null
}

interface SessionStateResponse {
  user: AuthenticatedUser | null
  defaultAddress?: Address | null
}

export const authApi = {
  login(input: { email: string; password: string }) {
    return request<SessionResponse>('/api/auth/login', { method: 'POST', body: input })
  },
  register(input: { name: string; email: string; phone?: string; password: string; defaultAddress: DeliveryAddressInput }) {
    return request<SessionResponse>('/api/auth/register', { method: 'POST', body: input })
  },
  refresh() {
    return request<SessionResponse>('/api/auth/refresh', { method: 'POST' })
  },
  me() {
    return request<SessionStateResponse>('/api/auth/me')
  },
  logout() {
    return request<void>('/api/auth/logout', { method: 'POST' })
  },
}
