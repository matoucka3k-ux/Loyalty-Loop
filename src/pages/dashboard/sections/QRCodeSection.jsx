import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../../context/AuthContext';
import Logo from '../../../components/ui/Logo';
import { useToast, ToastContainer } from '../../../components/ui/Toast';
import { Download, Copy, ExternalLink, QrCode, Share2 } from 'lucide-react';

export default function QRCodeSection() {
  const { merchant } = useAuth();
  const { toasts, success } = useToast();
  const qrRef = useRef(null);

  const slug = merchant?.slug || 'demo-commerce';
  const baseUrl = window.location.origin;
  const joinUrl = `${baseUrl}/join/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    success('Lien copié !');
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `qr-${slug}.png`;
      a.href = pngUrl;
      a.click();
      success('QR Code téléchargé !');
    };
    img.src = url;
  };

  return (
    <div style={{ maxWidth: 560 }} className="animate-mount">
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
          QR Code
        </h2>
        <p style={{ color: '#78716c', fontSize: 14 }}>
          Affichez ce QR code en caisse. Vos clients le scannent pour rejoindre
          votre programme.
        </p>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #f5f5f4',
          padding: 32,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <div ref={qrRef} style={{ display: 'inline-block' }}>
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              border: '2px solid #f5f5f4',
              padding: 24,
              display: 'inline-block',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Logo size={24} />
            </div>
            <QRCodeSVG
              value={joinUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#1c1917"
              bgColor="#ffffff"
            />
            <div style={{ marginTop: 16 }}>
              <p style={{ fontWeight: 700, color: '#1c1917', fontSize: 14 }}>
                {merchant?.business_name || 'Votre Commerce'}
              </p>
              <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 2 }}>
                Scannez pour gagner des points 🎁
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fafaf9',
            border: '1px solid #e7e5e4',
            borderRadius: 12,
            padding: '10px 14px',
            marginTop: 20,
          }}
        >
          <ExternalLink
            style={{ width: 16, height: 16, color: '#a8a29e', flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 13,
              color: '#57534e',
              fontFamily: 'monospace',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {joinUrl}
          </span>
          <button
            onClick={copyLink}
            style={{
              padding: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 6,
              color: '#78716c',
            }}
          >
            <Copy style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <button onClick={downloadQR} className="btn-primary">
            <Download style={{ width: 16, height: 16 }} />
            Télécharger PNG
          </button>
          <button onClick={copyLink} className="btn-secondary">
            <Share2 style={{ width: 16, height: 16 }} />
            Copier le lien
          </button>
        </div>
      </div>

      <div
        style={{
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#92400e',
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          <QrCode style={{ width: 16, height: 16 }} />
          Conseils d'affichage
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            '🏪 Imprimez le QR code et affichez-le à la caisse',
            '📱 Testez que le QR code fonctionne avec votre téléphone',
            '📐 Taille recommandée : minimum 5cm × 5cm',
            "💡 Ajoutez un texte 'Scannez pour gagner des points'",
          ].map((tip, i) => (
            <p key={i} style={{ fontSize: 14, color: '#b45309' }}>
              {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
