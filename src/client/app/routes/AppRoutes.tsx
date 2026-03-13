import { lazy } from 'react'
import type { ComponentType } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@client/app/layout'
import { ForbiddenPage, NotFoundPage } from '@client/app/pages'
import { ProtectedRoute } from '@client/modules/auth'

function lazyPage<TModule extends Record<string, ComponentType<any>>>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  return lazy(async () => {
    const module = await loader()

    return {
      default: module[exportName] as ComponentType<any>,
    }
  })
}

const HomePage = lazyPage(() => import('@client/modules/home/pages/HomePage'), 'HomePage')
const LoginPage = lazyPage(() => import('@client/modules/auth/pages/LoginPage'), 'LoginPage')
const RegisterPage = lazyPage(() => import('@client/modules/auth/pages/RegisterPage'), 'RegisterPage')
const TrackOrderPage = lazyPage(() => import('@client/modules/orders/pages/TrackOrderPage'), 'TrackOrderPage')
const OrderDetailPage = lazyPage(() => import('@client/modules/orders/pages/OrderDetailPage'), 'OrderDetailPage')
const CustomerAreaPage = lazyPage(() => import('@client/modules/orders/pages/CustomerAreaPage'), 'CustomerAreaPage')
const AttendantAreaPage = lazyPage(() => import('@client/modules/orders/pages/AttendantAreaPage'), 'AttendantAreaPage')
const AdminAreaPage = lazyPage(() => import('@client/modules/admin/pages/AdminAreaPage'), 'AdminAreaPage')

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/acompanhar" element={<TrackOrderPage />} />
        <Route path="/acompanhar/:codigo" element={<TrackOrderPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/pedido/:id" element={<OrderDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
          <Route path="/area-cliente" element={<CustomerAreaPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ATTENDANT', 'ADMIN']} />}>
          <Route path="/area-atendente" element={<AttendantAreaPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/area-admin" element={<AdminAreaPage />} />
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
