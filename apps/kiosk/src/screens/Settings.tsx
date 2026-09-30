import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, Settings as SettingsIcon, ShieldAlert, Monitor, Volume2, Save, Unlock } from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const [motionLevel, setMotionLevel] = useState('Full')
  const [theme, setTheme] = useState('Dark')
  const [uvLocked, setUvLocked] = useState(true)

  return (
    <div className="min-h-screen flex flex-col p-8 noise-bg bg-ink-950 overflow-y-auto">
      <header className="flex justify-between items-center mb-12">
        <Button variant="ghost" onClick={() => navigate('/home')}>
          <ArrowLeft className="mr-2" /> Home
        </Button>
        <h2 className="text-2xl font-display text-lamp-glow flex items-center">
          <SettingsIcon className="mr-3" /> System Settings
        </h2>
        <Button variant="primary"><Save className="mr-2" /> Save</Button>
      </header>

      <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
        
        {/* Appearance & Motion */}
        <Card className="p-8 border-ink-800">
          <h3 className="text-lg font-display mb-6 flex items-center"><Monitor className="mr-3 text-text-muted" /> Display & Motion</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-text-muted uppercase tracking-widest mb-3">Theme</label>
              <div className="flex space-x-2 bg-ink-900 rounded-lg p-1 border border-ink-800">
                {['Dark (Lamp)', 'Daylight'].map(t => (
                  <button key={t} onClick={() => setTheme(t)} className={`flex-1 py-3 rounded-md text-sm transition-colors ${theme === t ? 'bg-ink-800 text-saffron-500 font-bold' : 'text-text-muted hover:text-text-main'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-muted uppercase tracking-widest mb-3">Motion Level</label>
              <div className="flex space-x-2 bg-ink-900 rounded-lg p-1 border border-ink-800">
                {['Full', 'Calm', 'Off'].map(m => (
                  <button key={m} onClick={() => setMotionLevel(m)} className={`flex-1 py-3 rounded-md text-sm transition-colors ${motionLevel === m ? 'bg-ink-800 text-saffron-500 font-bold' : 'text-text-muted hover:text-text-main'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Safety & UV */}
        <Card className="p-8 border-ink-800">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-display mb-2 flex items-center"><ShieldAlert className="mr-3 text-danger" /> Ultraviolet (UV) Light</h3>
              <p className="text-sm text-text-muted max-w-lg mb-6">UV scanning can damage delicate pigments and fibres. It is strictly locked by default and requires a supervisor PIN to enable for a single 3-second capture.</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center ${uvLocked ? 'bg-ok/10 text-ok border border-ok/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
              {uvLocked ? 'LOCKED' : <><Unlock size={16} className="mr-2" /> UNLOCKED</>}
            </div>
          </div>
          
          <Button variant={uvLocked ? "secondary" : "primary"} onClick={() => {
            if(uvLocked) {
              const pin = prompt('Enter Supervisor PIN (demo: 1234):')
              if (pin === '1234') setUvLocked(false)
            } else {
              setUvLocked(true)
            }
          }}>
            {uvLocked ? 'Unlock UV (Requires PIN)' : 'Lock UV Now'}
          </Button>
        </Card>

        {/* System */}
        <Card className="p-8 border-ink-800">
          <h3 className="text-lg font-display mb-6 flex items-center"><Volume2 className="mr-3 text-text-muted" /> Audio & Language</h3>
          <div className="grid grid-cols-2 gap-8">
             <div>
               <label className="block text-sm text-text-muted uppercase tracking-widest mb-3">TTS Voice Speed</label>
               <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full accent-saffron-500" />
             </div>
             <div>
               <label className="block text-sm text-text-muted uppercase tracking-widest mb-3">Default Script</label>
               <select className="w-full bg-ink-900 border border-ink-800 rounded-lg p-3 text-text-main">
                 <option>Original</option>
                 <option>Devanagari</option>
                 <option>Latin (IAST)</option>
               </select>
             </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
