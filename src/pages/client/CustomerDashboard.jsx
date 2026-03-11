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
            <h2 style={{fontSize:18,fontWeight:800,color:'#1e3a5f',margin:'24px 0 16px'}}>Mon QR code</h2>
            <div style={{background:'white',borderRadius:20,padding:32,textAlign:'center',boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)',marginBottom:16}}>
              <p style={{fontSize:14,color:'#78716c',marginBottom:24}}>Presentez ce QR code a votre boulanger pour recevoir vos points.</p>
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
              <p style={{fontWeight:600,color:'#1e3a5f',fontSize:14,marginBottom:8}}>Comment ca marche ?</p>
              <p style={{fontSize:13,color:'#1e3a5f',lineHeight:1.6}}>A chaque visite, montrez ce QR code au comptoir. Le boulanger le scanne et vos points sont credites automatiquement.</p>
            </div>
          </div>
        )}

        {/* REWARDS */}
        {tab === 'rewards' && (
          <div>
            <h2 style={{fontSize:18,fontWeight:800,color:'#1e3a5f',margin:'24px 0 16px'}}>Recompenses</h2>
            {rewards.length === 0 ? (
              <div style={{background:'white',borderRadius:20,padding:40,textAlign:'center',boxShadow:'0 4px 20px -8px rgba(30,64,175,0.1)'}}>
                <span style={{fontSize:48}}>🥐</span>
                <p style={{fontWeight:700,color:'#1e3a5f',marginTop:16,marginBottom:8}}>Aucune recompense pour l'instant</p>
                <p style={{fontSize:14,color:'#78716c'}}>La boulangerie n'a pas encore ajoute de recompenses.</p>
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
                        Disponible - Montrez ceci a votre boulanger
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
                <p style={{fontSize:14,color:'#78716c'}}>Vos points apparaitront ici apres chaque visite.</p>
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
                        <p style={{fontWeight:600,color:'#1e3a5f',fontSize:13}}>{t.description || (t.type==='earn'?'Points gagnes':'Recompense utilisee')}</p>
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

        {/* COMPTE */}
        {tab === 'account' && (
          <div>
            <h2 style={{fontSize:18,fontWeight:800,color:'#1e3a5f',margin:'24px 0 16px'}}>Mon compte</h2>

            <div style={{display:'flex',background:'white',borderRadius:14,padding:4,marginBottom:16,border:'1px solid #dbeafe'}}>
              {[
                {id:'profile', label:'Profil'},
                {id:'legal', label:'Legal'},
                {id:'about', label:'A propos'},
              ].map(t => (
                <button key={t.id} onClick={() => setAccountTab(t.id)}
                  style={{flex:1,padding:'8px',borderRadius:10,border:'none',fontWeight:600,fontSize:13,cursor:'pointer',background:accountTab===t.id?'#eff6ff':'transparent',color:accountTab===t.id?'#1e40af':'#78716c',transition:'all 0.2s'}}>
                  {t.label}
                </button>
              ))}
            </div>

            {accountTab === 'profile' && (
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{background:'white',borderRadius:20,padding:24,border:'1px solid #dbeafe'}}>
                  <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
                    <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#1e40af,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800,color:'white'}}>
                      {profile?.full_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{fontWeight:800,color:'#1e3a5f',fontSize:16}}>{profile?.full_name}</p>
                      <p style={{fontSize:13,color:'#78716c'}}>{user?.email}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#f8faff',borderRadius:12}}>
                      <Mail style={{width:16,height:16,color:'#3b82f6',flexShrink:0}} />
                      <div>
                        <p style={{fontSize:11,color:'#a8a29e',marginBottom:2}}>Email</p>
                        <p style={{fontSize:14,color:'#1e3a5f',fontWeight:500}}>{user?.email}</p>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#f8faff',borderRadius:12}}>
                      <Star style={{width:16,height:16,color:'#3b82f6',flexShrink:0}} />
                      <div>
                        <p style={{fontSize:11,color:'#a8a29e',marginBottom:2}}>Points accumules</p>
                        <p style={{fontSize:14,color:'#1e3a5f',fontWeight:700}}>{points} points</p>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#f8faff',borderRadius:12}}>
                      <User style={{width:16,height:16,color:'#3b82f6',flexShrink:0}} />
                      <div>
                        <p style={{fontSize:11,color:'#a8a29e',marginBottom:2}}>Boulangerie</p>
                        <p style={{fontSize:14,color:'#1e3a5f',fontWeight:500}}>{merchantName}</p>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#f8faff',borderRadius:12}}>
                      <FileText style={{width:16,height:16,color:'#3b82f6',flexShrink:0}} />
                      <div>
                        <p style={{fontSize:11,color:'#a8a29e',marginBottom:2}}>Membre depuis</p>
                        <p style={{fontSize:14,color:'#1e3a5f',fontWeight:500}}>
                          {customerData?.created_at
                            ? new Date(customerData.created_at).toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'})
                            : '-'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={signOut}
                  style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',background:'#fff1f2',color:'#e11d48',fontWeight:700,fontSize:14,borderRadius:14,border:'1px solid #fecdd3',cursor:'pointer'}}>
                  <LogOut style={{width:16,height:16}} /> Se deconnecter
                </button>
              </div>
            )}

            {accountTab === 'legal' && (
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{background:'white',borderRadius:20,padding:24,border:'1px solid #dbeafe'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                    <Shield style={{width:20,height:20,color:'#3b82f6'}} />
                    <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Donnees personnelles & RGPD</h3>
                  </div>
                  <p style={{fontSize:14,color:'#44403c',lineHeight:1.7,marginBottom:12}}>
                    FideliPain collecte uniquement les donnees necessaires au fonctionnement du service : votre nom, email et historique de points.
                  </p>
                  <p style={{fontSize:14,color:'#44403c',lineHeight:1.7,marginBottom:12}}>
                    Vos donnees ne sont jamais vendues ni partagees avec des tiers. Elles sont utilisees uniquement pour gerer votre programme de fidelite.
                  </p>
                  <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>
                    Conformement au RGPD, vous disposez d'un droit d'acces, de rectification et de suppression de vos donnees en contactant : <strong style={{color:'#1e40af'}}>contact@fidelipain.fr</strong>
                  </p>
                </div>

                <div style={{background:'white',borderRadius:20,padding:24,border:'1px solid #dbeafe'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                    <FileText style={{width:20,height:20,color:'#3b82f6'}} />
                    <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Conditions d'utilisation</h3>
                  </div>
                  <p style={{fontSize:14,color:'#44403c',lineHeight:1.7,marginBottom:12}}>
                    En utilisant FideliPain, vous acceptez que vos points de fidelite sont geres par la boulangerie adherente et n'ont aucune valeur monetaire.
                  </p>
                  <p style={{fontSize:14,color:'#44403c',lineHeight:1.7,marginBottom:12}}>
                    Les recompenses sont soumises a la disponibilite des produits. FideliPain n'est pas responsable des litiges entre clients et commercants.
                  </p>
                  <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>
                    FideliPain se reserve le droit de modifier le service a tout moment avec notification prealable.
                  </p>
                </div>

                <div style={{background:'white',borderRadius:20,padding:24,border:'1px solid #dbeafe'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                    <FileText style={{width:20,height:20,color:'#3b82f6'}} />
                    <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15}}>Mentions legales</h3>
                  </div>
                  <p style={{fontSize:14,color:'#44403c',lineHeight:1.8}}>
                    <strong>FideliPain</strong><br />
                    Co-fondateurs : Mathis Bobo et Florian Buisson<br />
                    Email : contact@fidelipain.fr<br />
                    Hebergement : Vercel Inc., San Francisco, USA<br />
                    Droit applicable : droit francais
                  </p>
                </div>
              </div>
            )}

            {accountTab === 'about' && (
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{background:'linear-gradient(135deg,#1e40af,#3b82f6)',borderRadius:20,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:48,marginBottom:12}}>🥐</div>
                  <h3 style={{fontWeight:800,color:'white',fontSize:20,marginBottom:8}}>FideliPain</h3>
                  <p style={{color:'#bfdbfe',fontSize:14,marginBottom:4}}>Version 1.0</p>
                  <p style={{color:'#bfdbfe',fontSize:13}}>Le programme de fidelite digital pour les boulangeries</p>
                </div>

                <div style={{background:'white',borderRadius:20,padding:24,border:'1px solid #dbeafe'}}>
                  <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15,marginBottom:16}}>Notre mission</h3>
                  <p style={{fontSize:14,color:'#44403c',lineHeight:1.7}}>
                    FideliPain aide les boulangers independants a fideliser leur clientele grace a un systeme de points simple et moderne. Plus besoin de cartes tampons perdues — tout est sur le telephone !
                  </p>
                </div>

                <div style={{background:'white',borderRadius:20,padding:24,border:'1px solid #dbeafe'}}>
                  <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15,marginBottom:16}}>L'equipe</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {[
                      {name:'Mathis Bobo', role:'Co-fondateur & CEO'},
                      {name:'Florian Buisson', role:'Co-fondateur & CEO'},
                    ].map((p,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#f8faff',borderRadius:12}}>
                        <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#1e40af,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'white',fontSize:16,flexShrink:0}}>
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

                <div style={{background:'white',borderRadius:20,padding:24,border:'1px solid #dbeafe'}}>
                  <h3 style={{fontWeight:700,color:'#1e3a5f',fontSize:15,marginBottom:16}}>Nous contacter</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    <a href="mailto:contact@fidelipain.fr"
                      style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#eff6ff',borderRadius:12,textDecoration:'none'}}>
                      <Mail style={{width:16,height:16,color:'#3b82f6',flexShrink:0}} />
                      <span style={{fontSize:14,color:'#1e40af',fontWeight:500}}>contact@fidelipain.fr</span>
                    </a>
                  </div>
                </div>

                <div style={{textAlign:'center',padding:'16px 0'}}>
                  <p style={{fontSize:12,color:'#a8a29e'}}>© 2025 FideliPain — Mathis Bobo & Florian Buisson</p>
                  <p style={{fontSize:12,color:'#a8a29e',marginTop:4}}>Tous droits reserves</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:'white',borderTop:'1px solid #dbeafe',display:'flex',padding:'8px 0'}}>
        {[
          {id:'home', icon:'🏠', label:'Accueil'},
          {id:'myqr', icon:'📱', label:'Mon QR'},
          {id:'rewards', icon:'🥐', label:'Recompenses'},
          {id:'history', icon:'📋', label:'Historique'},
          {id:'account', icon:'👤', label:'Compte'},
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'8px',background:'none',border:'none',cursor:'pointer'}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:600,color:tab===t.id?'#1e40af':'#a8a29e'}}>{t.label}</span>
          </button>
        ))}
      </div>

    </div>
  )
}



