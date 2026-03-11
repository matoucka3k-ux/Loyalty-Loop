import { useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import { Check, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Mensuel',
      price: '39.99',
      period: '/mois',
      badge: null,
      highlight: false,
      features: ['Programme de fidélité illimité', 'QR code unique', 'Tableau de bord complet', "Jusqu'à 500 clients", 'Support email'],
    },
    {
      name: 'Annuel',
      price: '299.99',
      period: '/an',
      badge: '−38%',
      highlight: true,
      features: ['Tout du plan mensuel', 'Clients illimités', 'Support prioritaire', 'Export des données', 'Analytics avancés'],
    },
  ]

  return (
    <div style={{minHeight:'100vh',background:'#f8faff',display:'flex',flexDirection:'column'}}>
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',background:'white',borderBottom:'1px solid #dbeafe'}}>
        <button onClick={() => navigate('/')} style={{background:'none',border:'none',cursor:'pointer'}}>
          <Logo />
        </button>
        <button onClick={() => navigate('/login')} className="btn-secondary" style={{padding:'8px 16px'}}>Connexion</button>
      </nav>

      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px 24px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:99,color:'#1e40af',fontSize:14,fontWeight:500,marginBottom:16}}>
            🎉 15 jours gratuits · Sans carte bancaire
          </div>
          <h1 style={{fontSize:36,fontWeight:800,color:'#1e3a5f',marginBottom:12}}>Choisissez votre plan</h1>
          <p style={{color:'#78716c',fontSize:18}}>Commencez gratuitement, annulez à tout moment.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24,width:'100%',maxWidth:640}}>
          {plans.map((plan, i) => (
            <div key={i} style={{position:'relative',borderRadius:20,padding:32,border:plan.highlight?'2px solid #3b82f6':'2px solid #e7e5e4',background:plan.highlight?'linear-gradient(135deg,#1e40af,#3b82f6)':'white',boxShadow:plan.highlight?'0 20px 40px -10px rgba(30,64,175,0.3)':'0 1px 3px rgba(0,0,0,0.04)'}}>
              {plan.badge && (
                <div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',background:'#fbbf24',color:'#78350f',fontSize:12,fontWeight:700,padding:'4px 16px',borderRadius:99,whiteSpace:'nowrap'}}>
                  Économisez {plan.badge}
                </div>
              )}
              <div style={{fontSize:14,fontWeight:500,marginBottom:8,color:plan.highlight?'#bfdbfe':'#78716c'}}>Plan {plan.name}</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:4,marginBottom:24}}>
                <span style={{fontSize:48,fontWeight:800,color:plan.highlight?'white':'#1e3a5f'}}>{plan.price}€</span>
                <span style={{fontSize:14,marginBottom:8,color:plan.highlight?'#bfdbfe':'#78716c'}}>{plan.period}</span>
              </div>
              <ul style={{listStyle:'none',marginBottom:32,display:'flex',flexDirection:'column',gap:12}}>
                {plan.features.map((feat, j) => (
                  <li key={j} style={{display:'flex',alignItems:'center',gap:12,fontSize:14}}>
                    <Check style={{width:16,height:16,color:plan.highlight?'#bfdbfe':'#3b82f6',flexShrink:0}} />
                    <span style={{color:plan.highlight?'#eff6ff':'#57534e'}}>{feat}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/signup')}
                style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',borderRadius:12,fontWeight:700,fontSize:15,cursor:'pointer',border:'none',background:plan.highlight?'white':'#1e40af',color:plan.highlight?'#1e40af':'white'}}>
                Commencer gratuitement <ArrowRight style={{width:16,height:16}} />
              </button>
              <p style={{textAlign:'center',fontSize:12,marginTop:12,color:plan.highlight?'#bfdbfe':'#a8a29e'}}>
                15 jours gratuits · Sans engagement
              </p>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:24,marginTop:40}}>
          {['✅ Sans carte bancaire','✅ Annulation facile','✅ Support inclus','✅ Données sécurisées'].map((f,i) => (
            <span key={i} style={{fontSize:14,color:'#78716c',fontWeight:500}}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
