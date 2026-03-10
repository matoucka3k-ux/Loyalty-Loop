import { Croissant } from 'lucide-react'

export default function Logo({ size = 'md', withText = true, light = false }) {
  const sizes = { sm: { icon: 16, text: 14 }, md: { icon: 20, text: 18 }, lg: { icon: 28, text: 24 } }
  const s = sizes[size] || sizes.md

  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <div style={{width:s.icon+16,height:s.icon+16,borderRadius:10,background:light?'rgba(255,255,255,0.2)':'linear-gradient(135deg,#1e40af,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Croissant style={{width:s.icon,height:s.icon,color:'white'}} />
      </div>
      {withText && (
        <span style={{fontSize:s.text,fontWeight:800,color:light?'white':'#1e3a5f',letterSpacing:'-0.02em'}}>
          FideliPain
        </span>
      )}
    </div>
  )
}
