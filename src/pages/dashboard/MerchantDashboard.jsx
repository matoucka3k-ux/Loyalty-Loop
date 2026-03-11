import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Star, Gift, QrCode, Users, LogOut, User } from 'lucide-react'
import Logo from '../../components/ui/Logo'
import Overview from './sections/Overview'
import LoyaltyProgram from './sections/LoyaltyProgram'
import RewardsSection from './sections/RewardsSection'
import QRCodeSection from './sections/QRCodeSection'
import CustomersSection from './sections/CustomersSection'
import AccountSection from './sections/AccountSection'

const navItems = [
  { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'loyalty', label: 'Programme fidelite', icon: Star },
  { id: 'rewards', label: 'Recompenses', icon: Gift },
  { id: 'qrcode', label: 'QR Code', icon: QrCode },
  { id: 'customers', label: 'Clients', icon: Users },
  { id: 'account', label: 'Mon compte', icon: User },
]

export default function MerchantDashboard() {
  const { merchant, signOut } = useAuth()
  const [section, setSection] = useState('overview')

  const renderSection = () => {
    switch(section) {
      case 'overview': return <Overview />
      case 'loyalty': return <LoyaltyProgram />
      case 'rewards': return <RewardsSection />
      case 'qrcode': return <QRCodeSection />
      case 'customers': return <CustomersSection />
      case 'account': return <AccountSection />
      default: return <Overview />
    }
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f8faff'}}>
      <div style={{width:240,background:'white',borderRight:'1px solid #dbeafe',position:'fixed',top:0,left:0,bottom:0,zIndex:40,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'24px 20px',borderBottom:'1px solid #dbeafe'}}>
          <Logo />
          {merchant?.business_name && (
            <p style={{fontSize:12,color:'#3b82f6',marginTop:8,fontWeight:500}}>
              🥐 {merchant.business_name}
            </p>
          )}
        </div>
        <nav style={{flex:1,padding:'16px 12px',display:'flex',flexDirection:'column',gap:4}}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`nav-item ${section === item.id ? 'active' : ''}`}>
              <item.icon style={{width:18,height:18}} />
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{padding:'16px 12px',borderTop:'1px solid #dbeafe'}}>
          <button onClick={signOut} className="nav-item" style={{color:'#e11d48'}}>
            <LogOut style={{width:18,height:18}} />
            Deconnexion
          </button>
        </div>
      </div>

      <div style={{marginLeft:240,flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{background:'white',borderBottom:'1px solid #dbeafe',padding:'16px 24px',position:'sticky',top:0,zIndex:30}}>
          <h1 style={{fontSize:16,fontWeight:700,color:'#1e3a5f'}}>
            {navItems.find(n => n.id === section)?.label}
          </h1>
        </div>
        <div style={{flex:1,padding:24,maxWidth:960,width:'100%',margin:'0 auto'}}>
          {renderSection()}
        </div>
      </div>
    </div>
  )
}


