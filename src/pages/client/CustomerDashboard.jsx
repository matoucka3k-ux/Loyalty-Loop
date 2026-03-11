import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { LogOut, ChevronRight, QrCode, User, Shield, FileText, Star, Mail, Phone } from 'lucide-react'
import Logo from '../../components/ui/Logo'
import { QRCodeSVG } from 'qrcode.react'

export default function CustomerDashboard() {
  const { user, profile, signOut } = useAuth()
  const [tab, setTab] = useState('home')
  const [accountTab, setAccountTab] = useState('profile')
  const [customerData, setCustomerData] = useState(null)
  const [rewards, setRewards] = useState([])
  const [transactions, setTransactions] = useState([])
  const [merchantName, setMerchantName] = useState('')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data: customer } = await supabase
        .from('customers')
        .select('*, merchants(business_name, points_per_euro)')
        .eq('user_id', user.id)
        .single()
      if (customer) {
        setCustomerData(customer)
        setMerchantName(customer.merchants?.business_name || '')
        const { data: rewardsData } = await supabase
          .from('rewards').select('*')
          .eq('merchant_id', customer.merchant_id)
          .eq('is_active', true)
        setRewards(rewardsData || [])
        const { data: transactionsData } = await supabase
          .from('transactions').select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
        setTransactions(transactionsData || [])
      }
    }
    load()
  }, [user])

  const points = customerData?.points || 0
  const nextReward = rewards.sort((a,b) => a.points_required - b.points_required).find(r => r.points_required > points)
  const progress = nextReward ? Math.min((points / nextReward.points_required) * 100, 100) : 100

  return (
    <div style={{minHeight:'100vh',background:'#f8faff',maxWidth:480,margin:'0 auto',position:'relative',paddingBottom:80}}>

      <div style={{background:'linear-gradient(135deg,#1e40af,#3b82f6)',padding:'24px 20px 48px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <Logo light size="sm" />
          <button onClick={signOut} style={{background:'rgba(255,255,255,0.2)',border:'none',borderRadius:8,padding:'6px 12px',color:'white',fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
            <LogOut style={{width:14,height:14}} /> Deconnexion
          </button>
        </div>
        <p style={{color:'#bfdbfe',fontSize:13,marginBottom:4}}>Bonjour, {profile?.full_name?.split(' ')[0]} 👋</p>
        <h1 style={{color:'white',fontSize:28,fontWeight:800,marginBottom:4}}>{points} points</h1>
        <p style={{color:'#bfdbfe',fontSize:13}}>{merchantName}</p>
      </div>

      <div style={{padding:'0 16px',marginTop:-24}}>

        {/* HOME */}
        {tab === 'home' && (
          <div>
            <div style={{background:'white',borderRadius:20,padding:24,marginBottom:16,boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)'}}>
              {nextReward ? (
                <>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                    <span style={{fontSize:14,fontWeight:600,color:'#1e3a5f'}}>Prochain cadeau</span>
                    <span style={{fontSize:13,color:'#3b82f6',fontWeight:600}}>{points}/{nextReward.points_required} pts</span>
                  </div>
                  <div style={{background:'#dbeafe',borderRadius:99,height:8,marginBottom:12}}>
                    <div style={{width:`${progress}%`,background:'linear-gradient(90deg,#1e40af,#3b82f6)',borderRadius:99,height:8,transition:'width 0.5s'}} />
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px',background:'#eff6ff',borderRadius:12}}>
                    <span style={{fontSize:24}}>🥐</span>
                    <div>
                      <p style={{fontWeight:600,color:'#1e3a5f',fontSize:14}}>{nextReward.title}</p>
                      <p style={{fontSize:12,color:'#78716c'}}>Plus que {nextReward.points_required - points} points !</p>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{textAlign:'center',padding:'12px 0'}}>
                  <span style={{fontSize:32}}>🎉</span>
                  <p style={{fontWeight:700,color:'#1e3a5f',marginTop:8}}>Vous avez {points} points !</p>
                  <p style={{fontSize:13,color:'#78716c'}}>Decouvrez vos recompenses disponibles</p>
                </div>
              )}
            </div>

            <button onClick={() => setTab('myqr')} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',background:'linear-gradient(135deg,#1e40af,#3b82f6)',borderRadius:16,border:'none',cursor:'pointer',marginBottom:16,boxShadow:'0 4px 20px -8px rgba(30,64,175,0.3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:40,height:40,background:'rgba(255,255,255,0.2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <QrCode style={{width:20,height:20,color:'white'}} />
                </div>
                <div style={{textAlign:'left'}}>
                  <p style={{color:'white',fontWeight:700,fontSize:14}}>Mon QR code fidelite</p>
                  <p style={{color:'#bfdbfe',fontSize:12}}>A presenter au boulanger</p>
                </div>
              </div>
              <ChevronRight style={{width:18,height:18,color:'#bfdbfe'}} />
            </button>

            {rewards.length > 0 && (
              <div style={{background:'white',borderRadius:20,padding:24,marginBottom:16,boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Recompenses</h3>
                  <button onClick={() => setTab('rewards')} style={{background:'none',border:'none',color:'#3b82f6',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
                    Voir tout <ChevronRight style={{width:14,height:14}} />
                  </button>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {rewards.slice(0,2).map((r,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px',background:'#f8faff',borderRadius:12}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <span style={{fontSize:20}}>🥐</span>
                        <div>
                          <p style={{fontWeight:600,color:'#1e3a5f',fontSize:13}}>{r.title}</p>
                          <p style={{fontSize:12,color:'#78716c'}}>{r.points_required} points</p>
                        </div>
                      </div>
                      <div style={{padding:'4px 10px',borderRadius:99,background:points>=r.points_required?'#f0fdf4':'#eff6ff',color:points>=r.points_required?'#16a34a':'#1e40af',fontSize:12,fontWeight:600}}>
                        {points >= r.points_required ? 'Dispo' : `${r.points_required - points} pts`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rewards.length === 0 && (
              <div style={{background:'white',borderRadius:20,padding:32,textAlign:'center',boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)'}}>
                <span style={{fontSize:40}}>⭐</span>
                <p style={{fontWeight:700,color:'#1e3a5f',marginTop:12,marginBottom:4}}>Continuez a accumuler des points !</p>
                <p style={{fontSize:13,color:'#78716c'}}>Des recompenses seront bientot disponibles.</p>
              </div>
            )}
          </div>
        )}

        {/* MON QR CODE */}
        {tab === 'myqr' && (
          <div>
            <h2 style={{fontSize:18,fontWeight:800,color:'#1e3



