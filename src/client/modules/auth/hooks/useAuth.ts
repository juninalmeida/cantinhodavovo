import { useContext } from 'react'
import { AuthContext } from '@client/modules/auth/state/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
