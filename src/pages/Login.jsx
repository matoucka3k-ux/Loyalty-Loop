import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/ui/Logo'
import { ArrowRight, Loader2, Mail, Lock } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    if (!form.email || !form.password) { setError('Veuillez remplir tous les champs'); return }
    setLoading(true); setError('')
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })
      if (authError) throw authError
      if (data?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
        if (profileData?.role === 'merchant') navigate('/dashboard')
        else navigate('/client')
      }
    } catch (e) {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#f8faff',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{marginBottom:16,display:'flex',justifyContent:'center'}}>
            <Logo />
          </div>
          <h1 style={{fontSize:24,fontWeight:800,color:'#1e3a5f',marginBottom:8}}>Connexion</h1>
          <p style={{color:'#78716c',fontSize:14}}>Accedez a votre espace FideliPain</p>
        </div>

        <div style={{background:'white',borderRadius:20,padding:32,border:'1px solid #dbeafe',boxShadow:'0 4px 24px -8px rgba(30,64,175,0.08)'}}>
          {error && (
            <div style={{background:'#fff1f2',border:'1px solid #fecdd3',borderRadius:10,padding:12,marginBottom:20,color:'#e11d48',fontSize:14}}>
              {error}
            </div>
          )}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                <input
                  name="email" type="email" value={form.email} onChange={handle}
                  placeholder="jean@boulangerie.fr" className="input-base"
                  style={{paddingLeft:40}}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                />
              </div>
            </div>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Mot de passe</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                <input
                  name="password" type="password" value={form.password} onChange={handle}
                  placeholder="••••••••" className="input-base"
                  style={{paddingLeft:40}}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                />
              </div>
            </div>
            <button
              onClick={submit} disabled={loading}
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'14px',background:'linear-gradient(135deg,#1e40af,#3b82f6)',color:'white',fontWeight:700,fontSize:15,borderRadius:12,border:'none',cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,marginTop:8}}>
              {loading
                ? <Loader2 style={{width:18,height:18,animation:'spin 1s linear infinite'}} />
                : <><ArrowRight style={{width:16,height:16}} /> Se connecter</>
              }
            </button>
          </div>
          <p style={{textAlign:'center',fontSize:13,color:'#a8a29e',marginTop:20}}>
            Pas encore de compte ?{' '}
            <Link to="/pricing" style={{color:'#1e40af',fontWeight:500,textDecoration:'none'}}>Essai gratuit</Link>
          </p>
        </div>
      </div>
    </div>
  )
}



