import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabase'
import { useToast, ToastContainer } from '../../../components/ui/Toast'
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Save,
  Loader2,
  Shield,
  FileText,
  Info,
  Headphones,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'

export default function AccountSection() {
  const { merchant, profile, refreshMerchant } = useAuth()
  const { toasts, success, error: toastError } = useToast()
  const [tab, setTab] = useState('infos')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' })
  const [form, setForm] = useState({
    business_name: merchant?.business_name || '',
    address: merchant?.address || '',
    phone: merchant?.phone || '',
    description: merchant?.description || '',
  })

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSupport = e => setSupportForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      await supabase
        .from('merchants')
        .update({
          business_name: form.business_name,
          address: form.address,
          phone: form.phone,
          description: form.description,
        })
        .eq('id', merchant.id)
      await refreshMerchant()
      success('Informations mises a jour !')
    } catch (e) {
      toastError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const copyLink = () => {
    const link = window.location.origin + '/join/' + merchant?.slug
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendSupport = () => {
    if (!supportForm.subject || !supportForm.message) {
      toastError('Veuillez remplir tous les champs')
      return
    }
    const body = encodeURIComponent(
      'Bonjour,\n\n' + supportForm.message +
      '\n\nCommerce : ' + (merchant?.business_name || '') +
      '\nEmail : ' + (profile?.email || '')
    )
    const subj = encodeURIComponent('[FideliPain Support] ' + supportForm.subject)
    window.location.href = 'mailto:contact@fidelipain.fr?subject=' + subj + '&body=' + body
    success('Ouverture de votre messagerie...')
    setSupportForm({ subject: '', message: '' })
  }

  const tabs = [
    { id: 'infos', label: 'Commerce', Icon: Building2 },
    { id: 'legal', label: 'Legal', Icon: Shield },
    { id: 'about', label: 'A propos', Icon: Info },
    { id: 'support', label: 'Support', Icon: Headphones },
  ]

  const card = {
    background: 'white',
    borderRadius: 16,
    padding: 24,
    border: '1px solid #dbeafe',
  }

  const inputRow = (name, label, Icon, placeholder, extra = {}) => (
    <div>
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 500,
        color: '#44403c',
        marginBottom: 6,
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
          color: '#a8a29e',
        }} />
        <input
          name={name}
          value={form[name] || ''}
          onChange={handle}
          placeholder={placeholder}
          className="input-base"
          style={{ paddingLeft: 40, ...extra }}
          {...(extra.disabled ? { disabled: true } : {})}
        />
      </div>
    </div>
  )

  const condItems = [
    "L'abonnement est mensuel ou annuel et renouvelable automatiquement.",
    "Vous pouvez annuler votre abonnement a tout moment.",
    "Les donnees de vos clients restent votre propriete.",
    "FideliPain ne peut etre tenu responsable d'une mauvaise utilisation.",
    "Tout abus entraine la suspension immediate du compte.",
  ]

  const legalRows = [
    { label: 'Editeur', value: 'FideliPain' },
    { label: 'Co-fondateurs', value: 'Mathis Bobo et Florian Buisson' },
    { label: 'Email', value: 'contact@fidelipain.fr' },
    { label: 'Hebergement', value: 'Vercel Inc., San Francisco, USA' },
    { label: 'Base de donnees', value: 'Supabase Inc.' },
    { label: 'Droit applicable', value: 'Droit francais' },
  ]

  const stats = [
    { value: '+35%', label: 'CA moyen en plus' },
    { value: '2x', label: 'Plus de visites' },
    { value: '5 min', label: 'Pour demarrer' },
    { value: '100%', label: 'Satisfaits' },
  ]

  const team = [
    { name: 'Mathis Bobo', role: 'Co-fondateur & CEO' },
    { name: 'Florian Buisson', role: 'Co-fondateur & CEO' },
  ]

  const faq = [
    {
      q: 'Comment modifier mon programme de fidelite ?',
      a: 'Allez dans "Programme fidelite" dans le menu de gauche.',
    },
    {
      q: 'Comment telecharger mon QR code ?',
      a: 'Allez dans "QR Code" et cliquez sur "Telecharger".',
    },
    {
      q: 'Mes clients ne voient pas leurs points ?',
      a: 'Verifiez que vous avez bien scanne leur QR code depuis "Clients".',
    },
    {
      q: 'Comment annuler mon abonnement ?',
      a: 'Contactez-nous par email a contact@fidelipain.fr.',
    },
  ]

  return (
    <div className="animate-mount">
      <ToastContainer toasts={toasts} />

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a5f', marginBottom: 4 }}>
          Mon compte
        </h2>
        <p style={{ color: '#78716c', fontSize: 14 }}>
          Gerez votre commerce et consultez les informations FideliPain.
        </p>
      </div>

      <div style={{
        display: 'flex',
        background: 'white',
        borderRadius: 14,
        padding: 4,
        marginBottom: 24,
        border: '1px solid #dbeafe',
        gap: 2,
      }}>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: '9px 4px',
              borderRadius: 10,
              border: 'none',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
              background: tab === id ? '#eff6ff' : 'transparent',
              color: tab === id ? '#1e40af' : '#78716c',
              transition: 'all 0.2s',
            }}
          >
            <Icon style={{ width: 13, height: 13 }} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'infos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={card}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}>
                🥐
              </div>
              <div>
                <p style={{ fontWeight: 800, color: '#1e3a5f', fontSize: 16 }}>
                  {merchant?.business_name}
                </p>
                <p style={{ fontSize: 13, color: '#78716c' }}>{profile?.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {inputRow('business_name', 'Nom de la boulangerie', Building2, 'Ma Boulangerie')}
              {inputRow('address', 'Adresse', MapPin, '12 rue de la Paix, 75001 Paris')}
              {inputRow('phone', 'Telephone', Phone, '06 12 34 56 78')}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#44403c',
                  marginBottom: 6,
                }}>
                  Email de contact
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 16,
                    height: 16,
                    color: '#a8a29e',
                  }} />
                  <input
                    value={profile?.email || ''}
                    disabled
                    className="input-base"
                    style={{ paddingLeft: 40, opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <p style={{ fontSize: 11, color: '#a8a29e', marginTop: 4 }}>
                  L'email ne peut pas etre modifie
                </p>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#44403c',
                  marginBottom: 6,
                }}>
                  Description du programme
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handle}
                  placeholder="Ex: Gagnez des points a chaque achat !"
                  className="input-base"
                  style={{ minHeight: 80, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          <div style={{
            background: '#eff6ff',
            borderRadius: 16,
            padding: 20,
            border: '1px solid #bfdbfe',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e3a5f', marginBottom: 8 }}>
              Votre lien de fidelite
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'white',
              borderRadius: 10,
              padding: '10px 14px',
              border: '1px solid #bfdbfe',
            }}>
              <p style={{
                fontSize: 12,
                color: '#78716c',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                flex: 1,
              }}>
                {window.location.origin}/join/{merchant?.slug}
              </p>
              <button
                onClick={copyLink}
                style={{
                  flexShrink: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: copied ? '#16a34a' : '#1e40af',
                  padding: 4,
                }}
              >
                {copied
                  ? <Check style={{ width: 16, height: 16 }} />
                  : <Copy style={{ width: 16, height: 16 }} />
                }
              </button>
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            {saving
              ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
              : <Save style={{ width: 16, height: 16 }} />
            }
            Enregistrer
          </button>
        </div>
      )}

      {tab === 'legal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Shield style={{ width: 20, height: 20, color: '#3b82f6' }} />
              <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15 }}>
                Donnees personnelles et RGPD
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 14, color: '#44403c', lineHeight: 1.7 }}>
                FideliPain collecte uniquement les donnees strictement necessaires :
                nom du commerce, email du gerant, et donnees clients.
              </p>
              <p style={{ fontSize: 14, color: '#44403c', lineHeight: 1.7 }}>
                En tant que commercant adherent, vous etes co-responsable du traitement
                des donnees de vos clients conformement au RGPD (Reglement UE 2016/679).
              </p>
              <p style={{ fontSize: 14, color: '#44403c', lineHeight: 1.7 }}>
                Les donnees sont conservees pendant toute la duree de l'abonnement
                puis supprimees dans un delai de 30 jours apres resiliation.
              </p>
              <div style={{
                padding: '10px 14px',
                background: '#eff6ff',
                borderRadius: 10,
                border: '1px solid #bfdbfe',
              }}>
                <p style={{ fontSize: 13, color: '#44403c' }}>
                  Contact RGPD :{' '}
                  <strong style={{ color: '#1e40af' }}>contact@fidelipain.fr</strong>
                </p>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <FileText style={{ width: 20, height: 20, color: '#3b82f6' }} />
              <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15 }}>
                Conditions generales d'utilisation
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {condItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 14px',
                    background: '#f8faff',
                    borderRadius: 10,
                  }}
                >
                  <span style={{ color: '#3b82f6', fontWeight: 700, flexShrink: 0 }}>
                    →
                  </span>
                  <p style={{ fontSize: 13, color: '#44403c', lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <FileText style={{ width: 20, height: 20, color: '#3b82f6' }} />
              <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15 }}>
                Mentions legales
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {legalRows.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#f8faff',
                    borderRadius: 10,
                    gap: 12,
                  }}
                >
                  <span style={{
                    fontSize: 13,
                    color: '#78716c',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontSize: 13,
                    color: '#1e3a5f',
                    fontWeight: 600,
                    textAlign: 'right',
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
            borderRadius: 20,
            padding: 32,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🥐</div>
            <h3 style={{ fontWeight: 800, color: 'white', fontSize: 22, marginBottom: 8 }}>
              FideliPain
            </h3>
            <p style={{ color: '#bfdbfe', fontSize: 14, marginBottom: 4 }}>Version 1.0</p>
            <p style={{ color: '#bfdbfe', fontSize: 13 }}>
              Le programme de fidelite digital pour les boulangeries
            </p>
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15, marginBottom: 12 }}>
              Notre mission
            </h3>
            <p style={{ fontSize: 14, color: '#44403c', lineHeight: 1.7 }}>
              FideliPain aide les boulangers independants a fideliser leur clientele
              grace a un systeme de points simple, moderne et sans friction.
              Nous remplacons les cartes tampons par une solution 100% digitale,
              deployable en moins de 5 minutes.
            </p>
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15, marginBottom: 16 }}>
              Nos chiffres
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: '20px 16px',
                    background: '#f8faff',
                    borderRadius: 12,
                    textAlign: 'center',
                    border: '1px solid #dbeafe',
                  }}
                >
                  <p style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#1e40af',
                    marginBottom: 4,
                  }}>
                    {s.value}
                  </p>
                  <p style={{ fontSize: 12, color: '#78716c' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15, marginBottom: 16 }}>
              L'equipe fondatrice
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {team.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    background: '#f8faff',
                    borderRadius: 12,
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: 'white',
                    fontSize: 18,
                    flexShrink: 0,
                  }}>
                    {p.name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 14 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: '#78716c' }}>{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: 12, color: '#a8a29e' }}>
              2025 FideliPain - Mathis Bobo et Florian Buisson
            </p>
            <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 4 }}>
              Tous droits reserves
            </p>
          </div>
        </div>
      )}

      {tab === 'support' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
            borderRadius: 16,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{
              width: 48,
              height: 48,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Headphones style={{ width: 24, height: 24, color: 'white' }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, color: 'white', fontSize: 15, marginBottom: 2 }}>
                Support FideliPain
              </p>
              <p style={{ color: '#bfdbfe', fontSize: 13 }}>
                Reponse sous 24h en jours ouvrables
              </p>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15, marginBottom: 16 }}>
              Envoyer un message
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#44403c',
                  marginBottom: 6,
                }}>
                  Sujet
                </label>
                <input
                  name="subject"
                  value={supportForm.subject}
                  onChange={handleSupport}
                  placeholder="Ex: Probleme avec le scanner QR"
                  className="input-base"
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#44403c',
                  marginBottom: 6,
                }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={supportForm.message}
                  onChange={handleSupport}
                  placeholder="Decrivez votre probleme en detail..."
                  className="input-base"
                  style={{ minHeight: 100, resize: 'vertical' }}
                />
              </div>
              <button
                onClick={sendSupport}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              >
                <Mail style={{ width: 16, height: 16 }} />
                Envoyer au support
              </button>
              <p style={{ fontSize: 12, color: '#a8a29e', textAlign: 'center' }}>
                Votre messagerie s'ouvrira avec le message pre-rempli
              </p>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15, marginBottom: 16 }}>
              Questions frequentes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {faq.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 16px',
                    background: '#f8faff',
                    borderRadius: 12,
                    border: '1px solid #dbeafe',
                  }}
                >
                  <p style={{
                    fontWeight: 600,
                    color: '#1e3a5f',
                    fontSize: 13,
                    marginBottom: 6,
                  }}>
                    {item.q}
                  </p>
                  <p style={{ fontSize: 13, color: '#78716c', lineHeight: 1.5 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: 700, color: '#1e3a5f', fontSize: 15, marginBottom: 16 }}>
              Contact direct
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: '#eff6ff',
                borderRadius: 12,
                border: '1px solid #bfdbfe',
              }}>
                <Mail style={{ width: 18, height: 18, color: '#3b82f6', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, color: '#a8a29e', marginBottom: 2 }}>
                    Email support
                  </p>
                  <p style={{ fontSize: 14, color: '#1e40af', fontWeight: 600 }}>
                    contact@fidelipain.fr
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: '#f8faff',
                borderRadius: 12,
                border: '1px solid #dbeafe',
              }}>
                <ExternalLink style={{ width: 18, height: 18, color: '#3b82f6', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, color: '#a8a29e', marginBottom: 2 }}>
                    Disponibilite
                  </p>
                  <p style={{ fontSize: 14, color: '#1e3a5f', fontWeight: 600 }}>
                    Lun - Ven, 9h - 18h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
