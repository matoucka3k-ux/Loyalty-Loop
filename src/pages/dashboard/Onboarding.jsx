import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Check, ArrowRight, QrCode, Sparkles, Loader2, Euro, ShoppingBag, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const { merchant, profile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loyaltyMode, setLoyaltyMode] = useState('euro')
  const [pointsPerEuro, setPointsPerEuro] = useState(1)
  const [products, setProducts] = useState([
    { name: 'Baguette', points: 2 },
    { name: 'Croissant', points: 3 },
  ])
  const [newProduct, setNewProduct] = useState({ name: '', points: '' })
  const [saving, setSaving] = useState(false)

  const addProduct = () => {
    if (!newProduct.name || !newProduct.points) return
    setProducts(p => [...p, { name: newProduct.name, points: Number(newProduct.points) }])
    setNewProduct({ name: '', points: '' })
  }

  const removeProduct = (i) => setProducts(p => p.filter((_, idx) => idx !== i))

  const saveConfig = async () => {
    if (!merchant?.id) return
    setSaving(true)
    try {
      await supabase.from('merchants').update({
        loyalty_mode: loyaltyMode,
        points_per_euro: loyaltyMode === 'euro' ? pointsPerEuro : null,
        products: loyaltyMode === 'products' ? products : [],
      }).eq('id', merchant.id)
      setStep(3)
    } catch (e) {
      console.error(e)
      setStep(3)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#eff6ff,#f8faff)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{maxWidth:560,width:'100%'}}>

        {/* PROGRESS */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:40,justifyContent:'center'}}>
          {[1,2,3].map((s,i) => (
            <div key={s} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:step>=s?'linear-gradient(135deg,#1e40af,#3b82f6)':'#e7e5e4',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s'}}>
                {step>s ? <Check style={{width:14,height:14,color:'white'}} /> : <span style={{fontSize:12,fontWeight:700,color:step>=s?'white':'#a8a29e'}}>{s}</span>}
              </div>
              {i<2 && <div style={{width:48,height:2,background:step>s?'#3b82f6':'#e7e5e4',transition:'all 0.3s'}} />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{background:'white',borderRadius:24,padding:40,border:'1px solid #dbeafe',boxShadow:'0 20px 60px -20px rgba(30,64,175,0.15)',textAlign:'center'}}>
            <div style={{fontSize:64,marginBottom:16}}>🥐</div>
            <h1 style={{fontSize:28,fontWeight:800,color:'#1e3a5f',marginBottom:8}}>Bienvenue, {profile?.full_name?.split(' ')[0]} !</h1>
            <p style={{color:'#78716c',fontSize:16,marginBottom:8}}><strong style={{color:'#1e40af'}}>{merchant?.business_name}</strong> est sur FideliPain.</p>
            <p style={{color:'#a8a29e',fontSize:14,marginBottom:32}}>Configurons votre programme en 2 minutes.</p>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
              {[
                {icon:'⚙️', text:'Choisir votre systeme de points'},
                {icon:'📲', text:'Obtenir votre QR code'},
                {icon:'🚀', text:'Acceder a votre dashboard'},
              ].map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#f8faff',borderRadius:12}}>
                  <span style={{fontSize:20}}>{item.icon}</span>
                  <span style={{fontSize:14,color:'#44403c',fontWeight:500}}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'linear-gradient(135deg,#1e40af,#3b82f6)',color:'white',fontWeight:700,fontSize:16,borderRadius:12,border:'none',cursor:'pointer'}}>
              Commencer <ArrowRight style={{width:16,height:16}} />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{background:'white',borderRadius:24,padding:40,border:'1px solid #dbeafe',boxShadow:'0 20px 60px -20px rgba(30,64,175,0.15)'}}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <h2 style={{fontSize:22,fontWeight:800,color:'#1e3a5f',marginBottom:8}}>Choisissez votre systeme de points</h2>
              <p style={{color:'#78716c',fontSize:14}}>Vous pourrez modifier ce choix plus tard.</p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:28}}>
              <button onClick={() => setLoyaltyMode('euro')}
                style={{padding:'20px 16px',borderRadius:16,border:loyaltyMode==='euro'?'2px solid #3b82f6':'2px solid #dbeafe',background:loyaltyMode==='euro'?'#eff6ff':'#f8faff',cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}>
                <div style={{width:44,height:44,borderRadius:12,background:loyaltyMode==='euro'?'#dbeafe':'#e7e5e4',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}>
                  <Euro style={{width:22,height:22,color:loyaltyMode==='euro'?'#1e40af':'#a8a29e'}} />
                </div>
                <p style={{fontWeight:700,color:loyaltyMode==='euro'?'#1e40af':'#1e3a5f',fontSize:14,marginBottom:4}}>Par euro</p>
                <p style={{fontSize:12,color:'#78716c'}}>Ex: 1 = 2 pts</p>
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

            {loyaltyMode === 'euro' && (
              <div style={{marginBottom:24}}>
                <p style={{fontWeight:600,color:'#1e3a5f',fontSize:14,marginBottom:12}}>Points par euro</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
                  {[1,2,5,10].map(p => (
                    <button key={p} onClick={() => setPointsPerEuro(p)}
                      style={{padding:'14px',borderRadius:12,border:pointsPerEuro===p?'2px solid #3b82f6':'2px solid #dbeafe',background:pointsPerEuro===p?'#eff6ff':'#f8faff',fontWeight:700,fontSize:18,color:pointsPerEuro===p?'#1e40af':'#1e3a5f',cursor:'pointer'}}>
                      {p}
                    </button>
                  ))}
                </div>
                <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:12,padding:14,textAlign:'center'}}>
                  <p style={{fontSize:14,color:'#1e3a5f'}}>Pour <strong>10</strong> depenses = <strong style={{color:'#1e40af'}}>{pointsPerEuro * 10} points</strong></p>
                </div>
              </div>
            )}

            {loyaltyMode === 'products' && (
              <div style={{marginBottom:24}}>
                <p style={{fontWeight:600,color:'#1e3a5f',fontSize:14,marginBottom:12}}>Vos produits et leurs points</p>
                <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16,maxHeight:200,overflowY:'auto'}}>
                  {products.map((p,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'#f8faff',borderRadius:12,border:'1px solid #dbeafe'}}>
                      <span style={{fontSize:16}}>🥐</span>
                      <span style={{flex:1,fontWeight:500,color:'#1e3a5f',fontSize:14}}>{p.name}</span>
                      <span style={{fontWeight:700,color:'#1e40af',fontSize:14}}>{p.points} pts</span>
                      <button onClick={() => removeProduct(i)} style={{background:'none',border:'none',cursor:'pointer',color:'#e11d48',padding:4}}>
                        <Trash2 style={{width:14,height:14}} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:8}}>
                  <input
                    valu
