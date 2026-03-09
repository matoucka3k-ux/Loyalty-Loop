import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/ui/Logo'
import { ArrowRight, Loader2, User, Building2, Mail, Lock } from 'lucide-react'

export default function Signup() {
  const { signUpMerchant } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', businessName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    if (!form.fullName || !form.businessName || !form.email || !form.password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signUpMerchant(form)
      navigate('/onboarding')
    } catch (e) {
      setError(e.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#fafaf9',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{marginBottom:16,display:'flex',justifyContent:'center'}}>
            <Logo />
          </div>
          <h1 style={{fontSize:24,fontWeight:800,color:'#1c1917',marginBottom:8}}>Créer votre compte</h1>
          <p style={{color:'#78716c',fontSize:14}}>15 jours gratuits · Sans carte bancaire</p>
        </div>

        <div style={{background:'white',borderRadius:20,padding:32,border:'1px solid #f5f5f4',boxShadow:'0 4px 24px -8px rgba(0,0,0,0.08)'}}>
          {error && (
            <div style={{background:'#fff1f2',border:'1px solid #fecdd3',borderRadius:10,padding:12,marginBottom:20,color:'#e11d48',fontSize:14}}>
              {error}
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Votre nom</label>
              <div style={{position:'relative'}}>
                <User style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                <input name="fullName" value={form.fullName} onChange={handle}
                  placeholder="Jean Dupont" className="input-base" style={{paddingLeft:40}} />
              </div>
            </div>

            <div>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Nom de votre commerce</label>
              <div style={{position:'relative'}}>
                <Building2 style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                <input name="businessName" value={form.businessName} onChange={handle}
                  placeholder="Boulangerie Martin" className="input-base" style={{paddingLeft:40}} />
              </div>
            </div>

            <div>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                <input name="email" type="email" value={form.email} onChange={handle}
                  placeholder="jean@exemple.fr" className="input-base" style={{paddingLeft:40}} />
              </div>
            </div>

            <div>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Mot de passe</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                <input name="password" type="password" value={form.password} onChange={handle}
                  placeholder="8 caractères minimum" className="input-base" style={{paddingLeft:40}} />
              </div>
            </div>

            <button onClick={submit} disabled={loading}
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'14px',background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',fontWeight:700,fontSize:15,borderRadius:12,border:'none',cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,marginTop:8}}>
              {loading
                ? <Loader2 style={{width:18,height:18,animation:'spin 1s linear infinite'}} />
                : <><ArrowRight style={{width:16,height:16}} /> Créer mon compte</>
              }
            </button>
          </div>

          <p style={{textAlign:'center',fontSize:13,color:'#a8a29e',marginTop:20}}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{color:'#f97316',fontWeight:500,textDecoration:'none'}}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
