import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabase'
import { useToast, ToastContainer } from '../../../components/ui/Toast'
import Modal from '../../../components/ui/Modal'
import { Users, Search, Star, Plus, Loader2, TrendingUp, ShoppingBag, Euro, ScanLine, X } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import jsQR from 'jsqr'

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
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const animFrameRef = useRef(null)

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

  const startScanner = async () => {
    setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          scanFrame()
        }
      }, 300)
    } catch (e) {
      toastError('Impossible d\'accéder à la caméra')
      setScanning(false)
    }
  }

  const scanFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        stopScanner()
        handleQRResult(code.data)
        return
      }
    }
    animFrameRef.current = requestAnimationFrame(scanFrame)
  }

  const stopScanner = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setScanning(false)
  }

  const handleQRResult = async (text) => {
    try {
      const data = JSON.parse(text)
      if (data.customerId) {
        let customer = customers.find(c => c.id === data.customerId)
        if (!customer) {
          const { data: fresh } = await supabase
            .from('customers')
            .select('*, profiles(full_name, email)')
            .eq('id', data.customerId)
            .eq('merchant_id', merchant.id)
            .single()
          if (fresh) {
            setCustomers(cs => [...cs, fresh])
            customer = fresh
          } else {
            toastError('Ce client n\'appartient pas à votre boulangerie')
            return
          }
        }
        openModal(customer)
      }
    } catch (e) {
      toastError('QR code invalide')
    }
  }

  useEffect(() => { return () => stopScanner() }, [])

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
          <button onClick={scanning ? stopScanner : startScanner}
            style={{display:'flex',alignItems:'center',gap:8,padding:'8px 16px',background:scanning?'#e11d48':'linear-gradient(135deg,#1e40af,#3b82f6)',color:'white',fontWeight:600,fontSize:14,borderRadius:10,border:'none',cursor:'pointer'}}>
            {scanning ? <><X style={{width:16,height:16}} /> Arrêter</> : <><ScanLine style={{width:16,height:16}} /> Scanner</>}
          </button>
        </div>
      </div>

      {scanning && (
        <div style={{background:'white',borderRadius:16,border:'2px solid #3b82f6',marginBottom:16,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #dbeafe',display:'flex',alignItems:'center',gap:8}}>
            <ScanLine style={{width:18,height:18,color:'#3b82f6'}} />
            <p style={{fontWeight:600,color:'#1e3a5f',fontSize:15}}>Scanner le QR code client</p>
          </div>
          <div style={{padding:16,position:'relative'}}>
            <video ref={videoRef} style={{width:'100%',borderRadius:12,display:'block'}} muted playsInline />
            <canvas ref={canvasRef} style={{display:'none'}} />
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:200,height:200,border:'3px solid #3b82f6',borderRadius:16,pointerEvents:'none'}} />
            <p style={{textAlign:'center',fontSize:13,color:'#78716c',marginTop:12}}>Dirigez la caméra vers le QR code du client</p>
          </div>
        </div>
      )}

      <div style={{position:'relative',marginBottom:16}}>
        <Search style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#a8a29e'}} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client..." className="input-base" style={{paddingLeft:40}} />
      </div>

      {filtered.length === 0 ? (
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
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'#eff6ff


