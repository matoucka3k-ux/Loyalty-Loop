import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Pricing from './pages/Pricing'
import JoinPage from './pages/client/JoinPage'
import CustomerDashboard from './pages/client/CustomerDashboard'
import MerchantDashboard from './pages/dashboard/MerchantDashboard'

function HomeRedirect() {
  const { user, profile } = useAuth()
  if (!user) return <Landing />
  if (profile?.role === 'merchant') return <Navigate to="/dashboard" replace />
  if (profile?.role === 'customer') return <Navigate to="/client" replace />
  return <Landing />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/join/:slug" element={<JoinPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute role="merchant">
          <MerchantDashboard />
        </ProtectedRoute>
      } />
      <Route path="/client" element={
        <ProtectedRoute role="customer">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
