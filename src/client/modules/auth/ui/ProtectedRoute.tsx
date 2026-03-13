import type { UserRole } from '@shared/contracts/app'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@client/modules/auth/hooks/useAuth'

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="page-shell">Carregando sessão...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
