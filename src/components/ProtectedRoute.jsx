import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingSpinner size="lg" text="Chargement..." />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && profile && profile.role !== role) {
    if (profile.role === 'merchant')
      return <Navigate to="/dashboard" replace />;
    if (profile.role === 'customer') return <Navigate to="/client" replace />;
  }

  return children;
}
