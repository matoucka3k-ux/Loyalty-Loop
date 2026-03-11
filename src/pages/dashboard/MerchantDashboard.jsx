import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Star, Gift, QrCode, Users, LogOut, Menu, X } from 'lucide-react'
import Logo from '../../components/ui/Logo'
import Overview from './sections/Overview'
import LoyaltyProgram from './sections/LoyaltyProgram'
import RewardsSection from './sections/RewardsSection'
import QRCodeSection from './sections/QRCodeSection'
import CustomersSection from './sections/CustomersSection'

const navItems = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'loyalty', label: 'Programme fidélité', icon: Star },
  { id: 'rewards', label: 'Récompenses', icon: Gift },
  { id: 'qrcode', label: 'QR Code', icon: QrCode },
  { id: 'customers', label: 'Clients', icon: Users },
]

export default function MerchantDashboard() {
  const { merchant, signOut } = useAuth()
  const [section, setSection] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)

  const renderSection = () => {
    switch(section) {
      case 'overview': return <Overview />
      case 'loyalty': return <LoyaltyProgram />
      case 'rewards': return <RewardsSection />
      case 'qrcode': return <QRCodeSection />
      case 'customers': return <CustomersSection />
      default: return <Overview />
    }
  }

  const SidebarContent = () => (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'24px 20px',borderBottom:'1px solid #dbeafe'}}>
        <Logo />
        {merchant?.business_name && (
          <p style={{fontSize:12,color:'#3b82f6',marginTop:8,fontWeight:500}}>🥐 {merchant.business_name}</p>
        )}
      </div>
      <nav style={{flex:1,padding:'16px 12px',display:'flex',flexDirection:'column',gap:4}}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setSection(item.id); setMobileOpen(false) }}
            className={`nav-item ${section === item.id ? 'active' : ''}`}>
            <item.icon style={{width:18,height:18}} />
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{padding:'16px 12px',borderTop:'1px solid #dbeafe'}}>
        <button onClick={signOut} className="nav-item" style={{color:'#e11d48'}}>
          <LogOut style={{width:18,height:18}} />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f8faff'}}>

      {/* SIDEBAR DESKTOP */}
      <div style={{width:240,background:'white',borderRight:'1px solid #dbeafe',position:'fixed',top:0,left:0,bottom:0,zIndex:40,display:'flex',flexDirection:'column'}}>
        <SidebarContent />
      </div>

      {/* SIDEBAR MOBILE */}
      {mobileOpen && (
        <div style={{position:'fixed',inset:0,zIndex:50}}>
          <div onClick={() => setMobileOpen(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.3)'}} />
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:240,background:'white',zIndex:51}}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={{marginLeft:240,flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{background:'white',borderBottom:'1px solid #dbeafe',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:30}}>
          <button onClick={() => setMobileOpen(true)} style={{background:'none',border:'none',cursor:'pointer',display:'none'}}>
            <Menu style={{width:20,height:20}} />
          </button>
          <h1 style={{fontSize:16,fontWeight:700,color:'#1e3a5f'}}>
            {navItems.find(n => n.id === section)?.label}
          </h1>
          <div style={{width:32}} />
        </div>
        <div style={{flex:1,padding:24,maxWidth:960,width:'100%',margin:'0 auto'}}>
          {renderSection()}
        </div>
      </div>

    </div>
  )
}

