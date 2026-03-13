import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Address, AuthenticatedUser, DeliveryAddressInput } from '@shared/contracts/app'
import { authApi } from '@client/modules/auth/api/auth'

interface AuthContextValue {
  user: AuthenticatedUser | null
  defaultAddress: Address | null
  loading: boolean
  login: (input: { email: string; password: string; turnstileToken?: string }) => Promise<AuthenticatedUser>
  register: (input: {
    name: string
    email: string
    phone?: string
    password: string
    defaultAddress: DeliveryAddressInput
    turnstileToken?: string
  }) => Promise<AuthenticatedUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function restoreSession() {
      try {
        const { user, defaultAddress } = await authApi.me()
        if (!active) {
          return
        }

        setUser(user)
        setDefaultAddress(defaultAddress ?? null)
      } catch {
        if (active) {
          setUser(null)
          setDefaultAddress(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void restoreSession()
    return () => {
      active = false
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        defaultAddress,
        loading,
        async login(input) {
          const { user, defaultAddress } = await authApi.login(input)
          setUser(user)
          setDefaultAddress(defaultAddress ?? null)
          return user
        },
        async register(input) {
          const { user, defaultAddress } = await authApi.register(input)
          setUser(user)
          setDefaultAddress(defaultAddress ?? null)
          return user
        },
        async logout() {
          await authApi.logout()
          setUser(null)
          setDefaultAddress(null)
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
