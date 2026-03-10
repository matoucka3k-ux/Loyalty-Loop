import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Check, ArrowRight, QrCode, Star, Sparkles, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const { merchant, profile, refreshMerchant } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [pointsPerEuro, setPointsPerEuro] = useState(1)
  const [saving, setSaving] = useState(false)

  const savePoints = async () => {
    setSaving(true)
    try {
      await supabase
        .from('merchants')
        .update({ points_per_euro: pointsPerEuro })
        .eq('id', merchant?.id)
      await refreshMerchant()
      setStep(3)
    } catch (e) {
      setStep(3)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#fff7ed,#fafaf9)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{maxWidth:520,width:'100%'}}>

        {/* PROGRESS BAR */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:40,justifyContent:'center'}}>
          {[1,2,3].map((s,i) => (
            <div key={s} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:32,height:32,borderRadius:'50%',background: step >= s ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#e7e5e4',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s'}}>
                {step > s
                  ? <Check style={{width:14,height:14,color:'white'}} />
                  : <span style={{fontSize:12,fontWeight:700,color: step >= s ? 'white' : '#a8a29e'}}>{s}</span>
                }
              </div>
              {i < 2 && <div style={{width:48,height:2,background: step > s ? '#f97316' : '#e7e5e4',transition:'all 0.3s'}} />}
            </div>
          ))}
        </div>

        {/* STEP 1 — BIENVENUE */}
        {step === 1 && (
          <div style={{background:'white',borderRadius:24,padding:40,border:'1px solid #f5f5f4',boxShadow:'0 20px 60px -20px rgba(249,115,22,0.15)',textAlign:'center'}}>
            <div style={{fontSize:64,marginBottom:16}}>🎉</div>
            <h1 style={{fontSize:28,fontWeight:800,color:'#1c1917',marginBottom:8}}>
              Bienvenue, {profile?.full_name?.split(' ')[0] || 'cher commerçant'} !
            </h1>
            <p style={{color:'#78716c',fontSize:16,marginBottom:8}}>
              <strong style={{color:'#f97316'}}>{merchant?.business_name}</strong> est maintenant sur Loyalty Loop.
            </p>
            <p style={{color:'#a8a29e',fontSize:14,marginBottom:32}}>
              Configurons votre programme de fidélité en 2 minutes.
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
              {[
                { icon:'⭐', text:'Définir vos points par euro' },
                { icon:'📲', text:'Obtenir votre QR code' },
                { icon:'🚀', text:'Accéder à votre dashboard' },
              ].map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#fafaf9',borderRadius:12}}>
                  <span style={{fontSize:20}}>{item.icon}</span>
                  <span style={{fontSize:14,color:'#44403c',fontWeight:500}}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)}
              style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',fontWeight:700,fontSize:16,borderRadius:12,border:'none',cursor:'pointer',boxShadow:'0 8px 24px -8px rgba(249,115,22,0.5)'}}>
              Commencer <ArrowRight style={{width:16,height:16}} />
            </button>
          </div>
        )}

        {/* STEP 2 — POINTS */}
        {step === 2 && (
          <div style={{background:'white',borderRadius:24,padding:40,border:'1px solid #f5f5f4',boxShadow:'0 20px 60px -20px rgba(249,115,22,0.15)'}}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{width:64,height:64,borderRadius:'50%',background:'#fff7ed',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <Star style={{width:28,height:28,color:'#f97316'}} />
              </div>
              <h2 style={{fontSize:22,fontWeight:800,color:'#1c1917',marginBottom:8}}>Combien de points par euro ?</h2>
              <p style={{color:'#78716c',fontSize:14}}>Vos clients gagneront ces points à chaque achat.</p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24}}>
              {[1,2,5,10].map(p => (
                <button key={p} onClick={() => setPointsPerEuro(p)}
                  style={{padding:'20px',borderRadius:16,border: pointsPerEuro === p ? '2px solid #f97316' : '2px solid #f5f5f4',background: pointsPerEuro === p ? '#fff7ed' : '#fafaf9',cursor:'pointer',transition:'all 0.2s'}}>
                  <div style={{fontSize:28,fontWeight:800,color: pointsPerEuro === p ? '#f97316' : '#1c1917',marginBottom:4}}>{p}</div>
                  <div style={{fontSize:12,color:'#78716c'}}>point{p>1?'s':''} / €</div>
                </button>
              ))}
            </div>

            <div style={{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:12,padding:16,marginBottom:24,textAlign:'center'}}>
              <p style={{fontSize:14,color:'#92400e'}}>
                Pour <strong>10€</strong> dépensés → client gagne <strong style={{color:'#f97316'}}>{pointsPerEuro * 10} points</strong>
              </p>
            </div>

            <p style={{fontSize:12,color:'#a8a29e',marginBottom:20,textAlign:'center'}}>Vous pourrez modifier ça à tout moment dans votre dashboard.</p>

            <button onClick={savePoints} disabled={saving}
              style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',fontWeight:700,fontSize:15,borderRadius:12,border:'none',cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1}}>
              {saving
                ? <Loader2 style={{width:18,height:18,animation:'spin 1s linear infinite'}} />
                : <><ArrowRight style={{width:16,height:16}} /> Enregistrer et continuer</>
              }
            </button>
          </div>
        )}

        {/* STEP 3 — QR CODE */}
        {step === 3 && (
          <div style={{background:'white',borderRadius:24,padding:40,border:'1px solid #f5f5f4',boxShadow:'0 20px 60px -20px rgba(249,115,22,0.15)',textAlign:'center'}}>
            <div style={{fontSize:64,marginBottom:16}}>📲</div>
            <h2 style={{fontSize:22,fontWeight:800,color:'#1c1917',marginBottom:8}}>Votre QR code est prêt !</h2>
            <p style={{color:'#78716c',fontSize:14,marginBottom:32}}>
              Affichez-le en caisse. Vos clients le scannent pour rejoindre votre programme et gagner des points.
            </p>

            <div style={{background:'#fafaf9',borderRadius:16,padding:24,marginBottom:24}}>
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'white',borderRadius:12,border:'1px solid #f5f5f4',marginBottom:12}}>
                <QrCode style={{width:20,height:20,color:'#f97316',flexShrink:0}} />
                <span style={{fontSize:13,color:'#78716c',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {window.location.origin}/join/{merchant?.slug}
                </span>
              </div>
              <p style={{fontSize:12,color:'#a8a29e'}}>Retrouvez et téléchargez votre QR code dans le dashboard → onglet "QR Code"</p>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
              {[
                { icon:'✅', text:`${pointsPerEuro} point${pointsPerEuro>1?'s':''} par euro configuré` },
                { icon:'✅', text:'QR code prêt à afficher' },
                { icon:'✅', text:'Programme actif immédiatement' },
              ].map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',background:'#f0fdf4',borderRadius:10}}>
                  <span>{item.icon}</span>
                  <span style={{fontSize:14,color:'#166534',fontWeight:500}}>{item.text}</span>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/dashboard')}
              style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',fontWeight:700,fontSize:16,borderRadius:12,border:'none',cursor:'pointer',boxShadow:'0 8px 24px -8px rgba(249,115,22,0.5)'}}>
              <Sparkles style={{width:16,height:16}} />
              Accéder à mon dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
