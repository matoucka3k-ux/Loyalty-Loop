import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';
import {
  LayoutDashboard,
  Gift,
  QrCode,
  Users,
  LogOut,
  Settings,
  ChevronRight,
  Menu,
  Star,
} from 'lucide-react';
import Overview from './sections/Overview';
import LoyaltyProgram from './sections/LoyaltyProgram';
import RewardsSection from './sections/RewardsSection';
import QRCodeSection from './sections/QRCodeSection';
import CustomersSection from './sections/CustomersSection';

const NAV_ITEMS = [
  { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'program', label: 'Programme fidélité', icon: Star },
  { id: 'rewards', label: 'Récompenses', icon: Gift },
  { id: 'qrcode', label: 'QR Code', icon: QrCode },
  { id: 'customers', label: 'Clients', icon: Users },
];

export default function MerchantDashboard() {
  const [section, setSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, merchant, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #f5f5f4' }}>
        <Logo size={28} />
      </div>
      {merchant && (
        <div style={{ padding: 16, borderBottom: '1px solid #f5f5f4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fff7ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {merchant.business_name?.[0]?.toUpperCase() || 'M'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1c1917',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {merchant.business_name}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: '#a8a29e',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      )}
      <nav
        style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSection(item.id);
              setSidebarOpen(false);
            }}
            className={`nav-item ${section === item.id ? 'active' : ''}`}
          >
            <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
            {item.label}
          </button>
        ))}
      </nav>
      <div
        style={{
          padding: '16px 12px',
          borderTop: '1px solid #f5f5f4',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <button className="nav-item">
          <Settings style={{ width: 16, height: 16 }} />
          Paramètres
        </button>
        <button
          onClick={handleSignOut}
          className="nav-item"
          style={{ color: '#ef4444' }}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return <Overview />;
      case 'program':
        return <LoyaltyProgram />;
      case 'rewards':
        return <RewardsSection />;
      case 'qrcode':
        return <QRCodeSection />;
      case 'customers':
        return <CustomersSection />;
      default:
        return <Overview />;
    }
  };

  const currentNav = NAV_ITEMS.find((n) => n.id === section);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#fafaf9',
        overflow: 'hidden',
      }}
    >
      <aside
        style={{
          width: 224,
          background: 'white',
          borderRight: '1px solid #f5f5f4',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SidebarContent />
      </aside>
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
            }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 256,
              background: 'white',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            background: 'white',
            borderBottom: '1px solid #f5f5f4',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 8,
              }}
            >
              <Menu style={{ width: 20, height: 20, color: '#78716c' }} />
            </button>
            <div>
              <h1 style={{ fontWeight: 600, color: '#1c1917', fontSize: 14 }}>
                {currentNav?.label}
              </h1>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  color: '#a8a29e',
                }}
              >
                <span>Dashboard</span>
                <ChevronRight style={{ width: 12, height: 12 }} />
                <span style={{ color: '#78716c' }}>{currentNav?.label}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: 8,
                color: '#ea580c',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#f97316',
                  display: 'inline-block',
                }}
              />
              Essai gratuit — 12 jours
            </div>
            <button
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              Passer Premium
            </button>
          </div>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
