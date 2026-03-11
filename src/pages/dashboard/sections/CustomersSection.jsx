import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabase'
import { useToast, ToastContainer } from '../../../components/ui/Toast'
import Modal from '../../../components/ui/Modal'
import { Users, Search, Star, Plus, Loader2, TrendingUp, ShoppingBag, Euro, ScanLine, X } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Html5Qrcode } from 'html5-qrcode'

export default function CustomersSection() {
  const { merchant } = useAuth()
  const { toasts, success, error: toastError } = useToast()
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [pointsToAdd, setPointsToAdd] = useState('')
  const [selectedProducts, setSelectedProducts] = useState({})
  const [addingPoints, setAddingPoints] = useState(false)
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef(null)
  const html5QrRef = useRef(null)

  const loyaltyMode = merchant?.loyalty_mode || 'euro'
  const products = merchant?.products || []

  useEffect(() => {
    if (!merchant?.id) return
    const load = async () => {
      const { data } = await supabase.from('customers').select('*, profiles(full_name, email)').eq('merchant_id', merchant.id)
      setCustomers(data || [])
    }
    load()
  }, [merchant?.id])

  // Démarrer le scanner
  const startScanner = async () => {
    setScanning(true)
    setTimeout(async () => {
      try {
        const html5Qr = new Html5Qrcode('qr-scanner-container')
        html5QrRef.current = html5Qr
        await html5Qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (decodedText) => {
            await stopScanner()
            try {
              const data = JSON.parse(decodedText)
              if (data.customerId) {
                const customer = customers.find(c => c.id === data.customerId)
                if (customer) {
                  openModal(customer)
                } else {
                  // Client pas encore chargé, on va le chercher
                  const { data: freshCustomer } = await supabase
                    .from('customers')
                    .select('*, profiles(full_name, email)')
                    .eq('id', data.customerId)
                    .eq('merchant_id', merchant.id)
                    .single()
                  if (freshCustomer) {
                    setCustomers(cs => [...cs.filter(c => c.id !== freshCustomer.id), freshCustomer])
                    openModal(freshCustomer)
                  } else {
                    toastError('Ce client n\'appartient pas à votre boulangerie')
                  }
                }
              }
            } catch (e) {
              toastError('QR code invalide')
            }
          },
          () => {}
        )
      } catch (e) {
        toastError('Impossible d\'accéder à la caméra')
        setScanning(false)
      }
    }, 300)
  }

  const stopScanner = async () => {
    try {
      if (html5QrRef.current) {
        await html5QrRef.current.stop()
        html5QrRef.current = null
      }
    } catch (e) {}
    setScanning(false)
  }

  useEffect(() => {
    return () => { stopScanner() }
  }, [])

  const filtered = customers
    .filter(c => {
      const name = c.profiles?.full_name?.toLowerCase() || ''
      const email = c.profiles?.email?.toLowerCase() || ''
      const q = search.toLowerCase()
      return name.includes(q) || email.includes(q)
    })
    .sort((a,b) => b.points - a.points)

  const totalPointsFromProducts = () =>
    Object.entries(selectedProducts).reduce((sum, [name, qty]) => {
      const product = products.find(p => p.name === name)
      return sum + (product ? product.points * qty : 0)
    }, 0)

  const openModal = (customer) => {
    setSelectedCustomer(customer)
    setSelectedProducts({})
    setPointsToAdd('')
  }

  const handleAddPoints = async () => {
    if (!selectedCustomer) return
    const pts = loyaltyMode === 'euro' ? Number(pointsToAdd) : totalPointsFromProducts()
    if (!pts || pts <= 0) return
    setAddingPoints(true)
    try {
      const desc = loyaltyMode === 'products'
        ? Object.entries(selectedProducts).filter(([,q]) => q > 0).map(([name, qty]) => `${name} x${qty}`).join(', ')
        : 'Points ajoutés par le commerçant'
      await supabase.from('customers').update({ points: selectedCustomer.points + pts }).eq('id', selectedCustomer.id)
      await supabase.from('transactions').insert({ customer_id: selectedCustomer.id, merchant_id: merchant.id, points: pts, type: 'earn', description: desc })
      setCustomers(cs => cs.map(c => c.id === selectedCustomer.id ? {...c, points: c.points + pts} : c))
      success(`+${pts} points attribués à ${selectedCustomer.profiles?.full_name} !`)
      setSelectedCustomer(null)
    } catch (e) { toastError("Erreur lors de l'ajout de points") }
    finally { setAddingPoints(false) }
  }

  return (
    <div className="animate-mount">
      <ToastContainer toasts={toasts} />

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:'#1e3a5f',marginBottom:4}}>Clients</h2>
          <p style={{color:'#78716c',fontSize:14}}>{customers.length} client{customers.length>1?'s':''} inscrit{customers.length>1?'s':''}</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'#eff6ff',borderRadius:10,border:'1px solid #bfdbfe'}}>
            {loyaltyMode === 'euro'
              ? <><Euro style={{width:14,height:14,color:'#1e40af'}} /><span style={{fontSize:13,fontWeight:600,color:'#1e40af'}}>Mode euro</span></>
              : <><ShoppingBag style={{width:14,height:14,color:'#1e40af'}} /><span style={{fontSize:13,fontWeight:600,color:'#1e40af'}}>Mode produit</span></>
            }
          </div>
          <button onClick={startScanner}
            style={{display:'flex',alignItems:'center',gap:8,padding:'8px 16px',background:'linear-gradient(135deg,#1e40af,#3b82f6)',color:'white',fontWeight:600,fontSize:14,borderRadius:10,border:'none',cursor:'pointer'}}>
            <ScanLine style={{width:16,height:16}} /> Scanner
          </button>
        </div>
      </div>

      {/* SCANNER */}
      {scanning && (
        <div style={{background:'white',borderRadius:16,border:'2px solid #3b82f6',marginBottom:16,overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid #dbeafe'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <ScanLine style={{width:18,height:18,color:'#3b82f6'}} />
              <p style={{fontWeight:600,color:'#1e3a5f',fontSize:15}}>Scanner le QR code client</p>
            </div>
            <button onClick={stopScanner} style={{background:'#fff1f2',border:'none',borderRadius:8,padding:6,cursor:'pointer',display:'flex'}}>
              <X style={{width:16,height:16,color:'#e11d48'}} />
            </button>
          </div>
          <div style={{padding:16}}>
            <div id="qr-scanner-container" style={{width:'100%',borderRadius:12,overflow:'hidden'}} ref={scannerRef} />
            <p style={{textAlign:'center',fontSize:13,color:'#78716c',marginTop:12}}>Dirigez la caméra vers le QR code du client</p>
          </div>
        </div>
      )}

      <div style={{position:'relative',marginBottom:16}}>
        <Search style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client..." className="input-base" style={{paddingLeft:40}} />
      </div>

      {filtered.length === 0 && !scanning ? (
        <div style={{background:'white',borderRadius:16,border:'1px solid #dbeafe',padding:48,textAlign:'center'}}>
          <Users style={{width:48,height:48,color:'#bfdbfe',margin:'0 auto 12px'}} />
          <p style={{fontWeight:600,color:'#1e3a5f',marginBottom:4}}>Aucun client pour l'instant</p>
          <p style={{color:'#a8a29e',fontSize:14,marginBottom:20}}>Vos clients apparaîtront ici après avoir scanné votre QR code</p>
          <button onClick={startScanner}
            style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',background:'#eff6ff',color:'#1e40af',fontWeight:600,fontSize:14,borderRadius:10,border:'1px solid #bfdbfe',cursor:'pointer'}}>
            <ScanLine style={{width:16,height:16}} /> Scanner un client
          </button>
        </div>
      ) : (
        filtered.length > 0 && (
          <div style={{background:'white',borderRadius:16,border:'1px solid #dbeafe',overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:16,padding:'12px 20px',background:'#f8faff',borderBottom:'1px solid #dbeafe',fontSize:12,fontWeight:500,color:'#a8a29e',textTransform:'uppercase',letterSpacing:'0.05em'}}>
              <span>Client</span>
              <span style={{textAlign:'right'}}>Points</span>
              <span style={{textAlign:'right'}}>Inscrit</span>
              <span style={{textAlign:'right'}}>Action</span>
            </div>
            {filtered.map((customer,i) => (
              <div key={customer.id} style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:16,alignItems:'center',padding:'16px 20px',borderBottom:'1px solid #f8faff'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#1e40af',fontSize:14,flexShrink:0}}>
                    {customer.profiles?.full_name?.[0]?.toUpperCase()||'?'}
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <p style={{fontWeight:500,color:'#1e3a5f',fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {customer.profiles?.full_name||'Client'}
                      </p>
                      {i===0 && customers.length>1 && (
                        <span style={{display:'flex',alignItems:'center',gap:4,padding:'2px 8px',background:'#fefce8',color:'#854d0e',borderRadius:99,fontSize:11,fontWeight:500,flexShrink:0}}>
                          <TrendingUp style={{width:10,height:10}} /> Top
                        </span>
                      )}
                    </div>
                    <p style={{fontSize:12,color:'#a8a29e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{customer.profiles?.email}</p>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'#eff6ff',borderRadius:8}}>
                  <Star style={{width:14,height:14,color:'#3b82f6'}} />
                  <span style={{fontWeight:700,color:'#1e40af',fontSize:14}}>{customer.points}</span>
                </div>
                <span style={{fontSize:12,color:'#a8a29e',textAlign:'right'}}>
                  {format(new Date(customer.created_at),'d MMM',{locale:fr})}
                </span>
                <button onClick={() => openModal(customer)}
                  style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'#eff6ff',border:'none',borderRadius:8,cursor:'pointer',color:'#1e40af',fontSize:13,fontWeight:500}}>
                  <Plus style={{width:14,height:14}} /> Pts
                </button>
              </div>
            ))}
          </div>
        )
      )}

      <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title="Attribuer des points">
        {selectedCustomer && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:16,background:'#f8faff',borderRadius:12}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#1e40af',fontSize:16}}>
                {selectedCustomer.profiles?.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{fontWeight:600,color:'#1e3a5f'}}>{selectedCustomer.profiles?.full_name}</p>
                <p style={{fontSize:14,color:'#78716c'}}>{selectedCustomer.points} points actuellement</p>
              </div>
            </div>

            {loyaltyMode === 'euro' && (
              <>
                <div>
                  <label style={{display:'block',fontSize:14,fontWeight:500,color:'#44403c',marginBottom:6}}>Points à ajouter</label>
                  <div style={{position:'relative'}}>
                    <input type="number" min="1" value={pointsToAdd} onChange={e => setPointsToAdd(e.target.value)}
                      placeholder="Ex: 50" className="input-base" style={{paddingRight:40}} autoFocus />
                    <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'#a8a29e',fontSize:14}}>pts</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  {[10,25,50,100].map(p => (
                    <button key={p} onClick={() => setPointsToAdd(p.toString())}
                      style={{flex:1,padding:'8px',borderRadius:10,border:'none',fontSize:13,fontWeight:500,cursor:'pointer',background:pointsToAdd==p?'#1e40af':'#eff6ff',color:pointsToAdd==p?'white':'#1e40af'}}>
                      +{p}
                    </button>
                  ))}
                </div>
                {pointsToAdd && (
                  <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:12,padding:12,fontSize:14,color:'#1e3a5f'}}>
                    Nouveau solde : <strong>{selectedCustomer.points + Number(pointsToAdd)} points</strong>
                  </div>
                )}
              </>
            )}

            {loyaltyMode === 'products' && (
              <>
                <div>
                  <label style={{display:'block',fontSize:14,fontWeight:600,color:'#1e3a5f',marginBottom:10}}>Produits achetés</label>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {products.map((product, i) => {
                      const qty = selectedProducts[product.name] || 0
                      return (
                        <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:'#f8faff',borderRadius:12,border:'1px solid #dbeafe'}}>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <span style={{fontSize:18}}>🥐</span>
                            <div>
                              <p style={{fontWeight:500,color:'#1e3a5f',fontSize:14}}>{product.name}</p>
                              <p style={{fontSize:12,color:'#3b82f6',fontWeight:600}}>{product.points} pts / unité</p>
                            </div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <button onClick={() => setSelectedProducts(s => ({...s, [product.name]: Math.max(0, (s[product.name]||0) - 1)}))}
                              style={{width:28,height:28,borderRadius:'50%',background:'#dbeafe',border:'none',cursor:'pointer',fontWeight:700,color:'#1e40af',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                            <span style={{fontWeight:700,color:'#1e3a5f',minWidth:20,textAlign:'center'}}>{qty}</span>
                            <button onClick={() => setSelectedProducts(s => ({...s, [product.name]: (s[product.name]||0) + 1}))}
                              style={{width:28,height:28,borderRadius:'50%',background:'#1e40af',border:'none',cursor:'pointer',fontWeight:700,color:'white',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                {totalPointsFromProducts() > 0 && (
                  <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:12,padding:14}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:14,color:'#78716c'}}>Points à attribuer</span>
                      <span style={{fontWeight:800,color:'#1e40af',fontSize:16}}>+{totalPointsFromProducts()} pts</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:14,color:'#78716c'}}>Nouveau solde</span>
                      <span style={{fontWeight:700,color:'#1e3a5f',fontSize:14}}>{selectedCustomer.points + totalPointsFromProducts()} pts</span>
                    </div>
                  </div>
                )}
              </>
            )}

            <div style={{display:'flex',gap:12,paddingTop:4}}>
              <button onClick={() => setSelectedCustomer(null)} className="btn-secondary" style={{flex:1,justifyContent:'center'}}>Annuler</button>
              <button onClick={handleAddPoints}
                disabled={addingPoints || (loyaltyMode==='euro' ? !pointsToAdd : totalPointsFromProducts()===0)}
                className="btn-primary" style={{flex:1,justifyContent:'center'}}>
                {addingPoints ? <Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}} /> : <Plus style={{width:16,height:16}} />}
                Attribuer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

