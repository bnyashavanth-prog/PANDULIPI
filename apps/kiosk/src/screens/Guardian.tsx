import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, Shield, AlertCircle, Sun, Activity, BoxSelect } from 'lucide-react'

// Dummy Line Chart using SVG
const Sparkline = ({ data, color, yMin, yMax, threshold }: { data: number[], color: string, yMin: number, yMax: number, threshold?: [number, number] }) => {
  const h = 100
  const w = 400
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((d - yMin) / (yMax - yMin)) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible">
      {/* Threshold bands */}
      {threshold && (
        <rect 
          x="0" 
          y={h - ((threshold[1] - yMin) / (yMax - yMin)) * h} 
          width={w} 
          height={((threshold[1] - threshold[0]) / (yMax - yMin)) * h} 
          fill="var(--color-ok)" 
          opacity="0.1" 
        />
      )}
      <motion.polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  )
}

export default function Guardian() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [rescue, setRescue] = useState<any>(null)

  useEffect(() => {
    fetch('http://localhost:8000/env/history').then(r => r.json()).then(d => setHistory(d.history)).catch(console.error)
    fetch('http://localhost:8000/alerts').then(r => r.json()).then(d => setAlerts(d.alerts)).catch(console.error)
    fetch('http://localhost:8000/scans/1/rescue').then(r => r.json()).then(d => setRescue(d)).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen flex flex-col p-8 noise-bg bg-ink-950 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => navigate('/home')}>
          <ArrowLeft className="mr-2" /> Home
        </Button>
        <h2 className="text-2xl font-display text-lamp-glow flex items-center">
          <Shield className="mr-3" /> Guardian Dashboard
        </h2>
        <div className="w-24" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Rescue Score */}
        <div className="col-span-1 space-y-8">
          <Card className="flex flex-col items-center text-center p-8 border-ink-800">
            <h3 className="text-sm text-text-muted uppercase tracking-widest mb-6">Rescue Score</h3>
            
            {/* Radial Dial */}
            <div className="relative w-48 h-48 mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-ink-800)" strokeWidth="10" />
                {rescue && (
                  <motion.circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke={rescue.tier === 'Urgent' ? 'var(--color-danger)' : rescue.tier === 'Priority' ? 'var(--color-warn)' : 'var(--color-ok)'} 
                    strokeWidth="10" 
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * rescue.score / 100) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-mono font-bold text-text-main">{rescue ? Math.round(rescue.score) : '--'}</span>
                <span className={`text-sm font-bold uppercase mt-1 ${rescue?.tier === 'Urgent' ? 'text-danger' : 'text-text-muted'}`}>
                  {rescue ? rescue.tier : ''}
                </span>
              </div>
            </div>

            {/* Factor Bars */}
            <div className="w-full space-y-4">
              {rescue && Object.entries(rescue.sub_scores).map(([k, v], i) => (
                <div key={k} className="text-left">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize text-text-muted">{k.replace('_', ' ')}</span>
                    <span className="font-mono">{Math.round(v as number)}</span>
                  </div>
                  <div className="w-full h-2 bg-ink-950 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${(v as number) > 60 ? 'bg-danger' : (v as number) > 30 ? 'bg-warn' : 'bg-ok'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${v}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {rescue?.tier === 'Urgent' && (
              <div className="mt-6 w-full p-3 bg-danger/20 border border-danger/50 text-danger rounded-lg flex items-start text-left text-sm">
                <AlertCircle className="shrink-0 mr-2" size={16} />
                <span>Urgent conservation required. Scan first to preserve data.</span>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Env & Alerts */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* Environment Time Series */}
          <Card className="p-6 border-ink-800">
             <h3 className="text-sm text-text-muted uppercase tracking-widest mb-6 flex items-center">
               <Activity className="mr-2" size={16} /> Environment History (24h)
             </h3>
             <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs text-text-muted mb-2">Humidity (%)</h4>
                  <div className="h-32 bg-ink-950 rounded-lg p-2 relative">
                    {history.length > 0 && <Sparkline data={history.map(h => h.humidity)} color="var(--color-ok)" yMin={30} yMax={80} threshold={[45, 60]} />}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-text-muted mb-2">Temperature (°C)</h4>
                  <div className="h-32 bg-ink-950 rounded-lg p-2 relative">
                    {history.length > 0 && <Sparkline data={history.map(h => h.temp)} color="var(--color-saffron-500)" yMin={10} yMax={40} threshold={[18, 30]} />}
                  </div>
                </div>
             </div>
          </Card>

          {/* Light Dose & Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 border-ink-800">
              <h3 className="text-sm text-text-muted uppercase tracking-widest mb-6 flex items-center">
                <Sun className="mr-2" size={16} /> Light Dose Accumulation
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full h-4 bg-ink-950 rounded-full overflow-hidden border border-ink-800">
                    <motion.div className="h-full bg-saffron-500" initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 1 }} />
                  </div>
                  <div className="flex justify-between text-xs text-text-muted mt-2 font-mono">
                    <span>0 lx·s</span>
                    <span>Safe limit</span>
                  </div>
                </div>
                <div className="text-2xl font-mono text-lamp-glow">4.2k</div>
              </div>
            </Card>

            <Card className="p-6 border-ink-800">
              <h3 className="text-sm text-text-muted uppercase tracking-widest mb-6 flex items-center">
                <AlertCircle className="mr-2" size={16} /> System Alerts
              </h3>
              <div className="space-y-4">
                {alerts.map((a, i) => (
                  <motion.div 
                    key={i} 
                    className={`flex items-start p-3 rounded-lg border ${!a.acknowledged ? 'bg-warn/10 border-warn/30' : 'bg-ink-950 border-ink-800'}`}
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                  >
                    <AlertCircle className={`shrink-0 mr-3 mt-0.5 ${!a.acknowledged ? 'text-warn' : 'text-text-muted'}`} size={16} />
                    <div>
                      <p className={`text-sm ${!a.acknowledged ? 'text-text-main' : 'text-text-muted'}`}>{a.message}</p>
                      <p className="text-xs text-text-muted mt-1 font-mono">{new Date(a.ts).toLocaleTimeString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
