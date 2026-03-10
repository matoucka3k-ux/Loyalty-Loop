import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowRight, Loader2, User, Mail, Lock, Star } from 'lucide-react'
import Logo from '../../components/ui/Logo'

export default function JoinPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signup')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [merchantName, setMerchantName] = useState('')
  const [merchantId, setMerchantId] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useState(() => {
    const loadMerchant = async () => {
      const { data } = await supabase
        .from('merchants')
        .select('id, business_name')
        .eq('slug', slug)
        .single()
      if (data) {
        setMerchantName(data.business_name)
        setMerchantId(data.id)
      }
      setLoaded(true)
    }
    loadMerchant()
  }, [slug])

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    if (mode === 'signup' && !form.fullName) {
      setError('Veuillez entrer votre prénom')
      return
    }
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password
        })
        if (authError) throw authError

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        })
        if (signInError) throw signInError

        await supabase.from('profiles').insert({
          id: signInData.user.id,
          email: form.email,
          role: 'customer',
          full_name: form.fullName
        })

        if (merchantId) {
          await supabase.from('customers').insert({
            user_id: signInData.user.id,
            merchant_id: merchantId,
            points: 0
          })
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        })
        if (signInError) throw signInError
      }

      navigate('/client')
    } catch (e) {
      setError(e?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#fff7ed,#fafaf9)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:400}}>

        {/* HEADER */}
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
            <Logo />
          </div>
          {merchantName && (
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'white',border:'1px solid #fed7aa',borderRadius:99,marginBottom:16,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
              <Star style={{width:14,height:14,color:'#f97316',fill:'#f97316'}} />
              <span style={{fontSize:14,fontWeight:600,color:'#1c1917'}}>{merchantName}</span>
            </div>
          )}
          <h1 style={{fontSize:22,fontWeight:800,color:'#1c1917',marginBottom:8}}>
            {mode === 'signup' ? 'Rejoindre le programme' : 'Se connecter'}
          </h1>
          <p style={{color:'#78716c',fontSize:14}}>
            {mode === 'signup'
              ? 'Créez votre compte pour gagner des points à chaque visite'
              : 'Connectez-vous pour voir vos points'
            }
          </p>
        </div>

        {/* CARD */}
        <div style={{background:'white',borderRadius:20,padding:28,border:'1px solid #f5f5f4',boxShadow:'0 4px 24px -8px rgba(0,0,0,0.08)'}}>

          {/* TOGGLE */}
          <div style={{display:'flex',background:'#fafaf9',borderRadius:12,padding:4,marginBottom:24}}>
            {['signup','login'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                style={{flex:1,padding:'8px',borderRadius:10,border:'none',fontWeight:600,fontSize:13,cursor:'pointer',background:mode===m?'white':'transparent',color:mode===m?'#1c1917':'#78716c',boxShadow:mode===m?'0 1px 4px rgba(0,0,0,0.1)':'none',transition:'all 0.2s'}}>
                {m === 'signup' ? "S'inscrire" : 'Se connecter'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{background:'#fff1f2',border:'1px solid #fecdd3',borderRadius:10,padding:12,marginBottom:16,color:'#e11d48',fontSize:13}}>
              ⚠️ {error}
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {mode === 'signup' && (
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Votre prénom</label>
                <div style={{position:'relative'}}>
                  <User style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input name="fullName" value={form.fullName} onChange={handle}
                    placeholder="Marie" className="input-base" style={{paddingLeft:40}} />
                </div>
              </div>
            )}

            <div>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                <input name="email" type="email" value={form.email} onChange={handle}
                  placeholder="marie@exemple.fr" className="input-base" style={{paddingLeft:40}} />
              </div>
            </div>

            <div>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Mot de passe</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                <input name="password" type="password" value={form.password} onChange={handle}
                  placeholder="6 caractères minimum" className="input-base" style={{paddingLeft:40}} />
              </div>
            </div>

            <button onClick={submit} disabled={loading}
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'14px',background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',fontWeight:700,fontSize:15,borderRadius:12,border:'none',cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,marginTop:4}}>
              {loading
                ? <Loader2 style={{width:18,height:18,animation:'spin 1s linear infinite'}} />
                : <><ArrowRight style={{width:16,height:16}} /> {mode === 'signup' ? "Rejoindre le programme" : "Se connecter"}</>
              }
            </button>
          </div>

        </div>

        {/* FOOTER */}
        <p style={{textAlign:'center',fontSize:12,color:'#a8a29e',marginTop:16}}>
          Programme de fidélité propulsé par Loyalty Loop
        </p>

      </div>
    </div>
  )
}
