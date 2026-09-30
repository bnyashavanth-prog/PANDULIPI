import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, Info, BookOpen, AlertTriangle } from 'lucide-react'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col p-8 noise-bg bg-ink-950 overflow-y-auto">
      <header className="flex justify-between items-center mb-12">
        <Button variant="ghost" onClick={() => navigate('/home')}>
          <ArrowLeft className="mr-2" /> Home
        </Button>
        <h2 className="text-2xl font-display text-lamp-glow flex items-center">
          <Info className="mr-3" /> About & Safety
        </h2>
        <div className="w-24" />
      </header>

      <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
        <Card className="p-10 border-ink-800 text-center">
          <h1 className="text-4xl font-display text-lamp-glow mb-4">Pandulipi</h1>
          <p className="text-xl text-text-muted italic font-serif">"Read the past before it turns to dust."</p>
          <p className="mt-6 text-sm text-text-muted">Version 1.0.0 (Kiosk Build)</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 border-ink-800">
            <h3 className="text-xl font-display mb-6 flex items-center"><AlertTriangle className="mr-3 text-warn" /> Handling Safety</h3>
            <ul className="space-y-4 text-sm text-text-main list-disc pl-5">
              <li><strong>Do not force</strong> brittle leaves flat. Use the foam cradle.</li>
              <li>Ensure hands are clean and completely dry. Gloves are optional but recommended for degraded paper.</li>
              <li>Keep ambient humidity between 45% and 60% if possible.</li>
              <li>Do not leave manuscripts under the scanner lights for extended periods. The system will automatically shut off lights if left idle.</li>
            </ul>
          </Card>

          <Card className="p-8 border-ink-800">
            <h3 className="text-xl font-display mb-6 flex items-center"><BookOpen className="mr-3 text-text-muted" /> Technology</h3>
            <ul className="space-y-4 text-sm text-text-main list-disc pl-5">
              <li><strong>Photometric Stereo:</strong> Uses 4 directional light sources to compute a 3D normal map, revealing incised text that is invisible to normal cameras.</li>
              <li><strong>Offline AI:</strong> All HTR (Handwritten Text Recognition), translation, and text-to-speech run locally on the internal processor. No internet required.</li>
              <li><strong>Encrypted Vault:</strong> Data is secured using AES-GCM and will never be shared without explicit NFC custodian consent.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
