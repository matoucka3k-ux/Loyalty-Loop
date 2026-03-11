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

  return (
    <div className="animate-mount">
      <ToastContainer toasts={toasts} />

      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:800,color:'#1e3a5f',marginBottom:4}}>Mon compte</h2>
        <p style={{color:'#78716c',fontSize:14}}>Gerez vos informations et consultez les mentions legales.</p>
      </div>

      <div style={{display:'flex',background:'white',borderRadius:14,padding:4,marginBottom:24,border:'1px solid #dbeafe'}}>
        {[
          {id:'infos', label:'Mon commerce', icon: Building2},
          {id:'legal', label:'Legal & RGPD', icon: Shield},
          {id:'about', label:'A propos', icon: Info},
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px 8px',borderRadius:10,border:'none',fontWeight:600,fontSize:13,cursor:'pointer',background:tab===t.id?'#eff6ff':'transparent',color:tab===t.id?'#1e40af':'#78716c',transition:'all 0.2s'}}>
            <t.icon style={{width:14,height:14}} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'infos' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #dbeafe'}}>
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
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Nom de la boulangerie</label>
                <div style={{position:'relative'}}>
                  <Building2 style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input name="business_name" value={form.business_name} onChange={handle} placeholder="Ma Boulangerie" className="input-base" style={{paddingLeft:40}} />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Adresse</label>
                <div style={{position:'relative'}}>
                  <MapPin style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input name="address" value={form.address} onChange={handle} placeholder="12 rue de la Paix, 75001 Paris" className="input-base" style={{paddingLeft:40}} />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Telephone</label>
                <div style={{position:'relative'}}>
                  <Phone style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input name="phone" value={form.phone} onChange={handle} placeholder="06 12 34 56 78" className="input-base" style={{paddingLeft:40}} />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Email de contact</label>
                <div style={{position:'relative'}}>
                  <Mail style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
                  <input value={profile?.email || ''} disabled className="input-base" style={{paddingLeft:40,opacity:0.6,cursor:'not-allowed'}} />
                </div>
                <p style={{fontSize:11,color:'#a8a29e',marginTop:4}}>L'email ne peut pas etre modifie</p>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Description du programme</label>
                <textarea name="description" value={form.description} onChange={handle}
                  placeholder="Ex: Gagnez des points a chaque achat et obtenez des viennoiseries gratuites !"
                  className="input-base" style={{minHeight:80,resize:'vertical'}} />
              </div>
            </div>
          </div>
          <div style={{background:'#eff6ff',borderRadius:16,padding:20,border:'1px solid #bfdbfe'}}>
            <p style={{fontSize:13,fontWeight:600,color:'#1e3a5f',marginBottom:6}}>Votre lien de fidelite</p>
            <p style={{fontSize:12,color:'#78716c',fontFamily:'monospace',wordBreak:'break-all'}}>
              {window.location.origin}/join/{merchant?.slug}
            </p>
          </div>
          <button onClick={save} disabled={saving} className="btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px'}}>
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
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #dbeafe'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <Shield style={{width:20,height:20,color:'#3b82f6'}} />
              <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Donnees personnelles & RGPD</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>FideliPain collecte uniquement les donnees necessaires : nom du commerce, email du gerant, et donnees clients (nom, email, points).</p>
              <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>En tant que commercant, vous etes responsable des donnees de vos clients conformement au RGPD. Vos clients ont un droit d'acces, rectification et suppression.</p>
              <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>Les donnees ne sont jamais vendues ni partagees. Contact : <strong style={{color:'#1e40af'}}>contact@fidelipain.fr</strong></p>
            </div>
          </div>
          <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #dbeafe'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <FileText style={{width:20,height:20,color:'#3b82f6'}} />
              <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Conditions d'utilisation</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[
                "L'abonnement est mensuel ou annuel et renouvelable automatiquement.",
                "Vous pouvez annuler votre abonnement a tout moment.",
                "Les donnees de vos clients restent votre propriete.",
                "FideliPain ne peut etre tenu responsable d'une mauvaise utilisation.",
                "Tout abus entraine la suspension immediate du compte.",
              ].map((item, i) => (
                <div key={i} style
