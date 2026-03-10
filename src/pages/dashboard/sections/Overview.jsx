import { useAuth } from '../../../context/AuthContext'
import { Users, Star, Gift, TrendingUp, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Overview() {
  const { merchant, profile } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { label: 'Clients inscrits', value: '0', icon: Users, color: '#eff6ff', iconColor: '#3b82f6', desc: 'Aucun client encore' },
    { label: 'Points distribués', value: '0', icon: Star, color: '#fff7ed', iconColor: '#f97316', desc: 'Ce mois-ci' },
    { label: 'Récompenses utilisées', value: '0', icon: Gift, color: '#fff1f2', iconColor: '#f43f5e', desc: 'Ce mois-ci' },
    { label: 'Taux de retour', value: '0%', icon: TrendingUp, color: '#f0fdf4', iconColor: '#22c55e', desc: 'Clients fidèles' },
  ]

  return (
    <div className="animate-mount">
      <div style={{marginBottom:32}}>
        <h2 style={{fontSize:22,fontWeight:800,color:'#1c1917',marginBottom:4}}>
          Bonjour, {profile?.full_name?.split(' ')[0]} 👋
        </h2>
        <p style={{color:'#78716c',fontSize:14}}>Voici un aperçu de votre programme de fidélité.</p>
      </div>

      <div style={{background:'linear-gradient(135deg,#f97316,#ea580c)',borderRadius:20,padding:28,marginBottom:32,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div>
          <p style={{color:'#fed7aa',fontSize:13,fontWeight:500,marginBottom:4}}>🚀 Pour commencer</p>
          <h3 style={{color:'white',fontWeight:800,fontSize:18,marginBottom:4}}>Affichez votre QR code en caisse</h3>
          <p style={{color:'#fed7aa',fontSize:13}}>Vos premiers clients pourront rejoindre votre programme dès aujourd'hui.</p>
        </div>
        <button onClick={() => navigate('/dashboard?section=qrcode')}
          style={{display:'flex',alignItems:'center',gap:8,padding:'12px 20px',background:'white',color:'#ea580c',fontWeight:700,fontSize:14,borderRadius:12,border:'none',cursor:'pointer',flexShrink:0}}>
          <QrCode style={{width:16,height:16}} />
          Voir mon QR code
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:32}}>
        {stats.map((s,i) => (
          <div key={i} style={{background:'white',borderRadius:16,padding:20,border:'1px solid #f5f5f4'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
              <span style={{fontSize:13,color:'#78716c',fontWeight:500}}>{s.label}</span>
              <div style={{width:36,height:36,borderRadius:10,background:s.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <s.icon style={{width:16,height:16,color:s.iconColor}} />
              </div>
            </div>
            <p style={{fontSize:28,fontWeight:800,color:'#1c1917',marginBottom:4}}>{s.value}</p>
            <p style={{fontSize:12,color:'#a8a29e'}}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{background:'white',borderRadius:20,padding:28,border:'1px solid #f5f5f4',marginBottom:24}}>
        <h3 style={{fontWeight:700,color:'#1c1917',fontSize:16,marginBottom:20}}>✅ Guide de démarrage</h3>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[
            { done:true, text:'Compte créé', desc:'Votre espace commerçant est prêt' },
            { done:true, text:'Programme configuré', desc:`${merchant?.points_per_euro || 1} point${merchant?.points_per_euro > 1 ? 's' : ''} par euro dépensé` },
            { done:false, text:'Afficher le QR code en caisse', desc:'Téléchargez et imprimez votre QR code' },
            { done:false, text:'Créer vos premières récompenses', desc:'Ex: café offert à 50 points' },
            { done:false, text:'Obtenir votre premier client', desc:'Partagez le lien ou le QR code' },
          ].map((item, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 16px',background:item.done?'#f0fdf4':'#fafaf9',borderRadius:12,border:`1px solid ${item.done?'#bbf7d0':'#f5f5f4'}`}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:item.done?'#22c55e':'#e7e5e4',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {item.done
                  ? <span style={{color:'white',fontSize:14}}>✓</span>
                  : <span style={{color:'#a8a29e',fontSize:12,fontWeight:700}}>{i+1}</span>
                }
              </div>
              <div>
                <p style={{fontWeight:600,color:item.done?'#166534':'#1c1917',fontSize:14}}>{item.text}</p>
                <p style={{fontSize:12,color:item.done?'#16a34a':'#78716c'}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'white',borderRadius:20,padding:28,border:'1px solid #f5f5f4',textAlign:'center'}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:'#fff7ed',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
          <TrendingUp style={{width:24,height:24,color:'#f97316'}} />
        </div>
        <h3 style={{fontWeight:700,color:'#1c1917',marginBottom:8}}>Aucune activité pour l'instant</h3>
        <p style={{color:'#78716c',fontSize:14,marginBottom:20}}>
          Votre activité apparaîtra ici dès que vos premiers clients rejoindront votre programme.
        </p>
        <button onClick={() => navigate('/dashboard?section=qrcode')}
          style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',background:'#fff7ed',color:'#f97316',fontWeight:600,fontSize:14,borderRadius:10,border:'1px solid #fed7aa',cursor:'pointer'}}>
          <QrCode style={{width:14,height:14}} />
          Obtenir mon QR code
        </button>
      </div>

    </div>
  )
}

