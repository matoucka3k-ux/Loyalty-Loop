import { useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function QRCodeSection() {
  const { merchant } = useAuth()
  const [copied, setCopied] = useState(false)
  const qrRef = useRef()

  const joinUrl = `${window.location.origin}/join/${merchant?.slug}`

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const canvas = document.createElement('canvas')
    canvas.width = 400; canvas.height = 400
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svg)
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0,0,400,400)
      ctx.drawImage(img,40,40,320,320)
      const a = document.createElement('a')
      a.download = `qrcode-fidelipain-${merchant?.business_name || 'boulangerie'}.png`
      a.href = canvas.toDataURL()
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="animate-mount">
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:800,color:'#1e3a5f',marginBottom:4}}>Votre QR Code</h2>
        <p style={{color:'#78716c',fontSize:14}}>Affichez-le en caisse pour que vos clients rejoignent votre programme.</p>
      </div>

      <div style={{background:'white',borderRadius:20,padding:40,border:'1px solid #dbeafe',textAlign:'center',marginBottom:16}}>
        <div ref={qrRef} style={{display:'inline-block',padding:24,background:'white',borderRadius:16,border:'2px solid #dbeafe',marginBottom:24}}>
          <QRCodeSVG value={joinUrl} size={200} fgColor="#1e40af" bgColor="white" />
        </div>
        <p style={{fontWeight:700,color:'#1e3a5f',fontSize:16,marginBottom:4}}>{merchant?.business_name}</p>
        <p style={{color:'#78716c',fontSize:13,marginBottom:24}}>Scannez pour rejoindre le programme de fidélité</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={downloadQR} className="btn-primary">
            <Download style={{width:16,height:16}} /> Télécharger
          </button>
          <button onClick={copyLink} className="btn-secondary">
            {copied ? <Check style={{width:16,height:16}} /> : <Copy style={{width:16,height:16}} />}
            {copied ? 'Copié !' : 'Copier le lien'}
          </button>
        </div>
      </div>

      <div style={{background:'#eff6ff',borderRadius:16,padding:24,border:'1px solid #bfdbfe'}}>
        <h3 style={{fontWeight:700,color:'#1e3a5f',marginBottom:16,fontSize:15}}>💡 Conseils d'utilisation</h3>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            'Imprimez le QR code et plastifiez-le pour le poser sur votre comptoir',
            'Affichez-le également sur votre vitrine ou à la caisse',
            'Mentionnez-le sur vos réseaux sociaux pour attirer de nouveaux clients',
            'Créez des récompenses attractives pour motiver vos clients à scanner',
          ].map((tip,i) => (
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10}}>
              <span style={{color:'#3b82f6',fontWeight:700,flexShrink:0}}>→</span>
              <p style={{fontSize:14,color:'#1e3a5f'}}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
