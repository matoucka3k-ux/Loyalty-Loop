import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabase'
import { useToast, ToastContainer } from '../../../components/ui/Toast'
import { Star, Loader2, Save } from 'lucide-react'

export default function LoyaltyProgram() {
  const { merchant, refreshMerchant } = useAuth()
  const { toasts, success, error: toastError } = useToast()
  const [pointsPerEuro, setPointsPerEuro] = useState(merchant?.points_per_euro || 1)
  const [description, setDescription] = useState(merchant?.description || '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await supabase.from('merchants').update({ points_per_euro: pointsPerEuro, description }).eq('id', merchant.id)
      await refreshMerchant()
      success('Programme mis à jour !')
    } catch (e) { toastError('Erreur lors de la sauvegarde') }
    finally { setSaving(false) }
  }

  return (
    <div className="animate-mount">
      <ToastContainer toasts={toasts} />
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:800,color:'#1e3a5f',marginBottom:4}}>Programme de fidélité</h2>
        <p style={{color:'#78716c',fontSize:14}}>Configurez les règles de points pour vos clients.</p>
      </div>

      <div style={{background:'white',borderRadius:16,padding:28,border:'1px solid #dbeafe',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:10,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Star style={{width:18,height:18,color:'#3b82f6'}} />
          </div>
          <div>
            <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Points par euro</h3>
            <p style={{fontSize:13,color:'#78716c'}}>Combien de points vos clients gagnent par euro dépensé</p>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
          {[1,2,5,10].map(p => (
            <button key={p} onClick={() => setPointsPerEuro(p)}
              style={{padding:'14px',borderRadius:12,border:pointsPerEuro===p?'2px solid #3b82f6':'2px solid #dbeafe',background:pointsPerEuro===p?'#eff6ff':'#f8faff',fontWeight:700,fontSize:18,color:pointsPerEuro===p?'#1e40af':'#1e3a5f',cursor:'pointer'}}>
              {p}
            </button>
          ))}
        </div>
        <div style={{position:'relative',marginBottom:16}}>
          <input type="number" min="1" value={pointsPerEuro} onChange={e => setPointsPerEuro(Number(e.target.value))}
            className="input-base" placeholder="Valeur personnalisée" />
        </div>
        <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:12,padding:16}}>
          <p style={{fontSize:14,color:'#1e3a5f',textAlign:'center'}}>
            Pour <strong>10€</strong> dépensés → client gagne <strong style={{color:'#1e40af'}}>{pointsPerEuro * 10} points</strong>
          </p>
        </div>
      </div>

      <div style={{background:'white',borderRadius:16,padding:28,border:'1px solid #dbeafe',marginBottom:16}}>
        <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15,marginBottom:12}}>Description du programme</h3>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Ex: Gagnez des points à chaque achat et obtenez des viennoiseries gratuites !"
          className="input-base" style={{minHeight:100,resize:'vertical'}} />
      </div>

      <button onClick={save} disabled={saving} className="btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px'}}>
        {saving ? <Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}} /> : <Save style={{width:16,height:16}} />}
        Enregistrer
      </button>
    </div>
  )
}

