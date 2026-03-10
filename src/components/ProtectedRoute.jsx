import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, role }) {
  const { user, profile } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  
  if (role && profile?.role && profile.role !== role) {
    if (profile.role === 'merchant') return <Navigate to="/dashboard" replace />
    if (profile.role === 'customer') return <Navigate to="/client" replace />
  }

  return children
}
