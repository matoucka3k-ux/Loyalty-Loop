import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabase'
import { useToast, ToastContainer } from '../../../components/ui/Toast'
import { Star, Loader2, Save, Euro, ShoppingBag, Plus, Trash2 } from 'lucide-react'

export default function LoyaltyProgram() {
  const { merchant, refreshMerchant } = useAuth()
  const { toasts, success, error: toastError } = useToast()
  const [loyaltyMode, setLoyaltyMode] = useState(merchant?.loyalty_mode || 'euro')
  const [pointsPerEuro, setPointsPerEuro] = useState(merchant?.points_per_euro || 1)
  const [products, setProducts] = useState(merchant?.products || [])
  const [newProduct, setNewProduct] = useState({ name: '', points: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoyaltyMode(merchant?.loyalty_mode || 'euro')
    setPointsPerEuro(merchant?.points_per_euro || 1)
    setProducts(merchant?.products || [])
  }, [merchant])

  const addProduct = () => {
    if (!newProduct.name || !newProduct.points) return
    setProducts(p => [...p, { name: newProduct.name, points: Number(newProduct.points) }])
    setNewProduct({ name: '', points: '' })
  }

  const removeProduct = (i) => setProducts(p => p.filter((_, idx) => idx !== i))

  const save = async () => {
    setSaving(true)
    try {
      await supabase.from('merchants').update({
        loyalty_mode: loyaltyMode,
        points_per_euro: loyaltyMode === 'euro' ? pointsPerEuro : null,
        products: loyaltyMode === 'products' ? products : [],
      }).eq('id', merchant.id)
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
        <p style={{color:'#78716c',fontSize:14}}>Configurez votre système de points.</p>
      </div>

      {/* MODE SELECTOR */}
      <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #dbeafe',marginBottom:16}}>
        <p style={{fontWeight:700,color:'#1e3a5f',fontSize:15,marginBottom:16}}>Mode de fidélité</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <button onClick={() => setLoyaltyMode('euro')}
            style={{padding:'20px 16px',borderRadius:16,border:loyaltyMode==='euro'?'2px solid #3b82f6':'2px solid #dbeafe',background:loyaltyMode==='euro'?'#eff6ff':'#f8faff',cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}>
            <div style={{width:44,height:44,borderRadius:12,background:loyaltyMode==='euro'?'#dbeafe':'#e7e5e4',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}>
              <Euro style={{width:22,height:22,color:loyaltyMode==='euro'?'#1e40af':'#a8a29e'}} />
            </div>
            <p style={{fontWeight:700,color:loyaltyMode==='euro'?'#1e40af':'#1e3a5f',fontSize:14,marginBottom:4}}>Par euro</p>
            <p style={{fontSize:12,color:'#78716c'}}>Ex: 1€ = 2 pts</p>
          </button>
          <button onClick={() => setLoyaltyMode('products')}
            style={{padding:'20px 16px',borderRadius:16,border:loyaltyMode==='products'?'2px solid #3b82f6':'2px solid #dbeafe',background:loyaltyMode==='products'?'#eff6ff':'#f8faff',cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}>
            <div style={{width:44,height:44,borderRadius:12,background:loyaltyMode==='products'?'#dbeafe':'#e7e5e4',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}>
              <ShoppingBag style={{width:22,height:22,color:loyaltyMode==='products'?'#1e40af':'#a8a29e'}} />
            </div>
            <p style={{fontWeight:700,color:loyaltyMode==='products'?'#1e40af':'#1e3a5f',fontSize:14,marginBottom:4}}>Par produit</p>
            <p style={{fontSize:12,color:'#78716c'}}>Ex: baguette = 5 pts</p>
          </button>
        </div>
      </div>

      {/* CONFIG EURO */}
      {loyaltyMode === 'euro' && (
        <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #dbeafe',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <div style={{width:40,height:40,borderRadius:10,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Star style={{width:18,height:18,color:'#3b82f6'}} />
            </div>
            <div>
              <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Points par euro</h3>
              <p style={{fontSize:13,color:'#78716c'}}>Combien de points par euro dépensé</p>
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
          <input type="number" min="1" value={pointsPerEuro} onChange={e => setPointsPerEuro(Number(e.target.value))} className="input-base" style={{marginBottom:12}} placeholder="Valeur personnalisée" />
          <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:12,padding:14,textAlign:'center'}}>
            <p style={{fontSize:14,color:'#1e3a5f'}}>Pour <strong>10€</strong> dépensés → client gagne <strong style={{color:'#1e40af'}}>{pointsPerEuro * 10} points</strong></p>
          </div>
        </div>
      )}

      {/* CONFIG PRODUITS */}
      {loyaltyMode === 'products' && (
        <div style={{background:'white',borderRadius:16,padding:24,border:'1px solid #dbeafe',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <div style={{width:40,height:40,borderRadius:10,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <ShoppingBag style={{width:18,height:18,color:'#3b82f6'}} />
            </div>
            <div>
              <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Vos produits</h3>
              <p style={{fontSize:13,color:'#78716c'}}>{products.length} produit{products.length>1?'s':''} configuré{products.length>1?'s':''}</p>
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
            {products.length === 0 && (
              <div style={{padding:16,textAlign:'center',color:'#a8a29e',fontSize:14,background:'#f8faff',borderRadius:12}}>
                Aucun produit pour l'instant
              </div>
            )}
            {products.map((p,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'#f8faff',borderRadius:12,border:'1px solid #dbeafe'}}>
                <span style={{fontSize:18}}>🥐</span>
                <span style={{flex:1,fontWeight:500,color:'#1e3a5f',fontSize:14}}>{p.name}</span>
                <span style={{fontWeight:700,color:'#1e40af',fontSize:14,marginRight:8}}>{p.points} pts</span>
                <button onClick={() => removeProduct(i)} style={{background:'#fff1f2',border:'none',borderRadius:8,cursor:'pointer',padding:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Trash2 style={{width:14,height:14,color:'#e11d48'}} />
                </button>
              </div>
            ))}
          </div>

          <div style={{display:'flex',gap:8}}>
            <input value={newProduct.name} onChange={e => setNewProduct(p => ({...p, name: e.target.value}))}
              placeholder="Nom du produit" className="input-base" style={{flex:2}}
              onKeyDown={e => e.key === 'Enter' && addProduct()} />
            <input type="number" value={newProduct.points} onChange={e => setNewProduct(p => ({...p, points: e.target.value}))}
              placeholder="Pts" className="input-base" style={{flex:1}}
              onKeyDown={e => e.key === 'Enter' && addProduct()} />
            <button onClick={addProduct}
              style={{padding:'10px 16px',background:'#1e40af',color:'white',borderRadius:10,border:'none',cursor:'pointer',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Plus style={{width:16,height:16}} />
            </button>
          </div>
        </div>
      )}

      <button onClick={save} disabled={saving} className="btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px'}}>
        {saving ? <Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}} /> : <Save style={{width:16,height:16}} />}
        Enregistrer
      </button>
    </div>
  )
}


