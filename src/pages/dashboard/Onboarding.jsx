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
      await supabase.from('merchants').update({ points_per_euro: pointsPerEuro }).eq('id', merchant?.id)
      await refreshMerchant()
      setStep(3)
    } catch (e) { setStep(3) }
    finally { setSaving(false) }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#eff6ff,#f8faff)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{maxWidth:520,width:'100%'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:40,justifyContent:'center'}}>
          {[1,2,3].map((s,i) => (
            <div key={s} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:step>=s?'linear-gradient(135deg,#1e40af,#3b82f6)':'#e7e5e4',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s'}}>
                {step>s ? <Check style={{width:14,height:14,color:'white'}} /> : <span style={{fontSize:12,fontWeight:700,color:step>=s?'white':'#a8a29e'}}>{s}</span>}
              </div>
              {i<2 && <div style={{width:48,height:2,background:step>s?'#3b82f6':'#e7e5e4',transition:'all 0.3s'}} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{background:'white',borderRadius:24,padding:40,border:'1px solid #dbeafe',boxShadow:'0 20px 60px -20px rgba(30,64,175,0.15)',textAlign:'center'}}>
            <div style={{fontSize:64,marginBottom:16}}>🥐</div>
            <h1 style={{fontSize:28,fontWeight:800,color:'#1e3a5f',marginBottom:8}}>Bienvenue, {profile?.full_name?.split(' ')[0]} !</h1>
            <p style={{color:'#78716c',fontSize:16,marginBottom:8}}><strong style={{color:'#1e40af'}}>{merchant?.business_name}</strong> est maintenant sur FideliPain.</p>
            <p style={{color:'#a8a29e',fontSize:14,marginBottom:32}}>Configurons votre programme de fidélité en 2 minutes.</p>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
              {[{icon:'⭐',text:'Définir vos points par achat'},{icon:'📲',text:'Obtenir votre QR code'},{icon:'🚀',text:'Accéder à votre dashboard'}].map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#f8faff',borderRadius:12}}>
                  <span style={{fontSize:20}}>{item.icon}</span>
                  <span style={{fontSize:14,color:'#44403c',fontWeight:500}}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#1e40af,#3b82f6)',color:'white',fontWeight:700,fontSize:16,borderRadius:12,border:'none',cursor:'pointer',boxShadow:'0 8px 24px -8px rgba(30,64,175,0.5)'}}>
              Commencer <ArrowRight style={{width:16,height:16}} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{background:'white',borderRadius:24,padding:40,border:'1px solid #dbeafe',boxShadow:'0 20px 60px -20px rgba(30,64,175,0.15)'}}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{width:64,height:64,borderRadius:'50%',background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <Star style={{width:28,height:28,color:'#3b82f6'}} />
              </div>
              <h2 style={{fontSize:22,fontWeight:800,color:'#1e3a5f',marginBottom:8}}>Combien de points par euro ?</h2>
              <p style={{color:'#78716c',fontSize:14}}>Vos clients gagneront ces points à chaque achat.</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24}}>
              {[1,2,5,10].map(p => (
                <button key={p} onClick={() => setPointsPerEuro(p)}
                  style={{padding:'20px',borderRadius:16,border:pointsPerEuro===p?'2px solid #3b82f6':'2px solid #dbeafe',background:pointsPerEuro===p?'#eff6ff':'#f8faff',cursor:'pointer',transition:'all 0.2s'}}>
                  <div style={{fontSize:28,fontWeight:800,color:pointsPerEuro===p?'#1e40af':'#1e3a5f',marginBottom:4}}>{p}</div>
                  <div style={{fontSize:12,color:'#78716c'}}>point{p>1?'s':''} / €</div>
                </button>
              ))}
            </div>
            <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:12,padding:16,marginBottom:24,textAlign:'center'}}>
              <p style={{fontSize:14,color:'#1e3a5f'}}>Pour <strong>10€</strong> dépensés → client gagne <strong style={{color:'#1e40af'}}>{pointsPerEuro * 10} points</strong></p>
            </div>
            <button onClick={savePoints} disabled={saving}
              style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#1e40af,#3b82f6)',color:'white',fontWeight:700,fontSize:15,borderRadius:12,border:'none',cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1}}>
              {saving ? <Loader2 style={{width:18,height:18,animation:'spin 1s linear infinite'}} /> : <><ArrowRight style={{width:16,height:16}} /> Enregistrer et continuer</>}
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{background:'white',borderRadius:24,padding:40,border:'1px solid #dbeafe',boxShadow:'0 20px 60px -20px rgba(30,64,175,0.15)',textAlign:'center'}}>
            <div style={{fontSize:64,marginBottom:16}}>📲</div>
            <h2 style={{fontSize:22,fontWeight:800,color:'#1e3a5f',marginBottom:8}}>Votre QR code est prêt !</h2>
            <p style={{color:'#78716c',fontSize:14,marginBottom:32}}>Affichez-le en caisse. Vos clients le scannent pour rejoindre votre programme et gagner des points.</p>
            <div style={{background:'#f8faff',borderRadius:16,padding:24,marginBottom:24}}>
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'white',borderRadius:12,border:'1px solid #dbeafe',marginBottom:12}}>
                <QrCode style={{width:20,height:20,color:'#3b82f6',flexShrink:0}} />
                <span style={{fontSize:13,color:'#78716c',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{window.location.origin}/join/{merchant?.slug}</span>
              </div>
              <p style={{fontSize:12,color:'#a8a29e'}}>Retrouvez votre QR code dans le dashboard → onglet "QR Code"</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
              {[
                {text:`${pointsPerEuro} point${pointsPerEuro>1?'s':''} par euro configuré`},
                {text:'QR code prêt à afficher'},
                {text:'Programme actif immédiatement'},
              ].map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',background:'#f0fdf4',borderRadius:10}}>
                  <span>✅</span>
                  <span style={{fontSize:14,color:'#166534',fontWeight:500}}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/dashboard')} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#1e40af,#3b82f6)',color:'white',fontWeight:700,fontSize:16,borderRadius:12,border:'none',cursor:'pointer',boxShadow:'0 8px 24px -8px rgba(30,64,175,0.5)'}}>
              <Sparkles style={{width:16,height:16}} /> Accéder à mon dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
