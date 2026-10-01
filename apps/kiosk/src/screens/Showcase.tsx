import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, Globe, Share2, Download } from 'lucide-react'

export default function ShowcasePreview() {
  const navigate = useNavigate()
  const [qrCode, setQrCode] = useState('')

  useEffect(() => {
    QRCode.toDataURL('https://pandulipi-lilac.vercel.app', {
      color: { dark: '#E8891B', light: '#0A0E22' },
      width: 200,
      margin: 2
    }).then(setQrCode).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen flex flex-col p-8 noise-bg bg-ink-950 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => navigate('/home')}>
          <ArrowLeft className="mr-2" /> Home
        </Button>
        <h2 className="text-2xl font-display text-lamp-glow flex items-center">
          <Globe className="mr-3" /> Showcase Export
        </h2>
        <div className="w-24" />
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-12 items-center justify-center">
        
        {/* Phone Preview */}
        <div className="relative w-[320px] h-[640px] bg-black rounded-[40px] border-8 border-ink-800 overflow-hidden shadow-2xl flex-shrink-0">
          {/* Simulated scroll content */}
          <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-12">
            <div className="h-64 bg-[url('/assets/leaf_phone.jpg')] bg-cover bg-center flex items-center justify-center bg-black/50 bg-blend-overlay">
              <h1 className="text-lamp-glow font-display text-3xl">Rigveda Samhita</h1>
            </div>
            <div className="p-6 space-y-6 bg-ink-950">
              <p className="text-sm text-text-muted">Preserved by the Pandulipi project. Swipe to explore the incised text under relighting.</p>
              <div className="h-32 bg-ink-900 rounded-xl" />
              <div className="h-48 bg-ink-900 rounded-xl" />
            </div>
          </div>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-ink-800 rounded-b-xl z-10" />
        </div>

        {/* Info & Export Actions */}
        <div className="flex-1 space-y-8 max-w-lg">
          <Card className="p-8 border-ink-800 flex flex-col items-center text-center">
            <h3 className="text-xl font-display mb-4">Ready to Share</h3>
            <p className="text-text-muted mb-8">This manuscript's consent is set to Public. The showcase page has been generated.</p>
            
            {qrCode && (
              <motion.img 
                src={qrCode} 
                alt="QR Code" 
                className="rounded-xl border border-ink-800 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}
            
            <div className="flex w-full space-x-4">
              <Button variant="secondary" className="flex-1"><Share2 className="mr-2" size={18} /> AirDrop</Button>
              <Button variant="primary" className="flex-1"><Download className="mr-2" size={18} /> Save USB</Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
