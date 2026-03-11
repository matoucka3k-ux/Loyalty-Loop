import { useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'

export default function Legal() {
  const navigate = useNavigate()
  return (
    <div style={{minHeight:'100vh',background:'#f8faff'}}>
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',background:'white',borderBottom:'1px solid #dbeafe'}}>
        <button onClick={() => navigate('/')} style={{background:'none',border:'none',cursor:'pointer'}}><Logo /></button>
      </nav>
      <div style={{maxWidth:720,margin:'0 auto',padding:'48px 24px'}}>
        <h1 style={{fontSize:32,fontWeight:800,color:'#1e3a5f',marginBottom:8}}>Mentions légales</h1>
        <p style={{color:'#78716c',marginBottom:48}}>Dernière mise à jour : mars 2025</p>
        {[
          { title:'1. Éditeur du site', content:<><strong>FideliPain</strong><br />Co-fondateurs : <strong>Mathis Bobo</strong> et <strong>Florian Buisson</strong><br />Email : contact@fidelipain.fr<br />Site web : https://fidelipain.fr</> },
          { title:'2. Hébergement', content:<>Le site est hébergé par <strong>Vercel Inc.</strong><br />340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</> },
          { title:'3. Propriété intellectuelle', content:"L'ensemble des contenus présents sur FideliPain sont la propriété exclusive de Mathis Bobo et Florian Buisson. Toute reproduction est interdite sans autorisation." },
          { title:'4. Données personnelles', content:"Les données collectées (nom, email) sont utilisées uniquement dans le cadre du service FideliPain. Elles ne sont jamais vendues ni partagées. Conformément au RGPD, contactez contact@fidelipain.fr pour exercer vos droits." },
          { title:'5. Cookies', content:"FideliPain utilise uniquement des cookies techniques nécessaires au fonctionnement du service. Aucun cookie publicitaire n'est utilisé." },
          { title:'6. Droit applicable', content:"Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents." },
        ].map((s,i) => (
          <section key={i} style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#1e3a5f',marginBottom:12}}>{s.title}</h2>
            <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #dbeafe'}}>
              <p style={{color:'#44403c',lineHeight:1.8}}>{s.content}</p>
            </div>
          </section>
        ))}
        <div style={{textAlign:'center',marginTop:48}}>
          <button onClick={() => navigate('/')} style={{padding:'12px 24px',background:'#1e40af',color:'white',fontWeight:600,borderRadius:12,border:'none',cursor:'pointer',fontSize:14}}>
            Retour à l'accueil
          </button>
        </div>
      </div>
      <footer style={{borderTop:'1px solid #dbeafe',padding:'24px',textAlign:'center'}}>
        <p style={{fontSize:13,color:'#a8a29e'}}>© 2025 FideliPain — Mathis Bobo & Florian Buisson. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
