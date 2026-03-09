import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Check, ArrowRight, QrCode, Star, Sparkles } from 'lucide-react'

export default function Onboarding() {
  const { merchant, profile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const steps = [
    { id: 1, title: 'Compte créé !', desc: 'Votre compte commerçant est prêt.', icon: '🎉', done: true },
    { id: 2, title: 'Configurez vos points', desc: 'Définissez combien de points vos clients gagnent par euro dépensé.', icon: '⭐', done: false },
    { id: 3, title: 'Votre QR code est prêt', desc: 'Affichez-le en caisse pour que vos clients puissent rejoindre votre programme.', icon: '📲', done: false },
  ]

  return (
    <div style={{minHeight:'100vh',background:'#fafaf9',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{maxWidth:560,width:'100%'}}>

        {/* HEADER */}
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontSize:48,marginBottom:16}}>🎉</div>
          <h1 style={{fontSize:28,fontWeight:800,color:'#1c1917',marginBottom:8}}>
            Bienvenue, {profile?.full_name?.split(' ')[0] || 'cher commerçant'} !
          </h1>
          <p style={{color:'#78716c',fontSize:16}}>
            <strong style={{color:'#f97316'}}>{merchant?.business_name}</strong> est maintenant sur Loyalty Loop.
          </p>
        </div>

        {/* STEPS */}
        <div style={{display:'flex',flexDirection:'column',gap:16,marginBottom:40}}>
          {steps.map((s, i) => (
            <div key={s.id} style={{display:'flex',alignItems:'center',gap:16,padding:20,background:'white',borderRadius:16,border: step === s.id ? '2px solid #f97316' : '2px solid #f5f5f4',boxShadow: step === s.id ? '0 8px 24px -8px rgba(249,115,22,0.2)' : 'none',transition:'all 0.2s'}}>
              <div style={{width:48,height:48,borderRadius:'50%',background: s.done || step > s.id ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#f5f5f4',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {s.done || step > s.id
                  ? <Check style={{width:20,height:20,color:'white'}} />
                  : <span style={{fontSize:20}}>{s.icon}</span>
                }
              </div>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,color:'#1c1917',marginBottom:4}}>{s.title}</p>
                <p style={{fontSize:13,color:'#78716c'}}>{s.desc}</p>
              </div>
              {step === s.id && (
                <div style={{width:8,height:8,borderRadius:'50%',background:'#f97316',flexShrink:0}} />
              )}
            </div>
          ))}
        </div>

        {/* CTA selon étape */}
        {step === 1 && (
          <div style={{textAlign:'center'}}>
            <button onClick={() => setStep(2)}
              style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',fontWeight:700,fontSize:16,borderRadius:12,border:'none',cursor:'pointer',boxShadow:'0 8px 24px -8px rgba(249,115,22,0.5)'}}>
              Commencer la configuration <ArrowRight style={{width:16,height:16}} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{background:'white',borderRadius:16,padding:28,border:'2px solid #f5f5f4'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
              <Star style={{width:20,height:20,color:'#f97316'}} />
              <h3 style={{fontWeight:700,color:'#1c1917',fontSize:16}}>Combien de points par euro ?</h3>
            </div>
            <div style={{display:'flex',gap:12,marginBottom:24}}>
              {[1,2,5,10].map(p => (
                <button key={p} onClick={() => {}}
                  style={{flex:1,padding:'12px',borderRadius:12,border:'2px solid #f5f5f4',background:'#fafaf9',fontWeight:700,fontSize:16,color:'#57534e',cursor:'pointer'}}>
                  {p}
                </button>
              ))}
            </div>
            <p style={{fontSize:13,color:'#a8a29e',marginBottom:20}}>Vous pourrez modifier ça à tout moment dans votre dashboard.</p>
            <button onClick={() => setStep(3)}
              style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',fontWeight:700,fontSize:15,borderRadius:12,border:'none',cursor:'pointer'}}>
              Continuer <ArrowRight style={{width:16,height:16}} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{background:'white',borderRadius:16,padding:28,border:'2px solid #f5f5f4',textAlign:'center'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'#fff7ed',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <QrCode style={{width:28,height:28,color:'#f97316'}} />
            </div>
            <h3 style={{fontWeight:700,color:'#1c1917',marginBottom:8}}>Votre QR code est prêt !</h3>
            <p style={{color:'#78716c',fontSize:14,marginBottom:24}}>Rendez-vous dans votre dashboard pour le télécharger et l'afficher en caisse.</p>
            <button onClick={() => navigate('/dashboard')}
              style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',fontWeight:700,fontSize:15,borderRadius:12,border:'none',cursor:'pointer'}}>
              <Sparkles style={{width:16,height:16}} />
              Accéder à mon dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
