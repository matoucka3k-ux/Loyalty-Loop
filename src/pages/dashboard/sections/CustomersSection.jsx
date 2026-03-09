import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  getMerchantCustomers,
  addPointsToCustomer,
} from '../../../services/merchantService';
import { useToast, ToastContainer } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import { Users, Search, Star, Plus, Loader2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DEMO_CUSTOMERS = [
  {
    id: '1',
    points: 250,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    profiles: { full_name: 'Marie Dupont', email: 'marie@exemple.fr' },
  },
  {
    id: '2',
    points: 180,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    profiles: { full_name: 'Thomas Bernard', email: 'thomas@exemple.fr' },
  },
  {
    id: '3',
    points: 95,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    profiles: { full_name: 'Sophie Laurent', email: 'sophie@exemple.fr' },
  },
  {
    id: '4',
    points: 420,
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    profiles: { full_name: 'Pierre Martin', email: 'pierre@exemple.fr' },
  },
  {
    id: '5',
    points: 60,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    profiles: { full_name: 'Emma Garcia', email: 'emma@exemple.fr' },
  },
];

export default function CustomersSection() {
  const { merchant } = useAuth();
  const { toasts, success, error: toastError } = useToast();
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [addingPoints, setAddingPoints] = useState(false);

  useEffect(() => {
    if (!merchant?.id) return;
    const load = async () => {
      try {
        const data = await getMerchantCustomers(merchant.id);
        if (data.length > 0) setCustomers(data);
      } catch (e) {}
    };
    load();
  }, [merchant?.id]);

  const filtered = customers
    .filter((c) => {
      const name = c.profiles?.full_name?.toLowerCase() || '';
      const email = c.profiles?.email?.toLowerCase() || '';
      const q = search.toLowerCase();
      return name.includes(q) || email.includes(q);
    })
    .sort((a, b) => b.points - a.points);

  const handleAddPoints = async () => {
    if (!selectedCustomer || !pointsToAdd) return;
    setAddingPoints(true);
    try {
      if (merchant?.id) {
        await addPointsToCustomer(
          selectedCustomer.id,
          Number(pointsToAdd),
          merchant.id
        );
      }
      setCustomers((cs) =>
        cs.map((c) =>
          c.id === selectedCustomer.id
            ? { ...c, points: c.points + Number(pointsToAdd) }
            : c
        )
      );
      success(
        `${pointsToAdd} points ajoutés à ${selectedCustomer.profiles?.full_name} !`
      );
      setSelectedCustomer(null);
      setPointsToAdd('');
    } catch (e) {
      toastError("Erreur lors de l'ajout de points");
    } finally {
      setAddingPoints(false);
    }
  };

  return (
    <div className="animate-mount">
      <ToastContainer toasts={toasts} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#1c1917',
              marginBottom: 4,
            }}
          >
            Clients
          </h2>
          <p style={{ color: '#78716c', fontSize: 14 }}>
            {customers.length} client{customers.length > 1 ? 's' : ''} inscrit
            {customers.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
            color: '#a8a29e',
          }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="input-base"
          style={{ paddingLeft: 40 }}
        />
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid #f5f5f4',
            padding: 48,
            textAlign: 'center',
          }}
        >
          <Users
            style={{
              width: 48,
              height: 48,
              color: '#e7e5e4',
              margin: '0 auto 12px',
            }}
          />
          <p style={{ fontWeight: 600, color: '#44403c', marginBottom: 4 }}>
            Aucun client trouvé
          </p>
          <p style={{ color: '#a8a29e', fontSize: 14 }}>
            {search
              ? 'Modifiez votre recherche'
              : 'Vos clients apparaîtront ici après avoir scanné votre QR code'}
          </p>
        </div>
      ) : (
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
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto',
              gap: 16,
              padding: '12px 20px',
              background: '#fafaf9',
              borderBottom: '1px solid #f5f5f4',
              fontSize: 12,
              fontWeight: 500,
              color: '#a8a29e',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span>Client</span>
            <span style={{ textAlign: 'right' }}>Points</span>
            <span style={{ textAlign: 'right' }}>Inscrit le</span>
            <span style={{ textAlign: 'right' }}>Action</span>
          </div>
          {filtered.map((customer, i) => (
            <div
              key={customer.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: 16,
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #fafaf9',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#fff7ed,#fef3c7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#ea580c',
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {customer.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <p
                      style={{
                        fontWeight: 500,
                        color: '#1c1917',
                        fontSize: 14,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {customer.profiles?.full_name || 'Client'}
                    </p>
                    {i === 0 && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '2px 8px',
                          background: '#fef3c7',
                          color: '#92400e',
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 500,
                          flexShrink: 0,
                        }}
                      >
                        <TrendingUp style={{ width: 10, height: 10 }} /> Top
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#a8a29e',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {customer.profiles?.email}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: '#fff7ed',
                  borderRadius: 8,
                }}
              >
                <Star style={{ width: 14, height: 14, color: '#fb923c' }} />
                <span
                  style={{ fontWeight: 700, color: '#ea580c', fontSize: 14 }}
                >
                  {customer.points}
                </span>
              </div>
              <span
                style={{ fontSize: 12, color: '#a8a29e', textAlign: 'right' }}
              >
                {format(new Date(customer.created_at), 'd MMM yyyy', {
                  locale: fr,
                })}
              </span>
              <button
                onClick={() => setSelectedCustomer(customer)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: '#f5f5f4',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: '#57534e',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <Plus style={{ width: 14, height: 14 }} />
                Pts
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => {
          setSelectedCustomer(null);
          setPointsToAdd('');
        }}
        title="Ajouter des points"
      >
        {selectedCustomer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                background: '#fafaf9',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#fff7ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#ea580c',
                }}
              >
                {selectedCustomer.profiles?.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, color: '#1c1917' }}>
                  {selectedCustomer.profiles?.full_name}
                </p>
                <p style={{ fontSize: 14, color: '#78716c' }}>
                  {selectedCustomer.points} points actuellement
                </p>
              </div>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#44403c',
                  marginBottom: 6,
                }}
              >
                Points à ajouter
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  min="1"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(e.target.value)}
                  placeholder="Ex: 50"
                  className="input-base"
                  style={{ paddingRight: 40 }}
                  autoFocus
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a8a29e',
                    fontSize: 14,
                  }}
                >
                  pts
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[10, 25, 50, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => setPointsToAdd(p.toString())}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 10,
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: pointsToAdd == p ? '#f97316' : '#f5f5f4',
                    color: pointsToAdd == p ? 'white' : '#57534e',
                  }}
                >
                  +{p}
                </button>
              ))}
            </div>
            {pointsToAdd && (
              <div
                style={{
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 14,
                  color: '#92400e',
                }}
              >
                Nouveau solde :{' '}
                <strong>
                  {selectedCustomer.points + Number(pointsToAdd)} points
                </strong>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setPointsToAdd('');
                }}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Annuler
              </button>
              <button
                onClick={handleAddPoints}
                disabled={addingPoints || !pointsToAdd}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {addingPoints ? (
                  <Loader2
                    style={{
                      width: 16,
                      height: 16,
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                ) : (
                  <Plus style={{ width: 16, height: 16 }} />
                )}
                Ajouter
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
