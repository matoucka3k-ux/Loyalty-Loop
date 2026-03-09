import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  getMerchantStats,
  getRecentTransactions,
} from '../../../services/merchantService';
import {
  Users,
  Star,
  Gift,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DEMO_STATS = {
  totalCustomers: 47,
  totalPoints: 3842,
  redeemedRewards: 23,
};
const DEMO_TRANSACTIONS = [
  {
    id: 1,
    type: 'earn',
    points: 50,
    description: 'Achat',
    created_at: new Date().toISOString(),
    customers: { profiles: { full_name: 'Marie Dupont' } },
  },
  {
    id: 2,
    type: 'earn',
    points: 30,
    description: 'Achat',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    customers: { profiles: { full_name: 'Thomas Bernard' } },
  },
  {
    id: 3,
    type: 'redeem',
    points: -100,
    description: 'Récompense débloquée',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    customers: { profiles: { full_name: 'Sophie Laurent' } },
  },
  {
    id: 4,
    type: 'earn',
    points: 75,
    description: 'Achat',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    customers: { profiles: { full_name: 'Pierre Martin' } },
  },
];

export default function Overview() {
  const { merchant } = useAuth();
  const [stats, setStats] = useState(DEMO_STATS);
  const [transactions, setTransactions] = useState(DEMO_TRANSACTIONS);

  useEffect(() => {
    if (!merchant?.id) return;
    const load = async () => {
      try {
        const [s, t] = await Promise.all([
          getMerchantStats(merchant.id),
          getRecentTransactions(merchant.id, 8),
        ]);
        setStats(s);
        if (t.length > 0) setTransactions(t);
      } catch (e) {}
    };
    load();
  }, [merchant?.id]);

  const statCards = [
    {
      label: 'Clients inscrits',
      value: stats.totalCustomers,
      icon: Users,
      color: '#eff6ff',
      iconColor: '#3b82f6',
      trend: '+12%',
    },
    {
      label: 'Points distribués',
      value: stats.totalPoints.toLocaleString(),
      icon: Star,
      color: '#fff7ed',
      iconColor: '#f97316',
      trend: '+8%',
    },
    {
      label: 'Récompenses débloquées',
      value: stats.redeemedRewards,
      icon: Gift,
      color: '#fff1f2',
      iconColor: '#f43f5e',
      trend: '+23%',
    },
    {
      label: 'Taux de rétention',
      value: '68%',
      icon: TrendingUp,
      color: '#f0fdf4',
      iconColor: '#22c55e',
      trend: '+5%',
    },
  ];

  return (
    <div className="animate-mount">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1c1917' }}>
            Bonjour, {merchant?.business_name || 'Commerçant'} 👋
          </h2>
          <p style={{ color: '#78716c', fontSize: 14, marginTop: 2 }}>
            Voici l'activité de votre programme de fidélité
          </p>
        </div>
        <p style={{ fontSize: 12, color: '#a8a29e' }}>
          {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <s.icon style={{ width: 16, height: 16, color: s.iconColor }} />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  color: '#16a34a',
                  fontWeight: 500,
                }}
              >
                <ArrowUpRight style={{ width: 12, height: 12 }} />
                {s.trend}
              </div>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#1c1917' }}>
              {s.value}
            </p>
            <p style={{ fontSize: 12, color: '#78716c', marginTop: 2 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #f5f5f4',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #f5f5f4',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock style={{ width: 16, height: 16, color: '#a8a29e' }} />
            <span style={{ fontWeight: 600, color: '#1c1917', fontSize: 14 }}>
              Activité récente
            </span>
          </div>
          <span style={{ fontSize: 12, color: '#a8a29e' }}>
            {transactions.length} transactions
          </span>
        </div>
        <div>
          {transactions.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 24px',
                borderBottom: '1px solid #fafaf9',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: t.type === 'earn' ? '#fff7ed' : '#fff1f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {t.type === 'earn' ? '⭐' : '🎁'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#1c1917',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.customers?.profiles?.full_name || 'Client'}
                </p>
                <p style={{ fontSize: 12, color: '#a8a29e' }}>
                  {t.description}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: t.type === 'earn' ? '#f97316' : '#f43f5e',
                  }}
                >
                  {t.type === 'earn' ? '+' : ''}
                  {t.points} pts
                </p>
                <p style={{ fontSize: 12, color: '#a8a29e' }}>
                  {format(new Date(t.created_at), 'HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
