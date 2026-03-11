import { useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import { QrCode, Star, Gift, BarChart3, Sparkles, Check, ArrowRight, TrendingUp, ChevronRight } from 'lucide-react'

const StarRating = () => (
  <div style={{display:'flex',gap:2}}>
    {[...Array(5)].map((_, i) => <Star key={i} style={{width:14,height:14,fill:'#3b82f6',color:'#3b82f6'}} />)}
  </div>
)

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: QrCode, title: 'QR Code à la caisse', desc: 'Affichez votre QR code sur le comptoir. Vos clients le scannent en 5 secondes et rejoignent votre programme.', color: '#eff6ff', iconColor: '#3b82f6' },
    { icon: Sparkles, title: 'Points à chaque achat', desc: 'Vos clients gagnent des points à chaque baguette, viennoiserie ou commande. Simple et automatique.', color: '#fefce8', iconColor: '#ca8a04' },
    { icon: Gift, title: 'Récompenses gourmandes', desc: 'Offrez un croissant, une baguette gratuite ou une remise. Vos clients reviennent pour débloquer leurs cadeaux.', color: '#fdf2f8', iconColor: '#a855f7' },
    { icon: BarChart3, title: 'Vos habitués en un coup d\'œil', desc: 'Identifiez vos meilleurs clients, suivez leurs points et analysez la fidélité de votre clientèle.', color: '#f0fdf4', iconColor: '#22c55e' },
  ]

  const testimonials = [
    { name: 'Boulangerie Dupont, Paris', text: "Depuis FideliPain, mes clients reviennent 2x plus souvent. J'ai gagné 35% de CA en 2 mois. C'est magique.", avatar: '🥐' },
    { name: 'Au Pain Doré, Lyon', text: "Fini les cartes tampons perdues ! Mes clients adorent avoir leurs points sur leur téléphone. Ultra simple à utiliser.", avatar: '🍞' },
    { name: 'Maison Leroy, Bordeaux', text: "En 5 minutes j'avais mon programme en place. Mes habitués du matin sont devenus encore plus fidèles.", avatar: '🥖' },
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
    { step:'01', title:'Créez votre programme', desc:"Inscrivez-vous en 2 minutes. Définissez combien de points vos clients gagnent par achat.", icon:'⚙️' },
    { step:'02', title:'Posez votre QR code', desc:'Imprimez votre QR code et posez-le sur votre comptoir. Vos clients le scannent avec leur téléphone.', icon:'📲' },
    { step:'03', title:'Vos clients reviennent', desc:"Vos clients accumulent des points et reviennent chercher leurs récompenses. Votre CA augmente.", icon:'📈' },
  ]

  return (
    <div style={{minHeight:'100vh',background:'white'}}>

      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',background:'rgba(255,255,255,0.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid #dbeafe'}}>
        <Logo />
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={() => navigate('/login')} className="btn-secondary" style={{padding:'8px 16px'}}>Connexion</button>
          <button onClick={() => navigate('/pricing')} className="btn-primary" style={{padding:'8px 16px'}}>Essai gratuit</button>
        </div>
      </nav>

      <section style={{position:'relative',overflow:'hidden',paddingTop:128,paddingBottom:96,paddingLeft:24,paddingRight:24}}>
        <div className="blob" style={{width:384,height:384,background:'#3b82f6',top:0,right:0,transform:'translate(50%,-25%)'}} />
        <div className="blob" style={{width:288,height:288,background:'#fde68a',bottom:0,left:0,transform:'translate(-33%,0)'}} />
        <div style={{position:'relative',maxWidth:896,margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:99,color:'#1e40af',fontSize:14,fontWeight:500,marginBottom:24}}>
            <Sparkles style={{width:14,height:14}} />
            🥐 Spécialement conçu pour les boulangeries
          </div>
          <h1 style={{fontSize:'clamp(40px,7vw,72px)',fontWeight:800,color:'#1e3a5f',lineHeight:1.05,letterSpacing:'-0.02em',marginBottom:24}}>
            Transformez vos clients en
            <span className="gradient-text"> habitués fidèles</span>
          </h1>
          <p style={{fontSize:'clamp(18px,2.5vw,22px)',fontWeight:600,color:'#44403c',marginBottom:16}}>
            Le programme de fidélité digital fait pour les
            <span style={{color:'#1e40af'}}> boulangeries françaises</span>
          </p>
          <p style={{fontSize:17,color:'#78716c',maxWidth:520,margin:'0 auto 16px'}}>
            Un QR code posé sur votre comptoir. Vos clients scannent, accumulent des points et reviennent chercher leurs récompenses.
          </p>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,marginBottom:40}}>
            {['🥐 Boulangeries','🍰 Pâtisseries','🥖 Artisans boulangers','☕ Salons de thé'].map((c,i) => (
              <span key={i} style={{padding:'6px 14px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:99,fontSize:13,color:'#1e40af',fontWeight:500}}>{c}</span>
            ))}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',marginBottom:24}}>
            <button onClick={() => navigate('/pricing')} className="btn-primary" style={{fontSize:16,padding:'14px 32px'}}>
              Essai gratuit 15 jours <ArrowRight style={{width:16,height:16}} />
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary" style={{fontSize:16,padding:'14px 32px'}}>
              Connexion
            </button>
          </div>
          <p style={{fontSize:13,color:'#a8a29e'}}>Sans carte bancaire · Sans engagement · Opérationnel en 5 minutes</p>
        </div>
      </section>

      <section style={{padding:'48px 24px',background:'#eff6ff',borderTop:'1px solid #bfdbfe',borderBottom:'1px solid #bfdbfe'}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:32,textAlign:'center'}}>
          {[
            { value:'+35%', label:"Augmentation du CA en moyenne" },
            { value:'2x', label:"Plus de visites par client" },
            { value:'5 min', label:"Pour être opérationnel" },
            { value:'0€', label:"Pour commencer (15j gratuits)" },
          ].map((s,i) => (
            <div key={i}>
              <p style={{fontSize:36,fontWeight:800,color:'#1e40af',marginBottom:4}}>{s.value}</p>
              <p style={{fontSize:14,color:'#1e3a5f'}}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'96px 24px',background:'#fafaf9'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontSize:36,fontWeight:800,color:'#1e3a5f',marginBottom:16}}>Tout ce dont vous avez besoin</h2>
            <p style={{color:'#78716c',fontSize:18}}>Simple, rapide, efficace. Fait pour les boulangers.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
            {features.map((f,i) => (
              <div key={i} className="card-lift" style={{background:'white',borderRadius:16,padding:28,border:'1px solid #f0f9ff'}}>
                <div style={{width:44,height:44,borderRadius:12,background:f.color,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
                  <f.icon style={{width:20,height:20,color:f.iconColor}} />
                </div>
                <h3 style={{fontWeight:600,color:'#1e3a5f',marginBottom:8}}>{f.title}</h3>
                <p style={{color:'#78716c',fontSize:14,lineHeight:1.6}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontSize:36,fontWeight:800,color:'#1e3a5f',marginBottom:16}}>Opérationnel en 3 étapes</h2>
            <p style={{color:'#78716c',fontSize:18}}>Pas besoin de compétences techniques. Plus simple qu'une caisse enregistreuse.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:32}}>
            {steps.map((s,i) => (
              <div key={i} style={{textAlign:'center'}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#1e40af,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 10px 30px -10px rgba(30,64,175,0.4)'}}>
                  <span style={{fontSize:28}}>{s.icon}</span>
                </div>
                <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:24,height:24,borderRadius:'50%',background:'#eff6ff',color:'#1e40af',fontSize:11,fontWeight:700,marginBottom:8}}>{s.step}</div>
                <h3 style={{fontWeight:700,color:'#1e3a5f',marginBottom:8,fontSize:16}}>{s.title}</h3>
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
            <h2 style={{fontSize:36,fontWeight:800,color:'#1e3a5f',marginBottom:16}}>Tarifs simples et transparents</h2>
            <p style={{color:'#78716c',fontSize:18}}>Essayez gratuitement pendant 15 jours, sans carte bancaire.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
            {plans.map((plan,i) => (
              <div key={i} className="card-lift" style={{position:'relative',borderRadius:16,padding:32,border:plan.highlight?'2px solid #3b82f6':'2px solid #e7e5e4',background:plan.highlight?'linear-gradient(135deg,#1e40af,#3b82f6)':'white'}}>
                {plan.badge && (
                  <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#fbbf24',color:'#78350f',fontSize:12,fontWeight:700,padding:'4px 12px',borderRadius:99}}>
                    {plan.badge} économisé
                  </div>
                )}
                <div style={{fontSize:14,fontWeight:500,marginBottom:8,color:plan.highlight?'#bfdbfe':'#78716c'}}>Plan {plan.name}</div>
                <div style={{display:'flex',alignItems:'flex-end',gap:4,marginBottom:24}}>
                  <span style={{fontSize:48,fontWeight:800,color:plan.highlight?'white':'#1e3a5f'}}>{plan.price}€</span>
                  <span style={{fontSize:14,marginBottom:8,color:plan.highlight?'#bfdbfe':'#78716c'}}>{plan.period}</span>
                </div>
                <ul style={{listStyle:'none',marginBottom:32,display:'flex',flexDirection:'column',gap:12}}>
                  {plan.features.map((feat,j) => (
                    <li key={j} style={{display:'flex',alignItems:'center',gap:12,fontSize:14}}>
                      <Check style={{width:16,height:16,color:plan.highlight?'#bfdbfe':'#3b82f6',flexShrink:0}} />
                      <span style={{color:plan.highlight?'#eff6ff':'#57534e'}}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/pricing')} style={{width:'100%',padding:12,borderRadius:12,fontWeight:600,fontSize:14,cursor:'pointer',border:'none',background:plan.highlight?'white':'#1e40af',color:plan.highlight?'#1e40af':'white'}}>
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
            <h2 style={{fontSize:36,fontWeight:800,color:'#1e3a5f',marginBottom:16}}>Ils fidélisent avec FideliPain 🥐</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24}}>
            {testimonials.map((t,i) => (
              <div key={i} className="card-lift" style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f0f9ff'}}>
                <StarRating />
                <p style={{color:'#44403c',fontSize:14,lineHeight:1.6,margin:'16px 0 20px'}}>"{t.text}"</p>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{t.avatar}</div>
                  <span style={{fontWeight:600,color:'#1e3a5f',fontSize:14}}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px',background:'#fafaf9'}}>
        <div style={{maxWidth:640,margin:'0 auto',textAlign:'center'}}>
          <div style={{background:'linear-gradient(135deg,#1e40af,#3b82f6)',borderRadius:24,padding:64}}>
            <div style={{fontSize:48,marginBottom:16}}>🥐</div>
            <h2 style={{fontSize:28,fontWeight:800,color:'white',marginBottom:12}}>Prêt à fidéliser vos clients ?</h2>
            <p style={{color:'#bfdbfe',marginBottom:8}}>Rejoignez les boulangers qui ont adopté la fidélité digitale.</p>
            <p style={{color:'#bfdbfe',marginBottom:32,fontSize:14}}>15 jours gratuits, sans engagement, sans carte bancaire.</p>
            <button onClick={() => navigate('/pricing')} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',background:'white',color:'#1e40af',fontWeight:700,borderRadius:12,border:'none',cursor:'pointer',fontSize:16}}>
              Démarrer maintenant <ChevronRight style={{width:16,height:16}} />
            </button>
          </div>
        </div>
      </section>

      <footer style={{borderTop:'1px solid #dbeafe',padding:'32px 24px'}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:16}}>
          <Logo />
          <div style={{display:'flex',gap:24,alignItems:'center',flexWrap:'wrap'}}>
            <button onClick={() => navigate('/legal')} style={{background:'none',border:'none',color:'#a8a29e',fontSize:13,cursor:'pointer'}}>Mentions légales</button>
            <p style={{fontSize:14,color:'#a8a29e'}}>© 2025 FideliPain — Mathis Bobo & Florian Buisson</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

