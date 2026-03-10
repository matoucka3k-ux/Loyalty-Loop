import { useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'

export default function Legal() {
  const navigate = useNavigate()

  return (
    <div style={{minHeight:'100vh',background:'#fafaf9'}}>
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',background:'white',borderBottom:'1px solid #f5f5f4'}}>
        <button onClick={() => navigate('/')} style={{background:'none',border:'none',cursor:'pointer'}}>
          <Logo />
        </button>
      </nav>

      <div style={{maxWidth:720,margin:'0 auto',padding:'48px 24px'}}>
        <h1 style={{fontSize:32,fontWeight:800,color:'#1c1917',marginBottom:8}}>Mentions légales</h1>
        <p style={{color:'#78716c',marginBottom:48}}>Dernière mise à jour : mars 2025</p>

        <section style={{marginBottom:40}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#1c1917',marginBottom:16}}>1. Éditeur du site</h2>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f5f5f4'}}>
            <p style={{color:'#44403c',lineHeight:1.8}}>
              <strong>Stamply</strong><br />
              Co-fondateurs : <strong>Mathis Bobo</strong> et <strong>Florian Buisson</strong><br />
              Email : contact@stamply.fr<br />
              Site web : https://stamply.fr
            </p>
          </div>
        </section>

        <section style={{marginBottom:40}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#1c1917',marginBottom:16}}>2. Hébergement</h2>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f5f5f4'}}>
            <p style={{color:'#44403c',lineHeight:1.8}}>
              Le site est hébergé par <strong>Vercel Inc.</strong><br />
              340 Pine Street, Suite 701<br />
              San Francisco, CA 94104, États-Unis<br />
              Site : https://vercel.com
            </p>
          </div>
        </section>

        <section style={{marginBottom:40}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#1c1917',marginBottom:16}}>3. Propriété intellectuelle</h2>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f5f5f4'}}>
            <p style={{color:'#44403c',lineHeight:1.8}}>
              L'ensemble des contenus présents sur le site Stamply (textes, images, logos, code) sont la propriété exclusive de Stamply et de ses co-fondateurs Mathis Bobo et Florian Buisson. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.
            </p>
          </div>
        </section>

        <section style={{marginBottom:40}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#1c1917',marginBottom:16}}>4. Données personnelles</h2>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f5f5f4'}}>
            <p style={{color:'#44403c',lineHeight:1.8}}>
              Les données collectées (nom, email) sont utilisées uniquement dans le cadre du service Stamply. Elles ne sont jamais vendues ni partagées avec des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant contact@stamply.fr.
            </p>
          </div>
        </section>

        <section style={{marginBottom:40}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#1c1917',marginBottom:16}}>5. Cookies</h2>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f5f5f4'}}>
            <p style={{color:'#44403c',lineHeight:1.8}}>
              Stamply utilise des cookies techniques nécessaires au bon fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de tracking n'est utilisé.
            </p>
          </div>
        </section>

        <section style={{marginBottom:40}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#1c1917',marginBottom:16}}>6. Limitation de responsabilité</h2>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f5f5f4'}}>
            <p style={{color:'#44403c',lineHeight:1.8}}>
              Stamply s'engage à assurer la disponibilité du service mais ne peut être tenu responsable d'interruptions techniques, de pertes de données ou de tout dommage indirect lié à l'utilisation du service.
            </p>
          </div>
        </section>

        <section style={{marginBottom:40}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#1c1917',marginBottom:16}}>7. Droit applicable</h2>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #f5f5f4'}}>
            <p style={{color:'#44403c',lineHeight:1.8}}>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </div>
        </section>

        <div style={{textAlign:'center',marginTop:48}}>
          <button onClick={() => navigate('/')}
            style={{padding:'12px 24px',background:'#f97316',color:'white',fontWeight:600,borderRadius:12,border:'none',cursor:'pointer',fontSize:14}}>
            Retour à l'accueil
          </button>
        </div>
      </div>

      <footer style={{borderTop:'1px solid #f5f5f4',padding:'24px',textAlign:'center'}}>
        <p style={{fontSize:13,color:'#a8a29e'}}>© 2025 Stamply — Mathis Bobo & Florian Buisson. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
