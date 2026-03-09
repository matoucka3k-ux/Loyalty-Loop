import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, profile } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(form);
      setTimeout(() => {
        if (profile?.role === 'merchant') navigate('/dashboard');
        else navigate('/client');
      }, 500);
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fafaf9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <Logo size={36} />
        </div>
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            border: '1px solid #f5f5f4',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            padding: 32,
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#1c1917',
              marginBottom: 4,
            }}
          >
            Connexion
          </h1>
          <p style={{ color: '#78716c', fontSize: 14, marginBottom: 24 }}>
            Accédez à votre espace Loyalty Loop
          </p>
          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: '12px 16px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 12,
                color: '#dc2626',
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#44403c',
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="vous@exemple.fr"
                required
                className="input-base"
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#44403c',
                  marginBottom: 6,
                }}
              >
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  placeholder="••••••••"
                  required
                  className="input-base"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#a8a29e',
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: 16, height: 16 }} />
                  ) : (
                    <Eye style={{ width: 16, height: 16 }} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 14 }}
            >
              {loading ? (
                <Loader2
                  style={{
                    width: 16,
                    height: 16,
                    animation: 'spin 1s linear infinite',
                  }}
                />
              ) : (
                <>
                  Se connecter <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>
        </div>
        <p
          style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: 14,
            color: '#78716c',
          }}
        >
          Pas encore de compte ?{' '}
          <Link
            to="/signup"
            style={{
              color: '#f97316',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
