import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabase'
import { useToast, ToastContainer } from '../../../components/ui/Toast'
import { Building2, Mail, MapPin, Phone, Save, Loader2, Shield, FileText, Info } from 'lucide-react'

export default function AccountSection() {
  const { merchant, profile, refreshMerchant } = useAuth()
  const { toasts, success, error: toastError } = useToast()
  const [tab, setTab] = useState('infos')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    business_name: merchant?.business_name || '',
    address: merchant?.address || '',
    phone: merchant?.phone || '',
    description: merchant?.description || '',
  })

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      await supabase.from('merchants').update({
        business_name: form.business_name,
        address: form.address,
        phone: form.phone,
        description: form.description,
      }).eq('id', merchant.id)
      await refreshMerchant()
      success('Informations mises a jour !')
    } catch (e) {
      toastError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const tabStyle = (id) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 8px',
    borderRadius: 10,
    border: 'none',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    background: tab === id ? '#eff6ff' : 'transparent',
    color: tab === id ? '#1e40af' : '#78716c',
    transition: 'all 0.2s',
  })

  const card = {
    background: 'white',
    borderRadius: 16,
    padding: 24,
    border: '1px solid #dbeafe',
  }

  const condItems = [
    "L'abonnement est mensuel ou annuel et renouvelable automatiquement.",
    "Vous pouvez annuler votre abonnement a tout moment.",
    "Les donnees de vos clients restent votre propriete.",
    "FideliPain ne peut etre tenu responsable d'une mauvaise utilisation.",
    "Tout abus entraine la suspension immediate du compte.",
  ]

  const stats = [
    { value: '+35%', label: 'CA moyen en plus' },
    { value: '2x', label: 'Plus de visites' },
    { value: '5 min', label: 'Pour demarrer' },
    { value: '100%', label: 'Boulangers satisfaits' },
  ]

  const team = [
    { name: 'Mathis Bobo', role: 'Co-fondateur & CEO' },
    { name: 'Florian Buisson', role: 'Co-fondateur & CEO' },
  ]

  return (
    <div className="animate-mount">
      <ToastContainer toasts={toasts} />

      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:800,color:'#1e3a5f',marginBottom:4}}>Mon compte</h2>
        <p style={{color:'#78716c',fontSize:14}}>Gerez vos informations et consultez les mentions legales.</p>
      </div>

      <div style={{display:'flex',background:'white',borderRadius:14,padding:4,marginBottom:24,border:'1px solid #dbeafe'}}>
        <button onClick={() => setTab('infos')} style={tabStyle('infos')}>
          <Building2 style={{width:14,height:14}} /> Mon commerce
        </button>
        <button onClick={() => setTab('legal')} style={tabStyle('legal')}>
          <Shield style={{width:14,height:14}} /> Legal
        </button>
        <button onClick={() => setTab('about')} style={tabStyle('about')}>
          <Info style={{width:14,height:14}} /> A propos
        </button>
      </div>

      {tab === 'infos' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={card}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
              <div style={{width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#1e40af,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>
                🥐
              </div>
              <div>
                <p style={{fontWeight:800,color:'#1e3a5f',fontSize:16}}>{merchant?.business_name}</p>
                <p style={{fontSize:13,color:'#78716c'}}>{profile?.email}</p>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>
                  Nom de la boulangerie
                </label>
                <div style={{position:'relative'}}>
                  <Building2 style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input
                    name="business_name"
                    value={form.business_name}
                    onChange={handle}
                    placeholder="Ma Boulangerie"
                    className="input-base"
                    style={{paddingLeft:40}}
                  />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>
                  Adresse
                </label>
                <div style={{position:'relative'}}>
                  <MapPin style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input
                    name="address"
                    value={form.address}
                    onChange={handle}
                    placeholder="12 rue de la Paix, 75001 Paris"
                    className="input-base"
                    style={{paddingLeft:40}}
                  />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>
                  Telephone
                </label>
                <div style={{position:'relative'}}>
                  <Phone style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handle}
                    placeholder="06 12 34 56 78"
                    className="input-base"
                    style={{paddingLeft:40}}
                  />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>
                  Email de contact
                </label>
                <div style={{position:'relative'}}>
                  <Mail style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input
                    value={profile?.email || ''}
                    disabled
                    className="input-base"
                    style={{paddingLeft:40,opacity:0.6,cursor:'not-allowed'}}
                  />
                </div>
                <p style={{fontSize:11,color:'#a8a29e',marginTop:4}}>L'email ne peut pas etre modifie</p>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>
                  Description du programme
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handle}
                  placeholder="Ex: Gagnez des points a chaque achat !"
                  className="input-base"
                  style={{minHeight:80,resize:'vertical'}}
                />
              </div>
            </div>
          </div>

          <div style={{background:'#eff6ff',borderRadius:16,padding:20,border:'1px solid #bfdbfe'}}>
            <p style={{fontSize:13,fontWeight:600,color:'#1e3a5f',marginBottom:6}}>Votre lien de fidelite</p>
            <p style={{fontSize:12,color:'#78716c',fontFamily:'monospace',wordBreak:'break-all'}}>
              {window.location.origin}/join/{merchant?.slug}
            </p>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="btn-primary"
            style={{width:'100%',justifyContent:'center',padding:'14px'}}>
            {saving
              ? <Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}} />
              : <Save style={{width:16,height:16}} />
            }
            Enregistrer
          </button>
        </div>
      )}

      {tab === 'legal' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={card}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <Shield style={{width:20,height:20,color:'#3b82f6'}} />
              <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Donnees personnelles & RGPD</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>
                FideliPain collecte uniquement les donnees necessaires : nom du commerce, email du gerant, et donnees clients.
              </p>
              <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>
                En tant que commercant, vous etes responsable des donnees de vos clients conformement au RGPD.
              </p>
              <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>
                Contact : <strong style={{color:'#1e40af'}}>contact@fidelipain.fr</strong>
              </p>
            </div>
          </div>

          <div style={card}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <FileText style={{width:20,height:20,color:'#3b82f6'}} />
              <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Conditions d'utilisation</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {condItems.map((item, i) => (
                <div
                  key={i}
                  style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 14px',background:'#f8faff',borderRadius:10}}>
                  <span style={{color:'#3b82f6',fontWeight:700,flexShrink:0}}>→</span>
                  <p style={{fontSize:13,color:'#44403c',lineHeight:1.6}}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <FileText style={{width:20,height:20,color:'#3b82f6'}} />
              <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Mentions legales</h3>
            </div>
            <p style={{fontSize:14,color:'#44403c',lineHeight:1.9}}>
              <strong>FideliPain</strong><br />
              Co-fondateurs : Mathis Bobo et Florian Buisson<br />
              Email : contact@fidelipain.fr<br />
              Hebergement : Vercel Inc., San Francisco, USA<br />
              Base de donnees : Supabase Inc.<br />
              Droit applicable : droit francais
            </p>
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'linear-gradient(135deg,#1e40af,#3b82f6)',borderRadius:20,padding:32,textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:12}}>🥐</div>
            <h3 style={{fontWeight:800,color:'white',fontSize:22,marginBottom:8}}>FideliPain</h3>
            <p style={{color:'#bfdbfe',fontSize:14,marginBottom:4}}>Version 1.0</p>
            <p style={{color:'#bfdbfe',fontSize:13}}>Le programme de fidelite pour les boulangeries</p>
          </div>

          <div style={card}>
            <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15,marginBottom:12}}>Notre mission</h3>
            <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>
              FideliPain aide les boulangers independants a fideliser leur clientele grace a un systeme de points simple et moderne.
            </p>
          </div>

          <div style={card}>
            <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15,marginBottom:16}}>L'equipe fondatrice</h3>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {team.map((p, i) => (
                <div
                  key={i}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',background:'#f8faff',borderRadius:12}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#1e40af,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'white',fontSize:18,flexShrink:0}}>
                    {p.name[0]}
                  </div>
                  <div>
                    <p style={{fontWeight:700,color:'#1e3a5f',fontSize:14}}>{p.name}</p>
                    <p style={{fontSize:12,color:'#78716c'}}>{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15,marginBottom:16}}>Nos chiffres</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{padding:'16px',background:'#f8faff',borderRadius:12,textAlign:'center'}}>
                  <p style={{fontSize:24,fontWeight:800,color:'#1e40af',marginBottom:4}}>{s.value}</p>
                  <p style={{fontSize:12,color:'#78716c'}}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          
            href="mailto:contact@fidelipain.fr"
            style={{display:'flex',alignItems:'center',gap:12,padding:'16px 20px',background:'white',borderRadius:16,textDecoration:'none',border:'1px solid #dbeafe'}}>
            <Mail style={{width:18,height:18,color:'#3b82f6',flexShrink:0}} />
            <div>
              <p style={{fontSize:12,color:'#a8a29e',marginBottom:2}}>Nous contacter</p>
              <p style={{fontSize:14,color:'#1e40af',fontWeight:600}}>contact@fidelipain.fr</p>
            </div>
          </a>

          <div style={{textAlign:'center',padding:'8px 0'}}>
            <p style={{fontSize:12,color:'#a8a29e'}}>2025 FideliPain - Mathis Bobo et Florian Buisson</p>
          </div>
        </div>
      )}

    </div>
  )
}
