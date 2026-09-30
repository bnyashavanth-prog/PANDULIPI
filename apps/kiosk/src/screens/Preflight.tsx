import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'

// Dummy gauge component (would be an SVG arc in a real build)
const Gauge = ({ label, value, unit, status, max }: { label: string, value: number, unit: string, status: 'safe'|'caution'|'danger', max: number }) => {
  const colors = { safe: 'text-ok', caution: 'text-warn', danger: 'text-danger' }
  const bgColors = { safe: 'bg-ok', caution: 'bg-warn', danger: 'bg-danger' }
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* Background arc */}
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--color-ink-800)" strokeWidth="12" strokeLinecap="round" />
          {/* Foreground arc */}
          <motion.path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeLinecap="round"
            className={colors[status]}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: value / max }}
            transition={{ type: "spring", duration: 1.5, bounce: 0 }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-2">
          <span className="font-mono text-2xl font-bold">{value.toFixed(1)}</span>
          <span className="text-sm text-text-muted">{unit}</span>
        </div>
      </div>
      <span className="text-text-main font-medium">{label}</span>
    </div>
  )
}

export default function Preflight() {
  const navigate = useNavigate()
  const [envState, setEnvState] = useState<'safe'|'caution'|'blocked'>('safe')
  
  // Simulate WS incoming data
  const [data, setData] = useState({ rh: 50, temp: 22, voc: 80, lux: 300 })
  
  useEffect(() => {
    // In a real app this would connect to the websocket
    const timer = setTimeout(() => {
      // simulate drift
      setData({ rh: 48, temp: 23, voc: 85, lux: 310 })
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div 
      className="min-h-screen flex flex-col p-8 noise-bg bg-ink-950"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <header className="flex justify-between items-center mb-8 z-10">
        <Button variant="ghost" onClick={() => navigate('/setup')}>
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-display">Environment Check</h2>
        <Button variant="ghost"><Info className="mr-2"/> Why?</Button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full z-10 space-y-12">
        
        {/* Status Banner */}
        <motion.div 
          layout
          className={`w-full p-6 rounded-2xl flex items-center space-x-6 shadow-lg ${
            envState === 'safe' ? 'bg-ok/10 border border-ok/20' : 
            envState === 'caution' ? 'bg-warn/10 border border-warn/20' : 'bg-danger/10 border border-danger/20'
          }`}
        >
          {envState === 'safe' && <CheckCircle2 className="text-ok" size={48} />}
          {envState === 'caution' && <motion.div animate={{ rotate: [-5,5,-5] }} transition={{ repeat: Infinity, duration: 2 }}><AlertTriangle className="text-warn" size={48} /></motion.div>}
          {envState === 'blocked' && <XCircle className="text-danger" size={48} />}
          
          <div>
            <h3 className={`text-2xl font-display ${
              envState === 'safe' ? 'text-ok' : envState === 'caution' ? 'text-warn' : 'text-danger'
            }`}>
              {envState === 'safe' ? 'Conditions are safe' : envState === 'caution' ? 'Caution advised' : 'Scanning Blocked'}
            </h3>
            <p className="text-text-main text-lg mt-1">
              {envState === 'safe' ? 'You can begin scanning this manuscript.' : 
               envState === 'caution' ? 'The air is a little dry. You may continue, but take extra care.' : 
               'Humidity is too low for this leaf. Please try again later.'}
            </p>
          </div>
        </motion.div>

        {/* Gauges */}
        <Card className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <Gauge label="Humidity" value={data.rh} unit="%" max={100} status="safe" />
            <Gauge label="Temperature" value={data.temp} unit="°C" max={50} status="safe" />
            <Gauge label="VOC" value={data.voc} unit="ppb" max={500} status="safe" />
            <Gauge label="Light" value={data.lux} unit="lux" max={1000} status="safe" />
          </div>
        </Card>
      </div>

      <footer className="mt-auto flex justify-end z-10 pt-8">
        <Button size="lg" disabled={envState === 'blocked'} onClick={() => navigate('/positioning')}>
          Confirm & Position <ArrowRight className="ml-2" />
        </Button>
      </footer>
    </motion.div>
  )
}
