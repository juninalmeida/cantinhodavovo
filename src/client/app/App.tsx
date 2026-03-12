import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AppLayout } from '../layouts/AppLayout'
import { AdminAreaPage } from '../pages/AdminAreaPage'
import { AttendantAreaPage } from '../pages/AttendantAreaPage'
import { CustomerAreaPage } from '../pages/CustomerAreaPage'
import { ForbiddenPage } from '../pages/ForbiddenPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { OrderDetailPage } from '../pages/OrderDetailPage'
import { RegisterPage } from '../pages/RegisterPage'
import { TrackOrderPage } from '../pages/TrackOrderPage'

export function App() {
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
