import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  getMerchantRewards,
  createReward,
  deleteReward,
} from '../../../services/merchantService';
import { useToast, ToastContainer } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import { Gift, Plus, Trash2, Loader2, Star } from 'lucide-react';

const DEMO_REWARDS = [
  {
    id: '1',
    title: 'Café offert',
    description: 'Un café de votre choix',
    points_required: 50,
    is_active: true,
  },
  {
    id: '2',
    title: 'Croissant gratuit',
    description: 'Un croissant beurre',
    points_required: 30,
    is_active: true,
  },
  {
    id: '3',
    title: 'Réduction 10%',
    description: 'Sur votre prochain achat',
    points_required: 100,
    is_active: true,
  },
];

export default function RewardsSection() {
  const { merchant } = useAuth();
  const { toasts, success, error: toastError } = useToast();
  const [rewards, setRewards] = useState(DEMO_REWARDS);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    pointsRequired: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!merchant?.id) return;
    const load = async () => {
      try {
        const data = await getMerchantRewards(merchant.id);
        if (data.length > 0) setRewards(data);
      } catch (e) {}
    };
    load();
  }, [merchant?.id]);

  const handleCreate = async () => {
    if (!form.title || !form.pointsRequired) return;
    setSaving(true);
    try {
      if (merchant?.id) {
        const reward = await createReward(merchant.id, {
          title: form.title,
          description: form.description,
          pointsRequired: Number(form.pointsRequired),
        });
        setRewards((r) => [...r, reward]);
      } else {
        setRewards((r) => [
          ...r,
          {
            id: Date.now().toString(),
            title: form.title,
            description: form.description,
            points_required: Number(form.pointsRequired),
            is_active: true,
          },
        ]);
      }
      success('Récompense créée !');
      setShowModal(false);
      setForm({ title: '', description: '', pointsRequired: '' });
    } catch (e) {
      toastError('Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      if (merchant?.id) await deleteReward(id);
      setRewards((r) => r.filter((x) => x.id !== id));
      success('Récompense supprimée');
    } catch (e) {
      toastError('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ maxWidth: 600 }} className="animate-mount">
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
            Récompenses
          </h2>
          <p style={{ color: '#78716c', fontSize: 14 }}>
            Créez des récompenses que vos clients peuvent débloquer
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus style={{ width: 16, height: 16 }} />
          Nouvelle
        </button>
      </div>

      {rewards.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid #f5f5f4',
            padding: 48,
            textAlign: 'center',
          }}
        >
          <Gift
            style={{
              width: 48,
              height: 48,
              color: '#e7e5e4',
              margin: '0 auto 12px',
            }}
          />
          <p style={{ fontWeight: 600, color: '#44403c', marginBottom: 4 }}>
            Aucune récompense
          </p>
          <p style={{ color: '#a8a29e', fontSize: 14, marginBottom: 16 }}>
            Créez votre première récompense
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus style={{ width: 16, height: 16 }} />
            Créer une récompense
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rewards.map((reward) => (
            <div
              key={reward.id}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid #f5f5f4',
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#fff1f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Gift style={{ width: 20, height: 20, color: '#f43f5e' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: '#1c1917' }}>
                  {reward.title}
                </p>
                {reward.description && (
                  <p
                    style={{
                      fontSize: 14,
                      color: '#78716c',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {reward.description}
                  </p>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    background: '#fff7ed',
                    borderRadius: 8,
                  }}
                >
                  <Star style={{ width: 14, height: 14, color: '#f97316' }} />
                  <span
                    style={{ fontSize: 14, fontWeight: 700, color: '#ea580c' }}
                  >
                    {reward.points_required} pts
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(reward.id)}
                  disabled={deleting === reward.id}
                  style={{
                    padding: 8,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 8,
                    color: '#a8a29e',
                  }}
                >
                  {deleting === reward.id ? (
                    <Loader2
                      style={{
                        width: 16,
                        height: 16,
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                  ) : (
                    <Trash2 style={{ width: 16, height: 16 }} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nouvelle récompense"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              Nom *
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Ex: Café offert"
              className="input-base"
            />
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
              Description
            </label>
            <input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Ex: Un café espresso de votre choix"
              className="input-base"
            />
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
              Points requis *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="1"
                value={form.pointsRequired}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pointsRequired: e.target.value }))
                }
                placeholder="100"
                className="input-base"
                style={{ paddingRight: 40 }}
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
            {[25, 50, 100, 200].map((p) => (
              <button
                key={p}
                onClick={() =>
                  setForm((f) => ({ ...f, pointsRequired: p.toString() }))
                }
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: form.pointsRequired == p ? '#f97316' : '#f5f5f4',
                  color: form.pointsRequired == p ? 'white' : '#57534e',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          {form.title && form.pointsRequired && (
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
              "{form.title}" pour <strong>{form.pointsRequired} points</strong>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button
              onClick={() => setShowModal(false)}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Annuler
            </button>
            <button
              onClick={handleCreate}
              disabled={saving || !form.title || !form.pointsRequired}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {saving ? (
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
              Créer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
