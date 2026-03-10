import { useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import { QrCode, Star, Gift, BarChart3, Sparkles, Check, ArrowRight, TrendingUp, ChevronRight } from 'lucide-react'

const StarRating = () => (
  <div style={{display:'flex',gap:2}}>
    {[...Array(5)].map((_, i) => <Star key={i} style={{width:14,height:14,fill:'#fb923c',color:'#fb923c'}} />)}
  </div>
)

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: QrCode, title: 'QR Code fidélité', desc: 'Générez un QR code unique pour votre commerce. Vos clients le scannent et rejoignent votre programme en quelques secondes.', color: '#fff7ed', iconColor: '#f97316' },
    { icon: Sparkles, title: 'Points automatiques', desc: 'Définissez vos règles de points (ex: 1€ = 1 point). Les points sont attribués automatiquement à chaque visite.', color: '#fffbeb', iconColor: '#f59e0b' },
    { icon: Gift, title: 'Récompenses personnalisées', desc: 'Créez des récompenses attractives : café offert, remise, produit gratuit… Vos clients les débloquent avec leurs points.', color: '#fff1f2', iconColor: '#f43f5e' },
    { icon: BarChart3, title: 'Dashboard commerçant', desc: "Suivez vos clients, leurs points et l'activité de votre programme de fidélité en temps réel.", color: '#eff6ff', iconColor: '#3b82f6' },
  ]

  const testimonials = [
    { name: 'Boulangerie Martin', text: "Mes clients reviennent beaucoup plus souvent depuis que j'utilise Stamply. Mon CA a augmenté de 20%.", avatar: '🥐' },
    { name: 'Café Central', text: "Simple et efficace. En 10 minutes j'avais mon programme de fidélité en place et mes premiers clients inscrits.", avatar: '☕' },
    { name: 'Barber Shop Elite', text: "Le meilleur outil fidélité que j'ai testé. L'interface est claire et mes clients adorent le système de points.", avatar: '✂️' },
  ]

  const plans = [
    {
      name: 'Mensuel', price: '39.99', period: '/mois', badge: null, highlight: false,
      features: ['Programme de fidélité illimité', 'QR code unique', 'Tableau de bord complet', "Jusqu'à 500 clients", 'Support email'],
    },
    {
      name: 'Annuel', price: '299.99', period: '/an', badge: '−38%', highlight: true,
      features: ['Tout du plan mensuel', 'Clients illimités', 'Support prioritaire', 'Export des données', 'Analytics avancés'],
    },
  ]

  const steps = [
    { step:'01', title:'Créez votre programme', desc:'Inscrivez-vous, définissez vos règles de points et personnalisez vos récompenses en quelques clics.', icon:'⚙️' },
    { step:'02', title:'Affichez votre QR code', desc:'Imprimez votre QR code unique et affichez-le en caisse. Vos clients le scannent avec leur téléphone.', icon:'📲' },
    { step:'03', title:'Fidélisez et analysez', desc:'Vos clients accumulent des points automatiquement. Suivez vos stats en temps réel depuis votre dashboard.', icon:'📈' },
  ]

  return (
    <div style={{minHeight:'100vh',background:'white'}}>

      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',background:'rgba(255,255,255,0.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid #f5f5f4'}}>
        <Logo />
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={() => navigate('/login')} className="btn-secondary" style={{padding:'8px 16px'}}>Connexion</button>
          <button onClick={() => navigate('/pricing')} className="btn-primary" style={{padding:'8px 16px'}}>Essai gratuit</button>
        </div>
      </nav>

      <section style={{position:'relative',overflow:'hidden',paddingTop:128,paddingBottom:96,paddingLeft:24,paddingRight:24}}>
        <div className="blob" style={{width:384,height:384,background:'#fb923c',top:0,right:0,transform:'translate(50%,-25%)'}} />
        <div className="blob" style={{width:288,height:288,background:'#fcd34d',bottom:0,left:0,transform:'translate(-33%,0)'}} />
        <div style={{position:'relative',maxWidth:896,margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:99,color:'#ea580c',fontSize:14,fontWeight:500,marginBottom:24}}>
            <Sparkles style={{width:14,height:14}} />
            Nouveau · Fidélisation simplifiée
          </div>
          <h1 style={{fontSize:'clamp(48px,8vw,80px)',fontWeight:800,color:'#1c1917',lineHeight:1.05,letterSpacing:'-0.02em',marginBottom:24}}>
            <span className="gradient-text">Stamply</span>
          </h1>
          <p style={{fontSize:'clamp(20px,3vw,28px)',fontWeight:600,color:'#44403c',marginBottom:16}}>
            Il n'a jamais été aussi facile de
            <span style={{color:'#f97316'}}> fidéliser sa clientèle</span>
          </p>
          <p style={{fontSize:18,color:'#78716c',maxWidth:480,margin:'0 auto 16px'}}>
            Un QR code, un scan, et vos clients rejoignent votre programme de fidélité.
          </p>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,marginBottom:40}}>
            {['🥐 Boulangeries','☕ Cafés','✂️ Coiffeurs','🍕 Restaurants'].map((c,i) => (
              <span key={i} style={{padding:'6px 14px',background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:99,fontSize:13,color:'#ea580c',fontWeight:500}}>{c}</span>
            ))}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center'}}>
            <button onClick={() => navigate('/pricing')} className="btn-primary" style={{fontSize:16,padding:'14px 32px'}}>
              Essai gratuit <ArrowRight style={{width:16,height:16}} />
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary" style={{fontSize:16,padding:'14px 32px'}}>
              Connexion
            </button>
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px',background:'#fafaf9'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontSize:36,fontWeight:800,color:'#1c1917',marginBottom:16}}>Tout ce dont vous avez besoin</h2>
            <p style={{color:'#78716c',fontSize:18}}>Un système de fidélité complet, prêt en quelques minutes.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
            {features.map((f,i) => (
              <div key={i} className="card-lift" style={{background:'white',borderRadius:16,padding:28,border:'1px solid #f5f5f4'}}>
                <div style={{width:44,height:44,borderRadius:12,background:f.color,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
                  <f.icon style={{width:20,height:20,color:f.iconColor}} />
                </div>
                <h3 style={{fontWeight:600,color:'#1c1917',marginBottom:8}}>{f.title}</h3>
                <p style={{color:'#78716c',fontSize:14,lineHeight:1.6}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontSize:36,fontWeight:800,color:'#1c1917',marginBottom:16}}>Comment ça marche ?</h2>
            <p style={{color:'#78716c',fontSize:18}}>Opérationnel en moins de 5 minutes, sans compétence technique.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:32}}>
            {steps.map((s,i) => (
              <div key={i} style={{textAlign:'center'}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#f97316,#ea580c)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 10px 30px -10px rgba(249,115,22,0.4)'}}>
                  <span style={{fontSize:28}}>{s.icon}</span>
                </div>
                <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:24,height:24,borderRadius:'50%',background:'#fff7ed',color:'#ea580c',fontSize:11,fontWeight:700,marginBottom:8}}>{s.step}</div>
                <h3 style={{fontWeight:700,color:'#1c1917',marginBottom:8,fontSize:16}}>{s.title}</h3>
                <p style={{color:'#78716c',fontSize:14,lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:48}}>
            <button onClick={() => navigate('/pricing')} className="btn-primary" style={{fontSize:16,padding:'14px 32px'}}>
              Commencer gratuitement <ArrowRight style={{width:16,height:16}} />
            </button>
            <p style={{fontSize:13,color:'#a8a29e',marginTop:12}}>15 jours gratuits · Sans carte bancaire · Sans engagement</p>
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px',background:'#fafaf9'}}>
        <div style={{maxWidth:768,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontSize:36,fontWeight:800,color:'#1c1917',marginBottom:16}}>Tarifs simples et transparents</h2>
            <p style={{color:'#78716c',fontSize:18}}>Essayez gratuitement pendant 15 jours, sans carte bancaire.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
            {plans.map((plan,i) => (
              <div key={i} className="card-lift" style={{position:'relative',borderRadius:16,padding:32,border:plan.highlight?'2px solid #f97316':'2px solid #e7e5e4',background:plan.highlight?'linear-gradient(135deg,#f97316,#ea580c)':'white'}}>
                {plan.badge && (
                  <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#fbbf24',color:'#78350f',fontSize:12,fontWeight:700,padding:'4px 12px',borderRadius:99}}>
                    {plan.badge} économisé
                  </div>
                )}
                <div style={{fontSize:14,fontWeight:500,marginBottom:8,color:plan.highlight?'#fed7aa':'#78716c'}}>Plan {plan.name}</div>
                <div style={{display:'flex',alignItems:'flex-end',gap:4,marginBottom:24}}>
                  <span style={{fontSize:48,fontWeight:800,color:plan.highlight?'white':'#1c1917'}}>{plan.price}€</span>
                  <span style={{fontSize:14,marginBottom:8,color:plan.highlight?'#fed7aa':'#78716c'}}>{plan.period}</span>
                </div>
                <ul style={{listStyle:'none',marginBottom:32,display:'flex',flexDirection:'column',gap:12}}>
                  {plan.features.map((feat,j) => (
                    <li key={j} style={{display:'flex',alignItems:'center',gap:12,fontSize:14}}>
                      <Check style={{width:16,height:16,color:plan.highlight?'#fed7aa':'#f97316',flexShrink:0}} />
                      <span style={{color:plan.highlight?'#fff7ed':'#57534e'}}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/pricing')} style={{width:'100%',padding:12,borderRadius:12,fontWeight:600,fontSize:14,cursor:'pointer',border:'none',background:plan.highlight?'white':'#f97316',color:plan.highlight?'#ea580c':'white'}}>
                  Essai gratuit 15 jours
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontSize:36,fontWeight:800,color:'#1c1917',marginBottom:16}}>Ils fidélisent avec Stamply</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24}}>
            {testimonials.map((t,i) => (
              <div key={i} className="card-lift" style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f5f5f4'}}>
                <StarRating />
                <p style={{color:'#44403c',fontSize:14,lineHeight:1.6,margin:'16px 0 20px'}}>"{t.text}"</p>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'#fff7ed',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{t.avatar}</div>
                  <span style={{fontWeight:600,color:'#1c1917',fontSize:14}}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px',background:'#fafaf9'}}>
        <div style={{maxWidth:640,margin:'0 auto',textAlign:'center'}}>
          <div style={{background:'linear-gradient(135deg,#f97316,#ea580c)',borderRadius:24,padding:64,position:'relative',overflow:'hidden'}}>
            <TrendingUp style={{width:48,height:48,color:'#fed7aa',margin:'0 auto 16px'}} />
            <h2 style={{fontSize:28,fontWeight:800,color:'white',marginBottom:12}}>Prêt à fidéliser vos clients ?</h2>
            <p style={{color:'#fed7aa',marginBottom:32}}>15 jours gratuits, sans engagement.</p>
            <button onClick={() => navigate('/pricing')} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',background:'white',color:'#ea580c',fontWeight:700,borderRadius:12,border:'none',cursor:'pointer',fontSize:16}}>
              Essai gratuit <ChevronRight style={{width:16,height:16}} />
            </button>
          </div>
        </div>
      </section>

      <footer style={{borderTop:'1px solid #f5f5f4',padding:'32px 24px'}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:16}}>
          <Logo />
          <div style={{display:'flex',gap:24,alignItems:'center'}}>
            <button onClick={() => navigate('/legal')} style={{background:'none',border:'none',color:'#a8a29e',fontSize:13,cursor:'pointer'}}>Mentions légales</button>
            <p style={{fontSize:14,color:'#a8a29e'}}>© 2025 Stamply — Mathis Bobo & Florian Buisson</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

