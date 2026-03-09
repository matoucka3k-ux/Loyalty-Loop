import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateLoyaltyProgram } from '../../../services/merchantService';
import { useToast, ToastContainer } from '../../../components/ui/Toast';
import { Star, Save, Loader2, Info } from 'lucide-react';

export default function LoyaltyProgram() {
  const { merchant, refreshMerchant } = useAuth();
  const { toasts, success, error: toastError } = useToast();
  const [pointsPerEuro, setPointsPerEuro] = useState(
    merchant?.points_per_euro || 1
  );
  const [description, setDescription] = useState(merchant?.description || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!merchant?.id) return;
    setSaving(true);
    try {
      await updateLoyaltyProgram(merchant.id, {
        points_per_euro: pointsPerEuro,
        description,
      });
      await refreshMerchant();
      success('Programme mis à jour !');
    } catch (e) {
      toastError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const presets = [
    { label: '1€ = 1 pt', value: 1 },
    { label: '1€ = 2 pts', value: 2 },
    { label: '1€ = 5 pts', value: 5 },
    { label: '1€ = 10 pts', value: 10 },
  ];

  return (
    <div style={{ maxWidth: 600 }} className="animate-mount">
      <ToastContainer toasts={toasts} />
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#1c1917',
            marginBottom: 4,
          }}
        >
          Programme de fidélité
        </h2>
        <p style={{ color: '#78716c', fontSize: 14 }}>
          Définissez les règles de votre système de points
        </p>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #f5f5f4',
          padding: 24,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#fff7ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Star style={{ width: 20, height: 20, color: '#f97316' }} />
          </div>
          <div>
            <h3 style={{ fontWeight: 600, color: '#1c1917' }}>
              Règle de points
            </h3>
            <p style={{ fontSize: 12, color: '#a8a29e' }}>
              Combien de points par euro dépensé ?
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 8,
            marginBottom: 20,
          }}
        >
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => setPointsPerEuro(p.value)}
              style={{
                padding: '10px 8px',
                borderRadius: 12,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: pointsPerEuro === p.value ? '#f97316' : '#f5f5f4',
                color: pointsPerEuro === p.value ? 'white' : '#57534e',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              color: '#44403c',
              marginBottom: 6,
            }}
          >
            Valeur personnalisée
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              min="1"
              max="100"
              value={pointsPerEuro}
              onChange={(e) => setPointsPerEuro(Number(e.target.value))}
              className="input-base"
              style={{ paddingRight: 64 }}
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
              pts / €
            </span>
          </div>
        </div>

        <div
          style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#92400e',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            <Info style={{ width: 16, height: 16 }} />
            Aperçu de la règle
          </div>
          <p style={{ color: '#92400e', fontWeight: 600 }}>
            Pour chaque euro dépensé, votre client gagne{' '}
            <span style={{ fontSize: 24 }}>{pointsPerEuro}</span> point
            {pointsPerEuro > 1 ? 's' : ''}
          </p>
          <p style={{ color: '#b45309', fontSize: 12, marginTop: 4 }}>
            Ex: Un achat de 20€ = {20 * pointsPerEuro} points
          </p>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #f5f5f4',
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontWeight: 600, color: '#1c1917', marginBottom: 4 }}>
          Description du programme
        </h3>
        <p style={{ fontSize: 12, color: '#a8a29e', marginBottom: 16 }}>
          Ce texte sera visible par vos clients
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Gagnez des points à chaque visite et profitez de récompenses exclusives !"
          rows={4}
          className="input-base"
          style={{ resize: 'none' }}
        />
      </div>

      <button onClick={save} disabled={saving} className="btn-primary">
        {saving ? (
          <Loader2
            style={{
              width: 16,
              height: 16,
              animation: 'spin 1s linear infinite',
            }}
          />
        ) : (
          <Save style={{ width: 16, height: 16 }} />
        )}
        Sauvegarder
      </button>
    </div>
  );
}
