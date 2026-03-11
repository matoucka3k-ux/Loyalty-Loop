import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/ui/Logo'
import { ArrowRight, Loader2, User, Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', businessName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    const email = form.email.trim().toLowerCase()
    const password = form.password
    const fullName = form.fullName.trim()
    const businessName = form.businessName.trim()

    if (!fullName || !businessName || !email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caracteres')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: undefined }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Un compte existe deja avec cet email')
        } else {
          setError(authError.message)
        }
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Compte non cree, veuillez reessayer')
        setLoading(false)
        return
      }

      const userId = data.user.id
      const slug = businessName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '-' + Date.now()

      await supabase.from('profiles').insert({
        id: userId,
        email,
        role: 'merchant',
        full_name: fullName
      })

      await supabase.from('merchants').insert({
        user_id: userId,
        business_name: businessName,
        points_per_euro: 1,
        slug
      })

      if (data.session) {
        navigate('/onboarding')
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        navigate('/login')
        return
      }

      navigate('/onboarding')
    } catch (e) {
      setError(e?.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8faff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <Logo />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e3a5f', marginBottom: 8 }}>
            Creer votre compte
          </h1>
          <p style={{ color: '#78716c', fontSize: 14 }}>15 jours gratuits · Sans carte bancaire</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: 32,
          border: '1px solid #dbeafe',
          boxShadow: '0 4px 24px -8px rgba(30,64,175,0.08)',
        }}>
          {error && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 10,
              padding: 12,
              marginBottom: 20,
              color: '#e11d48',
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#44403c',
                marginBottom: 6,
              }}>
                Votre nom
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  color: '#a8a29e',
                }} />
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handle}
                  placeholder="Jean Dupont"
                  className="input-base"
                  style={{ paddingLeft: 40 }}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#44403c',
                marginBottom: 6,
              }}>
                Nom de votre boulangerie
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  color: '#a8a29e',
                }} />
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={handle}
                  placeholder="Boulangerie Martin"
                  className="input-base"
                  style={{ paddingLeft: 40 }}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#44403c',
                marginBottom: 6,
              }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  color: '#a8a29e',
                }} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="jean@boulangerie.fr"
                  className="input-base"
                  style={{ paddingLeft: 40 }}
                  autoComplete="email"
                  onKeyDown={e => e.key === 'Enter' && submit()}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#44403c',
                marginBottom: 6,
              }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  color: '#a8a29e',
                }} />
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  placeholder="6 caracteres minimum"
                  className="input-base"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  autoComplete="new-password"
                  onKeyDown={e => e.key === 'Enter' && submit()}
                />
                <button
                  onClick={() => setShowPwd(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#a8a29e',
                    padding: 0,
                  }}
                >
                  {showPwd
                    ? <EyeOff style={{ width: 16, height: 16 }} />
                    : <Eye style={{ width: 16, height: 16 }} />
                  }
                </button>
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
                color: 'white',
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 12,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: 8,
              }}
            >
              {loading
                ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                : <><ArrowRight style={{ width: 16, height: 16 }} /> Creer mon compte</>
              }
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#a8a29e', marginTop: 20 }}>
            Deja un compte ?{' '}
            <Link
              to="/login"
              style={{ color: '#1e40af', fontWeight: 500, textDecoration: 'none' }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}




