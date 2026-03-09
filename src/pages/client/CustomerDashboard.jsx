import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getCustomerMerchants,
  getCustomerTransactions,
  getAvailableRewards,
  redeemReward,
} from '../../services/customerService';
import { useToast, ToastContainer } from '../../components/ui/Toast';
import Logo from '../../components/ui/Logo';
import { Star, Gift, Clock, LogOut, Trophy, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DEMO_MERCHANT = { id: '1', business_name: 'Boulangerie Martin' };
const DEMO_CUSTOMER = { id: '1', points: 185 };
const DEMO_TRANSACTIONS = [
  {
    id: '1',
    type: 'earn',
    points: 50,
    description: 'Achat',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'earn',
    points: 30,
    description: 'Achat',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    type: 'redeem',
    points: -100,
    description: 'Café offert',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '4',
    type: 'earn',
    points: 75,
    description: 'Achat',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];
const DEMO_REWARDS = [
  {
    id: '1',
    title: 'Café offert',
    description: 'Un café de votre choix',
    points_required: 50,
  },
  {
    id: '2',
    title: 'Croissant gratuit',
    description: 'Un croissant beurre',
    points_required: 30,
  },
  {
    id: '3',
    title: 'Réduction 10%',
    description: 'Sur votre prochain achat',
    points_required: 100,
  },
  {
    id: '4',
    title: 'Viennoiserie VIP',
    description: 'Sélection du boulanger',
    points_required: 200,
  },
];

export default function CustomerDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toasts, success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [customerData, setCustomerData] = useState({
    merchant: DEMO_MERCHANT,
    customer: DEMO_CUSTOMER,
  });
  const [transactions, setTransactions] = useState(DEMO_TRANSACTIONS);
  const [rewards, setRewards] = useState(DEMO_REWARDS);
  const [redeeming, setRedeeming] = useState(null);

  const points = customerData.customer?.points || 0;

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const merchants = await getCustomerMerchants(user.id);
        if (merchants.length > 0) {
          const first = merchants[0];
          setCustomerData({ merchant: first.merchants, customer: first });
          const [t, r] = await Promise.all([
            getCustomerTransactions(first.id),
            getAvailableRewards(first.merchant_id),
          ]);
          if (t.length > 0) setTransactions(t);
          if (r.length > 0) setRewards(r);
        }
      } catch (e) {}
    };
    load();
  }, [user]);

  const handleRedeem = async (reward) => {
    if (points < reward.points_required) return;
    setRedeeming(reward.id);
    try {
      if (user && customerData.customer?.id && customerData.merchant?.id) {
        await redeemReward(
          customerData.customer.id,
          reward.id,
          customerData.merchant.id,
          reward.points_required
        );
      }
      setCustomerData((d) => ({
        ...d,
        customer: {
          ...d.customer,
          points: d.customer.points - reward.points_required,
        },
      }));
      setTransactions((t) => [
        {
          id: Date.now().toString(),
          type: 'redeem',
          points: -reward.points_required,
          description: reward.title,
          created_at: new Date().toISOString(),
        },
        ...t,
      ]);
      success(`🎉 "${reward.title}" débloqué !`);
    } catch (e) {
      toastError('Erreur lors du déblocage');
    } finally {
      setRedeeming(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const nextReward = rewards
    .filter((r) => r.points_required > points)
    .sort((a, b) => a.points_required - b.points_required)[0];
  const progressToNext = nextReward
    ? Math.min((points / nextReward.points_required) * 100, 100)
    : 100;

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Star },
    { id: 'rewards', label: 'Récompenses', icon: Gift },
    { id: 'history', label: 'Historique', icon: Clock },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fafaf9',
        maxWidth: 480,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <ToastContainer toasts={toasts} />
      <div
        style={{
          background: 'linear-gradient(135deg,#f97316,#ea580c)',
          padding: '48px 24px 96px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 160,
            height: 160,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            transform: 'translate(33%,-50%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <Logo light size={24} />
          <button
            onClick={handleSignOut}
            style={{
              padding: 8,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <LogOut style={{ width: 16, height: 16, color: 'white' }} />
          </button>
        </div>
        <p style={{ color: '#fed7aa', fontSize: 14, marginBottom: 4 }}>
          Bonjour,
        </p>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: 22 }}>
          {profile?.full_name || 'Client fidèle'} 👋
        </h1>
        <p style={{ color: '#fed7aa', fontSize: 12, marginTop: 4 }}>
          {customerData.merchant?.business_name}
        </p>
      </div>

      <div
        style={{
          padding: '0 20px',
          marginTop: -64,
          position: 'relative',
          zIndex: 10,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 10px 40px -10px rgba(249,115,22,0.2)',
            padding: 24,
            border: '1px solid #fff7ed',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div>
              <p style={{ color: '#78716c', fontSize: 14, marginBottom: 4 }}>
                Votre solde
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: '#1c1917',
                    lineHeight: 1,
                  }}
                >
                  {points}
                </span>
                <span
                  style={{ color: '#f97316', fontWeight: 600, marginBottom: 4 }}
                >
                  pts
                </span>
              </div>
            </div>
            <div
              style={{
                width: 56,
                height: 56,
                background: '#fff7ed',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy style={{ width: 28, height: 28, color: '#f97316' }} />
            </div>
          </div>
          {nextReward && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#78716c',
                  marginBottom: 6,
                }}
              >
                <span>
                  Prochain :{' '}
                  <strong style={{ color: '#1c1917' }}>
                    {nextReward.title}
                  </strong>
                </span>
                <span>
                  {points}/{nextReward.points_required} pts
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: '#f5f5f4',
                  borderRadius: 99,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg,#fb923c,#f97316)',
                    borderRadius: 99,
                    width: `${progressToNext}%`,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 6 }}>
                Plus que{' '}
                <strong style={{ color: '#f97316' }}>
                  {nextReward.points_required - points} points
                </strong>{' '}
                pour cette récompense
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 20px', paddingBottom: 100 }}>
        {activeTab === 'home' && (
          <div>
            <h2
              style={{
                fontWeight: 700,
                color: '#44403c',
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              Récompenses disponibles
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {rewards.slice(0, 3).map((reward) => {
                const unlocked = points >= reward.points_required;
                return (
                  <div
                    key={reward.id}
                    style={{
                      background: 'white',
                      borderRadius: 16,
                      border: `1px solid ${unlocked ? '#fed7aa' : '#f5f5f4'}`,
                      padding: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: unlocked ? '#fff7ed' : '#f5f5f4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {unlocked ? (
                        <Gift
                          style={{ width: 20, height: 20, color: '#f97316' }}
                        />
                      ) : (
                        <Lock
                          style={{ width: 18, height: 18, color: '#a8a29e' }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          color: '#1c1917',
                          fontSize: 14,
                        }}
                      >
                        {reward.title}
                      </p>
                      <p style={{ fontSize: 12, color: '#78716c' }}>
                        {reward.description}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#f97316',
                        }}
                      >
                        {reward.points_required} pts
                      </p>
                      {unlocked && (
                        <button
                          onClick={() => handleRedeem(reward)}
                          disabled={redeeming === reward.id}
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            background: '#f97316',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {redeeming === reward.id ? '...' : 'Utiliser'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setActiveTab('rewards')}
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: 14,
                color: '#f97316',
                fontWeight: 500,
                padding: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Voir toutes les récompenses →
            </button>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div>
            <h2
              style={{
                fontWeight: 700,
                color: '#44403c',
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              Toutes les récompenses
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {rewards.map((reward) => {
                const unlocked = points >= reward.points_required;
                return (
                  <div
                    key={reward.id}
                    style={{
                      background: 'white',
                      borderRadius: 16,
                      border: `1px solid ${unlocked ? '#fed7aa' : '#f5f5f4'}`,
                      padding: 20,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: unlocked ? '#fff7ed' : '#f5f5f4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {unlocked ? (
                            <Gift
                              style={{
                                width: 20,
                                height: 20,
                                color: '#f97316',
                              }}
                            />
                          ) : (
                            <Lock
                              style={{
                                width: 18,
                                height: 18,
                                color: '#a8a29e',
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: '#1c1917' }}>
                            {reward.title}
                          </p>
                          <p style={{ fontSize: 12, color: '#78716c' }}>
                            {reward.description}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              marginTop: 6,
                            }}
                          >
                            <Star
                              style={{
                                width: 12,
                                height: 12,
                                color: '#fb923c',
                              }}
                            />
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: '#f97316',
                              }}
                            >
                              {reward.points_required} points
                            </span>
                          </div>
                        </div>
                      </div>
                      {unlocked ? (
                        <button
                          onClick={() => handleRedeem(reward)}
                          disabled={redeeming === reward.id}
                          className="btn-primary"
                          style={{
                            padding: '8px 16px',
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          {redeeming === reward.id ? '...' : 'Débloquer'}
                        </button>
                      ) : (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 11, color: '#a8a29e' }}>
                            Il manque
                          </p>
                          <p
                            style={{
                              fontWeight: 700,
                              color: '#78716c',
                              fontSize: 14,
                            }}
                          >
                            {reward.points_required - points} pts
                          </p>
                        </div>
                      )}
                    </div>
                    {!unlocked && (
                      <div
                        style={{
                          marginTop: 12,
                          height: 6,
                          background: '#f5f5f4',
                          borderRadius: 99,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            background: '#fb923c',
                            borderRadius: 99,
                            width: `${Math.min(
                              (points / reward.points_required) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2
              style={{
                fontWeight: 700,
                color: '#44403c',
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              Historique des points
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {transactions.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    border: '1px solid #f5f5f4',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: t.type === 'earn' ? '#fff7ed' : '#fff1f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {t.type === 'earn' ? '⭐' : '🎁'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#1c1917',
                      }}
                    >
                      {t.description}
                    </p>
                    <p style={{ fontSize: 12, color: '#a8a29e' }}>
                      {format(new Date(t.created_at), 'd MMM yyyy', {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: t.type === 'earn' ? '#f97316' : '#f43f5e',
                      flexShrink: 0,
                    }}
                  >
                    {t.type === 'earn' ? '+' : ''}
                    {t.points} pts
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          background: 'white',
          borderTop: '1px solid #f5f5f4',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '4px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === tab.id ? '#f97316' : '#a8a29e',
            }}
          >
            <tab.icon style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 11, fontWeight: 500 }}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
