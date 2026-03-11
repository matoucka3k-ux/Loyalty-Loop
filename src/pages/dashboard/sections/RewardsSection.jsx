import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabase'
import { useToast, ToastContainer } from '../../../components/ui/Toast'
import Modal from '../../../components/ui/Modal'
import { Gift, Plus, Trash2, Loader2, Star } from 'lucide-react'

export default function RewardsSection() {
  const { merchant } = useAuth()
  const { toasts, success, error: toastError } = useToast()
  const [rewards, setRewards] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', points_required: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!merchant?.id) return
    const load = async () => {
      const { data } = await supabase.from('rewards').select('*').eq('merchant_id', merchant.id).eq('is_active', true)
      setRewards(data || [])
    }
    load()
  }, [merchant?.id])

  const createReward = async () => {
    if (!form.title || !form.points_required) return
    setSaving(true)
    try {
      const { data } = await supabase.from('rewards').insert({ merchant_id: merchant.id, title: form.title, description: form.description, points_required: Number(form.points_required), is_active: true }).select().single()
      setRewards(r => [...r, data])
      success('Récompense créée !')
      setShowModal(false)
      setForm({ title: '', description: '', points_required: '' })
    } catch (e) { toastError('Erreur lors de la création') }
    finally { setSaving(false) }
  }

  const deleteReward = async (id) => {
    await supabase.from('rewards').update({ is_active: false }).eq('id', id)
    setRewards(r => r.filter(x => x.id !== id))
    success('Récompense supprimée')
  }

  return (
    <div className="animate-mount">
      <ToastContainer toasts={toasts} />
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:'#1e3a5f',marginBottom:4}}>Récompenses</h2>
          <p style={{color:'#78716c',fontSize:14}}>{rewards.length} récompense{rewards.length > 1 ? 's' : ''} active{rewards.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus style={{width:16,height:16}} /> Ajouter
        </button>
      </div>

      {rewards.length === 0 ? (
        <div style={{background:'white',borderRadius:16,border:'1px solid #dbeafe',padding:48,textAlign:'center'}}>
          <Gift style={{width:48,height:48,color:'#bfdbfe',margin:'0 auto 12px'}} />
          <p style={{fontWeight:600,color:'#1e3a5f',marginBottom:4}}>Aucune récompense pour l'instant</p>
          <p style={{color:'#a8a29e',fontSize:14,marginBottom:20}}>Créez votre première récompense pour motiver vos clients</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus style={{width:16,height:16}} /> Créer une récompense
          </button>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {rewards.map((r,i) => (
            <div key={i} style={{background:'white',borderRadius:16,padding:20,border:'1px solid #dbeafe',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Gift style={{width:20,height:20,color:'#3b82f6'}} />
                </div>
                <div>
                  <p style={{fontWeight:700,color:'#1e3a5f',marginBottom:4}}>{r.title}</p>
                  {r.description && <p style={{fontSize:13,color:'#78716c',marginBottom:4}}>{r.description}</p>}
                  <div style={{display:'flex',alignItems:'center',gap:4}}>
                    <Star style={{width:12,height:12,color:'#3b82f6'}} />
                    <span style={{fontSize:13,fontWeight:600,color:'#1e40af'}}>{r.points_required} points</span>
                  </div>
                </div>
              </div>
              <button onClick={() => deleteReward(r.id)}
                style={{width:36,height:36,borderRadius:10,background:'#fff1f2',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Trash2 style={{width:16,height:16,color:'#e11d48'}} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle récompense">
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div>
            <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Nom de la récompense</label>
            <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
              placeholder="Ex: Croissant offert" className="input-base" />
          </div>
          <div>
            <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Description (optionnel)</label>
            <input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
              placeholder="Ex: Un croissant au beurre offert" className="input-base" />
          </div>
          <div>
            <label style={{display:'block',fontSize:13,fontWeight:500,color:'#44403c',marginBottom:6}}>Points nécessaires</label>
            <input type="number" value={form.points_required} onChange={e => setForm(f => ({...f, points_required: e.target.value}))}
              placeholder="Ex: 50" className="input-base" />
          </div>
          <div style={{display:'flex',gap:8}}>
            {[25,50,100,200].map(p => (
              <button key={p} onClick={() => setForm(f => ({...f, points_required: p.toString()}))}
                style={{flex:1,padding:'8px',borderRadius:10,border:'none',fontSize:13,fontWeight:500,cursor:'pointer',background:form.points_required==p?'#1e40af':'#eff6ff',color:form.points_required==p?'white':'#1e40af'}}>
                {p}
              </button>
            ))}
          </div>
          <div style={{display:'flex',gap:12,paddingTop:4}}>
            <button onClick={() => setShowModal(false)} className="btn-secondary" style={{flex:1,justifyContent:'center'}}>Annuler</button>
            <button onClick={createReward} disabled={saving||!form.title||!form.points_required} className="btn-primary" style={{flex:1,justifyContent:'center'}}>
              {saving ? <Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}} /> : <Plus style={{width:16,height:16}} />}
              Créer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

