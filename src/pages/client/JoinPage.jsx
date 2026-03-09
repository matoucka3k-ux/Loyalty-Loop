import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMerchantBySlug } from '../../services/customerService';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';
import { ArrowRight, Gift, Star, Loader2, Eye, EyeOff } from 'lucide-react';

export default function JoinPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { signUpCustomer, signIn, user, profile } = useAuth();

  const [merchant, setMerchant] = useState(null);
  const [loadingMerchant, setLoadingMerchant] = useState(true);
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMerchantBySlug(slug);
        setMerchant(data || { business_name: 'Commerce partenaire', id: null });
      } catch (e) {
        setMerchant({ business_name: 'Commerce partenaire', id: null });
      } finally {
        setLoadingMerchant(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'merchant') navigate('/dashboard');
      else navigate('/client');
    }
  }, [user, profile]);

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpCustomer({ ...form, merchantId: merchant?.id });
      } else {
        await signIn({ email: form.email, password: form.password });
      }
      navigate('/client');
    } catch (err) {
      setError(
        mode === 'signup'
          ? 'Erreur lors de la création du compte'
          : 'Email ou mot de passe incorrect'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingMerchant)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '2px solid #fed7aa',
            borderTopColor: '#f97316',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#fff7ed,white,#fffbeb)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <Logo size={32} />
      </div>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div
          style={{
            background: 'linear-gradient(135deg,#f97316,#ea580c)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {merchant?.business_name?.[0] || '🏪'}
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
            {merchant?.business_name}
          </h1>
          <p style={{ color: '#fed7aa', fontSize: 14 }}>
            Rejoignez le programme de fidélité !
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginTop: 16,
            }}
          >
            {[
              { icon: Star, text: 'Gagnez des points' },
              { icon: Gift, text: 'Débloquez des cadeaux' },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  color: '#fed7aa',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <b.icon style={{ width: 16, height: 16, color: 'white' }} />
                </div>
                <span style={{ fontSize: 11 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid #f5f5f4',
            padding: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              background: '#f5f5f4',
              borderRadius: 12,
              padding: 4,
              marginBottom: 20,
            }}
          >
            {['signup', 'login'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: mode === m ? 'white' : 'transparent',
                  color: mode === m ? '#1c1917' : '#78716c',
                }}
              >
                {m === 'signup' ? 'Créer un compte' : 'Se connecter'}
              </button>
            ))}
          </div>
          {error && (
            <div
              style={{
                marginBottom: 16,
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
            {mode === 'signup' && (
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#44403c',
                    marginBottom: 6,
                  }}
                >
                  Prénom et nom
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handle}
                  placeholder="Marie Dupont"
                  required
                  className="input-base"
                />
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
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
                placeholder="marie@exemple.fr"
                required
                className="input-base"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
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
                  minLength={6}
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
                  {mode === 'signup'
                    ? 'Rejoindre le programme'
                    : 'Se connecter'}{' '}
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
