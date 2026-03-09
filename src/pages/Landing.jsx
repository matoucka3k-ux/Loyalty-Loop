<section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontSize:36,fontWeight:800,color:'#1c1917',marginBottom:16}}>Comment ça marche ?</h2>
            <p style={{color:'#78716c',fontSize:18}}>Opérationnel en moins de 5 minutes, sans compétence technique.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:32,position:'relative'}}>
            {[
              { step:'01', title:'Créez votre programme', desc:'Inscrivez-vous, définissez vos règles de points et personnalisez vos récompenses en quelques clics.', icon:'⚙️' },
              { step:'02', title:'Affichez votre QR code', desc:'Imprimez votre QR code unique et affichez-le en caisse. Vos clients le scannent avec leur téléphone.', icon:'📲' },
              { step:'03', title:'Fidélisez et analysez', desc:'Vos clients accumulent des points automatiquement. Suivez vos stats en temps réel depuis votre dashboard.', icon:'📈' },
            ].map((s,i) => (
              <div key={i} style={{textAlign:'center',position:'relative'}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#f97316,#ea580c)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 10px 30px -10px rgba(249,115,22,0.4)'}}>
                  <span style={{fontSize:28}}>{s.icon}</span>
                </div>
                <div style={{position:'absolute',top:32,left:'60%',width:'80%',height:2,background:'linear-gradient(90deg,#fed7aa,transparent)',display:i<2?'block':'none'}} />
                <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:24,height:24,borderRadius:'50%',background:'#fff7ed',color:'#ea580c',fontSize:11,fontWeight:700,marginBottom:8}}>{s.step}</div>
                <h3 style={{fontWeight:700,color:'#1c1917',marginBottom:8,fontSize:16}}>{s.title}</h3>
                <p style={{color:'#78716c',fontSize:14,lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:48}}>
            <button onClick={() => navigate('/signup')} className="btn-primary" style={{fontSize:16,padding:'14px 32px'}}>
              Commencer gratuitement <ArrowRight style={{width:16,height:16}} />
            </button>
            <p style={{fontSize:13,color:'#a8a29e',marginTop:12}}>15 jours gratuits · Sans carte bancaire · Sans engagement</p>
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:768,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontSize:36,fontWeight:800,color:'#1c1917',marginBottom:16}}>Tarifs simples et transparents</h2>
