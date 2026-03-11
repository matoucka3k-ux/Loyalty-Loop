import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { LogOut, ChevronRight, QrCode } from 'lucide-react'
import Logo from '../../components/ui/Logo'
import { QRCodeSVG } from 'qrcode.react'

export default function CustomerDashboard() {
  const { user, profile, signOut } = useAuth()
  const [tab, setTab] = useState('home')
  const [customerData, setCustomerData] = useState(null)
  const [rewards, setRewards] = useState([])
  const [transactions, setTransactions] = useState([])
  const [merchantName, setMerchantName] = useState('')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data: customer } = await supabase.from('customers').select('*, merchants(business_name, points_per_euro)').eq('user_id', user.id).single()
      if (customer) {
        setCustomerData(customer)
        setMerchantName(customer.merchants?.business_name || '')
        const { data: rewardsData } = await supabase.from('rewards').select('*').eq('merchant_id', customer.merchant_id).eq('is_active', true)
        setRewards(rewardsData || [])
        const { data: transactionsData } = await supabase.from('transactions').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false })
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
            <LogOut style={{width:14,height:14}} /> Déconnexion
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
                  <p style={{fontSize:13,color:'#78716c'}}>Découvrez vos récompenses disponibles</p>
                </div>
              )}
            </div>

            {/* BOUTON RAPIDE QR */}
            <button onClick={() => setTab('myqr')} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',background:'linear-gradient(135deg,#1e40af,#3b82f6)',borderRadius:16,border:'none',cursor:'pointer',marginBottom:16,boxShadow:'0 4px 20px -8px rgba(30,64,175,0.3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:40,height:40,background:'rgba(255,255,255,0.2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <QrCode style={{width:20,height:20,color:'white'}} />
                </div>
                <div style={{textAlign:'left'}}>
                  <p style={{color:'white',fontWeight:700,fontSize:14}}>Mon QR code fidélité</p>
                  <p style={{color:'#bfdbfe',fontSize:12}}>À présenter au boulanger</p>
                </div>
              </div>
              <ChevronRight style={{width:18,height:18,color:'#bfdbfe'}} />
            </button>

            {rewards.length > 0 && (
              <div style={{background:'white',borderRadius:20,padding:24,marginBottom:16,boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Récompenses</h3>
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
                        {points >= r.points_required ? '✓ Dispo' : `${r.points_required - points} pts`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rewards.length === 0 && (
              <div style={{background:'white',borderRadius:20,padding:32,textAlign:'center',boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)'}}>
                <span style={{fontSize:40}}>⭐</span>
                <p style={{fontWeight:700,color:'#1e3a5f',marginTop:12,marginBottom:4}}>Continuez à accumuler des points !</p>
                <p style={{fontSize:13,color:'#78716c'}}>Des récompenses seront bientôt disponibles.</p>
              </div>
            )}
          </div>
        )}

        {/* MON QR CODE */}
        {tab === 'myqr' && (
          <div>
            <h2 style={{fontSize:18,fontWeight:800,color:'#1e3a5f',margin:'24px 0 16px'}}>Mon QR code</h2>
            <div style={{background:'white',borderRadius:20,padding:32,textAlign:'center',boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)',marginBottom:16}}>
              <p style={{fontSize:14,color:'#78716c',marginBottom:24}}>Présentez ce QR code à votre boulanger pour qu'il puisse vous attribuer des points.</p>
              <div style={{display:'inline-block',padding:24,background:'white',borderRadius:16,border:'2px solid #dbeafe',marginBottom:24}}>
                <QRCodeSVG
                  value={JSON.stringify({ customerId: customerData?.id, userId: user?.id })}
                  size={200}
                  fgColor="#1e40af"
                  bgColor="white"
                />
              </div>
              <p style={{fontWeight:700,color:'#1e3a5f',fontSize:16,marginBottom:4}}>{profile?.full_name}</p>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'#eff6ff',borderRadius:99,marginTop:8}}>
                <span style={{fontWeight:800,color:'#1e40af',fontSize:18}}>{points}</span>
                <span style={{fontSize:13,color:'#3b82f6'}}>points</span>
              </div>
            </div>
            <div style={{background:'#eff6ff',borderRadius:16,padding:20,border:'1px solid #bfdbfe'}}>
              <p style={{fontWeight:600,color:'#1e3a5f',fontSize:14,marginBottom:8}}>💡 Comment ça marche ?</p>
              <p style={{fontSize:13,color:'#1e3a5f',lineHeight:1.6}}>À chaque visite, montrez ce QR code au comptoir. Le boulanger le scanne, sélectionne vos achats et vos points sont crédités automatiquement.</p>
            </div>
          </div>
        )}

        {/* REWARDS */}
        {tab === 'rewards' && (
          <div>
            <h2 style={{fontSize:18,fontWeight:800,color:'#1e3a5f',margin:'24px 0 16px'}}>Récompenses</h2>
            {rewards.length === 0 ? (
              <div style={{background:'white',borderRadius:20,padding:40,textAlign:'center',boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)'}}>
                <span style={{fontSize:48}}>🥐</span>
                <p style={{fontWeight:700,color:'#1e3a5f',marginTop:16,marginBottom:8}}>Aucune récompense pour l'instant</p>
                <p style={{fontSize:14,color:'#78716c'}}>La boulangerie n'a pas encore ajouté de récompenses.</p>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {rewards.sort((a,b) => a.points_required - b.points_required).map((r,i) => (
                  <div key={i} style={{background:'white',borderRadius:16,padding:20,boxShadow:'0 2px 12px -4px rgba(30,64,175,0.08)',border:points>=r.points_required?'2px solid #86efac':'2px solid transparent'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:44,height:44,borderRadius:12,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>🥐</div>
                        <div>
                          <p style={{fontWeight:700,color:'#1e3a5f',marginBottom:4}}>{r.title}</p>
                          <p style={{fontSize:13,color:'#78716c'}}>{r.description}</p>
                        </div>
                      </div>
                      <div style={{textAlign:'right',flexShrink:0,marginLeft:12}}>
                        <p style={{fontWeight:800,color:'#1e40af',fontSize:16}}>{r.points_required}</p>
                        <p style={{fontSize:11,color:'#a8a29e'}}>points</p>
                      </div>
                    </div>
                    {points >= r.points_required && (
                      <div style={{marginTop:12,padding:'8px 12px',background:'#f0fdf4',borderRadius:8,fontSize:13,color:'#16a34a',fontWeight:600,textAlign:'center'}}>
                        ✓ Disponible — Montrez ceci à votre boulanger
                      </div>
                    )}
                    {points < r.points_required && (
                      <div style={{marginTop:12}}>
                        <div style={{background:'#dbeafe',borderRadius:99,height:4}}>
                          <div style={{width:`${Math.min((points/r.points_required)*100,100)}%`,background:'#3b82f6',borderRadius:99,height:4}} />
                        </div>
                        <p style={{fontSize:11,color:'#a8a29e',marginTop:4}}>Plus que {r.points_required - points} points</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HISTORY */}
        {tab === 'history' && (
          <div>
            <h2 style={{fontSize:18,fontWeight:800,color:'#1e3a5f',margin:'24px 0 16px'}}>Historique</h2>
            {transactions.length === 0 ? (
              <div style={{background:'white',borderRadius:20,padding:40,textAlign:'center',boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)'}}>
                <span style={{fontSize:48}}>📋</span>
                <p style={{fontWeight:700,color:'#1e3a5f',marginTop:16,marginBottom:8}}>Aucune transaction pour l'instant</p>
                <p style={{fontSize:14,color:'#78716c'}}>Vos points apparaîtront ici après chaque visite.</p>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {transactions.map((t,i) => (
                  <div key={i} style={{background:'white',borderRadius:14,padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 2px 8px -4px rgba(30,64,175,0.06)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{width:36,height:36,borderRadius:'50%',background:t.type==='earn'?'#eff6ff':'#fff1f2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>
                        {t.type === 'earn' ? '⭐' : '🥐'}
                      </div>
                      <div>
                        <p style={{fontWeight:600,color:'#1e3a5f',fontSize:13}}>{t.description || (t.type==='earn'?'Points gagnés':'Récompense utilisée')}</p>
                        <p style={{fontSize:11,color:'#a8a29e'}}>{new Date(t.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <span style={{fontWeight:700,color:t.type==='earn'?'#16a34a':'#e11d48',fontSize:15}}>
                      {t.type === 'earn' ? '+' : '-'}{t.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:'white',borderTop:'1px solid #dbeafe',display:'flex',padding:'8px 0'}}>
        {[
          { id:'home', icon:'🏠', label:'Accueil' },
          { id:'myqr', icon:'📱', label:'Mon QR' },
          { id:'rewards', icon:'🥐', label:'Récompenses' },
          { id:'history', icon:'📋', label:'Historique' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'8px',background:'none',border:'none',cursor:'pointer'}}>
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontSize:11,fontWeight:600,color:tab===t.id?'#1e40af':'#a8a29e'}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}


