import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8faff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #dbeafe',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <p style={{ color: '#78716c', fontSize: 14 }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && profile?.role && profile.role !== role) {
    if (profile.role === 'merchant') return <Navigate to="/dashboard" replace />
    if (profile.role === 'customer') return <Navigate to="/client" replace />
  }

  if (role && !profile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8faff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #dbeafe',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <p style={{ color: '#78716c', fontSize: 14 }}>Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return children
}

